using System.Collections.Generic;

namespace MerchantService.Repository.ApplicationClasses.Supplier
{
    public class CreditNoteReceivingAC
    {
        public List<CreditNoteAC> ListOfCreditNotes { get; set; }
        public decimal Cash { get; set; }
        public decimal Cheque { get; set; }
        public decimal TotalAmount { get; set; }
        public string VoucharNo { get; set; }
        public string ChequeNo { get; set; }
        public decimal Diffrents { get; set; }
    }
}
