using MerchantService.DomainModel.Enums;
using MerchantService.DomainModel.Models.Accounting;
using MerchantService.Repository.ApplicationClasses.Account;
using MerchantService.Repository.DataRepository;
using MerchantService.Utility.Logger;
using System;
using System.Collections.Generic;
using System.Linq;

namespace MerchantService.Repository.Modules.Account
{
    public class SalesPurchaseVoucherRepository : ISalesPurchaseVoucherRepository
    {
        #region Private Variable
        private readonly IDataRepository<SalesPurchaseVoucher> _salesPurchaseContext;
        private readonly IDataRepository<SalesPurchaseDetail> _salesPurchaseDetailContext;
        private readonly IErrorLog _errorLog;
        #endregion

        #region Constructor
        public SalesPurchaseVoucherRepository(IDataRepository<SalesPurchaseVoucher> salesPurchaseContext, IDataRepository<SalesPurchaseDetail> salesPurchaseDetailContext, IErrorLog errorLog)
        {
            _salesPurchaseContext = salesPurchaseContext;
            _salesPurchaseDetailContext = salesPurchaseDetailContext;
            _errorLog = errorLog;
        }
        #endregion

        #region Publich Method
        public SalesPurchaseVoucher SaveSalesPurchaseVoucher(SalesPurchaseVoucherAC salesPurchaseVoucherAc,int companyId)
        {
            try
            {
                int ledgerId = 0;
                ledgerId = salesPurchaseVoucherAc.IsSalesVoucher == true ? (int)AccountGroup.Sales :(int)AccountGroup.Purchase;
                var salesPurchaseVoucher = new SalesPurchaseVoucher
                {
                    BankBranch = salesPurchaseVoucherAc.BankBranch,
                    BankName = salesPurchaseVoucherAc.BankName,
                    CheckDate = salesPurchaseVoucherAc.CheckDate == null ? DateTime.UtcNow : salesPurchaseVoucherAc.CheckDate.Value,
                    ChequeNo = salesPurchaseVoucherAc.ChequeNo,
                    CreatedDateTime = DateTime.UtcNow,
                    IsSalesVoucher = salesPurchaseVoucherAc.IsSalesVoucher,
                    LedgerId = 18,
                    Narration = salesPurchaseVoucherAc.Narration,
                    ParamTypeId = salesPurchaseVoucherAc.ParamTypeId,
                    PartyAccountId = salesPurchaseVoucherAc.PartyAccountId,
                    ReferenaceNo = salesPurchaseVoucherAc.ReferenaceNo,
                    SupplierInvoiceNo = salesPurchaseVoucherAc.SupplierInvoiceNo,
                    TotalAmount = salesPurchaseVoucherAc.TotalAmount,
                    BranchId = 1,
                    CompanyId = companyId
                };
                _salesPurchaseContext.Add(salesPurchaseVoucher);
                _salesPurchaseContext.SaveChanges();

                SaveSalesPurchaseDetail(salesPurchaseVoucherAc.SalesPurchaseDetail, salesPurchaseVoucher.Id);

                return salesPurchaseVoucher;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }
        public int CountSalesOrPurchaseVoucherRecord(bool isSales,int companyId)
        {
            try
            {
                int count = isSales ? _salesPurchaseContext.GetAll().Count(x => x.IsSalesVoucher && x.CompanyId == companyId) : _salesPurchaseContext.GetAll().Count(x => !x.IsSalesVoucher && x.CompanyId == companyId);

                return count;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }
        #endregion

        #region Private Method
        private void SaveSalesPurchaseDetail(List<SalesPurchaseDetailAC> salesPurchaseDetailList, int Id)
        {
            try
            {
                foreach (var salesPurchase in salesPurchaseDetailList)
                {
                    var salesPurchaseDetail = new SalesPurchaseDetail
                    {
                        Amount = salesPurchase.Amount,
                        CreatedDateTime = DateTime.UtcNow,
                        ItemId = salesPurchase.ItemId,
                        Price = 0,
                        Quantity = 0,
                        SalesPurchaseVoucherId = Id,

                    };
                    _salesPurchaseDetailContext.Add(salesPurchaseDetail);
                    _salesPurchaseDetailContext.SaveChanges();
                }
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
