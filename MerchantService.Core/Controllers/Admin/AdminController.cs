using System.Web.Mvc;
using MerchantService.Utility.Constants;
using MerchantService.Repository.Modules.Admin;
using MerchantService.Repository.Modules.Admin.Company;
using Microsoft.AspNet.Identity;

namespace MerchantService.Core.Controllers.Admin
{
    public class AdminController : Controller
    {
        private readonly IUserDetailRepository _userDetailContext;
        private readonly ICompanyRepository _companyRepository;
        public AdminController(IUserDetailRepository userDetailContext, ICompanyRepository companyRepository)
        {
            _userDetailContext = userDetailContext;
            _companyRepository = companyRepository;
        }

        /// <summary>
        /// Method that will be used to show Index page of admin screen.
        /// </summary>
        /// <returns></returns>

        public ActionResult Index()
        {
            if (!HttpContext.User.Identity.Name.ToLower().Equals(StringConstants.SuperAdminRoleName.ToLower()))
            {
                if (HttpContext.User.Identity.Name != string.Empty)
                {
                    var userDetail = _userDetailContext.GetUserDetailByUserName(HttpContext.User.Identity.Name);
                    var currentCompanyId = _companyRepository.GetCompanyDetailByUserId(HttpContext.User.Identity.GetUserId());

                    if (userDetail != null && currentCompanyId != null)
                    {
                        System.Web.HttpContext.Current.Session["RoleName"] = userDetail.RoleName;
                        System.Web.HttpContext.Current.Session["CompanyId"] = currentCompanyId.Id;
                    }
                    else
                        System.Web.HttpContext.Current.Session["RoleName"] = userDetail.RoleName;
                }
            }
            else
                System.Web.HttpContext.Current.Session["RoleName"] = StringConstants.SuperAdminRoleName;
            return View();
        }
    }
}
