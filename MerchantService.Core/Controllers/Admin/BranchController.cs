using MerchantService.DomainModel.Models.Accounting;
using MerchantService.Repository.ApplicationClasses.Admin;
using MerchantService.Repository.Modules.Account;
using MerchantService.Repository.Modules.Admin;
using MerchantService.Utility.Constants;
using MerchantService.Utility.Logger;
using System;
using System.Collections.Generic;
using System.Web;
using System.Web.Http;

namespace MerchantService.Core.Controllers.Admin
{
    //[DynamicAuthorize]
    [RoutePrefix("api/branch")]
    public class BranchController : ApiController
    {
        #region Private Variables

        private readonly IErrorLog _errorLog;
        private readonly IBranchRepository _branchContext;
        private readonly ILedgerAccountRepository _iLedgerAccountRepository;

        private readonly int companyId;


        #endregion

        #region Constructor

        public BranchController(IErrorLog errorLog, IBranchRepository branchContext, ILedgerAccountRepository iLedgerAccountRepository)
        {
            _errorLog = errorLog;
            _iLedgerAccountRepository = iLedgerAccountRepository;
            _branchContext = branchContext;
            companyId = Convert.ToInt32(HttpContext.Current.Session["CompanyId"]);
        }
        public BranchController()
        {

        }
        #endregion

        #region Public Method

