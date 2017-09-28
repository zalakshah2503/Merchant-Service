using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MerchantService.DomainModel.Models;
using MerchantService.DomainModel.Models.Company;
using MerchantService.Repository.ApplicationClasses.Admin;
using MerchantService.Repository.ApplicationClasses.InternalTransferGoods;
using MerchantService.Repository.ApplicationClasses.Item;
using MerchantService.Repository.ApplicationClasses.SystemParameter;

namespace MerchantService.Repository.Modules.InternalTransferGoods
{
   public interface IInternalTransferGoodsRepository : IDisposable
    {
       /// <summary>
       /// this method is used to get all branch list.
       /// </summary>
       /// <param name="branchId"></param>
       /// <param name="companyId"></param>
       /// <returns></returns>
       List<BranchDetailAC> GetAllBranchList(int? branchId, int? companyId);

       /// <summary>
       /// this method is used to get all request type.
       /// </summary>
       /// <param name="paramId"></param>
       /// <returns></returns>
       List<ParamTypeAc> GetAllRequestType(int paramId);

       /// <summary>
       /// this method is used to get all item list by branch id.
       /// </summary>
       /// <param name="branchId"></param>
       /// <returns></returns>
       List<ItemProfileAC> GetItemListById(int branchId);

       /// <summary>
       /// this method is used to get the item details by item barcode
       /// </summary>
       /// <param name="barcode"></param>
       /// <param name="targetBranchId"></param>
       /// <param name="requestTypeId"></param>
       /// <param name="branchId"></param>
       /// <returns></returns>
       ItemInventoryTransferAc GetItemDetailsByItemBarcode(string barcode, int targetBranchId, int requestTypeId, int? branchId);

       /// <summary>
       /// this method is used to submit transfer request.
       /// </summary>
       /// <param name="transferGoodsDetails"></param>
       /// <param name="userDetails"></param>
       /// <param name="companyDetails"></param>
       /// <returns></returns>
       string SubmitInventoryTranserRequest(InventoryTransferAc transferGoodsDetails, UserDetail userDetails, CompanyDetail companyDetails);
      
       /// <summary>
       /// this method is used to get all inventory transfer list.
       /// </summary>
       /// <param name="branchId"></param>
       /// <param name="isAllowToAccessAllBranch"></param>
       /// <returns></returns>
       IOrderedEnumerable<InventoryTransferAc> GetAllInventoryTransferList(int? branchId, bool isAllowToAccessAllBranch);

       /// <summary>
       /// this method is used to view the tranfser details by Id.
       /// </summary>
       /// <param name="inventoryTransferId"></param>
       /// <param name="userDetails"></param>
       /// <param name="allowToReslovedUnmatchedItem"></param>
       /// <param name="isAllowToAccessAllBranch"></param>
       /// <param name="isAllowToRecieveInternalTransferGoods"></param>
       /// <returns></returns>
       InventoryTransferAc ViewInternalTransferGoodDetailsById(int inventoryTransferId, UserDetail userDetails, bool allowToReslovedUnmatchedItem, bool isAllowToAccessAllBranch,bool isAllowToRecieveInternalTransferGoods);
      
       /// <summary>
       /// this method is used to either approve or reject the transfer request.
       /// </summary>
       /// <param name="transferGoodsDetails"></param>
       /// <param name="userDetails"></param>
       /// <param name="companyDetails"></param>
       /// <param name="isAllowUnmatchedItemRecover"></param>
       /// <returns></returns>
       string TransferInventoryApprovalById(InventoryTransferAc transferGoodsDetails, UserDetail userDetails, CompanyDetail companyDetails, bool isAllowUnmatchedItemRecover);
      
       /// <summary>
       /// this method is used to review the inventory tarnsfer details.
       /// </summary>
       /// <param name="transferGoodsDetails"></param>
       /// <param name="userDetails"></param>
       /// <param name="companyDetails"></param>
       /// <param name="isAllowUnmatchedItemRecover"></param>
       /// <returns></returns>
       string ReviewTransferInventoryById(InventoryTransferAc transferGoodsDetails, UserDetail userDetails, CompanyDetail companyDetails, bool isAllowUnmatchedItemRecover);
       
       /// <summary>
       /// this method is used to re-submit the transfer details.
       /// </summary>
       /// <param name="transferGoodsDetails"></param>
       /// <param name="userDetails"></param>
       /// <param name="companyDetails"></param>
       /// <param name="isAllowToInitiateIntrenalTransferGood"></param>
       /// <param name="isAllowToReceiveIntranalTransferGood"></param>
       /// <returns></returns>
       string ReSubmitTransferInventory(InventoryTransferAc transferGoodsDetails, UserDetail userDetails, CompanyDetail companyDetails, bool isAllowToInitiateIntrenalTransferGood, bool isAllowToReceiveIntranalTransferGood);
      
       /// <summary>
       /// this method is used to recieve tranfser order by the Id.
       /// </summary>
       /// <param name="transferGoodsDetails"></param>
       /// <param name="userDetails"></param>
       /// <param name="companyDetails"></param>
       /// <returns></returns>
       string ReceiveTransferInventoryById(InventoryTransferAc transferGoodsDetails, UserDetail userDetails, CompanyDetail companyDetails);
      
       /// <summary>
       /// this method is used to print the inventory tarnsfer receipt.
       /// </summary>
       /// <param name="inventoryTransferId"></param>
       /// <returns></returns>
       InventoryTransferAc PrintTransferGoodReceipt(int inventoryTransferId);
    }
}
