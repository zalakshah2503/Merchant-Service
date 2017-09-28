using MerchantService.Core.Global;
using MerchantService.DomainModel.Enums;
using MerchantService.DomainModel.Models;
using MerchantService.DomainModel.Models.Accounting;
using MerchantService.DomainModel.Models.Company;
using MerchantService.DomainModel.Models.CreditNote;
using MerchantService.DomainModel.Models.Item;
using MerchantService.DomainModel.Models.Supplier;
using MerchantService.DomainModel.Models.SystemParameters;
using MerchantService.DomainModel.Models.WorkFlow;
using MerchantService.Repository.ApplicationClasses.Item;
using MerchantService.Repository.ApplicationClasses.ItemChangeRequest;
using MerchantService.Repository.ApplicationClasses.WorkFlow;
using MerchantService.Repository.DataRepository;
using MerchantService.Repository.Helper;
using MerchantService.Repository.Modules.Account;
using MerchantService.Repository.Modules.Admin;
using MerchantService.Repository.Modules.Admin.Company;
using MerchantService.Repository.Modules.CreditNote;
using MerchantService.Repository.Modules.Global;
using MerchantService.Repository.Modules.Item;
using MerchantService.Repository.Modules.ItemChangeRequest;
using MerchantService.Repository.Modules.ParentRecords;
using MerchantService.Repository.Modules.WorkFlow;
using MerchantService.Utility.Constants;
using MerchantService.Utility.Logger;
using NCalc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Http;

namespace MerchantService.Core.Controllers.Item
{
    //[DynamicAuthorize]
    [RoutePrefix("api/item")]
    public class ItemController : BaseController
    {
        #region "Private Member(s)"

        private readonly IErrorLog _errorLog;
        private readonly IItemRepository _iItemRepository;
        private readonly int currentCompanyId;
        private readonly ICreditNoteRepository _ICreditNoteRepository;
        private readonly IBranchRepository _branchContext;
        private readonly IUserDetailRepository _userDetailRepository;
        private readonly IParentRecordsRepository _iParentRecordsRepository;
        private readonly IRoleRepository _iRoleRepository;
        private readonly ICompanyRepository _companyRepository;
        private readonly IAccountingRepository _iAccountingRepository;
        private readonly IWorkFlowDetailsRepository _iWorkFlowDetailsRepository;
        private readonly IICRRepository _icrContext;

        #endregion

        #region "Constructor & Destructor(s)"
        public ItemController(IErrorLog errorLog, IItemRepository iItemRepository, IMerchantDataRepository merchantDataRepository, IBranchRepository branchContext, IUserDetailRepository userDetailRepository, IParentRecordsRepository iParentRecordsRepository, IRoleRepository iRoleRepository,
            IRolePermissionRepository iRolePermissionRepository, ICompanyRepository companyRepository, ICreditNoteRepository ICreditNoteRepository, IAccountingRepository iAccountingRepository, IWorkFlowDetailsRepository iWorkFlowDetailsRepository, IICRRepository icrContext, IDataRepository<WorkFlowLog> workFLowLogContext)
            : base(errorLog, merchantDataRepository)
        {
            _iWorkFlowDetailsRepository = iWorkFlowDetailsRepository;
            _ICreditNoteRepository = ICreditNoteRepository;
            _userDetailRepository = userDetailRepository;
            if (MerchantContext.CompanyDetails != null)
                currentCompanyId = MerchantContext.CompanyDetails.Id;
            _iItemRepository = iItemRepository;
            _branchContext = branchContext;
            _iRoleRepository = iRoleRepository;
            _companyRepository = companyRepository;
            _errorLog = errorLog;
            _iParentRecordsRepository = iParentRecordsRepository;
            _iAccountingRepository = iAccountingRepository;
            _icrContext = icrContext;
        }
        #endregion

        #region "Public Method(s)"


        /// <summary>
        /// This method used for get branch list. -An
        /// </summary>
        /// <returns></returns>
        [Route("getbranchlist")]
        [HttpGet]
        public IHttpActionResult GetBranchList()
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    var userName = HttpContext.Current.User.Identity.Name;
                    if (userName == StringConstants.AdminName)
                        return Ok();
                    else
                    {
                        var branchList = _branchContext.GetBranchList(userName, currentCompanyId);
                        return Ok(branchList);
                    }
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
        /// This method used get unit type. -An
        /// </summary>
        /// <returns>list of unit types</returns>
        [Route("getunittypelist")]
        [HttpGet]
        public IHttpActionResult GetListOfUnitTypeByCompanyId()
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    List<SystemParameter> listOfParamType = _iItemRepository.GetListOfUnitTypeByCompanyId(currentCompanyId);
                    return Ok(listOfParamType);
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
        /// This method used get unit type. -An
        /// </summary>
        /// <returns>list of unit types</returns>
        [Route("getlistofunittypebycompanyidforpos")]
        [HttpGet]
        public IHttpActionResult GetListOfUnitTypeByCompanyIdForPos(int currentCompanyId)
        {
            try
            {
                List<SystemParameter> listOfParamType = _iItemRepository.GetListOfUnitTypeByCompanyId(currentCompanyId);
                return Ok(listOfParamType);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }

        }


        /// <summary>
        /// This method used for get margin profit.- An
        /// </summary>
        /// <returns></returns>
        [Route("getmarginprofit")]
        [HttpGet]
        public IHttpActionResult GetMarginProfit()
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    decimal marginProfit = _iItemRepository.GetMarginProfit(currentCompanyId);
                    return Ok(new { isResult = marginProfit });
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
        /// This method used for insert item profile -An
        /// </summary>
        /// <param name="itemProfile"></param>
        /// <returns></returns>
        ///  
        [HttpPost]
        [Route("insertnewitemprofile")]
        public IHttpActionResult InsertItemProfile(ItemProfile itemProfile)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    CompanyConfiguration companyConfiguration = new CompanyConfiguration();
                    companyConfiguration = _companyRepository.GetCompanyConfigurationByCompanyId(MerchantContext.CompanyDetails.Id);
                    if (!itemProfile.IsCompanyBarcode)
                    {
                        if (itemProfile.Barcode.Length < companyConfiguration.NormalBarcodeFrom || itemProfile.Barcode.Length > companyConfiguration.NormalBarcodeTo)
                        {
                            return Ok(new { _isResult = companyConfiguration });
                        }
                    }
                    itemProfile.CompanyId = currentCompanyId;
                    if (itemProfile.SellPriceA == 0)
                        itemProfile.SellPriceA = itemProfile.SellPrice;
                    if (itemProfile.SellPriceB == 0)
                        itemProfile.SellPriceB = itemProfile.SellPrice;
                    if (itemProfile.SellPriceC == 0)
                        itemProfile.SellPriceC = itemProfile.SellPrice;
                    if (itemProfile.SellPriceD == 0)
                        itemProfile.SellPriceD = itemProfile.SellPrice;
                    int id = _iItemRepository.AddNewItemProfile(itemProfile);

                    #region Create Price ICR  -AN
                    itemProfile.Id = id;
                    if (companyConfiguration.IsIcrrGeneratedAtAddItem)
                        CratePriceICR(itemProfile);
                    #endregion
                    return Ok(new { _isResult = id });
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
        /// This method used for get list of item profile. -An
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("getlistofitemprofile")]
        public IHttpActionResult GetListOfItemProfile()
        {
            try
            {
                var itemProfile = _iItemRepository.GetListOfItemProfile(currentCompanyId);
                var itemProfileCollection = new List<ItemProfileAC>();
                var itemProfileAC = new ItemProfileAC();
                foreach (var item in itemProfile)
                {
                    itemProfileAC = ApplicationClassHelper.ConvertType<ItemProfile, ItemProfileAC>(item);
                    itemProfileAC.AverageCostPrice = item.AverageCostPrice;
                    itemProfileAC.Barcode = item.Barcode;
                    itemProfileAC.BaseUnit = item.BaseUnit;
                    itemProfileAC.CategoryId = item.CategoryId;
                    itemProfileAC.Code = item.Code;
                    itemProfileAC.CostPrice = item.CostPrice;
                    itemProfileAC.FlavourEn = item.FlavourEn;
                    itemProfileAC.FlavourSl = item.FlavourSl;
                    itemProfileAC.HasOffer = item.HasOffer;
                    itemProfileAC.IsActive = item.IsActive;
                    itemProfileAC.IsIcrApproved = item.IsAutomaticPO;
                    itemProfileAC.IsOfferItem = item.IsOfferItem;
                    itemProfileAC.IsParentItem = item.IsParentItem;
                    itemProfileAC.ItemNameEn = item.ItemNameEn;
                    itemProfileAC.ItemNameSl = item.ItemNameSl;
                    itemProfileAC.ParentItemId = item.ParentItemId;
                    itemProfileAC.PreviousCostPrice = item.PreviousCostPrice;
                    itemProfileAC.ProfitMargin = item.ProfitMargin;
                    itemProfileAC.SellPrice = item.SellPrice;
                    itemProfileAC.SellPriceA = item.SellPriceA;
                    itemProfileAC.SellPriceB = item.SellPriceB;
                    itemProfileAC.SellPriceC = item.SellPriceC;
                    itemProfileAC.SellPriceD = item.SellPriceD;
                    itemProfileAC.UnitParamTypeId = item.UnitParamTypeId;
                    itemProfileAC.Id = item.Id;
                    itemProfileCollection.Add(itemProfileAC);
                }
                return Ok(itemProfileCollection);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// This method used for get item profile list. -An
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("getitemprofilelist")]
        public IHttpActionResult GetItemPrfoileList()
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    List<ItemProfile> listOfItemProfile = new List<ItemProfile>();
                    List<ItemProfileAC> listOfItemProfileAC = new List<ItemProfileAC>();
                    listOfItemProfile = _iItemRepository.GetListOfItemProfile(currentCompanyId);

                    foreach (var item in listOfItemProfile)
                    {
                        List<SubItemProfileAC> listOfChildItemProfileAC = new List<SubItemProfileAC>();
                        ItemProfileAC itemProfileAc = new ItemProfileAC();
                        itemProfileAc = GetItemProfileAcObject(item);
                        List<ItemProfile> listOfChildItemProfile = _iItemRepository.GetSubItemListByParentId(itemProfileAc.Id, currentCompanyId);
                        if (listOfChildItemProfile.Any())
                        {
                            foreach (var childItem in listOfChildItemProfile)
                            {
                                SubItemProfileAC childItemProfileAc = new SubItemProfileAC();
                                childItemProfileAc = GetSubItemProfileAcObject(childItem);
                                listOfChildItemProfileAC.Add(childItemProfileAc);
                            }
                            itemProfileAc.listOfChildProfileAC = listOfChildItemProfileAC;
                        }
                        listOfItemProfileAC.Add(itemProfileAc);
                    }
                    return Ok(listOfItemProfileAC);
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
        /// This method used for item list. -An  
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("getitemlistfotitemoffer")]
        public IHttpActionResult GetItemListFotItemOffer()
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    List<ItemProfile> listOfItemProfile = new List<ItemProfile>();
                    List<ItemProfileAC> listOfItemProfileAC = new List<ItemProfileAC>();
                    listOfItemProfile = _iItemRepository.GetListOfWithOutOfferItem(currentCompanyId);

