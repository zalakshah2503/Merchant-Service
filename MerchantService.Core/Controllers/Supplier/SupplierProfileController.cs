using MerchantService.Core.Global;
using MerchantService.DomainModel.Models.Accounting;
using MerchantService.DomainModel.Models.Supplier;
using MerchantService.DomainModel.Models.SystemParameters;
using MerchantService.Repository.ApplicationClasses.Supplier;
using MerchantService.Repository.Helper;
using MerchantService.Repository.Modules.Account;
using MerchantService.Repository.Modules.Global;
using MerchantService.Repository.Modules.Supplier;
using MerchantService.Utility.Constants;
using MerchantService.Utility.Global;
using MerchantService.Utility.Logger;
using System;
using System.Collections.Generic;
using System.Web;
using System.Web.Http;


namespace MerchantService.Core.Controllers.Supplier
{
    //[DynamicAuthorize]
    [RoutePrefix("api/supplierprofile")]
    public class SupplierProfileController : BaseController
    {
        #region Private Variable
        private readonly IErrorLog _errorLog;
        private readonly ISupplierProfileRepository _supplierProfileContext;
        private readonly IAccountingRepository _iAccountingRepository;
        private readonly int companyId;
        private readonly ILedgerAccountRepository _iLedgerAccountRepository;

        #endregion

        #region Constructor
        public SupplierProfileController(IErrorLog errorLog, ILedgerAccountRepository iLedgerAccountRepository, ISupplierProfileRepository supplierProfileRepository, IMerchantDataRepository merchantDataRepository, IAccountingRepository iAccountingRepository)
            : base(errorLog, merchantDataRepository)
        //inorder to get companyid i changed apicontroller to basecontroller and inherited base()
        {
            _errorLog = errorLog;
            _iAccountingRepository = iAccountingRepository;
            _supplierProfileContext = supplierProfileRepository;
            _iLedgerAccountRepository = iLedgerAccountRepository;
            companyId = MerchantContext.CompanyDetails.Id;
        }
        #endregion

        #region Public Method

