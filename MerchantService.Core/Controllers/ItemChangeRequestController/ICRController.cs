using MerchantService.Core.Global;
using MerchantService.Repository.ApplicationClasses.ItemChangeRequest;
using MerchantService.Repository.Modules.Admin.Company;
using MerchantService.Repository.Modules.Global;
using MerchantService.Repository.Modules.ItemChangeRequest;
using MerchantService.Utility.Constants;
using MerchantService.Utility.Logger;
using System;
using System.Web;
using System.Web.Http;

namespace MerchantService.Core.Controllers.ItemChangeRequestController
{
    //[DynamicAuthorize]
    [RoutePrefix("api/itemchangerequest")]
    public class ICRController : BaseController
    {
        #region "Private Member(s)"

        private readonly IErrorLog _errorLog;
        private readonly IICRRepository _icrContext;
        private readonly ICompanyRepository _companyRepository;
        #endregion

        #region "Constructor"

        public ICRController(ICompanyRepository companyRepository, IErrorLog errorLog, IICRRepository icrContext, IMerchantDataRepository merchantDataRepository)
            : base(errorLog, merchantDataRepository)
        {
            _errorLog = errorLog;
            _companyRepository = companyRepository;
            _icrContext = icrContext;
        }
        #endregion

        #region "Public Method(s)"

        /// <summary>
        /// this method is used for fetching ItemQuantity list.- JJ
        /// </summary>
        /// <param name="id">Id of Item</param>
        /// <returns>list of object of ItemQuantity</returns>
        [HttpGet]
        [Route("getitemquantitylist")]
        public IHttpActionResult GetItemQuantityList(int id)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    if (MerchantContext.Permission.IsAllowToAccessAllBranch)
                    {
                        var itemQuantityList = _icrContext.GetItemQuantityList(id, null);
                        return Ok(itemQuantityList);
                    }
                    else
                    {
                        var itemQuantityList = _icrContext.GetItemQuantityList(id, MerchantContext.UserDetails.BranchId);
                        return Ok(itemQuantityList);
                    }
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
        /// this method is used for adding ICR.- JJ
        /// </summary>
        /// <param name="itemChangedDetail">object of ItemChangedDetailsAC</param>
        [HttpPost]
        [Route("saveicr")]
        public IHttpActionResult SaveICR(ItemChangedDetailsAC itemChangedDetail)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    if (MerchantContext.Permission.IsAllowedToInitiateICR || MerchantContext.Permission.IsAllowedToInitiateICRForOtherBranches)
                    {
                        var status = _icrContext.SaveICR(itemChangedDetail, MerchantContext.UserDetails, MerchantContext.CompanyDetails, null);
                        return Ok(new { status = status });
                    }
                    else
                    {
                        var status = StringConstants.PermissionDenied;
                        return Ok(new { status = status });
                    }
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
        /// this method is used for updating ICR.- JJ
        /// </summary>
        /// <param name="itemChangedDetail">object of ItemChangedDetailsAC</param>
        [HttpPost]
        [Route("updateicr")]
        public IHttpActionResult UpdateICR(ItemChangedDetailsAC itemChangedDetail)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    if (MerchantContext.Permission.IsAllowedToEditICR)
                    {
                        var status = _icrContext.UpdateICR(itemChangedDetail, MerchantContext.UserDetails, MerchantContext.CompanyDetails, itemChangedDetail.ParentRecordId);
                        return Ok(new { status = status });
                    }
                    else
                    {
                        var status = StringConstants.PermissionDenied;
                        return Ok(new { status = status });
                    }
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
        /// this method is used for fetching ComapnyConfiguration.- JJ
        /// </summary>
        /// <param name="itemChangedDetail">object of ItemChangedDetailsAC</param>
        [HttpGet]
        [Route("getcompanyconfigruation")]
        public IHttpActionResult GetCompanyConfigruation()
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    var companyConfigruation = _companyRepository.GetCompanyConfigurationByCompanyId(MerchantContext.CompanyDetails.Id);
                    return Ok(companyConfigruation);
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
      
        #endregion
    }
}
