using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MerchantService.DomainModel.Models;
using MerchantService.DomainModel.Models.Company;
using MerchantService.DomainModel.Models.IssueInventory;
using MerchantService.Repository.ApplicationClasses.Inventory;
using MerchantService.Repository.ApplicationClasses.Item;
using MerchantService.Repository.ApplicationClasses.Supplier;
using MerchantService.Repository.ApplicationClasses.SystemParameter;

namespace MerchantService.Repository.Modules.Inventory
{
   public interface IInventoryRepository :IDisposable
    {
        /// <summary>
        /// this method is used to get all inventory types.
        /// </summary>
        /// <returns></returns>
       List<ParamTypeAc> GetAllInvetoryTypeList(int paramId);

       /// <summary>
       /// this method is used to get all supplier list.
       /// </summary>
       /// <returns></returns>
       List<SupplierProfileAC> GetAllSupplierList(int comapanyId);

       /// <summary>
       /// this method is used to get all gategory list.
       /// </summary>
       /// <returns></returns>
       List<CategoryAC> GetAllCateGoryList(int comapanyId);

       /// <summary>
       /// this method is used to submit issue stock inventory.
       /// </summary>
       /// <param name="issueInventoryDetails"></param>
       /// <param name="companyDetails"></param>
       /// <returns></returns>
       IssueInventoryAc SubmitIssueStockInventory(IssueInventoryAc issueInventoryDetails, CompanyDetail companyDetails);

       /// <summary>
       /// this method is used to get all inventory list.
       /// </summary>
       /// <returns></returns>
       IOrderedEnumerable<IssueInventoryAc> GetAllInventoryList(int? branchId, bool isAllowToAccessAllBranch);

       /// <summary>
       /// this method is used to delete issue stock inventory request.
       /// </summary>
       /// <param name="issueInventoryId"></param>
       /// <returns></returns>
       void DeleteIssueStockInventoryById(int issueInventoryId);

       /// <summary>
       /// this method is used to view the inventory monitor details by the Id.
       /// </summary>
       /// <param name="issueInventoryId"></param>
       /// <returns></returns>
       IssueInventoryAc ViewIssueStockInventoryMoniterDetailsById(int issueInventoryId);

       /// <summary>
       /// this method is used to get all recorder list.
       /// </summary>
       /// <returns></returns>
       IOrderedEnumerable<IssueInventoryAc> GetAllInventoryRecorderList(int? branchId, bool isAllowToAccessAllBranch);

       /// <summary>
       /// this method is used to start issue stock inventory.
       /// </summary>
       /// <param name="issueInventoryId"></param>
       /// <returns></returns>
       void StartIssueStockInventory(int issueInventoryId);

       /// <summary>
       /// this method is used to get iventory record details by id.
       /// </summary>
       /// <param name="issueInventoryId"></param>
       /// <returns></returns>
       IssueInventoryAc GetInventoryRecorderDetailsById(int issueInventoryId);

       /// <summary>
       /// this method is used to get item list by the inventory Id.
       /// </summary>
       /// <param name="issueInventoryId"></param>
       /// <returns></returns>
       List<ItemProfileAC> GetItemListByIssueInventoryId(int issueInventoryId,int companyId);

       /// <summary>
       /// this method is used to get item details by the item barcode.
       /// </summary>
       /// <param name="issueStockInventoryId"></param>
       /// <param name="barcode"></param>
       /// <returns></returns>
       ItemProfileAC GetItemDetailsByItemBarcode(string barcode, int issueStockInventoryId);

       /// <summary>
       /// this method is used to add issue inventory recored details.
       /// </summary>
       /// <param name="issueInventoryDetails"></param>
       /// <param name="getUserId"></param>
       /// <param name="companyDetails"></param>
       /// <returns></returns>
       IssueInventoryAc AddIssueInventoryRecordDetails(IssueInventoryAc issueInventoryDetails, int getUserId, CompanyDetail companyDetails);


