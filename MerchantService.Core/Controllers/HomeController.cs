using Autofac.Extras.NLog;
using MerchantService.Core.Global;
using MerchantService.DomainModel.Models.Globalization;
using MerchantService.DomainModel.Models.Role;
using MerchantService.DomainModel.Models.UserAccess;
using MerchantService.Repository.ApplicationClasses.Account;
using MerchantService.Repository.ApplicationClasses.Globalization;
using MerchantService.Repository.DataRepository;
using MerchantService.Repository.Modules.Global;
using MerchantService.Utility.Logger;
using Microsoft.AspNet.Identity.Owin;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;



namespace MerchantService.Core.Controllers
{
    public class HomeController : Controller
    {
        private MerchantContext _merchantContext;
        private readonly IDataRepository<GlobalizationDetail> _globalizationContext;
        private readonly IDataRepository<SecondaryLanguage> _secondaryLanguageContext;
        private ApplicationUserManager _userManager;
        private readonly IDataRepository<UserAccessDetail> _userAccessDetailContext;
        private readonly IDataRepository<MerchantService.DomainModel.Models.UserDetail> _userDetailContext;
        private readonly IDataRepository<Role> _roleContext;
        private readonly IDataRepository<Form> _formContext;
        private readonly IErrorLog _errorLog;
        private readonly IMerchantDataRepository _merchantDataRepository;
        private readonly ILogger _logger;
        public HomeController(ApplicationUserManager userManager, IDataRepository<GlobalizationDetail> globalizationContext, IDataRepository<SecondaryLanguage> secondaryLanguageContext, IDataRepository<UserAccessDetail> userAccessDetailContext, IDataRepository<Form> formContext, IDataRepository<MerchantService.DomainModel.Models.UserDetail> userDetailContext, IDataRepository<Role> roleContext, IErrorLog errorLog, IMerchantDataRepository merchantDataRepository, ILogger logger)
        {
            _formContext = formContext;
            _userManager = userManager;
            _userAccessDetailContext = userAccessDetailContext;
            _globalizationContext = globalizationContext;
            _secondaryLanguageContext = secondaryLanguageContext;
            _userDetailContext = userDetailContext;
            _roleContext = roleContext;
            _errorLog = errorLog;
            _merchantDataRepository = merchantDataRepository;
            _logger = logger;
        }

        public ApplicationUserManager UserManager
        {
            get
            {
                return _userManager ?? HttpContext.GetOwinContext().GetUserManager<ApplicationUserManager>();
            }
            private set
            {
                _userManager = value;
            }
        }

        protected MerchantContext MerchantContext
        {
            get
            {
                if (_merchantContext == null && System.Web.HttpContext.Current != null)
                {
                    _merchantContext = new MerchantContext(_errorLog, _merchantDataRepository);
                }
                return _merchantContext;
            }
        }

        /// <summary>
        /// Retuens javascript for the  Merchantsettings required for system.
        /// </summary>
        /// <returns></returns>
        public JavaScriptResult MerchantSettings()
        {
            try
            {
                var merchatSettings = MerchantContext.Permission;
                const string js = @"var merchatSettings= {0};";
                return JavaScript(String.Format(js, JsonConvert.SerializeObject(merchatSettings)));
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }
        public ActionResult Index(string returnUrl)
        {
            _logger.Info("Application Loaded");
            var dictionaryList = new GlobalizationAc();
            List<GlobalizationDetail> detail = _globalizationContext.GetAll().ToList();
            List<SecondaryLanguage> secondarylanguage = _secondaryLanguageContext.GetAll().ToList();
            Dictionary<string, string> english = detail.Select(x => new { x.Key, x.ValueEn }).ToDictionary(x => x.Key, x => x.ValueEn);
            Dictionary<string, string> secondaryLanguage = secondarylanguage.Select(x => new { x.GlobalizationDetail.Key, x.ValueSl }).ToDictionary(x => x.Key, x => x.ValueSl);
            dictionaryList.ValueEn = english;
            dictionaryList.ValueSl = secondaryLanguage;

            if (!string.IsNullOrEmpty(HttpContext.User.Identity.Name))
            {
                //this object is user access page list object, this object have two paameter 1) listOfPageList(this list contain all active list of pages) and 2) isAdmin(this is set true if admin is login ortherwise false) 
                UserAccessPageListAC userAccessPageList = new UserAccessPageListAC();
                userAccessPageList.isAdmin = false;
                List<string> listOfUserAccessPage = new List<string>();
                var userDetail = _userDetailContext.Fetch(x => x.UserName == HttpContext.User.Identity.Name).FirstOrDefault();
                var userRole = _roleContext.GetById(userDetail.RoleId);
                if (userRole.RoleName == "Admin")
                {
                    userAccessPageList.isAdmin = true;
                }
                else
                {
                    List<UserAccessDetail> listOfUserAccessDetail = _userAccessDetailContext.Fetch(x => x.RoleId == userDetail.RoleId).ToList();
                    if (listOfUserAccessDetail.Any())
                    {
                        foreach (var objUserAcess in listOfUserAccessDetail)
                        {
                            Form formObj = _formContext.FirstOrDefault(x => x.Id == objUserAcess.FormId);
                            if (formObj != null)
                            {
                                listOfUserAccessPage.Add(formObj.FormName);
                            }
                        }
                    }
                    userAccessPageList.isAdmin = false;
                    userAccessPageList.listOfPageList = listOfUserAccessPage;
                    userAccessPageList.roleId = userDetail.RoleId;
                }
                ViewBag.ListOfAccessPage = userAccessPageList;
                if (HttpContext.Session["Language"] != null && HttpContext.Session["Language"].ToString() == "2")
                    ViewBag.LanguageValue = "ValueSl";
                else
                    ViewBag.LanguageValue = "ValueEn";
            }
            return View(dictionaryList);
        }


    }
}
