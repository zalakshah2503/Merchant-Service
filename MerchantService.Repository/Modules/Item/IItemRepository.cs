using MerchantService.DomainModel.Models.Item;
using MerchantService.DomainModel.Models.SystemParameters;
using System.Collections.Generic;
using MerchantService.DomainModel.Models.WorkFlow;
using MerchantService.Repository.ApplicationClasses.ItemDestruction;
using MerchantService.Repository.ApplicationClasses.Item;
using MerchantService.DomainModel.Models;
using MerchantService.DomainModel.Models.Company;
using MerchantService.Repository.ApplicationClasses.Admin;

namespace MerchantService.Repository.Modules.Item
{
    public interface IItemRepository
    {
        /// <summary>
        /// This method used for get list of unit type. -An
        /// </summary>
        /// <returns>list of unit types</returns>
        List<SystemParameter> GetListOfUnitTypeByCompanyId(int companyId);

        /// <summary>
        /// This method used for get margin profit by login user company id. -An
        /// </summary>
        /// <param name="name">name as login user name</param>
        /// <returns></returns>
        decimal GetMarginProfit(int companyId);

        /// <summary>
        /// This method used for insert into item profile in item profile table and return primary key. -An
        /// </summary>
        /// <param name="itemProfile">UnitParamTypeId,CategoryId,ParentItemId,Barcode,Code,ItemNameEn,
        /// ItemNameSl,BaseUnit,FlavourEn,FlavourSl,IsActive,HasOffer,IsOfferItem,IsParentItem,IsIcrApproved,CostPriceSellPrice,SellPriceA,
        /// SellPriceB,SellPriceC,SellPriceD,PreviousCostPrice,AverageCostPrice
        ///,ProfitMargin,branchId,MinimuQuantity,MaximunQuantity,ListOfItemQuantityList</param>
        /// <returns>return primary key</returns>
        int AddNewItemProfile(ItemProfile itemProfile);

        /// <summary>
        /// This method used for get item profile object by id. -An
        /// </summary>
        /// <param name="id">pass primary key value</param>
        /// <returns>return item profile object related passed id</returns>
        ItemProfile GetItemProfileObjectById(int id);

        /// <summary>
        /// This method is used for geeting list of Item Profile -SP
        /// </summary>
        /// <param name="comapnyId">pass comapnyId(login user comapnyId)</param>
        /// <returns>list of item profile</returns>
        List<ItemProfile> GetListOfItemProfile(int companyId);



        /// <summary>
        /// This method is used for geeting list of without offer item Profile list. 
        /// </summary>
        /// <param name="comapnyId">pass comapnyId(login user comapnyId)</param>
        /// <returns>list of item profile</returns>
        List<ItemProfile> GetListOfWithOutOfferItem(int companyId);

        /// <summary>
        /// This metod used for get list of item profile with searching
        /// </summary>
        /// <param name="itemDestructionSearchModelAC"></param>
        /// <param name="comapnyId"></param>
        /// <returns></returns>
        List<ItemProfile> GetListOfItemProfileWithSearching(ItemDestructionSearchModelAC itemDestructionSearchModelAC, int comapnyId);


        /// <summary>
        /// This method used for update item profile. -An
        /// <param name="itemProfile">UnitParamTypeId,CategoryId,ParentItemId,Barcode,Code,ItemNameEn,
        /// ItemNameSl,BaseUnit,FlavourEn,FlavourSl,IsActive,HasOffer,IsOfferItem,IsParentItem,IsIcrApproved,CostPriceSellPrice,SellPriceA,
        /// SellPriceB,SellPriceC,SellPriceD,PreviousCostPrice,AverageCostPrice,Id
        ///,ProfitMargin,branchId,MinimuQuantity,MaximunQuantity,ListOfItemQuantityList</param>
        /// <returns></returns>
        int UpdateItemProfile(ItemProfile itemProfile);

        /// <summary>
        /// This method used for delete item profile. -An
        /// </summary>
        /// <param name="id">pass primary key id which you want to delete item profile.</param>
        /// <returns></returns>
        string DeleteItemProfile(int id);

        /// <summary>
        /// This method used for check item Purchse and Customer Order Completed or not. -An
        /// </summary>
        /// <param name="itemId">pass item primary key.</param>
        /// <returns>return 0 when its completed.</returns>
        int CheckItemOrderCompleted(int itemId);

