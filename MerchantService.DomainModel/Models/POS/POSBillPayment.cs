using MerchantService.DomainModel.Models.Global;
using System.ComponentModel.DataAnnotations.Schema;
using MerchantService.DomainModel.Models.SystemParameters;

namespace MerchantService.DomainModel.Models.POS
{
   public class POSBillPayment : MerchantServiceBase
    {

       public int POSBillID { get; set; }

       public int ParamTypeId { get; set; }
       public decimal Amount {get;set;}

       public string BankPOSTransNo { get; set; }

       [ForeignKey("POSBillID")]
       public virtual POSBill POSBill { get; set; }
       
       [ForeignKey("ParamTypeId")] 
       public virtual ParamType ParamType {get;set;}

       

    }
}
