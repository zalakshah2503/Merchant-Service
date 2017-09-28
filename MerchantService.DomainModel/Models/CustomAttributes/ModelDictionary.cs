using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MerchantService.DomainModel.Models.IncidentReport;
using MerchantService.DomainModel.Models.Item;
using MerchantService.DomainModel.Models.SupplierPurchaseOrder;
using MerchantService.DomainModel.Models.ItemChangeRequest;

namespace MerchantService.DomainModel.Models.CustomAttributes
{
    public class ModelDictionary
    {
        public static Dictionary<int, object> GetModelDictionary()
        {
            Dictionary<int, object> dictionary;
            dictionary = new Dictionary<int, object>();
            dictionary.Add(17, typeof(ItemOffer));
            dictionary.Add(12, typeof(SupplierPurchaseOrder.SupplierPurchaseOrder));
            dictionary.Add(32, typeof(PurchaseOrderItem));
            dictionary.Add(36, typeof(PurchaseOrderBranch));
            dictionary.Add(33, typeof(IcrPrice));
            dictionary.Add(39, typeof(IssueInventory.IssueInventory));
            dictionary.Add(21, typeof(PosIncidentReport));
            return dictionary;
        }

    }


}