        /// <summary>
        /// This method is used to get branch list - JJ
        /// </summary>        
        /// <returns>return list of BranchDetail objects</returns>
        [Route("getBranch")]
        [HttpGet]
        public IHttpActionResult GetBranchList()
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    var userName = HttpContext.Current.User.Identity.Name;
                    if (userName == StringConstants.AdminName)
                        return Ok();
                    else
                    {
                        var branchList = _branchContext.GetBranchList(userName, companyId);
                        return Ok(branchList);
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
        ///This method is used to get branch detail of the specific Id -JJ
        /// </summary>
        /// <param name="Id">Id of branch</param>
        /// <returns>return BranchDetailAC object</returns>
        [HttpGet]
        [Route("getBranchById")]
        public IHttpActionResult GetBranchById(int branchId)
        {
            try
            {
                var branch = _branchContext.GetBranchById(branchId);
                return Ok(branch);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// This method is used to add branch to the system - JJ
        /// </summary>
        /// <param name="branchDetail">object of BranchDetailAC</param>
        /// <param name="userNmae">currently logged in user's name</param>
        /// <returns>return BranchDetailAC object</returns>
        [HttpPost]
        [Route("addBranchDetail")]
        public IHttpActionResult AddBranchDetail(BranchDetailAC branchDetail)
        {
            try
            {
                var userName = HttpContext.Current.User.Identity.Name;
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    branchDetail.CompanyId = companyId;
                    var branchDetails = _branchContext.AddBranchDetail(branchDetail, userName);
                    if (branchDetails.Id != 0)
                    {
                        _branchContext.UpdateItemQuantity(branchDetails.Id, branchDetails.CompanyId);
                        List<Ledgers> listOfLedeger = new List<Ledgers>();
                        listOfLedeger.Add(new Ledgers { GroupId = 16, LedgerName = "Cash", Name = StringConstants.CashInHand, Address = "Baroda", CreatedDateTime = DateTime.UtcNow, IsEditable = false, State = "Gujrat", BranchId = branchDetails.Id, SuplierId = null, Comment = null, ParentLedgerId = null, Balance = 0 });
                        listOfLedeger.Add(new Ledgers { GroupId = 3, LedgerName = "Bank", Name = StringConstants.Bank, Address = "Baroda", CreatedDateTime = DateTime.UtcNow, IsEditable = false, State = "Gujrat", BranchId = branchDetails.Id, SuplierId = null, Comment = null, ParentLedgerId = null, Balance = 0 });
                        listOfLedeger.Add(new Ledgers { GroupId = 17, LedgerName = "Sales", Name = StringConstants.Sales, Address = "Baroda", CreatedDateTime = DateTime.UtcNow, IsEditable = false, State = "Gujrat", BranchId = branchDetails.Id, SuplierId = null, Comment = null, ParentLedgerId = null, Balance = 0 });
                        listOfLedeger.Add(new Ledgers { GroupId = 17, LedgerName = "Purchase", Name = StringConstants.Purchase, Address = "Baroda", CreatedDateTime = DateTime.UtcNow, IsEditable = false, State = "Gujrat", BranchId = branchDetails.Id, SuplierId = null, Comment = null, ParentLedgerId = null, Balance = 0 });
                        listOfLedeger.Add(new Ledgers { GroupId = 14, LedgerName = StringConstants.Loss, Name = StringConstants.Loss, Address = "Baroda", CreatedDateTime = DateTime.UtcNow, IsEditable = false, State = "Gujrat", BranchId = branchDetails.Id, SuplierId = null, Comment = null, ParentLedgerId = null, Balance = 0 });
                        listOfLedeger.Add(new Ledgers { GroupId = 8, LedgerName = StringConstants.Expenses, Name = StringConstants.Expenses, Address = "Baroda", CreatedDateTime = DateTime.UtcNow, IsEditable = false, State = "Gujrat", BranchId = branchDetails.Id, SuplierId = null, Comment = null, ParentLedgerId = null, Balance = 0 });
                        listOfLedeger.Add(new Ledgers { GroupId = 6, LedgerName = "Credit Note", Name = StringConstants.CRNote, Address = "Baroda", CreatedDateTime = DateTime.UtcNow, IsEditable = false, State = "Gujrat", BranchId = branchDetails.Id, SuplierId = null, Comment = null, ParentLedgerId = null, Balance = 0 });
                        listOfLedeger.Add(new Ledgers { GroupId = 17, LedgerName = StringConstants.StockInHand, Name = StringConstants.StockInHand, Address = "Baroda", CreatedDateTime = DateTime.UtcNow, IsEditable = false, State = "Gujrat", BranchId = branchDetails.Id, SuplierId = null, Comment = null, ParentLedgerId = null, Balance = 0 });
                        listOfLedeger.Add(new Ledgers { GroupId = 12, LedgerName = StringConstants.Income, Name = StringConstants.Income, Address = "Baroda", CreatedDateTime = DateTime.UtcNow, IsEditable = false, State = "Gujrat", BranchId = branchDetails.Id, SuplierId = null, Comment = null, ParentLedgerId = null, Balance = 0 });
                        listOfLedeger.Add(new Ledgers { GroupId = 17, LedgerName = StringConstants.SalesReturn, Name = StringConstants.SalesReturn, Address = "Baroda", CreatedDateTime = DateTime.UtcNow, IsEditable = false, State = "Gujrat", BranchId = branchDetails.Id, SuplierId = null, Comment = null, ParentLedgerId = null, Balance = 0 });
                        listOfLedeger.Add(new Ledgers { GroupId = 17, LedgerName = StringConstants.PurchaseRetrun, Name = StringConstants.PurchaseRetrun, Address = "Baroda", CreatedDateTime = DateTime.UtcNow, IsEditable = false, State = "Gujrat", BranchId = branchDetails.Id, SuplierId = null, Comment = null, ParentLedgerId = null, Balance = 0 });
                        _iLedgerAccountRepository.AddLedgersForBranch(listOfLedeger);
                    }
                    return Ok(branchDetails);
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
        /// This method is used to update branch - JJ
        /// </summary>
        /// <param name="branchDetail">object of BranchDetailAC</param>
        /// <returns>null</returns>
        [Route("updateBranchDetail")]
        [HttpPut]
        public IHttpActionResult UpdateBranchDetail(BranchDetailAC branchDetail)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    if (_branchContext.CheckBranchNameIdExist(branchDetail.Name, branchDetail.Id, branchDetail.CompanyId))
                    {
                        var nameExists = true;
                        return Ok(new { nameExists });
                    }
                    else if (_branchContext.CheckCodeIdExist(branchDetail.Code, branchDetail.Id, branchDetail.CompanyId))
                    {
                        var codeExists = true;
                        return Ok(new { codeExists });
                    }
                    else if (_branchContext.CheckEmailIdExist(branchDetail.Email, branchDetail.Id))
                    {
                        var emailExixts = true;
                        return Ok(new { emailExixts });
                    }
                    else if (_branchContext.CheckPhoneIdExist(branchDetail.Phone, branchDetail.Id))
                    {
                        var phoneExists = true;
                        return Ok(new { phoneExists });
                    }
                    else
                    {
                        _branchContext.UpdateBranchDetail(branchDetail);
                        List<Ledgers> listOfLedeger = new List<Ledgers>();
                        listOfLedeger.Add(new Ledgers { GroupId = 16, LedgerName = "Cash", Name = StringConstants.CashInHand, Address = "Baroda", CreatedDateTime = DateTime.UtcNow, IsEditable = false, State = "Gujrat", BranchId = branchDetail.Id, SuplierId = null, Comment = null, ParentLedgerId = null, Balance = 0, CompanyId = companyId });
                        listOfLedeger.Add(new Ledgers { GroupId = 3, LedgerName = "Bank", Name = StringConstants.Bank, Address = "Baroda", CreatedDateTime = DateTime.UtcNow, IsEditable = false, State = "Gujrat", BranchId = branchDetail.Id, SuplierId = null, Comment = null, ParentLedgerId = null, Balance = 0, CompanyId = companyId });
                        listOfLedeger.Add(new Ledgers { GroupId = 17, LedgerName = "Sales", Name = StringConstants.Sales, Address = "Baroda", CreatedDateTime = DateTime.UtcNow, IsEditable = false, State = "Gujrat", BranchId = branchDetail.Id, SuplierId = null, Comment = null, ParentLedgerId = null, Balance = 0, CompanyId = companyId });
                        listOfLedeger.Add(new Ledgers { GroupId = 17, LedgerName = "Purchase", Name = StringConstants.Purchase, Address = "Baroda", CreatedDateTime = DateTime.UtcNow, IsEditable = false, State = "Gujrat", BranchId = branchDetail.Id, SuplierId = null, Comment = null, ParentLedgerId = null, Balance = 0, CompanyId = companyId });
                        listOfLedeger.Add(new Ledgers { GroupId = 14, LedgerName = StringConstants.Loss, Name = StringConstants.Loss, Address = "Baroda", CreatedDateTime = DateTime.UtcNow, IsEditable = false, State = "Gujrat", BranchId = branchDetail.Id, SuplierId = null, Comment = null, ParentLedgerId = null, Balance = 0, CompanyId = companyId });
                        listOfLedeger.Add(new Ledgers { GroupId = 8, LedgerName = StringConstants.Expenses, Name = StringConstants.Expenses, Address = "Baroda", CreatedDateTime = DateTime.UtcNow, IsEditable = false, State = "Gujrat", BranchId = branchDetail.Id, SuplierId = null, Comment = null, ParentLedgerId = null, Balance = 0, CompanyId = companyId });
                        listOfLedeger.Add(new Ledgers { GroupId = 6, LedgerName = "Credit Note", Name = StringConstants.CRNote, Address = "Baroda", CreatedDateTime = DateTime.UtcNow, IsEditable = false, State = "Gujrat", BranchId = branchDetail.Id, SuplierId = null, Comment = null, ParentLedgerId = null, Balance = 0, CompanyId = companyId });
                        listOfLedeger.Add(new Ledgers { GroupId = 17, LedgerName = StringConstants.StockInHand, Name = StringConstants.StockInHand, Address = "Baroda", CreatedDateTime = DateTime.UtcNow, IsEditable = false, State = "Gujrat", BranchId = branchDetail.Id, SuplierId = null, Comment = null, ParentLedgerId = null, Balance = 0, CompanyId = companyId });
                        listOfLedeger.Add(new Ledgers { GroupId = 12, LedgerName = StringConstants.Income, Name = StringConstants.Income, Address = "Baroda", CreatedDateTime = DateTime.UtcNow, IsEditable = false, State = "Gujrat", BranchId = branchDetail.Id, SuplierId = null, Comment = null, ParentLedgerId = null, Balance = 0, CompanyId = companyId });
                        listOfLedeger.Add(new Ledgers { GroupId = 17, LedgerName = StringConstants.SalesReturn, Name = StringConstants.SalesReturn, Address = "Baroda", CreatedDateTime = DateTime.UtcNow, IsEditable = false, State = "Gujrat", BranchId = branchDetail.Id, SuplierId = null, Comment = null, ParentLedgerId = null, Balance = 0, CompanyId = companyId });
                        listOfLedeger.Add(new Ledgers { GroupId = 17, LedgerName = StringConstants.PurchaseRetrun, Name = StringConstants.PurchaseRetrun, Address = "Baroda", CreatedDateTime = DateTime.UtcNow, IsEditable = false, State = "Gujrat", BranchId = branchDetail.Id, SuplierId = null, Comment = null, ParentLedgerId = null, Balance = 0, CompanyId = companyId });
                        _iLedgerAccountRepository.AddLedgersForBranch(listOfLedeger);
                        return Ok(branchDetail);
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
        /// This method is used to delete branch from the system - JJ
        /// </summary>
        /// <param name="id">Id of branch</param>
        /// <returns>null</returns>

        [Route("deleteBranch")]
        [HttpGet]
        public IHttpActionResult DeleteBranch(int id)
        {
            try
            {
                var status = _branchContext.DeleteBranchDetail(id);
                return Ok(new { status = status });
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