        /// <summary>
        /// This method used for insert sub item and return primary key. -An
        /// </summary>
        /// <param name="itemProfile">UnitParamTypeId,CategoryId,ParentItemId,Barcode,Code,ItemNameEn,
        /// ItemNameSl,BaseUnit,FlavourEn,FlavourSl,IsActive,HasOffer,IsOfferItem,IsParentItem,IsIcrApproved,CostPriceSellPrice,SellPriceA,
        /// SellPriceB,SellPriceC,SellPriceD,PreviousCostPrice
        ///,ProfitMargin,</param>
        /// <returns>primary key</returns>
        int InsertSubItem(ItemProfile itemProfile);

        /// <summary>
        /// This method used for get sub item list by parent Id. -An
        /// </summary>
        /// <param name="parentId">pass parentId</param>
        /// <param name="comapnyId">pass comapnyId(login user comapnyId)</param>
        /// <returns>return list of sub items.</returns>
        List<ItemProfile> GetSubItemListByParentId(int parentId, int comapnyId);

        /// <summary>
        /// This method used for check parent item have sub items. -An 
        /// </summary>
        /// <param name="parntId">pass parentId</param>
        /// <returns>return boolean, if true means sub item is exits and false for not exists</returns>
        bool CheckAnySubItemIsExists(int parntId);

        /// <summary>
        /// This method used for convert sub item to main item. -An
        /// </summary>
        /// <param name="id">passed item primary key id</param>
        /// <returns></returns>
        int ConvertToMainItem(int id);

        /// <summary>
        /// This method used for change main item. -An
        /// </summary>
        /// <param name="parentId">pass parentId and childId</param>
        /// <param name="childId"></param>
        /// <returns>true/false</returns>
        bool ChangeMainItem(int parentId, int childId);

        /// <summary>
        /// This method used for insert item offer and return primary key. -An
        /// </summary>
        /// <param name="itemOffer">ItemId,RecordId,StartDateTime,EndDateTime,SellPrice,SellPriceA,SellPriceB,SellPriceC,SellPriceD,
        ///Discount,QuantityLimit,IsSupplierInitiate,IsActive</param>
        /// <returns></returns>
        int AddItemOffer(ItemOffer itemOffer);

        /// <summary>
        /// This method used for get list of active status. -An
        /// </summary>
        /// <returns></returns>
        List<StatusType> GetlistOfStatus();

        /// <summary>
        /// This method used for get list Of item offer by branchId. -An
        /// </summary>
        /// <returns></returns>
        List<ItemOffer> GetListOfItemOffer(int branchId);


        /// <summary>
        /// This method used for get list of item offer for all branch. -An 
        /// </summary>
        /// <returns></returns>
        List<ItemOffer> GetListOfItemOfferAllBranch();



        /// <summary>
        /// This method used for get item offer by id. -An
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        ItemOffer GetItemOfferById(int id);


        ItemOffer GetItemOfferWithDeletedRecordById(int id);

        /// <summary>
        /// This method used for get itemoffer detail by id. -An
        /// </summary>
        /// <param name="id"></param>
        /// <param name="userDetails"></param>
        /// <param name="companyId"></param>
        /// <returns></returns>
        ItemOfferDetailAC GetItemOfferDetailById(int id, UserDetail userDetails, int companyId);

        /// <summary>
        ///This method used for check item offer is already exists or not. -An
        /// </summary>
        /// <param name="itemOffer"></param>
        /// <returns></returns>
        bool CheckItemOfferIsAlreadyExists(int itemId, int branchId, int updateId);


        /// <summary>
        /// This method is used for geeting list of Item Profile -JJ
        /// </summary>
        /// <param name="comapnyId">pass comapnyId(login user comapnyId)</param>
        /// <returns>list of item profile</returns>
        List<ItemProfile> GetItemList(int companyId, int? branchId);


        /// <summary>
        /// This method is used for geeting list of Item Profile -JJ
        /// </summary>
        /// <param name="comapnyId">pass comapnyId(login user comapnyId)</param>
        /// <returns>list of item profile</returns>
        List<ItemProfile> GetItemProfileList(int companyId, int? branchId);

        /// <summary>
        /// This method is used for geeting list of Item Profile -JJ
        /// </summary>
        /// <param name="comapnyId">pass comapnyId(login user comapnyId)</param>
        /// <returns>list of item profile</returns>
        List<ItemProfile> GetSubItemProfileList(int parentId, int companyId, int? branchId);



        /// <summary>
        /// This method used for update item offer and return primary key. -An
        /// </summary>
        /// <param name="itemOffer"></param>
        /// <returns></returns>
        int UpdateItemOffer(ItemOffer itemOffer);

        /// <summary>
        /// this method used for get item profile by barcode. -An
        /// </summary>
        /// <returns></returns>
        ItemProfile GetItemProfileByBarcode(string barcode, int branchId);

