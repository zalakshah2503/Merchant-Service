using MerchantService.DomainModel.Models.Global;
using MerchantService.DomainModel.Models.SystemParameters;
using MerchantService.DomainModel.Models.WorkFlow;
using System;
using System.ComponentModel.DataAnnotations.Schema;


namespace MerchantService.DomainModel.Models.POS
{
    public class POSSession : MerchantServiceBase
    {
        public int POSLoginSessionId { get; set; }
        public int MismatchResolveTypeID { get; set; }
        public int? ParentRecordId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public bool IsMatched { get; set; }
        public decimal MismatchedValue { get; set; }
        public decimal Cash { get; set; }
        public decimal DebitCard { get; set; }
        public decimal CreditCard { get; set; }
        public decimal Coupon { get; set; }
        public decimal CreditAccount { get; set; }
        public decimal ReturnedBill { get; set; }
        public decimal ActualCash { get; set; }
        public decimal ActualDebitCard { get; set; }
        public decimal ActualCreditCard { get; set; }
        public decimal ActualCoupon { get; set; }
        public decimal ActualCreditAccount { get; set; }
        public decimal ActualCheque { get; set; }
        public decimal Cheque { get; set; }
        public string Comment { get; set; }
        public int StatusTypeId { get; set; }
        public decimal ActualReturnedBill { get; set; }
        [ForeignKey("POSLoginSessionId")]
        public virtual POSLoginSession POSLoginSession { get; set; }
        [ForeignKey("MismatchResolveTypeID ")]
        public virtual ParamType ParamType { get; set; }

        [ForeignKey("ParentRecordId")]
        public virtual ParentRecord ParentRecord { get; set; }

        [ForeignKey("StatusTypeId")]
        public virtual StatusType StatusType { get; set; }


    }
}
