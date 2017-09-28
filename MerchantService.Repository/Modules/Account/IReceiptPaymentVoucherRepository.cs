using MerchantService.DomainModel.Models.Accounting;
using MerchantService.Repository.ApplicationClasses.Account;

namespace MerchantService.Repository.Modules.Account
{
    public interface IReceiptPaymentVoucherRepository
   {
       /// <summary>
       /// This method is used for saving  record in ReceiptPaymentVoucher table. SP
       /// </summary>
       /// <param name="receiptPaymentVoucher">object of ReceiptPaymentVoucherAC</param>
       /// <returns>object of ReceiptPaymentVoucher</returns>
       ReceiptPaymentVoucher SaveReceiptVoucher(ReceiptPaymentVoucherAC receiptPaymentVoucher,int companyId);

       /// <summary>
       /// this method is use for geeting count of receipt or payment voucher record.
       /// </summary>
       /// <param name="Receipt">if receipt then true else false</param>
       /// <returns></returns>
       int CountReceiptOrPaymentVoucherRecord(bool isReceipt,int companyId);

   }
}
