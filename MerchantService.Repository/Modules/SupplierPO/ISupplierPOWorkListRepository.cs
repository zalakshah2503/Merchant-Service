using MerchantService.DomainModel.Models;
using MerchantService.Repository.ApplicationClasses.SupplierPO;
using System;
using System.Collections.Generic;

namespace MerchantService.Repository.Modules.SupplierPO
{
    public interface ISupplierPOWorkListRepository : IDisposable
    {
        /// <summary>
        /// This method is used for fetching supplier purchase order list from database. - JJ
        /// </summary>   
        /// <param name="username">username of currently logged in user</param>
        /// <param name="allow">whether allowed to creat spo for other branches</param>
        /// <returns>list of objects of SupplierPOWorkListAC</returns>
        List<SupplierPOWorkListAC> GetSupplierPOWorkList(string userName, bool allow);

        /// <summary>
        /// This method is used for fetching supplier purchase order from database. - JJ
        /// </summary>   
        /// <param name="POUD">ID OF PO</param>
        /// <returns>object of SupplierPOAC</returns>
        SupplierPOAC GetSupplierPO(int POId);

        /// <summary>
        /// This method is used for fetching supplier purchase order item list from database. - JJ
        /// </summary>   
        /// <param name="id">id of spo</param>
        /// <param name="PONum">Purchase Order Number of SPO</param>
        /// <returns>list of objects of SupplierItemAC</returns>
        List<SupplierItemAC> GetSupplierPOItemList(int? id, string PONum);

        /// <summary>
        /// This method is used for fetching spo workFlowLog from database. - JJ
        /// </summary>   
        /// <param name="id">id of spo</param>
        /// <returns>list of objects of WorkFlowLogAC</returns>
        List<WorkFlowLogAC> GetSPOWorkFlowLog(int id);
        
        /// <summary>
        /// This method is used for approve supplier purchase order in database. - JJ
        /// </summary>
        /// <param name="Comment">Comment of the approver</param>
        /// <param name="RecordId">Id of Parent Record</param>
        /// <param name="userName"> Currently logged in user's username </param>
        /// <returns>status</returns>
        string ApproveSupplierPO(string Comment, int RecordId, string userName);

        /// <summary>
        /// This method is used for review supplier purchase order in database. - JJ
        /// </summary>
        /// <param name="Comment">Comment of the approver</param>
        /// <param name="RecordId">Id of Parent Record</param>
        /// <param name="user"> Currently logged in user</param>
        /// <returns>status</returns>
        string ReviewSupplierPO(string Comment, int RecordId, UserDetail user);

        /// <summary>
        /// This method is used for reject supplier purchase order in database. - JJ
        /// </summary>
        /// <param name="Comment">Comment of the rejector</param>
        /// <param name="RecordId">Id of Parent Record</param>
        /// <param name="userName"> Currently logged in user's username </param>
        /// <returns>status</returns>
        string RejectSupplierPO(string Comment, int RecordId, string userName);

        /// <summary>
        /// This method is used for cancel supplier purchase order in database. - JJ
        /// </summary>
        /// <param name="Comment">Comment of the person who rejects</param>
        /// <param name="RecordId">Id of Parent Record</param>
        /// <param name="userName"> Currently logged in user's username </param>
        /// <returns>status</returns>
        string CancelSupplierPO(string Comment, int RecordId, string userName);

        /// <summary>
        /// This method is used for approving cancel supplier purchase order in database. - JJ
        /// </summary>
        /// <param name="Comment">Comment of the person who approves cancel</param>
        /// <param name="RecordId">Id of Parent Record</param>
        /// <param name="userName"> Currently logged in user's username </param
        /// <param name="Status">whether approve or reject</param>
        /// <returns>null</returns>
        void ApproveCancelSupplierPO(string Comment, int RecordId, string userName, int Status);

        /// <summary>
        /// This method is used for fetching spo branch list from database. - JJ
        /// </summary>   
        /// <param name="id">id of spo</param>
        /// <returns>list of objects of SPOBranchAC</returns>
        List<SPOBranchAC> GetSPOBranchList(int id);

        /// <summary>
        /// This method is used for fetching purchase order details for printing from database. - JJ
        /// </summary>   
        /// <param name="RecordId">parent record id</param>
        ///<param name="Comment">Comment of the sender</param>
        ///<param name="RoleId">Role Id of the sender</param>
        ///<param name="RoleName">Role Name of the sender</param>
        ///<param name="UserName">User name</param>
        /// <returns>object of SPOReceipt</returns>
        SPOReceipt PrintSPOReceipt(string Comment, int RecordId, int RoleId, string RoleName, string UserName);
        
        /// <summary>
        /// This method is used for saving data into SupplierPurchaseOrderLog. - JJ
        /// </summary>   
        /// <param name="Action"></param>
        /// <param name="Comment"></param>
        /// <param name="POId"></param>
        /// <param name="RecordId"></param>
        /// <param name="RoleName"></param>
        /// <param name="Stage"></param>
        /// <param name="UserName"></param>
        /// <returns>null</returns>
        void SaveSupplierPurchaseOrderLog(string Action, string Comment, int POId, int? RecordId, string RoleName, string Stage, string UserName);

    }
}
