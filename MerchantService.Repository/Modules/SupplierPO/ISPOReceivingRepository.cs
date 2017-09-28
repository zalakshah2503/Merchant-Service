using MerchantService.DomainModel.Models;
using MerchantService.DomainModel.Models.Company;
using MerchantService.Repository.ApplicationClasses.SupplierPO;
using System;
using System.Collections.Generic;

namespace MerchantService.Repository.Modules.SupplierPO
{
    public interface ISPOReceivingRepository : IDisposable
    {
        /// <summary>
        /// This method is used for end receiving SPO in database. - JJ
        /// </summary>
        /// <param name="SPOReceivingAC"> object of SPOReceivingAC</param>
        /// <param name="roleName">role name of the currently logged in user</param>
        /// <param name="userName">user name of the current logged in user</param>
        /// <returns>status</returns>
        bool EndReceiving(SPOReceivingAC SPOReceivingAC, string roleName,string userName);


        /// <summary>
        /// This method is used for fetching supplier purchase order from database. - JJ
        /// </summary>   
        /// <param name="POID">ID OF PO</param>
        /// <returns>object of SPOReceivingAC</returns>
        SPOReceivingAC GetSupplierPO(int POId);

        /// <summary>
        /// This method is used for insert new SPO bill in database. - JJ
        /// </summary>
        /// <param name="supplierPOBill"> object of SPOReceivingAC</param>
        /// <returns>status</returns>
        bool SaveSupplierPOBill(SPOReceivingAC SPOReceivingAC);

        
        /// <summary>
        /// This method is used for receive an item of SPO - JJ
        /// </summary>
        /// <param name="SupplierItemAC">object of SupplierItemAC</param>
        /// <param name="UserDetail">object of UserDetail</param>
        /// <param name="company"></param>
        /// <returns>receiving status</returns>
        int ReceiveSPOItem(SupplierItemAC SupplierItemAC, UserDetail UserDetail, CompanyDetail company);


        /// <summary>
        /// This method is used for fetching supplier purchase order bills from database. - JJ
        /// </summary>   
        /// <param name="POID">ID OF PO</param>
        /// <returns>list of SPOReceivingBillAC</returns>
        IList<SPOReceivingBillAC> GetSPOBill(int POId);

        /// <summary>
        /// This method is used for verifying bill - JJ
        /// </summary>
        /// <param name="BillId">Id of Bill</param>    
        /// <returns>status</returns>
        bool VerifyBill(int BillId);

        /// <summary>
        /// This method is used for verifying purchase order - JJ
        /// </summary>
        /// <param name="spoId">Id of Supplier Purchase Order</param>    
        /// <returns>status</returns>
        bool VerifySPO(int SPOId, string RoleName, string Comment,string userName);


        /// <summary>
        /// This method is used for adding supplier purchase order bill. - JJ
        /// </summary>   
        /// <param name="POID">ID OF PO</param>
        /// <param name="POSupplierBill">object of SPOReceivingBillAC</param>
        /// <returns>status</returns>
        int AddSupplierBill(SPOReceivingBillAC POSupplierBill, int PurchaseOrderId);


        /// <summary>
        /// This method is used for deleting supplier purchase order bill. - JJ
        /// </summary>   
        /// <param name="BillID">ID OF Bill</param>
        /// <returns>status</returns>
        bool DeletePOSupplierBill(int BillId);

        /// <summary>
        /// This method used for get list of purchase order item by purchase order item id.
        /// </summary>
        /// <param name="purchaseOrderItemId"></param>
        /// <returns></returns>
        ReceivingPurchaseOrderAC GetListOfPurchaseOrderItem(int purchaseOrderId);
    }
}
