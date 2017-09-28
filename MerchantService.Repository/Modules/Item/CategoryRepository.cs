using MerchantService.DomainModel.Models.Item;
using MerchantService.DomainModel.Models.SupplierPurchaseOrder;
using MerchantService.Repository.ApplicationClasses.Item;
using MerchantService.Repository.DataRepository;
using MerchantService.Utility.Logger;
using System;
using System.Collections.Generic;
using System.Linq;

namespace MerchantService.Repository.Modules.Item
{
    public class CategoryRepository : ICategoryRepository
    {
        #region Private Variable

        private readonly IDataRepository<Category> _categoryContext;
        private readonly IDataRepository<ItemSupplier> _itemSupplierContext;
        private readonly IDataRepository<ItemProfile> _itemProfileContext;
        private readonly IDataRepository<PurchaseOrderItem> _purchaseOrderItemContext;
        private readonly IErrorLog _errorLog;
        #endregion

        #region Constructor
        public CategoryRepository(IDataRepository<Category> categoryContext, IDataRepository<ItemSupplier> itemSupplierContext,
            IDataRepository<ItemProfile> itemProfileContext, IDataRepository<PurchaseOrderItem> purchaseOrderItemContext, IErrorLog errorLog)
        {
            _categoryContext = categoryContext;
            _itemSupplierContext = itemSupplierContext;
            _itemProfileContext = itemProfileContext;
            _purchaseOrderItemContext = purchaseOrderItemContext;
            _errorLog = errorLog;
        }
        #endregion

