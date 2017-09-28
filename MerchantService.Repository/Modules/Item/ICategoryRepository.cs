using MerchantService.DomainModel.Models.Item;
using MerchantService.Repository.ApplicationClasses.Item;
using System;
using System.Collections.Generic;

namespace MerchantService.Repository.Modules.Item
{
   public interface ICategoryRepository: IDisposable
    {
        /// <summary>
        /// This method is used for insert new category in database. - JJ
        /// </summary>
        /// <param name="category">object of CategoryAC</param>
        /// <param name="companyId"></param>
        /// <returns>saved object of CategoryAC</returns>
       CategoryAC SaveCategory(CategoryAC category, int companyId);

       /// <summary>
       /// This method is used for getting list of categories. - JJ
       /// </summary>
       /// <param name="companyId"></param>
       /// <returns>list of object of Category</returns>
       List<Category> GetCategoryList(int companyId);

       /// <summary>
       /// This method is used for getting list of Item Suppliers. - JJ
       /// </summary>
       /// <param name="id">ID OF Category</param>
       /// <returns>list of object of ItemSupplier</returns>
       List<ItemSupplier> GetItemSupplierList(int id);

       /// <summary>
       /// check category exists in databse or not. - JJ
       /// </summary>
       /// <param name="category"></param>
       /// <param name="companyId"></param>
       /// <returns>return true if category already exist,otherwise false</returns>
       bool CheckCategoryExixtsOrNot(CategoryAC category, int companyId);

       /// <summary>
       /// check itemSupplier exists in databse or not. - JJ
       /// </summary>
       /// <param name="itemSupplier">object of ItemSupplier</param>
       /// <returns>return true if itemSupplier already exist,otherwise false</returns>
       bool CheckItemSupplierExixtsOrNot(ItemSupplier itemSupplier);

       /// <summary>
       /// This method is used for insert new itemsuppier in database. - JJ
       /// </summary>
       /// <param name="itemSupplier">object of ItemSupplier</param>
       /// <returns>Saved object of ItemSupplier</returns>
       ItemSupplier SaveItemSupplier(ItemSupplier itemSupplier);

       /// <summary>
       /// This method is used to delete category from the database by setting IsDelete to true - JJ
       /// </summary>
       /// <param name="category">Object of Category</param>      
       /// <returns>ideally empty string</returns>
       string DeleteCategory(Category category);

       /// <summary>
       /// This method is used to delete category from the database by setting IsDelete to true - JJ
       /// </summary>
       /// <param name="id">id of the category</param>      
       /// <returns>null</returns>
       void DeleteItemSupplier(int id);

        bool CheckIfSupplierForCategoryCanBeDeletedOrNot(int categoryId, int supplierId);
    }
}
