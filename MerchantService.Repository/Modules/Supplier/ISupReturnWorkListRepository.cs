using MerchantService.DomainModel.Models;
using MerchantService.Repository.ApplicationClasses.Supplier;
using System;
using System.Collections.Generic;
using MerchantService.DomainModel.Models.Company;

namespace MerchantService.Repository.Modules.Supplier
{
    public interface ISupReturnWorkListRepository : IDisposable
    {
        /// <summary>
        /// This method is used for fetching supplier return request list from database. - JJ
        /// </summary>   
        /// <param name="CompanyId">Id of currently logged in user's Id</param>       
        /// <param name="IsAllow">whether allowed to fetch worklist of other branches too</param>
        /// <param name="BranchId">BranchId of user</param>
        /// <returns>list of objects of SupplierReturnRequest</returns>
        List<SupplierReturnRequest> GetSupReturnWorkList(int CompanyId,bool IsAllow,int? BranchId);

        /// <summary>
        /// This method is used for fetching supplier return request from database. - JJ
        /// </summary>   
        /// <param name="id">id of supplier return detail</param>
        /// <returns>object of SupplierReturnRequest</returns>
        SupplierReturnRequest GetSupReturnRequest(int id);

        /// <summary>
        /// This method is used for approve/return Supplier Return Request. - JJ
        /// </summary>
        /// <param name="Comment">Comment of the approver</param>
        /// <param name="RecordId">Id of Parent Record</param>
        /// <param name="user"> Currently logged in userDetail </param>
        /// <param name="status"></param>
        /// <param name="SupplierReturnId">id of SupplierReturnDetail</param>
        /// <param name="companyDetails"></param>
        /// <returns>status</returns>
        string ApprovalSupplierReturn(string Comment, int RecordId, UserDetail user, bool status, int SupplierReturnId, CompanyDetail companyDetails);

        /// <summary>
        /// This method is used for reject Supplier Return Request. - JJ
        /// </summary>
        /// <param name="Id">Id of SupplierReturnRequestDetail</param>
        /// <param name="RejectorId">Id of the Rejector</param>
        /// <returns>status</returns>
        string RejectSupplierReturn(int Id,int RejectorId,string Comment);


        /// <summary>
        /// This method is used for delete Supplier Return Request. - JJ
        /// </summary>
        /// <param name="Id">Id of SupplierReturnRequestDetail</param>
        /// <param name="userName">username of the current logged in user</param>
        /// <param name="Comment"></param>
        /// <returns>status</returns>
        string DeleteSupplierReturn(int Id,string userName,string Comment);

        /// <summary>
        /// This method is used for Getting details for Supplier Return Request Receipt. - JJ
        /// </summary>
        /// <param name="Comment">Comment of the approver</param>
        /// <param name="SupplierReturnId">id of SupplierReturnDetail</param>
        /// <param name="userName"></param>
        /// <returns>object of SupplierReturnReceiptAC</returns>
        SupplierReturnReceiptAC PrintReceipt(string Comment, int SupplierReturnId, string userName);
    
          /// <summary>
        /// This method is used to issue credit note. - JJ
        /// </summary>
        /// <param name="SupplierReturnId">Id of SupplierReturnDetail</param>
        /// <param name="BranchId"></param>
        /// <param name="Comment"></param>
        /// <param name="CompanyId"></param>
        /// <returns>status</returns>
        bool IssueCreditNote(int SupplierReturnId, int? BranchId, int CompanyId, string Comment);

        /// <summary>
        /// This method is used to update quantity. - JJ
        /// </summary>
        /// <param name="SupplierReturnId">Id of SupplierReturnDetail</param>
        /// <param name="BranchId">Id of Returning Branch</param>
        /// <param name="IsAdd">indicates whether quantity is to be added or subtracted</param>
        /// <param name="companyDetails"></param>
        /// <param name="user"></param>
        /// <returns>status</returns>
        bool UpdateItemQuantity(int SupplierReturnId,int BranchId,bool IsAdd,CompanyDetail companyDetails,UserDetail user);
    }
}
