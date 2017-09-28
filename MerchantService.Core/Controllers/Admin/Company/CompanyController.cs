using System;
using System.Collections.Generic;
using System.Web;
using System.Web.Http;
using MerchantService.DomainModel.Models.Company;
using MerchantService.DomainModel.Models.Globalization;
using MerchantService.Repository.ApplicationClasses.Admin.Company;
using MerchantService.Repository.ApplicationClasses.Globalization;
using MerchantService.Repository.Helper;
using MerchantService.Repository.Modules.Admin.Company;
using MerchantService.Utility.Logger;
using Microsoft.AspNet.Identity;

namespace MerchantService.Core.Controllers.Admin.Company
{
    //[DynamicAuthorize]
    [RoutePrefix("api/Company")]
    public class CompanyController : ApiController
    {
        #region Private Variables
        private readonly IErrorLog _errorLog;
        private readonly ICompanyRepository _companyRepository;
        #endregion

        #region Constructor
        public CompanyController(IErrorLog errorLog, ICompanyRepository companyRepository)
        {
            _errorLog = errorLog;
            _companyRepository = companyRepository;
        }
        #endregion

        #region Public Methods
        /// <summary>
        /// this method is used for adding a new company details.
        /// </summary>
        /// <param name="companyDetail">company detailAC with company details</param>
        /// <returns>obejct of companydetail with the company details</returns>
        [HttpPost]
        [Route("addCompanyDetail")]
        public IHttpActionResult AddCompanyDetail(CompanyDetailAC companyDetail)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    var currentUser = HttpContext.Current.User.Identity.GetUserId();
                    var companyDetaill = _companyRepository.AddCompanyDetail(companyDetail, currentUser);
                    return Ok(companyDetaill);
                }
                else
                {
                    return BadRequest();
                }
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// this method is used to get all company list.
        /// </summary>
        /// <returns>list of company with the company basic details.</returns>
        [HttpGet]
        [Route("getAllCompanyDetail")]
        public IHttpActionResult GetAllCompanyDetail()
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    var companyCollection = new List<CompanyDetailAC>();
                    var currentUser = HttpContext.Current.User.Identity.GetUserId();