        /// <summary>
        /// This method used for get item offer by barcode. -An
        /// </summary>
        /// <param name="barcode"></param>
        /// <returns></returns>
        ItemOffer GetItemOfferByBarCode(string barcode, int branchId);

        /// <summary>
        /// This method used for get item Quantity by branch id and item id. -An
        /// </summary>
        /// <param name="itemId"></param>
        /// <param name="branchId"></param>
        /// <returns></returns>
        ItemQuantity GetItemQunatityByItemIdAndBranchId(int itemId, int branchId);

        /// <summary>
        /// This method is used for update quantity after each pos transcation. -PS
        /// </summary>
        /// <param name="itemId">item id</param>
        /// <param name="Quantity"></param>
        /// <param name="branchId"></param>
        /// <param name="currentUserId"></param>
        /// <returns>true/false</returns>
        bool UpdateItemQuantityForPOS(int itemId, int Quantity, int branchId, int currentUserId);

        /// <summary>
        /// This method is used for getting Item Quantity by item Id - PS
        /// </summary>
        /// <param name="itemId">itemId</param>
        /// <returns>object of ItemQuantity</returns>
        ItemQuantity GetItemQuantityByItemId(int itemId, int branchId);


        /// <summary>
        /// This method used for update item qunatity return primary key. -An
        /// </summary>
        /// <param name="itemQunatity"></param>
        /// <returns></returns>
        int UpdateItemQunatity(ItemQuantity itemQunatity);

        /// <summary>
        /// This method used  for get item qunatity objet by branchid and itemid. -An 
        /// </summary>
        /// <param name="itemId"></param>
        /// <param name="branchId"></param>
        /// <returns></returns>
        ItemQuantity GetItemQunatityByBranchIdAndItemId(int itemId, int branchId);

        /// <summary>
        /// This method is used for insert itemprofile for pos. -PS
        /// </summary>
        /// <param name="itemProfile"></param>
        /// <returns></returns>
        int InsertItemProfileForPos(ItemProfile itemProfile);

        /// <summary>
        /// This method used for get Condition operator by work flow. -An
        /// </summary>
        /// <param name="workFlowId"></param>
        /// <returns></returns>
        ConditionalOperator GetConditionalOperatorByWorkFlowId(int workFlowId);


        /// <summary>
        /// This method used for get list of conditional operator. -An
        /// </summary>
        /// <param name="parentConditionalOperatorId"></param>
        /// <returns></returns>
        List<ConditionalOperator> GetListOfConditionalOperator(int workFlowId);

        /// <summary>
        /// This method is used for updating item offer remaining quantiy from pos application. -PS
        /// </summary>
        /// <param name="itemOffer"></param>
        /// <returns></returns>
        ItemOffer UpdateItemOfferForRemainingQuantiy(ItemOffer itemOffer);


        /// <summary>
        /// This method used for get Item Supplier By Category Is. -An
        /// </summary>
        /// <param name="categoryId"></param>
        /// <returns></returns>
        List<ItemSupplier> GetItemSupplierListByCategoryId(int categoryId);

        /// <summary>
        /// This method used for update item Quantity. -An
        /// </summary>
        /// <param name="item"></param>
        /// <param name="branchId"></param>
        /// <param name="destructionQuantity"></param>
        /// <param name="companyDetails"></param>
        /// <param name="userDetails"></param>
        /// <param name="itemId"></param>
        /// <returns></returns>
        int UpdateItemQuantity(ItemProfile item, int branchId, int destructionQuantity, CompanyDetail companyDetails, UserDetail userDetails);

        /// <summary>
        /// This method used to check unique Item code -Roshni
        /// </summary>
        /// <param name="itemId"></param>
        /// <param name="branchId"></param>
        /// <param name="destructionQuantity"></param>
        /// <returns></returns>
        bool CheckForUniqueItemCode(string itemCode);

        /// <summary>
        /// This method is used to add item quantity.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="branchId"></param>
        void AddItemQuantity(int id, int branchId);

        /// <summary>
        /// this method is used to genrate automatic SPO.
        /// </summary>
        void GenrateAutomaticSpo(ItemQuantity itemQuantity, CompanyDetail companyDetail,UserDetail userDetails);


        /// <summary>
        /// this methos is used to get all SPO initiator role.
        /// </summary>
        /// <param name="companyId"></param>
        /// <returns></returns>
        List<RoleAc> GetAllInitiatorOfSpo(int companyId);

        /// <summary>
        /// This method used for genrate company barcode. -An
        /// </summary>
        /// <param name="companyId"></param>
        /// <returns></returns>
        string GenrateCompanyBarcode(int companyId);

        
    }
}
