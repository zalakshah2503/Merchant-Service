using MerchantService.DomainModel.Models.CreditNote;
using System.Collections.Generic;

namespace MerchantService.Repository.ApplicationClasses.SupplierPO
{
    public class SPOPaymentAC
    {
        public decimal Amount { get; set; }
        public string Comment { get; set; }
        public decimal Credit { get; set; }
        public bool IsPOBillPayment { get; set; }
        public int PurchaseOrderId { get; set; }
        public string BillNumber { get; set; }
        public decimal Cheque { get; set; }
        public string ChequeNo { get; set; }
        public decimal Cash { get; set; }
        public string VoucherNo { get; set; }
        public ICollection<CreditNoteDetail> CreditNoteDetail { get; set; }
        public ICollection<SPOReceivingBillAC> SPOBill { get; set; }
    }
}