       /// <summary>
       /// this method is used to submit issue stock inventory.
       /// </summary>
       /// <param name="issueInventoryDetails"></param>
       /// <returns></returns>
       string SubmitIssueStockInventoryDetails(IssueInventoryAc issueInventoryDetails,UserDetail userDetails, CompanyDetail companyDetails);

       /// <summary>
       /// this method is used to view issue stock inventory details by Id.
       /// </summary>
       /// <param name="issueInventoryId"></param>
       /// <returns></returns>
       IssueInventoryAc ViewIssueStockInventoryDetailsById(int issueInventoryId, UserDetail userDetails, bool isAllowUnmatchedItemRecover);

       /// <summary>
       /// this method is used for either approve or reject issue stock inventory details.
       /// </summary>
       /// <param name="issueInventoryDetails"></param>
       /// <returns></returns>
       string IssueStockInventoryApprovalById(IssueInventoryAc issueInventoryDetails, UserDetail userDetails, CompanyDetail companyDetails, bool isAllowUnmatchedItemRecover);

       /// <summary>
       /// this method is used to review issue stock inventory request by Id.
       /// </summary>
       /// <param name="issueInventoryDetails"></param>
       /// <returns></returns>
       string ReviewIssueStockInventoryById(IssueInventoryAc issueInventoryDetails, UserDetail userDetails, CompanyDetail companyDetails, bool isAllowUnmatchedItemRecover);

       /// <summary>
       /// this method is used to resubmit the issue stock inventory request.
       /// </summary>
       /// <param name="issueInventoryDetails"></param>
       /// <returns></returns>
       string ReSubmitIssueStockInventory(IssueInventoryAc issueInventoryDetails, UserDetail userDetails, CompanyDetail companyDetails, bool isAllowUnmatchedItemRecover);

       /// <summary>
       /// this method is used to get item details.
       /// </summary>
       /// <param name="paramId"></param>
       /// <param name="detailsId"></param>
       /// <param name="companyId"></param>
       /// <returns></returns>
       List<ItemProfileAC> GetItemDetailsById(int paramId, int detailsId, int? companyId);

       /// <summary>
       /// this method is used to update issue stock inventory date.
       /// </summary>
       /// <param name="issueInventoryDetails"></param>
       /// <returns></returns>
       string UpdateIssueInventoryDate(IssueInventoryAc issueInventoryDetails);


       /// <summary>
       /// this method is used to submit issue stock inventory.
       /// </summary>
       /// <param name="issueInventoryDetails"></param>
       /// <param name="companyDetails"></param>
       /// <returns></returns>
       IssueInventoryAc SubmitStockInventory(IssueInventoryAc issueInventoryDetails, CompanyDetail companyDetails);

       /// <summary>
       /// this method is used to submit muliple branch issue stock inventory.
       /// </summary>
       /// <param name="issueInventoryDetails"></param>
       /// <param name="companyDetails"></param>
       /// <returns></returns>
       IssueInventoryAc SubmitConflictBranchIssueInventory(IssueInventoryAc issueInventoryDetails, CompanyDetail companyDetails);
       void UpdateStockIssueInventoryDate(IssueInventoryAc issueInventoryDetails);

       /// <summary>
       ///  this method is used to get unmatched item list.
       /// </summary>
       /// <param name="issueStockInventoryId"></param>
       /// <returns></returns>
       IssueInventoryUnmatchedItemAc GetUnmatchedItemListById(int issueStockInventoryId, UserDetail userDetails);

       /// <summary>
       /// this method is used to re-record item details.
       /// </summary>
       /// <param name="issueInventoryUnmatchedItem"></param>
       /// <returns></returns>
       IssueInventoryUnmatchedItemAc ReRecordSelectedItemDetails(IssueInventoryUnmatchedItemAc issueInventoryUnmatchedItem);
    }
}
