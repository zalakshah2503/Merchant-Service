using MerchantService.DomainModel.Models.Globalization;
using MerchantService.Repository.ApplicationClasses.Globalization;
using MerchantService.Repository.Modules.Admin.Company;
using MerchantService.Repository.Modules.Admin.Globalization;
using MerchantService.Utility.Logger;
using System;
using System.Collections.Generic;
using System.Web;
using System.Web.Http;
using Microsoft.AspNet.Identity;

namespace MerchantService.Core.Controllers.Admin.Globalization
{
    //[DynamicAuthorize]
    [RoutePrefix("api/Globalization")]
    public class GlobalizationController : ApiController
    {
        #region "Private Member(s)"

        private readonly IErrorLog _errorLog;
        private readonly IGlobalizationRepository _globalizationContext;
        private readonly ICompanyRepository _companyContext;

        #endregion

        #region "Constructor"
        public GlobalizationController(IErrorLog errorLog, IGlobalizationRepository globalizationContext, ICompanyRepository companyContext)
        {
            _errorLog = errorLog;
            _globalizationContext = globalizationContext;
            _companyContext = companyContext;
        }
        #endregion

        #region "Public Method(s)"
        /// <summary>
        /// method is used for get all module list in database. - ps
        /// </summary>
        /// <returns>return module list</returns>
        [HttpGet]
        [Route("GetModuleList")]
        public IHttpActionResult GetModuleList()
        {
            try
            {
                if (_companyContext.CheckSecondaryLanguageSelectedOrNot())
                {
                    List<ModuleInfo> moduleInfo = _globalizationContext.GetModuleList();
                    return Ok(new { moduleInfo = moduleInfo });
                }
                return Ok(new { isLanguageAdded = false });

            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        [Route("GetLabelListById")]
        [HttpGet]
        public IHttpActionResult GetLabelListById(int id)
        {
            try
            {
                int companyId = 0;
                var companyDetail = _companyContext.GetCompanyDetailByUserId(HttpContext.Current.User.Identity.GetUserId());
                if (companyDetail != null)
                {
                    companyId = companyDetail.Id;
                }
                List<GlobalizationDetailAc> globalizationDetail = _globalizationContext.GetStaticLabelListById(id, companyId);

                return Ok(globalizationDetail);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        [HttpPost]
        [Route("SaveListOfLabel")]
        public IHttpActionResult SaveListOfLabel(GlobalizationDetailAc GlobalizationDetail)
        {
            try
            {
                var companyDetail = _companyContext.GetCompanyDetailByUserId(HttpContext.Current.User.Identity.GetUserId());
                List<GlobalizationDetailAc> globalizationCollection = new List<GlobalizationDetailAc>();

                foreach (var globalizationDetail in GlobalizationDetail.GlobalizationDetail)
                {
                    GlobalizationDetailAc globalize = new GlobalizationDetailAc
                    {
                        Id = globalizationDetail.Id,
                        Key = globalizationDetail.Key,
                        ModuleId = globalizationDetail.ModuleId,
                        ValueEn = globalizationDetail.ValueEn,
                        ValueSl = globalizationDetail.ValueSl,
                        ModuleInfo = globalizationDetail.ModuleInfo,
                        CompanyId = companyDetail.Id
                    };
                    globalizationCollection.Add(globalize);
                }
                _globalizationContext.AddListOfSataticLabel(globalizationCollection);
                return Ok();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        #endregion
    }
}