        #region public methods
        /// <summary>
        /// This method is used for insert new category in database. - JJ
        /// </summary>
        /// <param name="category">object of CategoryAC</param>
        /// <param name="companyId"></param>
        /// <returns>saved object of CategoryAC</returns>
        public CategoryAC SaveCategory(CategoryAC category, int companyId)
        {
            try
            {
                var categorys = new Category
                {
                    CompanyId = companyId,
                    GroupParamTypeId = category.GroupParamTypeId,
                    BrandParamTypeId = category.BrandParamTypeId,
                    CreatedDateTime = DateTime.UtcNow,
                };
                _categoryContext.Add(categorys);
                _categoryContext.SaveChanges();
                category.CategoryId = categorys.Id;

                var supplier = new ItemSupplier
                {
                    SupplierId = category.SupplierId,
                    CategoryId = category.CategoryId,
                    CreatedDateTime = DateTime.UtcNow
                };
                _itemSupplierContext.Add(supplier);
                _itemSupplierContext.SaveChanges();

                return category;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// This method is used for getting list of categories. - JJ
        /// </summary>
        /// <param name="companyId"></param>
        /// <returns>list of object of Category</returns>
        public List<Category> GetCategoryList(int companyId)
        {
            try
            {
                var categoryList = new List<Category>();
                var listCategory = _categoryContext.Fetch(x => !x.IsDelete && x.CompanyId == companyId).ToList();
                foreach (var category in listCategory)
                {
                    var supplier = GetItemSupplierList(category.Id);
                    var supplierCount = supplier.Count();
                    Category categorys = new Category
                    {
                        BrandParamTypeId = category.BrandParamTypeId,
                        GroupParamTypeId = category.GroupParamTypeId,
                        SupplierCount = supplierCount,
                        Id = category.Id,
                        BrandParamType = category.BrandParamType,
                        GroupParamType = category.GroupParamType,
                        ItemSupplier = supplier,
                        CreatedDateTime = category.CreatedDateTime
                    };
                    categoryList.Add(categorys);
                }
                return categoryList;

            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// This method is used for getting list of Item Suppliers. - JJ
        /// </summary>
        /// <param name="id">ID OF Category</param>
        /// <returns>list of object of ItemSupplier</returns>
        public List<ItemSupplier> GetItemSupplierList(int id)
        {
            try
            {
                var supplierList = new List<ItemSupplier>();
                var listSupplier = _itemSupplierContext.Fetch(x => x.CategoryId == id && x.IsDelete == false).ToList();
                foreach (var supplier in listSupplier)
                {
                    ItemSupplier itemsupplier = new ItemSupplier
                    {
                        CategoryId = supplier.CategoryId,
                        SupplierId = supplier.SupplierId,
                        SupplierProfile = supplier.SupplierProfile,
                        Id = supplier.Id,
                        CreatedDateTime = supplier.CreatedDateTime
                    };
                    supplierList.Add(itemsupplier);
                }
                return supplierList;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// check category exists in databse or not. - JJ
        /// </summary>
        /// <param name="category"></param>
        /// <param name="companyId"></param>
        /// <returns>return true if category already exist,otherwise false</returns>
        public bool CheckCategoryExixtsOrNot(CategoryAC category, int companyId)
        {
            try
            {
                return _categoryContext.Fetch(x => x.GroupParamTypeId == category.GroupParamTypeId && x.BrandParamTypeId == category.BrandParamTypeId && x.Id != category.CategoryId && x.IsDelete == false && x.CompanyId == companyId).Any();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// This method is used for insert new itemsuppier in database. - JJ
        /// </summary>
        /// <param name="itemSupplier">object of ItemSupplier</param>
        /// <returns>Saved object of ItemSupplier</returns>
        public ItemSupplier SaveItemSupplier(ItemSupplier itemSupplier)
        {
            try
            {
                var supplier = new ItemSupplier
                {
                    SupplierId = itemSupplier.SupplierId,
                    CategoryId = itemSupplier.CategoryId,
                    CreatedDateTime = DateTime.UtcNow
                };
                _itemSupplierContext.Add(supplier);
                _itemSupplierContext.SaveChanges();
                itemSupplier.Id = supplier.Id;
                return itemSupplier;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }
        /// <summary>
        /// check itemSupplier exists in databse or not. - JJ
        /// </summary>
        /// <param name="itemSupplier">object of ItemSupplier</param>
        /// <returns>return true if itemSupplier already exist,otherwise false</returns>
        public bool CheckItemSupplierExixtsOrNot(ItemSupplier itemSupplier)
        {
            try
            {
                return _itemSupplierContext.Fetch(x => x.SupplierId == itemSupplier.SupplierId && x.CategoryId == itemSupplier.CategoryId && x.Id != itemSupplier.Id && x.IsDelete == false).Any();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// This method is used to delete category from the database by setting IsDelete to true - JJ
        /// </summary>
        /// <param name="category">Object of Category</param>      
        /// <returns>ideally empty string</returns>

        //changed the parameter to category bcoz we need the supplier list too
        // coz what if a category has been deleted and its itemsupplier's isdelete is still false
        // a user might create a category just as before and it will try to add a supplier just as before but as the previous
        // combination is still existing with isdelete = false still exists the operation won't be successful

        public string DeleteCategory(Category category)
        {
            int count = _itemProfileContext.Fetch(x => x.CategoryId == category.Id && !x.IsDeleted).Count();
            if (count == 0)
            {
                var deletedCategory = _categoryContext.GetById(category.Id);
                deletedCategory.IsDelete = true;
                deletedCategory.ModifiedDateTime = DateTime.UtcNow;
                _categoryContext.Update(deletedCategory);
                _categoryContext.SaveChanges();

                foreach (var supplier in category.ItemSupplier)
                {
                    DeleteItemSupplier(supplier.Id);
                }

                return "";
            }
            else
            {
                return "" + count + " Item(s) Are In This Category. Please Delete Them First and Then Proceed to Delete Category";
            }
        }

        /// <summary>
        /// This method is used to delete itemsupplier from the database by setting IsDelete to true - JJ
        /// </summary>
        /// <param name="id">id of the itemsupplier</param>      
        /// <returns>null</returns>
        public void DeleteItemSupplier(int id)
        {
            var deletedItemSupplier = _itemSupplierContext.GetById(id);
            deletedItemSupplier.IsDelete = true;
            deletedItemSupplier.ModifiedDateTime = DateTime.UtcNow;
            _itemSupplierContext.Update(deletedItemSupplier);
            _itemSupplierContext.SaveChanges();
        }

        /// <summary>
        /// Method to check whether supplier for the category can be deleted or not.
        /// Based on any pedning SPO for that category from given supplier.
        /// </summary>
        /// <param name="categoryId"></param>
        /// <param name="supplierId"></param>
        /// <returns>bool</returns>
        public bool CheckIfSupplierForCategoryCanBeDeletedOrNot(int categoryId, int supplierId)
        {
            bool canDeleteSupplier = true;
            var poItems = _purchaseOrderItemContext.Fetch(x => x.ItemProfile.CategoryId == categoryId && x.SupplierPurchaseOrder.SupplierId == supplierId);
            if(poItems.Any())
            {
                var anyOpenItem = poItems.Any(x => !x.SupplierPurchaseOrder.IsCanceled && !x.SupplierPurchaseOrder.IsPaid && !x.SupplierPurchaseOrder.IsRejected);
                canDeleteSupplier = anyOpenItem ? false : true;
            }
            return canDeleteSupplier;

        }
        #endregion

        #region Dispose Method
        public void Dispose()
        {
            try
            {
                _categoryContext.Dispose();
                _itemProfileContext.Dispose();
                _itemSupplierContext.Dispose();
                GC.SuppressFinalize(this);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
            }
        }
        #endregion
    }
}
