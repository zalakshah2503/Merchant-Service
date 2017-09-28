using MerchantService.DomainModel.Models.Accounting;
using MerchantService.Repository.ApplicationClasses.Account;

namespace MerchantService.Repository.Modules.Account
{
    public interface ISalesPurchaseVoucherRepository
    {
        /// <summary>
        /// This method is used for saving  record in SalesPurchaseVoucher table. SP
        /// </summary>
        /// <param name="receiptPaymentVoucher">object of SalesPurchaseVoucherAC</param>
        /// <returns>object of SalesPurchaseVoucherAC</returns>
       SalesPurchaseVoucher SaveSalesPurchaseVoucher(SalesPurchaseVoucherAC salesPurchaseVoucherAc,int CompanyId);


       /// <summary>
       /// this method is use for geeting count of sales or purchase voucher record.
       /// </summary>
       /// <param name="isSales">if sales then true else false</param>
       /// <returns></returns>
       int CountSalesOrPurchaseVoucherRecord(bool isSales, int CompanyId);

        
    }
}
