using MerchantService.Core.Global;
using MerchantService.DomainModel.Models.Item;
using MerchantService.Repository.ApplicationClasses.Item;
using MerchantService.Repository.Modules.Global;
using MerchantService.Repository.Modules.Item;
using MerchantService.Utility.Logger;
using System;
using System.Web;
using System.Web.Http;

namespace MerchantService.Core.Controllers.Item
{
    //[DynamicAuthorize]
    [RoutePrefix("api/category")]
    public class CategoryController : BaseController
    {
        #region Private Variable
        private readonly IErrorLog _errorLog;
        private readonly ICategoryRepository _categoryContext;
        private readonly int companyId;
        #endregion

        #region Constructor
        public CategoryController(IErrorLog errorLog, ICategoryRepository categoryRepository, IMerchantDataRepository merchantDataRepository)
            : base(errorLog, merchantDataRepository)
        {
            _errorLog = errorLog;
            _categoryContext = categoryRepository;
            companyId = MerchantContext.CompanyDetails.Id;
        }
        #endregion

        #region Public Method

        /// <summary>
        /// This method is used for insert new category in database. - JJ
        /// </summary>
        /// <param name="category">object of CategoryAC</param>
        /// <returns>saved object of CategoryAC</returns>

        [Route("savecategory")]
        [HttpPost]
        public IHttpActionResult SaveCategory(CategoryAC category)
        {
            try
            {
                bool isCategoryExist = _categoryContext.CheckCategoryExixtsOrNot(category, companyId);

                if (isCategoryExist)
                    return Ok(new { isCategoryExist = isCategoryExist });
                var categorys = _categoryContext.SaveCategory(category, companyId);
                return Ok(categorys);
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
        /// <returns>list of object of Category</returns>
        [HttpGet]
        [Route("getcategorylist")]
        public IHttpActionResult GetCategoryList()
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    var categoryList = _categoryContext.GetCategoryList(companyId);
                    return Ok(categoryList);
                }
                else
                    return BadRequest();
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
        /// <param name="category">object of ItemSupplier</param>
        /// <returns>Saved object of ItemSupplier</returns>
        [Route("saveitemsupplier")]
        [HttpPost]
        public IHttpActionResult SaveItemSupplier(ItemSupplier itemSupplier)
        {
            try
            {
                bool isItemSupplierExist = _categoryContext.CheckItemSupplierExixtsOrNot(itemSupplier);
                if (isItemSupplierExist)
                    return Ok(new { isItemSupplierExist = isItemSupplierExist });
                var itemSuppliers = _categoryContext.SaveItemSupplier(itemSupplier);
                return Ok(itemSuppliers);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// This method is used to delete category from the database - JJ
        /// </summary>
        /// <param name="category">object of category</param>
        /// <returns>null</returns>

        [Route("deletecategory")]
        [HttpPut]
        public IHttpActionResult DeleteCategory(Category category)
        {
            try
            {
                string status = _categoryContext.DeleteCategory(category);
                return Ok(new { status = status });
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// This method is used to delete itemsupplier from the database - JJ
        /// </summary>
        /// <param name="id">id of itemsupplier</param>
        /// <returns>null</returns>

        [Route("deleteitemsupplier")]
        [HttpGet]
        public IHttpActionResult DeleteItemSupplier(int supplierId)
        {
            try
            {
                _categoryContext.DeleteItemSupplier(supplierId);
                return Ok();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        [Route("candeleteitemsupplier")]
        [HttpGet]
        public IHttpActionResult CanDeleteItemSupplier(int categoryId, int supplierId)
        {
            try
            {
                var canDeleteItemSupplier = _categoryContext.CheckIfSupplierForCategoryCanBeDeletedOrNot(categoryId, supplierId);
                return Ok(new { canDelete = canDeleteItemSupplier });
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }
        #endregion
    }
}
