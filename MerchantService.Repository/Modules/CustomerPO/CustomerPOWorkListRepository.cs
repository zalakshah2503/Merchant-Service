using MerchantService.DomainModel.Models.CustomerPurchaseOrder;
using MerchantService.DomainModel.Models.POS;
using MerchantService.Repository.ApplicationClasses.CustomerPO;
using MerchantService.Repository.DataRepository;
using MerchantService.Utility.Logger;
using System;
using System.Collections.Generic;
using System.Linq;

namespace MerchantService.Repository.Modules.CustomerPO
{
    public class CustomerPOWorkListRepository : ICustomerPOWorkListRepository
    {
        #region Private Variable
        private readonly IErrorLog _errorLog;
        private readonly IDataRepository<CustomerPurchaseOrder> _customerPOContext;
        private readonly IDataRepository<CPOItem> _CPOItemContext;
        private readonly IDataRepository<CPOAdditionalCost> _CPOAdditionalCostContext;
        private readonly IDataRepository<CPOPayment> _cpoPaymentContext;
        private readonly IDataRepository<CPOBill> _cpoBillContext;
        private readonly IDataRepository<POSBillItem> _posBillItemContext;

        #endregion

        #region Constructor
        public CustomerPOWorkListRepository(IDataRepository<CustomerPurchaseOrder> customerPOContext, IDataRepository<CPOItem> CPOItemContext,
             IDataRepository<POSBillItem> posBillItemContext, IDataRepository<CPOAdditionalCost> CPOAdditionalCostContext,
            IDataRepository<CPOPayment> cpoPaymentContext, IDataRepository<CPOBill> cpoBillContext, IErrorLog errorLog)
        {
            _customerPOContext = customerPOContext;
            _posBillItemContext = posBillItemContext;
            _CPOAdditionalCostContext = CPOAdditionalCostContext;
            _CPOItemContext = CPOItemContext;
            _cpoPaymentContext = cpoPaymentContext;
            _cpoBillContext = cpoBillContext;
            _errorLog = errorLog;
        }

        #endregion

        #region Public Methods

