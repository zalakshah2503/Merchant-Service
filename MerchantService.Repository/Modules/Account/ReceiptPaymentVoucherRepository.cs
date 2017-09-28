using MerchantService.DomainModel.Models.Accounting;
using MerchantService.Repository.ApplicationClasses.Account;
using MerchantService.Repository.DataRepository;
using MerchantService.Utility.Logger;
using System;
using System.Collections.Generic;
using System.Linq;

namespace MerchantService.Repository.Modules.Account
{
    public class ReceiptPaymentVoucherRepository :IReceiptPaymentVoucherRepository
    {
        #region Private Variable
        private readonly IDataRepository<ReceiptPaymentVoucher> _receiptPaymnetContext;
        private readonly IDataRepository<ReceiptPaymentDetail> _receiptPaymnetDetailContext;
        private readonly IErrorLog _errorLog;
        #endregion

        #region Public Method
        public ReceiptPaymentVoucherRepository(IDataRepository<ReceiptPaymentVoucher> receiptPaymnetContext,IDataRepository<ReceiptPaymentDetail> receiptPaymnetDetailContext,IErrorLog errorLog)
        {
            _receiptPaymnetContext = receiptPaymnetContext;
            _receiptPaymnetDetailContext = receiptPaymnetDetailContext;
            _errorLog = errorLog;
        }
        public ReceiptPaymentVoucher SaveReceiptVoucher(ReceiptPaymentVoucherAC receiptPaymentVoucherAc, int companyId)
        {
            try
            {
                var receiptPaymentVoucher = new ReceiptPaymentVoucher
                {
                    BranchId = 1,
                    IsReceipt = receiptPaymentVoucherAc.IsReceipt,
                    Narration = receiptPaymentVoucherAc.Narration,
                    TotalAmount = receiptPaymentVoucherAc.TotalAmount,
                    CreatedDateTime = DateTime.UtcNow,
                    AccountId = receiptPaymentVoucherAc.AccountId,
                    BankName = receiptPaymentVoucherAc.BankName,
                    BankBranch = receiptPaymentVoucherAc.BankBranch,
                    ChequeNo = receiptPaymentVoucherAc.ChequeNo,
                    ParamTypeId = receiptPaymentVoucherAc.ParamTypeId,
                    ReceivedFromId =  receiptPaymentVoucherAc.ReceivedFromId,
                    ChequeDate =  receiptPaymentVoucherAc.ChequeDate,
                    companyId = companyId
                };
                _receiptPaymnetContext.Add(receiptPaymentVoucher);
                _receiptPaymnetContext.SaveChanges();

                SaveReceiptVoucherDetail(receiptPaymentVoucherAc.ReceiptPaymentDetail,receiptPaymentVoucher.Id);

                return receiptPaymentVoucher;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        public int CountReceiptOrPaymentVoucherRecord(bool isReceipt, int companyId)
        {
            try
            {
                int count = isReceipt ? _receiptPaymnetContext.GetAll().Count(x => x.IsReceipt && x.companyId == companyId) : _receiptPaymnetContext.GetAll().Count(x => !x.IsReceipt && x.companyId == companyId);

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

        private void SaveReceiptVoucherDetail(List<ReceiptPaymentDetailAC> receiptPaymentDetailAcList,int id)
        {
            try
            {
                foreach (var receiptPaymentDetail in receiptPaymentDetailAcList)
                {
                    var receiptPaymentDeatiDetailAc = new ReceiptPaymentDetail
                    {
                        Amount = receiptPaymentDetail.Amount,
                        LedgerId = receiptPaymentDetail.LedgerId,
                        ReceiptPaymentId = id,
                        
                    };
                    
                    receiptPaymentDeatiDetailAc.CreatedDateTime = DateTime.UtcNow;
                    _receiptPaymnetDetailContext.Add(receiptPaymentDeatiDetailAc);
                    _receiptPaymnetDetailContext.SaveChanges();
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
