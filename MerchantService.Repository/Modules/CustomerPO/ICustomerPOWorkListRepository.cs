using MerchantService.DomainModel.Models.CustomerPurchaseOrder;
using MerchantService.DomainModel.Models.POS;
using MerchantService.Repository.ApplicationClasses.CustomerPO;
using System.Collections.Generic;

namespace MerchantService.Repository.Modules.CustomerPO
{
    public interface ICustomerPOWorkListRepository
    {
        /// <summary>
        /// this method is used for fetching customer purchase order list.
        /// </summary>
        /// <param name="companyId"></param>
        /// <returns>list of object of CustomerPOAC</returns>
        List<CustomerPOAC> GetCustomerPOList(int companyId);

        /// <summary>
        /// this method is used for fetching customer purchase order.
        /// </summary>
        /// <param name="Id">Id of the Customer Purchase Order</param>
        /// <returns>object of CustomerPOAC</returns>
        CustomerPOAC GetCustomerPO(int Id);


        /// <summary>
        /// This method used for get customer purchase ordr by branch.-An
        /// </summary>
        /// <param name="branchId"></param>
        /// <returns></returns>
        List<CustomerPurchaseOrder> GetListOfCustomerPurchaseOrderByBranch(int branchId);

        /// <summary>
        /// This method used for CPO Item list by customer PO Id. -An
        /// </summary>
        /// <param name="customerPOId"></param>
        /// <returns></returns>
        List<CPOItem> GetCPOItemListByCustomerPOId(int customerPOId);

        /// <summary>
        /// This method used for get CPO Bill By Id.
        /// </summary>
        /// <param name="purchaseOrederId"></param>
        /// <returns></returns>
        List<CPOBill> GetCPOBillListByPOId(int purchaseOrederId);

        /// <summary>
        /// This method used for get pos bill item by bill id.-An
        /// </summary>
        /// <param name="billId"></param>
        /// <returns></returns>
        List<POSBillItem> getPOsBillItemByBillId(int billId);
    }
}