        /// <summary>
        /// this method is used for fetching customer purchase order list.
        /// </summary>
        /// <param name="companyId"></param>
        /// <returns>list of object of CustomerPOAC</returns>
        public List<CustomerPOAC> GetCustomerPOList(int companyId)
        {
            try
            {
                var date = DateTime.UtcNow.Subtract(TimeSpan.FromDays(14));

                var customerpoList = new List<CustomerPOAC>();
                var cpoList = _customerPOContext.Fetch(x => x.UserDetail.Branch.CompanyId == companyId).OrderByDescending(x => x.CreatedDateTime).ToList();
                foreach (var cpo in cpoList)
                {
                    var isInList = false;
                    if (cpo.CollectionDate != null)
                    {
                        if (cpo.CollectionDate > date)
                        {
                            isInList = true;
                        }
                    }
                    else
                    {
                        isInList = true;
                    }
                    if (isInList)
                    {
                        CustomerPOAC cpoAC = new CustomerPOAC
                        {
                            CollectingBranchId = cpo.CollectingBranchId,
                            CancelationDate = cpo.CancelationDate,
                            CollectingBranchName = cpo.CollectingBranch.Name,
                            CollectionDate = cpo.CollectionDate,
                            Comments = cpo.Comments,
                            CustomerId = cpo.CustomerId,
                            CustomerPOId = cpo.Id,
                            MembershipCode = cpo.CustomerProfile.MembershipCode,
                            DueDate = cpo.DueDate,
                            InitiationBranchId = cpo.InitiationBranchId,
                            InitiationBranchName = cpo.InitiationBranch.Name,
                            InitiationDate = cpo.InitiationDate,
                            InitiatorId = cpo.InitiatorId,
                            IsCancel = cpo.IsCancel,
                            IsSPORequired = cpo.IsSPORequired,
                            IsCollected = cpo.IsCollected,
                            ModifiedBy = cpo.ModifiedBy,
                            PurchaseOrderNo = cpo.PurchaseOrderNo,
                            Total = cpo.TotalCPOAmount,
                            CustomerName = cpo.CustomerProfile.Name,
                            CustomerMobile = cpo.CustomerProfile.Mobile
                        };
                        customerpoList.Add(cpoAC);
                    }
                }
                return customerpoList;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        public List<CPOBill> GetCPOBillListByPOId(int purchaseOrederId)
        {
            try
            {
                return _cpoBillContext.Fetch(x => x.CPOId == purchaseOrederId).OrderByDescending(x => x.CreatedDateTime).ToList();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }

        }


        /// <summary>
        /// This method used for get pos bill item by bill id.-An
        /// </summary>
        /// <param name="billId"></param>
        /// <returns></returns>
        public List<POSBillItem> getPOsBillItemByBillId(int billId)
        {
            try
            {
                return _posBillItemContext.Fetch(x => x.BillID == billId).OrderByDescending(x => x.CreatedDateTime).ToList();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }

        }


        /// <summary>
        /// This method used for get customer purchase ordr by branch.-An
        /// </summary>
        /// <param name="branchId"></param>
        /// <returns></returns>
        public List<CustomerPurchaseOrder> GetListOfCustomerPurchaseOrderByBranch(int branchId)
        {
            try
            {
                return _customerPOContext.Fetch(x => x.InitiationBranchId == branchId).OrderByDescending(x => x.CreatedDateTime).ToList();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }

        }

        /// <summary>
        /// This method used for CPO Item list by customer PO Id. -An
        /// </summary>
        /// <param name="customerPOId"></param>
        /// <returns></returns>
        public List<CPOItem> GetCPOItemListByCustomerPOId(int customerPOId)
        {
            try
            {
                return _CPOItemContext.Fetch(x => x.CPOId == customerPOId).OrderByDescending(x => x.CreatedDateTime).ToList();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }

        }


        /// <summary>
        /// this method is used for fetching customer purchase order.
        /// </summary>
        /// <param name="Id">Id of the Customer Purchase Order</param>
        /// <returns>object of CustomerPOAC</returns>
        public CustomerPOAC GetCustomerPO(int Id)
        {
            try
            {
                var cpo = _customerPOContext.Find(Id);
                var cpoItemList = _CPOItemContext.Fetch(x => x.CPOId == Id).ToList();
                var additionalCostList = _CPOAdditionalCostContext.Fetch(x => x.CPOId == Id).ToList();
                var cpoPaymentList = _cpoPaymentContext.Fetch(x => x.CPOId == Id).ToList();
                CustomerPOAC cpoAC = new CustomerPOAC();
                cpoAC.CustomerPOId = cpo.Id;
                cpoAC.InitiationDate = cpo.InitiationDate;
                cpoAC.Comments = cpo.Comments;
                cpoAC.TotalCPOAmount = cpo.TotalCPOAmount;
                cpoAC.Customer = cpo.CustomerProfile;
                cpoAC.PurchaseOrderNo = cpo.PurchaseOrderNo;
                cpoAC.InitiationBranchId = cpo.InitiationBranchId;
                cpoAC.InitiationBranchName = cpo.InitiationBranch.Name;
                cpoAC.InitiatorId = cpo.InitiatorId;
                cpoAC.IsCancel = cpo.IsCancel;
                cpoAC.IsSPORequired = cpo.IsSPORequired;
                cpoAC.DueDate = cpo.DueDate;
                cpoAC.CancelationDate = cpo.CancelationDate;
                cpoAC.IsCollected = cpo.IsCollected;
                cpoAC.CollectingBranchId = cpo.CollectingBranchId;
                cpoAC.CollectingBranchName = cpo.CollectingBranch.Name;
                cpoAC.CollectionDate = cpo.CollectionDate;
                cpoAC.ModifiedBy = cpo.ModifiedBy;
                cpoAC.CPOPayment = cpoPaymentList;
                cpoAC.CPOItem = cpoItemList;
                cpoAC.CPOAdditionalCost = additionalCostList;
                return cpoAC;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }
        #endregion

        #region Dispose Method
        public void Dispose()
        {
            try
            {
                _customerPOContext.Dispose();
                _CPOAdditionalCostContext.Dispose();
                _CPOItemContext.Dispose();
                _cpoPaymentContext.Dispose();
                GC.SuppressFinalize(this);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
            }
        }

        #endregion
    }
}