                    CompanyConfiguration companyConfiguration = _companyRepository.GetCompanyConfigurationByCompanyId(MerchantContext.UserDetails.Branch.CompanyId);
                    foreach (var item in listOfItemProfile)
                    {
                        if (!(item.Barcode.Length < companyConfiguration.NormalBarcodeFrom || item.Barcode.Length > companyConfiguration.NormalBarcodeTo))
                        {
                            List<SubItemProfileAC> listOfChildItemProfileAC = new List<SubItemProfileAC>();
                            ItemProfileAC itemProfileAc = new ItemProfileAC();
                            itemProfileAc = GetItemProfileAcObject(item);
                            List<ItemProfile> listOfChildItemProfile = _iItemRepository.GetSubItemListByParentId(itemProfileAc.Id, currentCompanyId);
                            if (listOfChildItemProfile.Any())
                            {
                                foreach (var childItem in listOfChildItemProfile)
                                {
                                    if (!(childItem.Barcode.Length < companyConfiguration.NormalBarcodeFrom || childItem.Barcode.Length > companyConfiguration.NormalBarcodeTo))
                                    {
                                        SubItemProfileAC childItemProfileAc = new SubItemProfileAC();
                                        childItemProfileAc = GetSubItemProfileAcObject(childItem);
                                        listOfChildItemProfileAC.Add(childItemProfileAc);
                                    }
                                }
                                itemProfileAc.listOfChildProfileAC = listOfChildItemProfileAC;
                            }
                            listOfItemProfileAC.Add(itemProfileAc);
                        }
                    }
                    return Ok(listOfItemProfileAC);
                }
                else
                {
                    return BadRequest();
                }
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// This method used for get item profile object by id. -An
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("getitemprofileobjectbyid")]
        public IHttpActionResult GetItemProfileObjectById(int id)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    ItemProfile itemProfile = _iItemRepository.GetItemProfileObjectById(id);
                    ItemProfileAC itemProfileAc = new ItemProfileAC();
                    itemProfileAc.Id = itemProfile.Id;
                    itemProfileAc.CategoryId = itemProfile.CategoryId;
                    itemProfileAc.ItemNameEn = itemProfile.ItemNameEn;
                    itemProfileAc.FlavourEn = itemProfile.FlavourEn;
                    itemProfileAc.ItemType = itemProfile.Category.BrandParamType.ValueEn + "-" + itemProfile.Category.GroupParamType.ValueEn;
                    itemProfileAc.Code = itemProfile.Code;
                    itemProfileAc.Barcode = itemProfile.Barcode;
                    itemProfileAc.Unit = itemProfile.SystemParameter.ValueEn;
                    itemProfileAc.BaseUnit = itemProfile.BaseUnit;
                    itemProfileAc.IsOfferItem = itemProfile.IsOfferItem;
                    itemProfileAc.FlavourSl = itemProfile.FlavourSl;
                    itemProfileAc.ItemNameSl = itemProfile.ItemNameSl;
                    itemProfileAc.UnitParamTypeId = itemProfile.UnitParamTypeId;
                    itemProfileAc.SellPrice = itemProfile.SellPrice;
                    itemProfileAc.SellPriceA = itemProfile.SellPriceA;
                    itemProfileAc.SellPriceB = itemProfile.SellPriceB;
                    itemProfileAc.SellPriceC = itemProfile.SellPriceC;
                    itemProfileAc.SellPriceD = itemProfile.SellPriceD;
                    itemProfileAc.CostPrice = itemProfile.CostPrice;
                    itemProfileAc.IsActive = itemProfile.IsActive;
                    itemProfileAc.ProfitMargin = itemProfile.ProfitMargin;
                    var comapnyConfiguration = _companyRepository.GetCompanyConfigurationByCompanyId(Convert.ToInt32(MerchantContext.CompanyDetails.Id));
                    if (comapnyConfiguration != null)
                    {
                        itemProfileAc.IsOfferCreatedBelowCostPrice = comapnyConfiguration.IsOfferCreatedBelowCostPrice;
                    }
                    if (itemProfile.IsParentItem)
                    {
                        var itemQunatity = _iItemRepository.GetItemQunatityByItemIdAndBranchId(itemProfile.Id, Convert.ToInt32(MerchantContext.UserDetails.BranchId));
                        if (itemQunatity != null)
                            itemProfileAc.SystemQuantity = itemQunatity.ActualQuantity > 0 ? itemQunatity.ActualQuantity : 0;
                    }
                    else
                    {
                        var itemQunatity = _iItemRepository.GetItemQunatityByItemIdAndBranchId(Convert.ToInt32(itemProfile.ParentItemId), Convert.ToInt32(MerchantContext.UserDetails.BranchId));
                        if (itemQunatity != null && itemQunatity.ActualQuantity > 0)
                        {
                            decimal systemQuantity = (itemQunatity.ActualQuantity / itemProfile.BaseUnit);
                            itemProfileAc.SystemQuantity = systemQuantity > 0 ? Math.Floor(systemQuantity) : 0;
                        }
                    }
                    return Ok(itemProfileAc);
                }
                else
                {
                    return BadRequest();
                }
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// This method used for Get Item Profile Detail With Child Item List. -An
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("getitemprofiledetailbyid")]
        public IHttpActionResult GetItemProfileDetailById(int id)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    ItemProfile itemProfile = _iItemRepository.GetItemProfileObjectById(id);
                    return Ok(itemProfile);
                }
                else
                {
                    return BadRequest();
                }
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// This method used fopr update item profile. -An
        /// </summary>
        /// <param name="itemProfile"></param>
        /// <returns></returns>
        [HttpPut]
        [Route("updateitemprofile")]
        public IHttpActionResult UpdateItemProfile(ItemProfile itemProfile)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    CompanyConfiguration companyConfiguration = new CompanyConfiguration();
                    companyConfiguration = _companyRepository.GetCompanyConfigurationByCompanyId(MerchantContext.CompanyDetails.Id);
                    if (companyConfiguration != null)
                    {
                        int id = _iItemRepository.UpdateItemProfile(itemProfile);
                        return Ok(new { _isResult = id });
                    }
                    return Ok(new { _isResult = companyConfiguration });
                }
                else
                {
                    return BadRequest();
                }
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// This method uased for delete item profile. -An
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("deleteitemprofile")]
        public IHttpActionResult DeleteItemProfile(int id)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    int itemId = _iItemRepository.CheckItemOrderCompleted(id);
                    if (itemId == 0)
                    {
                        string isDelted = _iItemRepository.DeleteItemProfile(id);
                        return Ok(new { _isResult = isDelted });
                    }
                    return Ok(new { _isResult = itemId });
                }
                else
                {
                    return BadRequest();
                }
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// This method used for insert sub item. -An
        /// </summary>
        /// <param name="itemProfile"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("insertsubitem")]
        public IHttpActionResult InsertSubItem(ItemProfile itemProfile)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    CompanyConfiguration companyConfiguration = new CompanyConfiguration();
                    companyConfiguration = _companyRepository.GetCompanyConfigurationByCompanyId(MerchantContext.CompanyDetails.Id);
                    if (!itemProfile.IsCompanyBarcode)
                    {
                        if (itemProfile.Barcode.Length < companyConfiguration.NormalBarcodeFrom || itemProfile.Barcode.Length > companyConfiguration.NormalBarcodeTo)
                        {
                            return Ok(new { _isResult = companyConfiguration });
                        }
                    }
                    itemProfile.CompanyId = currentCompanyId;
                    if (itemProfile.SellPriceA == 0)
                    {
                        itemProfile.SellPriceA = itemProfile.SellPrice;
                    }
                    if (itemProfile.SellPriceB == 0)
                    {
                        itemProfile.SellPriceB = itemProfile.SellPrice;
                    }
                    if (itemProfile.SellPriceC == 0)
                    {
                        itemProfile.SellPriceC = itemProfile.SellPrice;
                    }
                    if (itemProfile.SellPriceD == 0)
                    {
                        itemProfile.SellPriceD = itemProfile.SellPrice;
                    }
                    itemProfile.CompanyId = MerchantContext.CompanyDetails.Id;
                    int id = _iItemRepository.AddNewItemProfile(itemProfile);
                    #region Create Price ICR  -AN
                    itemProfile.Id = id;
                    if (companyConfiguration.IsIcrrGeneratedAtAddItem)
                        CratePriceICR(itemProfile);
                    #endregion
                    return Ok(new { _isResult = id });
                }
                else
                {
                    return BadRequest();
                }
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// This method used for get sub item list. -An
        /// </summary>
        /// <param name="parentId"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("getsubitemlistbyparentid")]
        public IHttpActionResult GetSubItemList(int parentId)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    List<ItemProfileAC> listOfItemProfile = new List<ItemProfileAC>();
                    List<ItemProfile> listOfItemProfileList = _iItemRepository.GetSubItemListByParentId(parentId, currentCompanyId);
                    foreach (var item in listOfItemProfileList)
                    {
                        ItemProfileAC itemProfileAc = new ItemProfileAC();
                        itemProfileAc.AverageCostPrice = item.AverageCostPrice;
                        itemProfileAc.Barcode = item.Barcode;
                        itemProfileAc.BaseUnit = item.BaseUnit;
                        itemProfileAc.CategoryId = item.CategoryId;
                        itemProfileAc.Code = item.Code;
                        itemProfileAc.CostPrice = item.CostPrice;
                        itemProfileAc.FlavourEn = item.FlavourEn;
                        itemProfileAc.FlavourSl = item.FlavourSl;
                        itemProfileAc.HasOffer = item.HasOffer;
                        itemProfileAc.IsActive = item.IsActive;
                        itemProfileAc.IsIcrApproved = item.IsAutomaticPO;
                        itemProfileAc.IsOfferItem = item.IsOfferItem;
                        itemProfileAc.IsParentItem = item.IsParentItem;
                        itemProfileAc.ItemNameEn = item.ItemNameEn;
                        itemProfileAc.ItemNameSl = item.ItemNameSl;
                        itemProfileAc.ParentItemId = item.ParentItemId;
                        itemProfileAc.PreviousCostPrice = item.PreviousCostPrice;
                        itemProfileAc.ProfitMargin = item.ProfitMargin;
                        itemProfileAc.SellPrice = item.SellPrice;
                        itemProfileAc.SellPriceA = item.SellPriceA;
                        itemProfileAc.SellPriceB = item.SellPriceB;
                        itemProfileAc.SellPriceC = item.SellPriceC;
                        itemProfileAc.SellPriceD = item.SellPriceD;
                        itemProfileAc.UnitParamTypeId = item.UnitParamTypeId;
                        itemProfileAc.Id = item.Id;
                        itemProfileAc.ItemType = item.Category.BrandParamType.ValueEn + "-" + item.Category.GroupParamType.ValueEn;
                        itemProfileAc.Unit = item.SystemParameter.ValueEn;
                        itemProfileAc.HasChildItem = _iItemRepository.CheckAnySubItemIsExists(item.Id);
                        listOfItemProfile.Add(itemProfileAc);
                    }
                    return Ok(listOfItemProfile);
                }
                else
                {
                    return BadRequest();
                }
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// This method used for update sub item. -An
        /// </summary>
        /// <param name="itemProfile"></param>
        /// <returns></returns>
        [HttpPut]
        [Route("updatesubitem")]
        public IHttpActionResult UpdateSubItem(ItemProfile itemProfile)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    CompanyConfiguration companyConfiguration = new CompanyConfiguration();
                    companyConfiguration = _companyRepository.GetCompanyConfigurationByCompanyId(MerchantContext.CompanyDetails.Id);
                    if (companyConfiguration != null)
                    {
                        int id = _iItemRepository.UpdateItemProfile(itemProfile);
                        return Ok(new { _isResult = id });
                    }
                    return Ok(new { _isResult = companyConfiguration });
                }
                else
                {
                    return BadRequest();
                }
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// This method used for convert to main item. -An
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("converttomainitem")]
        public IHttpActionResult ConvertToMainItem(int id)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    int primaryId = _iItemRepository.ConvertToMainItem(id);
                    return Ok(new { _isResult = primaryId });
                }
                else
                {
                    return BadRequest();
                }
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// This method used for change main item. -An
        /// </summary>
        /// <param name="parentId"></param>
        /// <param name="childId"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("changemainitem/{parentId}/{childId}")]
        public IHttpActionResult ChangeMainItem(int parentId, int childId)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    bool ischange = _iItemRepository.ChangeMainItem(parentId, childId);
                    return Ok(ischange);
                }
                else
                {
                    return BadRequest();
                }
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// This method used for get item List. -JJ
        /// </summary>
        /// <param name="PriceCategory"></param>
        /// <returns>list of object of ItemProfileAC</returns>
        [HttpGet]
        [Route("getitemlist")]
        public IHttpActionResult GetItemList(int? PriceCategory, int? BranchId)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    List<ItemProfileAC> listOfItemProfileAC = new List<ItemProfileAC>();
                    var itemProfile = new List<ItemProfile>();
                    if (MerchantContext.UserDetails.Branch != null)
                        itemProfile = _iItemRepository.GetItemList(currentCompanyId, BranchId);
                    else
                    {
                        itemProfile = _iItemRepository.GetItemList(currentCompanyId, null);
                    }
                    foreach (var item in itemProfile)
                    {
                        var itemProfileAc = GetItemProfileAcObject(item);
                        if (MerchantContext.UserDetails.BranchId != null)
                        {
                            if (itemProfileAc.IsParentItem)
                            {
                                var itemQuantity = _iItemRepository.GetItemQuantityByItemId(itemProfileAc.Id, Convert.ToInt32(MerchantContext.UserDetails.BranchId));
                                itemProfileAc.SystemQuantity = itemQuantity != null ? itemQuantity.ActualQuantity : 0;
                            }
                            else
                            {
                                if (itemProfileAc.BaseUnit > 0)
                                {
                                    var itemQuantity = _iItemRepository.GetItemQuantityByItemId((int)itemProfileAc.ParentItemId, Convert.ToInt32(MerchantContext.UserDetails.BranchId));
                                    itemProfileAc.SystemQuantity = itemQuantity != null ? Math.Floor((decimal)(itemQuantity.ActualQuantity / itemProfileAc.BaseUnit)) : 0;
                                }
                                else
                                {
                                    itemProfileAc.SystemQuantity = 0;
                                }
                            }
                            itemProfileAc.ActualQuantity = Convert.ToInt32(itemProfileAc.SystemQuantity);
                        }
                        if (item.ItemOffer != null)
                        {
                            itemProfileAc.IsOfferValid = true;
                        }
                        else
                        {
                            itemProfileAc.IsOfferValid = false;
                        }
                        switch (PriceCategory)
                        {
                            case 2:
                                itemProfileAc.SellPrice = itemProfileAc.SellPriceA;
                                break;
                            case 3:
                                itemProfileAc.SellPrice = itemProfileAc.SellPriceB;
                                break;
                            case 4:
                                itemProfileAc.SellPrice = itemProfileAc.SellPriceC;
                                break;
                            case 5:
                                itemProfileAc.SellPrice = itemProfileAc.SellPriceD;
                                break;
                            default:
                                break;
                        }
                        listOfItemProfileAC.Add(itemProfileAc);
                    }
                    return Ok(listOfItemProfileAC);
                }
                else
                {
                    return BadRequest();
                }
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// This method used for get item profile list. -jj
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("fetchitemprofilelist")]
        public IHttpActionResult FetchItemPrfoileList()
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    List<ItemProfile> listOfItemProfile = new List<ItemProfile>();
                    List<ItemProfileAC> listOfItemProfileAC = new List<ItemProfileAC>();
                    listOfItemProfile = _iItemRepository.GetItemProfileList(currentCompanyId, MerchantContext.UserDetails.BranchId);

                    foreach (var item in listOfItemProfile)
                    {
                        List<SubItemProfileAC> listOfChildItemProfileAC = new List<SubItemProfileAC>();
                        ItemProfileAC itemProfileAc = new ItemProfileAC();
                        itemProfileAc = GetItemProfileAcObject(item);
                        if (item.ItemOffer != null)
                        {
                            itemProfileAc.IsOfferValid = true;
                        }
                        else
                        {
                            itemProfileAc.IsOfferValid = false;
                        }
                        List<ItemProfile> listOfChildItemProfile = _iItemRepository.GetSubItemProfileList(itemProfileAc.Id, currentCompanyId, MerchantContext.UserDetails.BranchId);
                        if (listOfChildItemProfile.Any())
                        {
                            itemProfileAc.HasChildItem = true;
                            foreach (var childItem in listOfChildItemProfile)
                            {
                                SubItemProfileAC childItemProfileAc = new SubItemProfileAC();
                                childItemProfileAc = GetSubItemProfileAcObject(childItem);

                                if (MerchantContext.UserDetails.BranchId != null)
                                {
                                    if (itemProfileAc.BaseUnit > 0)
                                    {
                                        var itemQuantity = _iItemRepository.GetItemQuantityByItemId((int)childItemProfileAc.ParentItemId, Convert.ToInt32(MerchantContext.UserDetails.BranchId));
                                        childItemProfileAc.SystemQuantity = itemQuantity != null ? Math.Floor((decimal)(itemQuantity.ActualQuantity / childItemProfileAc.BaseUnit)) : 0;
                                    }
                                    else
                                    {
                                        childItemProfileAc.SystemQuantity = 0;
                                    }
                                    childItemProfileAc.ActualQuantity = Convert.ToInt32(childItemProfileAc.SystemQuantity);
                                }
                                if (childItem.ItemOffer != null)
                                {
                                    childItemProfileAc.IsOfferValid = true;
                                }
                                else
                                {
                                    childItemProfileAc.IsOfferValid = false;
                                }
                                listOfChildItemProfileAC.Add(childItemProfileAc);
                            }
                            itemProfileAc.listOfChildProfileAC = listOfChildItemProfileAC;
                        }
                        else
                        {
                            itemProfileAc.HasChildItem = false;
                        }
                        listOfItemProfileAC.Add(itemProfileAc);
                    }
                    return Ok(listOfItemProfileAC);
                }
                else
                {
                    return BadRequest();
                }
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// This method used for get item profile by barcode. -An
        /// </summary>
        /// <param name="barcode"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("getitemprofilebybarcode")]
        public IHttpActionResult GetItemProfileByBarcode(string barcode, int branchId)
        {
            try
            {
                var itemProfile = _iItemRepository.GetItemProfileByBarcode(barcode, branchId);
                return Ok(itemProfile);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        [HttpGet]
        [Route("updateitemquantityforpos")]
        public IHttpActionResult UpdateItemQuantityForPOS(int itemId, int Quantity, int branchId, int currentUserId)
        {
            try
            {
                bool result = _iItemRepository.UpdateItemQuantityForPOS(itemId, Quantity, branchId, currentUserId);
                return Ok(result);

            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        [HttpGet]
        [Route("getitemquantitybyitemid")]
        public IHttpActionResult GetItemQuantityByItemId(int itemId, int branchId)
        {
            try
            {
                var itemQuantity = _iItemRepository.GetItemQuantityByItemId(itemId, branchId);
                return Ok(itemQuantity);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// This method used for insert item profile -An
        /// </summary>
        /// <param name="itemProfile"></param>
        /// <returns></returns>
        ///  
        [HttpPost]
        [Route("insertitemprofileforpos")]
        public IHttpActionResult InsertItemProfileForPos(ItemProfile itemProfile)
        {
            try
            {
                int id = _iItemRepository.InsertItemProfileForPos(itemProfile);
                _iItemRepository.AddItemQuantity(id, itemProfile.CompanyId);
                return Ok(id);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        [HttpGet]
        [Route("checkforuniqueitemCode")]
        public IHttpActionResult CheckForUniqueItemCode(string itemCode)
        {
            try
            {
                var isUnique = _iItemRepository.CheckForUniqueItemCode(itemCode);
                return Ok(isUnique);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        #region Item Offer


        [Route("getitemofferbybarcode")]
        public IHttpActionResult GetItemOfferByBarcode(string barcode, int branchId)
        {
            try
            {
                var itemOffer = _iItemRepository.GetItemOfferByBarCode(barcode, branchId);
                return Ok(itemOffer);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        [HttpPost]
        [Route("insertitemoffer")]
        public IHttpActionResult InsertIntoItemOffer(ItemOffer itemOffer)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    if (MerchantContext.Permission.IsAllowCreateItemOffer)
                    {
                        List<ReturnItemOfferMeesage> returnItemOfferMessage = new List<ReturnItemOfferMeesage>();
                        foreach (var branch in itemOffer.BranchList)
                        {
                            ReturnItemOfferMeesage returnItemOfferMeesageObject = new ReturnItemOfferMeesage();
                            bool workFlowNotExists = false;
                            bool validSystemQuantity = true;
                            var branchDetail = _branchContext.GetBranchById(branch.Id);
                            returnItemOfferMeesageObject.BranchName = branchDetail.Name;
                            bool isCheckItemOffer = _iItemRepository.CheckItemOfferIsAlreadyExists(itemOffer.ItemId, branch.Id, 0);
                            if (isCheckItemOffer)//vcheck offer already exists or not.
                            {
                                var item = _iItemRepository.GetItemProfileObjectById(itemOffer.ItemId);
                                if (item != null)
                                {
                                    ItemQuantity itemQuantity = new ItemQuantity();
                                    if (item.IsParentItem)
                                        itemQuantity = _iItemRepository.GetItemQuantityByItemId(item.Id, branch.Id);
                                    else
                                        itemQuantity = _iItemRepository.GetItemQuantityByItemId(Convert.ToInt32(item.ParentItemId), branch.Id);

                                    if (itemQuantity != null)
                                    {
                                        if (item.IsParentItem)
                                        {
                                            if (itemOffer.QuantityLimit > itemQuantity.ActualQuantity)
                                                validSystemQuantity = false;
                                        }
                                        else
                                        {
                                            decimal subQuantity = (itemQuantity.ActualQuantity / item.BaseUnit);
                                            if (itemOffer.QuantityLimit > Math.Floor(subQuantity))
                                                validSystemQuantity = false;
                                        }
                                    }
                                    else
                                        validSystemQuantity = false;

                                    if (validSystemQuantity)
                                    {
                                        List<WorkFlowDetail> listOfWorkFlowDetail = _iParentRecordsRepository.GetWorkFlowDetailListByParent(StringConstants.ItemOffer, currentCompanyId);
                                        if (listOfWorkFlowDetail.Any())//get list of work flow
                                        {
                                            var activityWorkFlow = listOfWorkFlowDetail.FirstOrDefault(x => x.InitiatorId == MerchantContext.Permission.RoleId && x.IsParentAction && x.Activity.Name == StringConstants.CreateItemOffer);
                                            if (activityWorkFlow != null)//get initiator work flow
                                            {
                                                itemOffer.IsStop = false;
                                                if (activityWorkFlow.IsCondition)//check when any condition is apply or not.
                                                {
                                                    var companyConfiguation = _companyRepository.GetCompanyConfigurationByCompanyId(MerchantContext.CompanyDetails.Id);
                                                    if (companyConfiguation != null)//get comapny Configuration for get disocunt UperBound and LowerBound feild value
                                                    {
                                                        StringBuilder finalExpression = new StringBuilder("");
                                                        List<ConditionalOperator> listOfConditionOperator = _iItemRepository.GetListOfConditionalOperator(activityWorkFlow.Id);
                                                        if (listOfConditionOperator.Any())
                                                        {
                                                            foreach (var condition in listOfConditionOperator)
                                                            {
                                                                string expressions = GetExpression(condition.Variable1, condition.Variable2, condition.Operator, itemOffer, companyConfiguation);
                                                                finalExpression.Append(condition.Condition).Append(expressions);
                                                            }
                                                        }
                                                        string expression = finalExpression.ToString();
                                                        Expression e = new Expression(expression);
                                                        var finalResult = e.Evaluate();
                                                        if (Convert.ToBoolean(finalResult))
                                                            activityWorkFlow = listOfWorkFlowDetail.FirstOrDefault(x => x.ParentActivityId == activityWorkFlow.Id && x.IsApprovePanel);
                                                        else
                                                            activityWorkFlow = listOfWorkFlowDetail.FirstOrDefault(x => x.ParentActivityId == activityWorkFlow.Id && x.IsRejectPanel);
                                                        InsertItemOffer(itemOffer, branch.Id, activityWorkFlow);
                                                        returnItemOfferMeesageObject.IsSuccess = true;
                                                        returnItemOfferMeesageObject.StringMessage = StringConstants.AddedItemOffer;
                                                    }
                                                    else
                                                        workFlowNotExists = true;
                                                }
                                                else
                                                {
                                                    InsertItemOffer(itemOffer, branch.Id, activityWorkFlow);
                                                    returnItemOfferMeesageObject.IsSuccess = true;
                                                    returnItemOfferMeesageObject.StringMessage = StringConstants.AddedItemOffer;
                                                }
                                            }
                                            else
                                                workFlowNotExists = true;
                                        }
                                        else
                                            workFlowNotExists = true;
                                    }
                                    else
                                    {
                                        returnItemOfferMeesageObject.IsSuccess = false;
                                        returnItemOfferMeesageObject.StringMessage = StringConstants.notValidQuantityLimit;
                                    }
                                }
                            }
                            else
                            {
                                returnItemOfferMeesageObject.IsSuccess = false;
                                returnItemOfferMeesageObject.StringMessage = StringConstants.ItemOfferAlreadyExists;
                            }
                            if (workFlowNotExists)
                            {
                                returnItemOfferMeesageObject.IsSuccess = false;
                                returnItemOfferMeesageObject.StringMessage = StringConstants.WorkFlowNotCreated;
                            }
                            returnItemOfferMessage.Add(returnItemOfferMeesageObject);
                        }
                        return Ok(new { _isResult = returnItemOfferMessage });
                    }
                    else
                        return Ok(new { _isResult = false });
                }
                else
                {
                    return BadRequest();
                }
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        [HttpGet]
        [Route("getsupplierlistbyitemid")]
        public IHttpActionResult getSupplierListByItemId(int itemId)
        {
            try
            {
                List<SupplierProfile> listOfSupplier = new List<SupplierProfile>();
                ItemProfile itemProfile = _iItemRepository.GetItemProfileObjectById(itemId);
                if (itemProfile != null)
                {

                    List<ItemSupplier> listOfItemSupplier = _iItemRepository.GetItemSupplierListByCategoryId(Convert.ToInt32(itemProfile.CategoryId));
                    foreach (var itemSupplier in listOfItemSupplier)
                    {
                        listOfSupplier.Add(itemSupplier.SupplierProfile);
                    }
                }
                return Ok(listOfSupplier);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        [HttpGet]
        [Route("getsupplierlistbycategoryid")]
        public IHttpActionResult getSupplierListByCategoryId(int categoryId)
        {
            try
            {
                List<SupplierProfile> listOfSupplier = new List<SupplierProfile>();
                List<ItemSupplier> listOfItemSupplier = _iItemRepository.GetItemSupplierListByCategoryId(categoryId);
                foreach (var itemSupplier in listOfItemSupplier)
                {
                    listOfSupplier.Add(itemSupplier.SupplierProfile);
                }
                return Ok(listOfSupplier);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        [HttpPost]
        [Route("updateitemoffer")]
        public IHttpActionResult UpdateItemOffer(UpdateItemOfferAC updateItemOffer)
        {
            try
            {
                ItemOffer itemOffer = _iItemRepository.GetItemOfferById(updateItemOffer.Id);
                itemOffer.Discount = updateItemOffer.Discount;
                itemOffer.Comment = updateItemOffer.Comment;
                bool isCheckItemOffer = _iItemRepository.CheckItemOfferIsAlreadyExists(itemOffer.ItemId, Convert.ToInt32(itemOffer.BranchId), itemOffer.Id);
                if (isCheckItemOffer)//vcheck offer already exists or not.
                {
                    WorkFlowLog workFlowLogObject = _iParentRecordsRepository.GetLastWorkFlowDetaiByRecordId(itemOffer.RecordId);
                    if (workFlowLogObject != null)
                    {
                        List<WorkFlowDetail> listOfWorkFlowDetail = _iParentRecordsRepository.GetWorkFlowDetailListByParent(StringConstants.ItemOffer, currentCompanyId);
                        if (listOfWorkFlowDetail.Any())//get list of work flow
                        {
                            var activityWorkFlow = _iParentRecordsRepository.GetWorkFlowDetailById(workFlowLogObject.WorkFlowDetail.ParentActivityId);
                            if (activityWorkFlow != null && MerchantContext.UserDetails.RoleId == workFlowLogObject.WorkFlowDetail.AssignedId)
                            {
                                if (activityWorkFlow.IsCondition)//check when any condition is apply or not.
                                {
                                    var companyConfiguation = _companyRepository.GetCompanyConfigurationByCompanyId(MerchantContext.CompanyDetails.Id);
                                    if (companyConfiguation != null)//get comapny Configuration for get disocunt UperBound and LowerBound feild value
                                    {
                                        StringBuilder finalExpression = new StringBuilder("");
                                        List<ConditionalOperator> listOfConditionOperator = _iItemRepository.GetListOfConditionalOperator(activityWorkFlow.Id);
                                        if (listOfConditionOperator.Any())
                                        {
                                            foreach (var condition in listOfConditionOperator)
                                            {
                                                string expressions = GetExpression(condition.Variable1, condition.Variable2, condition.Operator, itemOffer, companyConfiguation);
                                                finalExpression.Append(condition.Condition).Append(expressions);
                                            }
                                        }
                                        string expression = finalExpression.ToString();
                                        Expression e = new Expression(expression);
                                        var finalResult = e.Evaluate();
                                        if (Convert.ToBoolean(finalResult))
                                            activityWorkFlow = listOfWorkFlowDetail.FirstOrDefault(x => x.ParentActivityId == activityWorkFlow.Id && x.IsApprovePanel);
                                        else
                                            activityWorkFlow = listOfWorkFlowDetail.FirstOrDefault(x => x.ParentActivityId == activityWorkFlow.Id && x.IsRejectPanel);
                                        UpdateItemOffer(updateItemOffer, activityWorkFlow);
                                        return Ok(new { _isResult = true });
                                    }
                                }
                                else
                                {
                                    UpdateItemOffer(updateItemOffer, activityWorkFlow);
                                    return Ok(new { _isResult = true });
                                }
                            }
                        }
                    }
                    return Ok(new { _isResult = "IsNotWorkFlow" });
                }
                else
                    return Ok(new { _isResult = "IsExists" });
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        [HttpGet]
        [Route("getstatuslist")]
        public IHttpActionResult GetStatusList()
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    List<StatusType> listOfStatusType = _iItemRepository.GetlistOfStatus();
                    return Ok(listOfStatusType);
                }
                else
                {
                    return BadRequest();
                }
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        [HttpGet]
        [Route("getitemofferworklist")]
        public IHttpActionResult GetItemOfferWorkList()
        {
            try
            {
                bool isAdd = true;
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    List<ItemOfferAC> listOfItemOfferAC = new List<ItemOfferAC>();
                    if (MerchantContext.UserDetails.BranchId != null)
                    {
                        List<ItemOffer> listOfitemOffer = new List<ItemOffer>();
                        if (MerchantContext.Permission.IsAllowToAccessAllBranch)
                            listOfitemOffer = _iItemRepository.GetListOfItemOfferAllBranch();
                        else
                            listOfitemOffer = _iItemRepository.GetListOfItemOffer(Convert.ToInt32(MerchantContext.UserDetails.BranchId));

                        foreach (var itemOffer in listOfitemOffer)
                        {
                            ItemOfferAC itemOfferAc = new ItemOfferAC();
                            itemOfferAc.Id = itemOffer.Id;
                            if (itemOffer.ItemProfile != null)
                            {
                                itemOfferAc.Barcode = itemOffer.ItemProfile.Barcode;
                                itemOfferAc.ItemUnit = itemOffer.ItemProfile.SystemParameter != null ? itemOffer.ItemProfile.SystemParameter.ValueEn : "";
                                itemOfferAc.ItemName = itemOffer.ItemProfile.ItemNameEn;
                            }
                            if (itemOffer.BranchDetail != null)
                            {
                                itemOfferAc.BranchId = itemOffer.BranchId;
                                itemOfferAc.BranchName = itemOffer.BranchDetail.Name != null ? itemOffer.BranchDetail.Name : "";
                                var workFlowLog = _iParentRecordsRepository.GetLastWorkFlowDetaiByRecordId(itemOffer.RecordId);
                                if (workFlowLog != null && workFlowLog.WorkFlowDetail != null)
                                {
                                    if (workFlowLog.Action == "Returned")
                                        itemOfferAc.StatusName = "Rejected";
                                    else if (workFlowLog.Action == "Approval")
                                        itemOfferAc.StatusName = "Approved";
                                    else
                                        itemOfferAc.StatusName = workFlowLog.Action;
                                }
                            }
                            itemOfferAc.StartDate = itemOffer.StartDateTime.Date;
                            itemOfferAc.EndDate = itemOffer.EndDateTime.Date;
                            itemOfferAc.StartTime = itemOffer.StartDateTime.TimeOfDay;
                            itemOfferAc.EndTime = itemOffer.EndDateTime.TimeOfDay;
                            itemOfferAc.StartDateTime = itemOffer.StartDateTime;
                            itemOfferAc.EndDateTime = itemOffer.EndDateTime;
                            itemOfferAc.IsDeleted = itemOffer.IsDeleted;
                            itemOfferAc.EndDateDemo = itemOffer.EndDateTime.ToShortDateString();

                            if (itemOffer.IsDeleted)
                            {
                                DateTime createdDateTime = itemOffer.CreatedDateTime.AddDays(14);
                                if (DateTime.UtcNow > createdDateTime)
                                    isAdd = false;
                            }
                            DateTime endDateTime = itemOffer.EndDateTime.AddDays(14);
                            if (DateTime.UtcNow > endDateTime)
                                isAdd = false;

                            if (isAdd)
                                listOfItemOfferAC.Add(itemOfferAc);
                        }
                    }
                    return Ok(listOfItemOfferAC);
                }
                else
                {
                    return BadRequest();
                }
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        [HttpGet]
        [Route("getitemofferdetailbyid")]
        public IHttpActionResult GetItemOfferDetailById(int id)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    ItemOfferDetailAC itemOfferDetailAc = new ItemOfferDetailAC();
                    itemOfferDetailAc = _iItemRepository.GetItemOfferDetailById(id, MerchantContext.UserDetails, currentCompanyId);
                    return Ok(itemOfferDetailAc);
                }
                else
                {
                    return BadRequest();
                }
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        [HttpPost]
        [Route("approveitemoffer")]
        public IHttpActionResult ApproveItemOffer(WorkFlowItemOfferAC workFlowLogItemOfferAC)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    if (MerchantContext.Permission.IsAllowToReview)
                    {
                        ItemOffer itemOffer = _iItemRepository.GetItemOfferById(workFlowLogItemOfferAC.ItemOfferId);
                        if (itemOffer != null)
                        {
                            if (_iWorkFlowDetailsRepository.CheckLastActionPerform(itemOffer.RecordId, StringConstants.Initiate, MerchantContext.UserDetails.RoleId))
                                return Ok(new { _isResult = StringConstants.AlreadyActivityProcessed });

                            var activityWorkFlow = _iWorkFlowDetailsRepository.GetApprovalActionWorkFLow(Convert.ToInt32(itemOffer.RecordId), StringConstants.ApprovAction, workFlowLogItemOfferAC.Comment, MerchantContext.UserDetails, true);
                            if (activityWorkFlow != null)
                            {
                                var workFlowDetail = _iParentRecordsRepository.GetWorkFlowDetailById(activityWorkFlow.WorkFlowId);
                                if (workFlowDetail != null)
                                {

                                    if (workFlowDetail.NextActivity.IsClosed)
                                    {
                                        if (workFlowDetail.ParentPermission.Name == StringConstants.ItemOffer)
                                        {
                                            #region Credit Note Creation
                                            CreditNoteDetail creditNoteDetail = new CreditNoteDetail();
                                            if (itemOffer.IsSupplierInitiate)
                                            {
                                                List<CreditNoteDetail> listOfCreditNotes = _ICreditNoteRepository.GetTodayListOfCreditNotes(Convert.ToInt32(itemOffer.BranchId), Convert.ToInt32(CreditNoteType.SupplierItemOfferNote));
                                                DateTime dt = DateTime.UtcNow;
                                                creditNoteDetail.CreditNoteNo = "CR" + dt.Day.ToString() + dt.Month.ToString() + dt.Year.ToString() + (listOfCreditNotes.Count + 1);
                                                creditNoteDetail.BranchId = Convert.ToInt32(itemOffer.BranchId);
                                                creditNoteDetail.CreatedDateTime = dt;
                                                creditNoteDetail.InitiationComment = "Created Credit Notes For Item Offer By" + " " + MerchantContext.UserDetails.UserName;
                                                creditNoteDetail.InitiationDate = dt;
                                                creditNoteDetail.TypeId = Convert.ToInt32(CreditNoteType.SupplierItemOfferNote);
                                                ItemQuantity itemQuantity = _iItemRepository.GetItemQunatityByItemIdAndBranchId(Convert.ToInt32(itemOffer.ItemId), Convert.ToInt32(itemOffer.BranchId));
                                                decimal itemPriceDiffrent = (itemOffer.ItemProfile.SellPrice - itemOffer.SellPrice);
                                                if (itemQuantity != null)
                                                {
                                                    creditNoteDetail.Amount = (itemPriceDiffrent * itemQuantity.ActualQuantity);
                                                    int creditNoteId = _ICreditNoteRepository.AddCreditNoteDetail(creditNoteDetail);
                                                    if (creditNoteId != 0)
                                                    {
                                                        CreditNoteItem creditNoteItem = new CreditNoteItem();
                                                        creditNoteItem.CostPrice = itemOffer.ItemProfile.CostPrice;
                                                        creditNoteItem.CreatedDateTime = DateTime.UtcNow;
                                                        creditNoteItem.CreditNoteId = creditNoteId;
                                                        creditNoteItem.ItemId = itemOffer.ItemId;
                                                        creditNoteItem.Quantity = itemQuantity.ActualQuantity;
                                                        _ICreditNoteRepository.AddCreditNotesItem(creditNoteItem);

                                                        ItemOfferCreditNote itemOfferCreditNote = new ItemOfferCreditNote();
                                                        itemOfferCreditNote.CreatedDateTime = DateTime.UtcNow;
                                                        itemOfferCreditNote.CreditNoteId = creditNoteId;
                                                        itemOfferCreditNote.ItemOfferId = itemOffer.Id;
                                                        itemOfferCreditNote.SupplierId = Convert.ToInt32(itemOffer.SupplierId);
                                                        _ICreditNoteRepository.AddCreditNoteItemOffer(itemOfferCreditNote);
                                                    }
                                                }
                                            }

                                            #endregion

                                            #region Insert Into Accounting

                                            InsertIntoAccounting(itemOffer);

                                            #endregion

                                            itemOffer.IsActive = true;
                                        }
                                        else if (workFlowDetail.ParentPermission.Name == StringConstants.DeleteItemOffer)
                                            itemOffer.IsDeleted = true;

                                        _iItemRepository.UpdateItemOffer(itemOffer);
                                    }
                                    return Ok(new { _isResult = true });
                                }
                            }
                        }
                    }
                    else
                        return Ok(new { _isResult = false });

                    return Ok(new { _isResult = "IsNotWorkFlow" });
                }
                else
                {
                    return BadRequest();
                }
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        [HttpPost]
        [Route("rejectitemoffer")]
        public IHttpActionResult RejectItemOffer(WorkFlowItemOfferAC workFlowLogItemOfferAC)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    if (MerchantContext.Permission.IsAllowToReview)
                    {
                        ItemOffer itemOffer = _iItemRepository.GetItemOfferById(workFlowLogItemOfferAC.ItemOfferId);
                        if (itemOffer != null)
                        {
                            if (_iWorkFlowDetailsRepository.CheckLastActionPerform(itemOffer.RecordId, StringConstants.Initiate, MerchantContext.UserDetails.RoleId))
                                return Ok(new { _isResult = StringConstants.AlreadyActivityProcessed });

                            var activityWorkFlow = _iWorkFlowDetailsRepository.GetApprovalActionWorkFLow(Convert.ToInt32(itemOffer.RecordId), StringConstants.ReturnAction, workFlowLogItemOfferAC.Comment, MerchantContext.UserDetails, false);

                            if (activityWorkFlow != null)
                            {
                                return Ok(new { _isResult = true });
                            }
                        }
                    }
                    else
                        return Ok(new { _isResult = false });
                    return Ok(new { _isResult = "IsNotWorkFlow" });
                }
                else
                {
                    return BadRequest();
                }
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        [HttpPost]
        [Route("stopitemoffer")]
        public IHttpActionResult StopItemOffer(WorkFlowItemOfferAC workFlowLogItemOfferAC)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    ItemOffer itemOffer = _iItemRepository.GetItemOfferById(workFlowLogItemOfferAC.ItemOfferId);
                    if (itemOffer != null)
                    {
                        itemOffer.IsActive = false;
                        itemOffer.IsStop = true;
                        _iItemRepository.UpdateItemOffer(itemOffer);
                        return Ok(new { _isResult = true });
                    }
                    else
                        return Ok(new { _isResult = false });
                }
                else
                {
                    return BadRequest();
                }
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        [HttpPost]
        [Route("resumeitemoffer")]
        public IHttpActionResult ResumeItemOffer(WorkFlowItemOfferAC workFlowLogItemOfferAC)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    ItemOffer itemOffer = _iItemRepository.GetItemOfferById(workFlowLogItemOfferAC.ItemOfferId);
                    if (itemOffer != null)
                    {
                        itemOffer.IsActive = true;
                        itemOffer.IsStop = false;
                        _iItemRepository.UpdateItemOffer(itemOffer);
                        return Ok(new { _isResult = true });
                    }
                    else
                        return Ok(new { _isResult = false });
                }
                else
                {
                    return BadRequest();
                }
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        [HttpPost]
        [Route("deleteditemoffer")]
        public IHttpActionResult DeleteItemOffer(WorkFlowItemOfferAC workFlowLogItemOfferAC)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    ItemOffer itemOffer = _iItemRepository.GetItemOfferById(workFlowLogItemOfferAC.ItemOfferId);
                    if (itemOffer != null)
                    {
                        List<WorkFlowDetail> listOfWorkFlowDetail = _iParentRecordsRepository.GetWorkFlowDetailListByParent(StringConstants.DeleteItemOffer, MerchantContext.CompanyDetails.Id);
                        if (listOfWorkFlowDetail.Any())
                        {
                            var activityWorkFlow = listOfWorkFlowDetail.FirstOrDefault(x => x.InitiatorId == MerchantContext.UserDetails.RoleId && x.IsParentAction);
                            if (activityWorkFlow != null)
                            {
                                WorkFlowLog workFlowLog = new WorkFlowLog();
                                workFlowLog.Comments = workFlowLogItemOfferAC.Comment;
                                workFlowLog.CreatedDateTime = DateTime.UtcNow;
                                workFlowLog.RecordId = itemOffer.RecordId;
                                workFlowLog.WorkFlowId = activityWorkFlow.Id;
                                workFlowLog.RoleId = MerchantContext.Permission.RoleId;
                                workFlowLog.UserId = MerchantContext.UserId;
                                workFlowLog.Action = "Deleted";
                                workFlowLog.Stage = (MerchantContext.UserDetails != null ? MerchantContext.UserDetails.RoleName : "") + " " + "Deleted Item Offer";
                                _iParentRecordsRepository.AddWorkFlowLogs(workFlowLog);

                                if (activityWorkFlow.IsClosed || activityWorkFlow.NextActivity.IsClosed)
                                {
                                    itemOffer.IsDeleted = true;
                                    _iItemRepository.UpdateItemOffer(itemOffer);
                                }
                                return Ok(new { _isResult = true });
                            }
                        }
                        return Ok(new { _isResult = "IsNotWorkFlow" });
                    }
                    else
                        return Ok(new { _isResult = false });
                }
                else
                {
                    return BadRequest();
                }
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        [HttpGet]
        [Route("getactionlist")]
        public IHttpActionResult GetActionList(int itemOfferId)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    List<WorkFlowActionAC> listOfWorkFlowActionAc = new List<WorkFlowActionAC>();
                    ItemOffer itemOffer = _iItemRepository.GetItemOfferWithDeletedRecordById(itemOfferId);
                    if (itemOffer != null)
                    {
                        List<WorkFlowLog> listOfWrkFlow = _iParentRecordsRepository.GetListOfWorkFlowLogByRecordId(itemOffer.RecordId);
                        foreach (var item in listOfWrkFlow)
                        {
                            WorkFlowActionAC workFlowActionAc = new WorkFlowActionAC();
                            workFlowActionAc.Id = item.Id;
                            var roleDetail = _iRoleRepository.GetRoleById(item.RoleId);
                            if (roleDetail != null)
                            {
                                workFlowActionAc.Role = roleDetail.RoleName;
                                workFlowActionAc.RoleId = roleDetail.Id;
                            }
                            workFlowActionAc.Comments = item.Comments;
                            workFlowActionAc.ActionDate = item.CreatedDateTime;
                            workFlowActionAc.Action = item.Action;
                            workFlowActionAc.Stage = item.Stage;

                            UserDetail userDetail = _userDetailRepository.GetUserDetailUserId(item.UserId);
                            if (userDetail != null)
                                workFlowActionAc.UserName = userDetail.UserName;

                            listOfWorkFlowActionAc.Add(workFlowActionAc);
                        }
                    }
                    return Ok(listOfWorkFlowActionAc);
                }
                else
                {
                    return BadRequest();
                }
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        [HttpPost]
        [Route("UpdateItemOfferForRemainingQuantiy")]
        public IHttpActionResult UpdateItemOfferForRemainingQuantiy(ItemOffer itemOffer)
        {
            try
            {
                var itemOfferObject = _iItemRepository.UpdateItemOfferForRemainingQuantiy(itemOffer);
                return Ok(itemOfferObject);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        #endregion

        [HttpGet]
        [Route("getallinitiatorofspo")]
        public IHttpActionResult GetAllInitiatorOfSpo()
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    var spoInitiatorCollection = _iItemRepository.GetAllInitiatorOfSpo(MerchantContext.CompanyDetails.Id);
                    return Ok(spoInitiatorCollection);
                }
                else
                {
                    return BadRequest();
                }
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        [HttpGet]
        [Route("genrateCompanyBarcode")]
        public IHttpActionResult GenrateCompanyBarcode()
        {
            if (HttpContext.Current.User.Identity.IsAuthenticated)
            {
                return Ok(new { _isResult = _iItemRepository.GenrateCompanyBarcode(MerchantContext.CompanyDetails.Id) });
            }
            else
            {
                return BadRequest();
            }

        }

        #endregion

        #region Private Method(s)

        /// <summary>
        /// This method used for create Price ICR. -An
        /// </summary>
        /// <param name="itemProfile"></param>
        private void CratePriceICR(ItemProfile itemProfile)
        {
            ItemChangedDetailsAC itemChangedDetailAc = new ItemChangedDetailsAC();
            itemChangedDetailAc.ItemId = itemProfile.Id;
            itemChangedDetailAc.IsPriceChangeRequest = true;
            itemChangedDetailAc.Barcode = itemProfile.Barcode;
            itemChangedDetailAc.ActualQuantity = itemProfile.ActualQuantity;
            itemChangedDetailAc.IsAddItemIcr = true;
            itemChangedDetailAc.ModifyingCostPrice = itemProfile.CostPrice;
            itemChangedDetailAc.ModifyingSellPrice = itemProfile.SellPrice;
            itemChangedDetailAc.ModifyingSellPriceA = itemProfile.SellPriceA;
            itemChangedDetailAc.ModifyingSellPriceB = itemProfile.SellPriceB;
            itemChangedDetailAc.ModifyingSellPriceC = itemProfile.SellPriceC;
            itemChangedDetailAc.ModifyingSellPriceD = itemProfile.SellPriceD;
            _icrContext.SaveICR(itemChangedDetailAc, MerchantContext.UserDetails, MerchantContext.CompanyDetails, null);
        }

        /// <summary>
        /// This method used for get item profile object. -An
        /// </summary>
        /// <param name="childItem"></param>
        /// <returns></returns>
        private SubItemProfileAC GetSubItemProfileAcObject(ItemProfile childItem)
        {
            try
            {
                SubItemProfileAC itemProfileAc = new SubItemProfileAC();
                itemProfileAc.AverageCostPrice = childItem.AverageCostPrice;
                itemProfileAc.Barcode = childItem.Barcode;
                itemProfileAc.BaseUnit = childItem.BaseUnit;
                itemProfileAc.CategoryId = childItem.CategoryId;
                itemProfileAc.Code = childItem.Code;
                itemProfileAc.CostPrice = childItem.CostPrice;
                itemProfileAc.FlavourEn = childItem.FlavourEn;
                itemProfileAc.FlavourSl = childItem.FlavourSl;
                itemProfileAc.HasOffer = childItem.HasOffer;
                itemProfileAc.IsActive = childItem.IsActive;
                itemProfileAc.IsIcrApproved = childItem.IsAutomaticPO;
                itemProfileAc.IsOfferItem = childItem.IsOfferItem;
                itemProfileAc.IsParentItem = childItem.IsParentItem;
                itemProfileAc.ItemNameEn = childItem.ItemNameEn;
                itemProfileAc.ItemNameSl = childItem.ItemNameSl;
                itemProfileAc.ParentItemId = childItem.ParentItemId;
                itemProfileAc.PreviousCostPrice = childItem.PreviousCostPrice;
                itemProfileAc.IsItemChangeRequestGenerated = childItem.IsItemChangeRequestGenerated;
                itemProfileAc.ProfitMargin = childItem.ProfitMargin;
                itemProfileAc.SellPrice = childItem.SellPrice;
                itemProfileAc.SellPriceA = childItem.SellPriceA;
                itemProfileAc.SellPriceB = childItem.SellPriceB;
                itemProfileAc.SellPriceC = childItem.SellPriceC;
                itemProfileAc.SellPriceD = childItem.SellPriceD;
                itemProfileAc.UnitParamTypeId = childItem.UnitParamTypeId;
                itemProfileAc.Id = childItem.Id;
                itemProfileAc.IsIssueInventory = childItem.IsIssueInventory;
                itemProfileAc.ItemType = childItem.Category.BrandParamType.ValueEn + "-" + childItem.Category.GroupParamType.ValueEn;
                itemProfileAc.Unit = childItem.SystemParameter.ValueEn;
                itemProfileAc.HasChildItem = _iItemRepository.CheckAnySubItemIsExists(childItem.Id);
                itemProfileAc.BaseUnitCount = childItem.SystemParameter.ValueEn + " - " + childItem.BaseUnit;
                if (MerchantContext.UserDetails.BranchId != null)
                {
                    var itemQuantity = _iItemRepository.GetItemQuantityByItemId(childItem.Id, Convert.ToInt32(MerchantContext.UserDetails.BranchId));
                    itemProfileAc.SystemQuantity = itemQuantity != null ? itemQuantity.ActualQuantity : 0;
                    itemProfileAc.ActualQuantity = itemProfileAc.SystemQuantity;
                }
                return itemProfileAc;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        //This method used for get sub Item Profile Object. -An
        private ItemProfileAC GetItemProfileAcObject(ItemProfile item)
        {
            try
            {
                ItemProfileAC itemProfileAc = new ItemProfileAC();
                itemProfileAc.AverageCostPrice = item.AverageCostPrice;
                itemProfileAc.Barcode = item.Barcode;
                itemProfileAc.BaseUnit = item.BaseUnit;
                itemProfileAc.CategoryId = item.CategoryId;
                itemProfileAc.BrandId = item.Category.BrandParamTypeId;
                itemProfileAc.GroupId = item.Category.GroupParamTypeId;
                itemProfileAc.Code = item.Code;
                itemProfileAc.CostPrice = item.CostPrice;
                itemProfileAc.FlavourEn = item.FlavourEn;
                itemProfileAc.FlavourSl = item.FlavourSl;
                itemProfileAc.HasOffer = item.HasOffer;
                itemProfileAc.IsActive = item.IsActive;
                itemProfileAc.IsIcrApproved = item.IsIcrApproved;
                itemProfileAc.IsItemChangeRequestGenerated = item.IsItemChangeRequestGenerated;
                itemProfileAc.IsOfferItem = item.IsOfferItem;
                itemProfileAc.IsParentItem = item.IsParentItem;
                itemProfileAc.ItemNameEn = item.ItemNameEn;
                itemProfileAc.ItemNameSl = item.ItemNameSl;
                itemProfileAc.ParentItemId = item.ParentItemId;
                itemProfileAc.PreviousCostPrice = item.PreviousCostPrice;
                itemProfileAc.ProfitMargin = item.ProfitMargin;
                itemProfileAc.SellPrice = item.SellPrice;
                itemProfileAc.SellPriceA = item.SellPriceA;
                itemProfileAc.SellPriceB = item.SellPriceB;
                itemProfileAc.SellPriceC = item.SellPriceC;
                itemProfileAc.SellPriceD = item.SellPriceD;
                itemProfileAc.UnitParamTypeId = item.UnitParamTypeId;
                itemProfileAc.Id = item.Id;
                itemProfileAc.IsIssueInventory = item.IsIssueInventory;
                itemProfileAc.ItemType = item.Category.BrandParamType.ValueEn + "-" + item.Category.GroupParamType.ValueEn;
                itemProfileAc.Unit = item.SystemParameter.ValueEn;
                itemProfileAc.BaseUnitCount = item.SystemParameter.ValueEn + " - " + item.BaseUnit;
                itemProfileAc.HasChildItem = _iItemRepository.CheckAnySubItemIsExists(item.Id);
                if (MerchantContext.UserDetails.BranchId != null)
                {
                    var itemQuantity = _iItemRepository.GetItemQuantityByItemId(item.Id, Convert.ToInt32(MerchantContext.UserDetails.BranchId));
                    itemProfileAc.SystemQuantity = itemQuantity != null ? itemQuantity.ActualQuantity : 0;
                    itemProfileAc.ActualQuantity = Convert.ToInt32(itemProfileAc.SystemQuantity);
                }
                return itemProfileAc;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// this private method used for get expression. -An
        /// </summary>
        /// <param name="var1"></param>
        /// <param name="var2"></param>
        /// <param name="operatorSign"></param>
        /// <param name="itemOffer"></param>
        /// <param name="conditionOperator"></param>
        /// <returns></returns>
        private string GetExpression(string var1, string var2, string operatorSign, ItemOffer itemOffer, CompanyConfiguration conditionOperator)
        {
            try
            {
                string value2 = "";
                string value1 = "";

                if (var1 == "UpperBound" || var1 == "LowerBound")
                {
                    value1 = conditionOperator.GetType().GetProperty(var2).GetValue(conditionOperator, null).ToString();
                    value2 = itemOffer.GetType().GetProperty(var1).GetValue(itemOffer, null).ToString();
                }
                else if (var2 == "UpperBound" || var2 == "LowerBound")
                {
                    value2 = conditionOperator.GetType().GetProperty(var2).GetValue(conditionOperator, null).ToString();
                    value1 = itemOffer.GetType().GetProperty(var1).GetValue(itemOffer, null).ToString();
                }

                string str = (value1 + operatorSign + value2);
                return str;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// This private method used for inset item offer. -An
        /// </summary>
        /// <param name="itemOffer"></param>
        /// <param name="activityWorkFlow"></param>
        private void InsertItemOffer(ItemOffer itemOffer, int branchId, WorkFlowDetail activityWorkFlow)
        {
            try
            {
                if (itemOffer != null)
                {
                    ParentRecord parentRecord = new ParentRecord();
                    parentRecord.BranchId = branchId;
                    parentRecord.CreatedDateTime = DateTime.UtcNow;
                    parentRecord.InitiationComment = itemOffer.Comment;
                    parentRecord.InitiationDate = DateTime.UtcNow;
                    parentRecord.ModificationDate = DateTime.UtcNow;
                    parentRecord.InitiatorId = MerchantContext.UserId;
                    parentRecord.ModifiedUserId = parentRecord.InitiatorId;
                    parentRecord.WorkFlowId = activityWorkFlow.Id;
                    int recordId = _iParentRecordsRepository.AddParentRecords(parentRecord);
                    if (recordId != 0)
                    {
                        WorkFlowLog workFlowLog = new WorkFlowLog();
                        workFlowLog.Comments = itemOffer.Comment;
                        workFlowLog.CreatedDateTime = DateTime.UtcNow;
                        workFlowLog.RecordId = recordId;
                        workFlowLog.RoleId = MerchantContext.Permission.RoleId;
                        workFlowLog.UserId = MerchantContext.UserId;
                        workFlowLog.WorkFlowId = activityWorkFlow.Id;
                        workFlowLog.Action = "inititate";
                        workFlowLog.Stage = (MerchantContext.UserDetails != null ? MerchantContext.UserDetails.RoleName : "") + " " + (activityWorkFlow.Activity != null ? activityWorkFlow.Activity.Name : "");
                        int workFlowId = _iParentRecordsRepository.AddWorkFlowLogs(workFlowLog);
                        if (workFlowId != 0)
                        {
                            itemOffer.CreatedDateTime = DateTime.UtcNow;
                            itemOffer.BranchId = branchId;
                            itemOffer.RecordId = recordId;
                            itemOffer.StartDateTime = itemOffer.StartDateTime.ToLocalTime();
                            itemOffer.RemainingQuantity = itemOffer.QuantityLimit;
                            itemOffer.EndDateTime = itemOffer.EndDateTime.ToLocalTime();
                            itemOffer.IsSupplierInitiate = itemOffer.intiatedId == 1 ? true : false;

                            if (!activityWorkFlow.IsApproval)//check any approval is not exists so item offer is active set true.
                            {
                                List<WorkFlowDetail> listOfWorkFlow = _iParentRecordsRepository.GetWorkFlowDetailByParnetId(activityWorkFlow.Id);
                                if (listOfWorkFlow.Count == 1)
                                {
                                    if (listOfWorkFlow[0].NextActivity.IsClosed)
                                        itemOffer.IsActive = true;
                                }
                                else
                                {
                                    if (activityWorkFlow.NextActivity.Name == StringConstants.Closed)
                                        itemOffer.IsActive = true;
                                }
                            }
                            int itemOfferId = _iItemRepository.AddItemOffer(itemOffer);

                            if (itemOffer.IsActive)
                            {
                                #region Credit Note Creation

                                CreditNoteDetail creditNoteDetail = new CreditNoteDetail();
                                if (itemOffer.IsSupplierInitiate)
                                {
                                    var itemProfile = _iItemRepository.GetItemProfileObjectById(itemOffer.ItemId);
                                    List<CreditNoteDetail> listOfCreditNotes = _ICreditNoteRepository.GetTodayListOfCreditNotes(Convert.ToInt32(itemOffer.BranchId), Convert.ToInt32(CreditNoteType.SupplierItemOfferNote));
                                    DateTime dt = DateTime.UtcNow;
                                    creditNoteDetail.CreditNoteNo = "CR" + dt.Day.ToString() + dt.Month.ToString() + dt.Year.ToString() + (listOfCreditNotes.Count + 1);
                                    creditNoteDetail.BranchId = Convert.ToInt32(itemOffer.BranchId);
                                    creditNoteDetail.CreatedDateTime = dt;
                                    creditNoteDetail.InitiationComment = "Created Credit Notes For Item Offer By" + " " + MerchantContext.UserDetails.UserName;
                                    creditNoteDetail.InitiationDate = dt;
                                    creditNoteDetail.TypeId = Convert.ToInt32(CreditNoteType.SupplierItemOfferNote);
                                    ItemQuantity itemQuantity = _iItemRepository.GetItemQunatityByItemIdAndBranchId(Convert.ToInt32(itemOffer.ItemId), Convert.ToInt32(itemOffer.BranchId));
                                    decimal itemPriceDiffrent = (itemProfile.SellPrice - itemOffer.SellPrice);
                                    if (itemQuantity != null)
                                    {
                                        creditNoteDetail.Amount = (itemPriceDiffrent * itemQuantity.ActualQuantity);
                                        int creditNoteId = _ICreditNoteRepository.AddCreditNoteDetail(creditNoteDetail);
                                        if (creditNoteId != 0)
                                        {
                                            CreditNoteItem creditNoteItem = new CreditNoteItem();
                                            creditNoteItem.CostPrice = itemProfile.CostPrice;
                                            creditNoteItem.CreatedDateTime = DateTime.UtcNow;
                                            creditNoteItem.CreditNoteId = creditNoteId;
                                            creditNoteItem.ItemId = itemOffer.ItemId;
                                            creditNoteItem.Quantity = itemQuantity.ActualQuantity;
                                            _ICreditNoteRepository.AddCreditNotesItem(creditNoteItem);

                                            ItemOfferCreditNote itemOfferCreditNote = new ItemOfferCreditNote();
                                            itemOfferCreditNote.CreatedDateTime = DateTime.UtcNow;
                                            itemOfferCreditNote.CreditNoteId = creditNoteId;
                                            itemOfferCreditNote.ItemOfferId = itemOfferId;
                                            itemOfferCreditNote.SupplierId = Convert.ToInt32(itemOffer.SupplierId);
                                            _ICreditNoteRepository.AddCreditNoteItemOffer(itemOfferCreditNote);
                                        }
                                    }
                                }

                                #endregion

                                #region Insert Into Accounting
                                itemOffer = _iItemRepository.GetItemOfferById(itemOffer.Id);
                                InsertIntoAccounting(itemOffer);

                                #endregion
                            }

                        }
                    }
                }
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// This private method used for update item offer. -An
        /// </summary>
        /// <param name="itemOffer"></param>
        /// <param name="activityWorkFlow"></param>
        private void UpdateItemOffer(UpdateItemOfferAC updateItemOffer, WorkFlowDetail activityWorkFlow)
        {
            try
            {
                ItemOffer newItemOffer = _iItemRepository.GetItemOfferById(updateItemOffer.Id);
                if (newItemOffer != null)
                {
                    newItemOffer.SellPrice = updateItemOffer.SellPrice;
                    newItemOffer.SellPriceA = updateItemOffer.SellPriceA;
                    newItemOffer.SellPriceB = updateItemOffer.SellPriceB;
                    newItemOffer.SellPriceC = updateItemOffer.SellPriceC;
                    newItemOffer.SellPriceD = updateItemOffer.SellPriceD;
                    newItemOffer.StartDateTime = updateItemOffer.StartDateTime;
                    newItemOffer.EndDateTime = updateItemOffer.EndDateTime;
                    newItemOffer.Comment = updateItemOffer.Comment;
                    newItemOffer.QuantityLimit = Convert.ToInt32(updateItemOffer.QuantityLimit);
                    newItemOffer.IsActive = false;
                    int id = _iItemRepository.UpdateItemOffer(newItemOffer);
                    if (id != 0)
                    {
                        WorkFlowLog workFlowLog = new WorkFlowLog();
                        workFlowLog.Comments = updateItemOffer.Comment;
                        workFlowLog.CreatedDateTime = DateTime.UtcNow;
                        workFlowLog.RecordId = newItemOffer.RecordId;
                        workFlowLog.RoleId = MerchantContext.Permission.RoleId;
                        workFlowLog.UserId = MerchantContext.UserId;
                        workFlowLog.WorkFlowId = activityWorkFlow.Id;
                        workFlowLog.Action = "Editing";
                        workFlowLog.Stage = (MerchantContext.UserDetails != null ? MerchantContext.UserDetails.RoleName : "") + " " + "Update Item Offer";
                        int workFlowLogId = _iParentRecordsRepository.AddWorkFlowLogs(workFlowLog);
                    }
                }
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        private void InsertIntoAccounting(ItemOffer itemOffer)
        {
            try
            {
                List<DoubleEntry> listOfDoubleEntry = new List<DoubleEntry>();
                if (itemOffer.IsSupplierInitiate)//check initiatedBySupplier.
                {
                    var ledgersForSupplier = _iAccountingRepository.GetAccountLedgerBySupplier(Convert.ToInt32(itemOffer.SupplierId));
                    var ledgersForCreditNote = _iAccountingRepository.GetAccountLedgerByName(StringConstants.CRNote, Convert.ToInt32(itemOffer.BranchId));
                    if (ledgersForSupplier != null && ledgersForCreditNote != null)
                    {
                        listOfDoubleEntry.Add(new DoubleEntry { LedgerId = ledgersForSupplier.Id, TransactionDate = DateTime.UtcNow, Credit = itemOffer.ItemProfile.CostPrice, Debit = 0, ActivityName = StringConstants.ItemOffer, CreatedDateTime = DateTime.UtcNow });
                        listOfDoubleEntry.Add(new DoubleEntry { LedgerId = ledgersForCreditNote.Id, TransactionDate = DateTime.UtcNow, Credit = 0, Debit = itemOffer.ItemProfile.CostPrice, ActivityName = StringConstants.ItemOffer, CreatedDateTime = DateTime.UtcNow });
                    }
                }
                else
                {
                    var ledgersForMiscExcp = _iAccountingRepository.GetAccountLedgerByName(StringConstants.MiscExp, Convert.ToInt32(itemOffer.BranchId));
                    if (ledgersForMiscExcp != null)
                    {
                        listOfDoubleEntry.Add(new DoubleEntry { LedgerId = ledgersForMiscExcp.Id, TransactionDate = DateTime.UtcNow, Credit = 0, Debit = itemOffer.ItemProfile.CostPrice, ActivityName = StringConstants.ItemOffer, CreatedDateTime = DateTime.UtcNow });
                    }
                }
                if (listOfDoubleEntry.Any())
                    _iAccountingRepository.AddAccountingEntries(listOfDoubleEntry);
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