                    foreach (var companyDetail in _companyRepository.GetCurrentUserCompanyDetailList(currentUser))
                    {
                        var companyDetailAC = new CompanyDetailAC();
                        companyDetailAC = ApplicationClassHelper.ConvertType<CompanyDetail, CompanyDetailAC>(companyDetail);
                        companyDetailAC.CompanyId = companyDetail.Id;
                        companyDetailAC.Name = companyDetail.Name;
                        companyDetailAC.NameSL = companyDetail.NameSL;
                        companyDetailAC.Location = companyDetail.Location;
                        companyDetailAC.Email = companyDetail.Email;
                        companyDetailAC.Zipcode = companyDetail.Zipcode;
                        companyDetailAC.PhoneNumber = companyDetail.PhoneNumber;
                        companyDetailAC.IsDeleteOrEdit = true;
                        companyCollection.Add(companyDetailAC);
                    }
                    return Ok(companyCollection);
                }
                else
                    return BadRequest();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// this method is used for geeting the comapany details by the company id.
        /// </summary>
        /// <param name="companyId">contain the company to get the company details</param>
        /// <returns>object of company with the company detail. </returns>
        [Route("getCompanyDetailsById")]
        [HttpGet]
        public IHttpActionResult GetCompanyDetailsById(int companyId)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    var currentUser = HttpContext.Current.User.Identity.GetUserId();
                    var company = _companyRepository.GetCompanyDetailsById(companyId, currentUser);
                    if (company.CurrencyId == null)
                        company.CurrencyId = 1;
                    return Ok(company);
                }
                else
                {
                    return BadRequest();
                }
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }

        }

        /// <summary>
        /// this method is used to update the company details
        /// </summary>
        /// <param name="companyDetail">company detailAC with updated company details.</param>
        /// <returns>object of company details with updated details</returns>
        [Route("updateCompanyDetail")]
        [HttpPut]
        public IHttpActionResult UpdateCompanyDetail(CompanyDetailAC companyDetail)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    var companyDetails = _companyRepository.UpdateCompanyDetail(companyDetail);
                    return Ok(companyDetails);
                }
                else
                    return BadRequest();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// get all the languages
        /// </summary>
        /// <returns>list of Languguage with the language details.</returns>
        [Route("getAllLanguage")]
        [HttpGet]
        public IHttpActionResult GetAllLanguage()
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    var languageCollection = new List<LanguageAC>();
                    foreach (var language in _companyRepository.GetAllLanguage())
                    {
                        var languageAC = new LanguageAC();
                        languageAC = ApplicationClassHelper.ConvertType<Language, LanguageAC>(language);
                        languageAC.LanguageId = language.Id;
                        languageCollection.Add(languageAC);
                    }
                    return Ok(languageCollection);
                }
                else
                    return BadRequest();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// delete the company information.
        /// </summary>
        /// <param name="companyId">contain the company id to delete company details.</param>
        /// <returns></returns>
        [Route("deleteCompanyDetails")]
        [HttpGet]
        public IHttpActionResult DeleteCompanyDetails(int companyId)
        {
            try
            {
                _companyRepository.DeleteCompanyDetails(companyId);
                return Ok();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// this method is used to add system settings to database. -JJ
        /// </summary>
        /// <param name="companyDetail">object of CompanyDetailAC</param>
        /// <returns>saved object of CompanyDetailAC</returns>
        [HttpPost]
        [Route("addSystemSetting")]
        public IHttpActionResult AddSystemSetting(CompanyDetailAC systemSetting)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    var userName = (HttpContext.Current.User.Identity.Name);
                    var companySystemSetting = _companyRepository.AddSystemSetting(systemSetting, userName);
                    return Ok(companySystemSetting);

                }
                else
                {
                    return BadRequest();
                }
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// this method is used to get system setting - JJ
        /// </summary>
        /// <returns> Object of CompanyConfiguration </returns>
        [Route("getSystemSetting")]
        [HttpGet]
        public IHttpActionResult GetSystemSetting()
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    var userName = (HttpContext.Current.User.Identity.Name);
                    var systemSetting = _companyRepository.GetSystemSetting(userName);

                    return Ok(systemSetting);
                }
                else
                    return BadRequest();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        [Route("GetCompanyDetailByUserId")]
        [HttpGet]
        public IHttpActionResult GetCompanyDetailByUserId()
        {
            try
            {
                string userId = HttpContext.Current.User.Identity.GetUserId();
                var companyDetail = _companyRepository.GetCompanyDetailByUserId(userId);
                var companyDetailAC = new CompanyDetailAC();
                if (companyDetail != null)
                {
                    companyDetailAC.CompanyId = companyDetail.Id;
                    companyDetailAC.Name = companyDetail.Name;
                    companyDetailAC.userId = companyDetail.UserId;
                }
                return Ok(companyDetailAC);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        [Route("GetCompanyObjectByUserId")]
        [HttpGet]
        public IHttpActionResult GetCompanyObjectByUserId(string userId)
        {
            try
            {
                var companyDetail = _companyRepository.GetCompanyDetailByUserId(userId);
                var companyDetailAC = new CompanyDetailAC();
                if (companyDetail != null)
                {
                    companyDetailAC.CompanyId = companyDetail.Id;
                    companyDetailAC.Name = companyDetail.Name;
                    companyDetailAC.userId = companyDetail.UserId;

                }
                return Ok(companyDetailAC);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        [HttpGet]
        [Route("getAllCurrencyDetail")]
        public IHttpActionResult GetAllCurrencyDetail()
        {
            try
            {
                return Ok(_companyRepository.GetAllCurrencyDetail());
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        [HttpGet]
        [Route("GetCompanyConfigruationByCompanyId")]
        public IHttpActionResult GetCompanyConfigruationByCompanyId(int companyId)
        {
            try
            {
                var companyConfigruation = _companyRepository.GetCompanyConfigurationByCompanyId(companyId);
                return Ok(companyConfigruation);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        [HttpGet]
        [Route("getbalancebarcodeconfiguration")]
        public IHttpActionResult GetBalanceBarcodeConfiguration(int companyId)
        {
            try
            {                
                var BBConfiguration = _companyRepository.GetBalanceBarcodeConfiguration(companyId);
                //int TotalCount = BBConfiguration.Count;

                return Ok(BBConfiguration);
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