        /// <summary>
        /// This method is used for insert new supplier profile in database. - JJ
        /// </summary>
        /// <param name="supplierProfile"> object of SupplierProfileAC</param>
        /// <returns>object of SupplierProfileAC</returns>
        [HttpPost]
        [Route("savesupplier")]
        public IHttpActionResult SaveSupplier(SupplierProfileAC supplier)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    if (MerchantContext.Permission.IsAllowToCreateSupplierProfile)
                    {
                        var supplierProfileAC = _supplierProfileContext.SaveSupplierProfile(supplier, companyId);
                        if (supplierProfileAC != null && supplierProfileAC.Id > 0)
                        {
                            Ledgers ledgers = new Ledgers();
                            ledgers.Address = supplierProfileAC.AddressEn;
                            ledgers.State = "Gujarat";
                            ledgers.CompanyId = MerchantContext.CompanyDetails.Id;
                            ledgers.LedgerName = supplierProfileAC.NameEn + "Ledgers";
                            ledgers.Name = ledgers.LedgerName;
                            ledgers.CreatedDateTime = DateTime.UtcNow;
                            ledgers.GroupId = 6;
                            ledgers.ParentLedgerId = null;
                            ledgers.Balance = 0;
                            ledgers.SuplierId = supplierProfileAC.Id;
                            _iAccountingRepository.AddAccountLedger(ledgers);
                        }
                        return Ok(supplierProfileAC);
                    }
                    else
                        return Ok(new { status = StringConstants.PermissionDenied });
                }
                else
                    return BadRequest();
            }
            catch (PhoneNumberIsAlreadyExists)
            {
                return BadRequest("PhoneNumberIsAlreadyExists");
            }
            catch (EmailisAlreadyExists)
            {
                return BadRequest("EmailisAlreadyExists");
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// This method is used for fetching supplier list from database. - JJ
        /// </summary>       
        /// <returns>list of objects of SupplierProfileAC</returns>
        [HttpGet]
        [Route("getsupplierprofilelist")]
        public IHttpActionResult GetSupplierProfileList()
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    var supplierList = _supplierProfileContext.GetSupplierList(companyId);
                    var supplierCollection = new List<SupplierProfileAC>();
                    var supplierAC = new SupplierProfileAC();
                    foreach (var supplier in supplierList)
                    {
                        supplierAC = ApplicationClassHelper.ConvertType<SupplierProfile, SupplierProfileAC>(supplier);
                        supplierAC.Id = supplier.Id;
                        supplierAC.IsAcceptReturnForExpiredItem = supplier.IsAcceptReturnForExpiredItem;
                        supplierCollection.Add(supplierAC);
                    }
                    return Ok(supplierCollection);
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
        /// This method is used to delete supplier from the database by setting IsDeleted to true - JJ
        /// </summary>
        /// <param name="id">id of the supplier</param>      
        /// <returns>null</returns>

        [Route("deletesupplierprofile")]
        [HttpGet]
        public IHttpActionResult DeleteSupplierProfile(int id)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    if (MerchantContext.Permission.IsAllowToDeleteSupplier)
                    {
                        string status = _supplierProfileContext.DeleteSupplierProfile(id);
                        return Ok(new { status = status });
                    }
                    else
                        return Ok(new { status = StringConstants.PermissionDenied });
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
        /// This method is used to update supplier profile in database. - JJ
        /// </summary>
        /// <param name="supplierProfile"> object of SupplierProfileAC</param>
        /// <returns>object of SupplierProfile</returns>
        [HttpPut]
        [Route("updatesupplierprofile")]
        public IHttpActionResult UpdateSupplierProfile(SupplierProfileAC supplier)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    if (MerchantContext.Permission.IsAllowToEditSupplierProfile)
                    {
                        if (_supplierProfileContext.CheckSupplierPhoneIdExist(supplier.Phone, supplier.Id))
                        {
                            supplier.Phone = "";
                            return Ok(new { supplier });
                        }
                        else if (_supplierProfileContext.CheckSupplierEmailIdExist(supplier.Email, supplier.Id))
                        {
                            supplier.Email = "";
                            return Ok(new { supplier });
                        }
                        var supplierProfile = _supplierProfileContext.UpdateSupplier(supplier, companyId);
                        Ledgers supplierLedgers = _iLedgerAccountRepository.GerLedgersBySupplierId(companyId, supplier.Id);
                        if (supplierLedgers == null)
                        {
                            Ledgers ledgers = new Ledgers();
                            ledgers.Address = supplierProfile.AddressEn;
                            ledgers.State = "Gujarat";
                            ledgers.CompanyId = MerchantContext.CompanyDetails.Id;
                            ledgers.LedgerName = supplierProfile.NameEn + "Ledgers";
                            ledgers.Name = ledgers.LedgerName;
                            ledgers.CreatedDateTime = DateTime.UtcNow;
                            ledgers.GroupId = 6;
                            ledgers.ParentLedgerId = null;
                            ledgers.Balance = 0;
                            ledgers.SuplierId = supplierProfile.Id;
                            _iAccountingRepository.AddAccountLedger(ledgers);
                        }
                        return Ok(supplierProfile);
                    }
                    else
                        return Ok(new { status = StringConstants.PermissionDenied });
                }
                else
                    return BadRequest();
            }
            catch (PhoneNumberIsAlreadyExists)
            {
                return BadRequest("PhoneNumberIsAlreadyExists");
            }
            catch (EmailisAlreadyExists)
            {
                return BadRequest("EmailisAlreadyExists");
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// This method is used for getting list of contact persons of suppliers. - JJ
        /// </summary>
        /// <param "id">id of supplier</param>
        /// <returns>List of object of SupplierContactPerson</returns>
        [HttpGet]
        [Route("getcontactpersonlist")]
        public IHttpActionResult GetContactPersonList(int id)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    var contactPersonList = _supplierProfileContext.GetContactPersonList(id);
                    var contactPersonCollection = new List<ContactPersonAC>();
                    var contactAC = new ContactPersonAC();
                    foreach (var contact in contactPersonList)
                    {
                        contactAC = ApplicationClassHelper.ConvertType<SupplierContactPerson, ContactPersonAC>(contact);
                        contactAC.ContactId = contact.Id;
                        contactPersonCollection.Add(contactAC);
                    }
                    return Ok(contactPersonCollection);
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
        /// This method is used for insert new contact person of supplier in database. - JJ
        /// </summary>
        /// <param name="contactPerson">object of SupplierProfileAC </param>
        /// <returns>object of SupplierContactPerson </returns>
        [HttpPost]
        [Route("savecontactperson")]
        public IHttpActionResult saveContactPerson(ContactPersonAC contact)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    _supplierProfileContext.SaveContactPerson(contact);
                    return Ok(contact);
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
        /// This method is used to update contact person of supplier in database. - JJ
        /// </summary>
        /// <param name="contactPerson">object of SupplierProfileAC </param>
        /// <returns>object of SupplierContactPerson </returns>
        [HttpPut]
        [Route("updatecontactperson")]
        public IHttpActionResult UpdateContactPerson(ContactPersonAC contact)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    var contactPerson = _supplierProfileContext.UpdateContact(contact);
                    return Ok(contactPerson);
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
        /// This method is used to delete contact person from the system by setting ContactIsDeleted to true - JJ
        /// </summary>
        /// <param name="id">id of contact person</param>  
        /// <returns>null</returns>

        [Route("deletecontactperson")]
        [HttpGet]
        public IHttpActionResult DeleteContactPerson(int id)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    _supplierProfileContext.DeleteContactPerson(id);
                    return Ok();
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
        /// This method is used for getting list of supplier types. - JJ
        /// </summary>
        /// <returns>List of objects of ParamType</returns>
        [HttpGet]
        [Route("getsuppliertypelist")]
        public IHttpActionResult GetSupplierTypeList()
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    var supplierTypeList = _supplierProfileContext.GetSupplierTypeList();
                    var supplierTypeCollection = new List<ParamTypeAC>();
                    var supplierTypeAC = new ParamTypeAC();
                    foreach (var type in supplierTypeList)
                    {
                        supplierTypeAC = ApplicationClassHelper.ConvertType<ParamType, ParamTypeAC>(type);
                        supplierTypeAC.Id = type.Id;
                        supplierTypeCollection.Add(supplierTypeAC);
                    }
                    return Ok(supplierTypeCollection);
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
        ///This method is used to getsupplier days limit of the supplier Id -JJ
        /// </summary>
        /// <param name="Id">id of supplier</param>
        /// <returns>return list of objects of SupplierDaysLimit</returns>
        [Route("getsupplierdayslimitbyid")]
        [HttpGet]
        public IHttpActionResult GetSupplierDaysLimitById(int id)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    var dayslimit = _supplierProfileContext.GetSupplierDaysLimitById(id);
                    return Ok(dayslimit);
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
        /// This method is used to delete supplier from the database by setting IsDeleted to true - JJ
        /// </summary>
        /// <param name="id">id of the supplier</param>      
        /// <returns>null</returns>
        [Route("checkspoexist")]
        [HttpGet]
        public IHttpActionResult CheckSPOExist(int id)
        {
            try
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    var spoCount = _supplierProfileContext.CheckSPOExist(id);
                    return Ok(new { spoCount = spoCount });
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
        #endregion
    }
}
