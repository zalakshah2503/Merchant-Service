using MerchantService.DomainModel.Models.CustomerPurchaseOrder;
using MerchantService.Repository.ApplicationClasses.CustomerPO;
using System.Collections.Generic;

namespace MerchantService.Repository.Modules.CustomerPO
{
    public interface ICustomerPORepository
    {
        /// <summary>
        /// this method is used for adding a new customer purchase order. - jj
        /// </summary>
        /// <param name="customerPO">object of CustomerPOAC</param>
        /// <param name="userName">username of currently logged in user</param>
        /// <returns>object of CPOReceiptAC</returns>
        CPOReceiptAC SaveCustomerPO(CustomerPOAC customerPO, string userName);


        /// <summary>
        /// this method is used for editing customer purchase order. -jj
        /// </summary>
        /// <param name="customerPO">object of CustomerPOAC</param>
        /// <param name="userName">username of currently logged in user</param>
        /// <returns></returns>
        void UpdateCustomerPO(CustomerPOAC customerPO, string userName);

        /// <summary>
        /// this method is used for generating customer purchase order number
        /// </summary>
        /// <param name="companyId"></param>
        /// <returns>object of CPOConstantsAC</returns>
        CPOConstantsAC PurchaseOrderNumberGenerator(int companyId);

        /// <summary>
        /// this method used for get purchase order by po number. -An
        /// </summary>
        /// <param name="poNumber"></param>
        /// <returns>object of CustomerPurchaseOrder</returns>
        CustomerPurchaseOrder getCustomerPurchaseOrderByPONumber(string poNumber);

        /// <summary>
        /// this method is used for fetching customer purchase order list.
        /// </summary>
        /// <param name="customerId">Id of Customer</param>
        /// <returns>list of object of CPODownPaymentAC</returns>
        List<CPODownPaymentAC> GetCustomerPOListByCustomerId(int customerId);

        /// <summary>
        /// this method is used for cancelling customer purchase order .- JJ
        /// </summary>
        /// <param name="CPOId">Purchase Order id of CPO</param>
        /// <param name="returnAmount"></param>
        /// <param name="userId"></param>
        void CancelCustomerPO(int CPOId, decimal returnAmount, int userId);

        /// <summary>
        /// this method used for get purchase order by cpo id. -jj
        /// </summary>
        /// <param name="cpoid"></param>
        /// <returns>object of CustomerPOAC</returns>
        CustomerPOAC GetCustomerPurchaseOrderByCPOId(int cpoId);

        int UpdateCustomerPurchseOrderForPOS(CustomerPurchaseOrder customerPurchaseOrder);
        int AddCpoBillMappingFromPos(CPOBill cpoBill);

    }
}
