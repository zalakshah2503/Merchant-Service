using System;
using System.Collections.Generic;
using System.Linq;
using MerchantService.DomainModel.Models.Item;
using MerchantService.DomainModel.Models.Supplier;
using MerchantService.DomainModel.Models.SystemParameters;
using MerchantService.Repository.ApplicationClasses.Supplier;
using MerchantService.Repository.DataRepository;
using MerchantService.Utility.Logger;
using MerchantService.DomainModel.Models.SupplierPurchaseOrder;
using MerchantService.Utility.Constants;
using MerchantService.Utility.Global;

namespace MerchantService.Repository.Modules.Supplier
{
    public class SupplierProfileRepository : ISupplierProfileRepository
    {
        #region Private Variable
        private readonly IDataRepository<SupplierProfile> _supplierProfileContext;
        private readonly IDataRepository<SupplierContactPerson> _supplierContactPersonContext;
        private readonly IDataRepository<SupplierDaysLimit> _supplierDaysLimitContext;
        private readonly IDataRepository<ParamType> _paramTypeContext;
        private readonly IDataRepository<ItemSupplier> _itemSupplierContext;
        private readonly IDataRepository<SupplierPurchaseOrder> _supplierPOContext;
        private readonly IErrorLog _errorLog;
        #endregion

        #region Constructor
        public SupplierProfileRepository(IDataRepository<SupplierProfile> supplierProfileContext, IDataRepository<SupplierContactPerson> supplierContactPersonContext,
            IDataRepository<SupplierDaysLimit> supplierDaysLimitContext, IDataRepository<SupplierPurchaseOrder> supplierPOContext,
            IDataRepository<ItemSupplier> itemSupplierContext, IDataRepository<ParamType> paramTypeContext, IErrorLog errorLog)
        {
            _supplierProfileContext = supplierProfileContext;
            _supplierContactPersonContext = supplierContactPersonContext;
            _supplierDaysLimitContext = supplierDaysLimitContext;
            _paramTypeContext = paramTypeContext;
            _itemSupplierContext = itemSupplierContext;
            _supplierPOContext = supplierPOContext;
            _errorLog = errorLog;
        }
        #endregion

        #region public methods
        /// <summary>
        /// This method is used for insert new supplier profile in database. - JJ
        /// </summary>
        /// <param name="supplierProfile"> object of SupplierProfileAC</param>
        /// <param name="companyId"></param>
        /// <returns>object of SupplierProfileAC</returns>
        public SupplierProfileAC SaveSupplierProfile(SupplierProfileAC supplierProfile, int companyId)
        {
            try
            {
                if (CheckSupplierCodeIdExist(supplierProfile.Code, supplierProfile.Id, companyId))
                {
                    supplierProfile.Code = "";
                    return supplierProfile;
                }
                else if (CheckSupplierPhoneIdExist(supplierProfile.Phone, supplierProfile.Id))
                {
                    supplierProfile.Phone = "";
                    return supplierProfile;
                }
                else if (CheckSupplierEmailIdExist(supplierProfile.Email, supplierProfile.Id))
                {
                    supplierProfile.Email = "";
                    return supplierProfile;
                }
                var supplierProfiles = new SupplierProfile
                {
                    Code = supplierProfile.Code,
                    CompanyId = companyId,
                    NameEn = supplierProfile.NameEn,
                    NameSl = supplierProfile.NameSl,
                    AddressEn = supplierProfile.AddressEn,
                    AddressSl = supplierProfile.AddressSl,
                    Phone = supplierProfile.Phone,
                    Fax = supplierProfile.Fax,
                    Email = supplierProfile.Email,
                    ZipCode = supplierProfile.ZipCode,
                    TotalDaysLimit = supplierProfile.TotalDaysLimit,
                    POBox = supplierProfile.POBox,
                    SupplierTypeId = supplierProfile.SupplierTypeId,
                    IsDeleted = supplierProfile.IsDeleted,
                    IsActive = true,
                    IsAcceptReturnForExpiredItem = supplierProfile.IsAcceptReturnForExpiredItem,
                    CreatedDateTime = DateTime.UtcNow
                };
                _supplierProfileContext.Add(supplierProfiles);
                _supplierProfileContext.SaveChanges();
                supplierProfile.Id = supplierProfiles.Id;
                var creditTypeId = _paramTypeContext.FirstOrDefault(x => x.Param.Value == StringConstants.SupplierType && x.ValueEn == StringConstants.Credit).Id;
                if (supplierProfiles.SupplierTypeId == creditTypeId && supplierProfile.TotalDaysLimit > 0)
                {
                    AddDaysLimit(supplierProfile.DiscountDays, supplierProfiles.Id, supplierProfile.Discount, supplierProfile.Days);
                }
                return supplierProfile;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// This method used for get supplier by id. -An
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public SupplierProfile GetSupplierById(int id)
        {
            try
            {
                return _supplierProfileContext.FirstOrDefault(x => x.Id == id && x.IsDeleted == false);
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
        /// <param name="companyId">currently logged-in user's company id</param>
        /// <returns>list of objects of SupplierProfile</returns>
        public List<SupplierProfile> GetSupplierList(int companyId)
        {
            try
            {
                var listSupplier = _supplierProfileContext.Fetch(x => !x.IsDeleted && x.CompanyId == companyId).ToList();
                return listSupplier;
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
        /// <returns>status</returns>
        public string DeleteSupplierProfile(int id)
        {
            try
            {
                int category = _itemSupplierContext.Fetch(x => x.SupplierId == id && !x.IsDelete).Count();
                if (category == 0)
                {
                    var spoCount = CheckSPOExist(id);
                    if (spoCount == 0)
                    {
                        var deletedSupplier = _supplierProfileContext.GetById(id);
                        deletedSupplier.IsDeleted = true;
                        deletedSupplier.ModifiedDateTime = DateTime.UtcNow;
                        _supplierProfileContext.Update(deletedSupplier);
                        _supplierProfileContext.SaveChanges();
                        return "";
                    }
                    else
                    {
                        return "Supplier cannot be deleted as " + spoCount + " purchase orders are existing for this supplier.";
                    }
                }
                else
                {
                    return "" + category + " Category(s) Are Added with This Supoplier. Please Delete Category(s) First, Then Proceed to Delete Supplier";
                }
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
        /// <param name="companyId"></param>
        /// <returns>object of SupplierProfile</returns>
        public SupplierProfile UpdateSupplier(SupplierProfileAC supplierProfile, int companyId)
        {
            try
            {
                var supplier = _supplierProfileContext.GetById(supplierProfile.Id);
                supplier.Code = supplierProfile.Code;
                supplier.NameEn = supplierProfile.NameEn;
                supplier.NameSl = supplierProfile.NameSl;
                supplier.AddressEn = supplierProfile.AddressEn;
                supplier.AddressSl = supplierProfile.AddressSl;
                supplier.Phone = supplierProfile.Phone;
                supplier.Fax = supplierProfile.Fax;
                supplier.Email = supplierProfile.Email;
                supplier.ZipCode = supplierProfile.ZipCode;
                supplier.POBox = supplierProfile.POBox;
                supplier.SupplierTypeId = supplierProfile.SupplierTypeId;
                supplier.TotalDaysLimit = supplierProfile.TotalDaysLimit;
                supplier.IsDeleted = supplierProfile.IsDeleted;
                supplier.IsActive = supplierProfile.IsActive;
                supplier.IsAcceptReturnForExpiredItem = supplierProfile.IsAcceptReturnForExpiredItem;
                supplier.CreatedDateTime = supplierProfile.CreatedDateTime;
                supplier.ModifiedDateTime = DateTime.UtcNow;
                _supplierProfileContext.Update(supplier);
                _supplierProfileContext.SaveChanges();

                DeleteSupplierDaysLimit(supplierProfile.Id);

                if (supplier.SupplierType.ValueEn == StringConstants.Credit && supplier.TotalDaysLimit > 0)
                {
                    AddDaysLimit(supplierProfile.DiscountDays, supplier.Id, supplierProfile.Discount, supplierProfile.Days);
                }
                return supplier;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }



        /// <summary>
        /// This method is used to add supplier days limit to database - JJ 
        /// </summary>
        /// <param name="DiscountDays"></param>
        /// <param name="SupplierId"></param>
        /// <param name="Discount"></param>
        /// <param name="Days"></param>
        /// <returns>status</returns>
        private string AddDaysLimit(ICollection<DiscountDaysAC> DiscountDays, int SupplierId, decimal Discount, int Days)
        {
            try
            {
                if (DiscountDays == null)
                    DiscountDays = new List<DiscountDaysAC>();

                DiscountDays.Add(new DiscountDaysAC
                {
                    SupplierId = SupplierId,
                    Discount = Discount,
                    Days = Days,
                    CreatedDateTime = DateTime.UtcNow
                });

                DiscountDays = DiscountDays.OrderBy(x => x.Days).ToList();
                foreach (var item in DiscountDays.GroupBy(x => x.Days))
                {
                    var daysLimit = item.First();
                    var limit = new SupplierDaysLimit
                    {
                        SupplierId = SupplierId,
                        Discount = daysLimit.Discount,
                        Days = daysLimit.Days,
                        CreatedDateTime = DateTime.UtcNow
                    };
                    _supplierDaysLimitContext.Add(limit);
                    _supplierDaysLimitContext.SaveChanges();
                }
                return "ok";
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// This method is used to check if supplier with given code and id is  already registered to the system - JJ 
        /// </summary>
        /// <param name="code"></param>
        /// <param name="Id"></param>
        /// <param name="companyId"></param>
        /// <returns>if user with given code and Id exists return true,otherwise false</returns>
        public bool CheckSupplierCodeIdExist(string code, int Id, int companyId)
        {
            try
            {
                return _supplierProfileContext.Fetch(x => x.Code == code && x.Id != Id && x.CompanyId == companyId && x.IsDeleted == false).Any();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }

        }


        /// <summary>
        /// This method is used to check if supplier with given email and id is  already registered to the system - JJ 
        /// </summary>
        /// <param name="email"></param>
        /// <param name="Id"></param>
        /// <returns>if user with given email and Id exists return true,otherwise false</returns>
        public bool CheckSupplierEmailIdExist(string email, int Id)
        {
            try
            {
                if (!string.IsNullOrEmpty(email) && _supplierProfileContext.Fetch(x => x.Email == email && x.Id != Id && x.IsDeleted == false).Any())
                {
                    throw new EmailisAlreadyExists();
                }
                return false;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// This method is used to check if supplier with given phone and id is  already registered to the system - JJ 
        /// </summary>
        /// <param name="phone"></param>
        /// <param name="Id"></param>
        /// <returns>if user with given phone and Id exists return true,otherwise false</returns>
        public bool CheckSupplierPhoneIdExist(string phone, int Id)
        {
            try
            {
                if (!string.IsNullOrEmpty(phone) && _supplierProfileContext.Fetch(x => x.Phone == phone && x.Id != Id && x.IsDeleted == false).Any())
                {
                    throw new PhoneNumberIsAlreadyExists();
                }
                return false;
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
        public List<SupplierContactPerson> GetContactPersonList(int id)
        {
            try
            {
                var listContactPerson = _supplierContactPersonContext.Fetch(x => !x.ContactIsDeleted && x.SupplierId == id).ToList();
                return listContactPerson;
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
        public SupplierContactPerson SaveContactPerson(ContactPersonAC contactPerson)
        {
            try
            {
                var contactPersons = new SupplierContactPerson
                {
                    SupplierId = contactPerson.SupplierId,
                    ContactNameEn = contactPerson.ContactNameEn,
                    ContactNameSl = contactPerson.ContactNameSl,
                    JobTitleEn = contactPerson.JobTitleEn,
                    JobTitleSl = contactPerson.JobTitleSl,
                    ContactAddressEn = contactPerson.ContactAddressEn,
                    ContactAddressSl = contactPerson.ContactAddressSl,
                    ContactPhone = contactPerson.ContactPhone,
                    PhoneExtension = contactPerson.PhoneExtension,
                    ContactFax = contactPerson.ContactFax,
                    ContactEmail = contactPerson.ContactEmail,
                    ContactIsDeleted = contactPerson.ContactIsDeleted,
                    CreatedDateTime = DateTime.UtcNow
                };
                _supplierContactPersonContext.Add(contactPersons);
                _supplierContactPersonContext.SaveChanges();
                contactPerson.ContactId = contactPersons.Id;
                return contactPersons;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// This method is used to know whether Supplier Accept Expired Item. - JJ
        /// </summary>
        /// <param name="SupplierId"> id of supplier</param>
        /// <returns>object of SupplierProfileAC</returns>
        public SupplierProfileAC DoesSupplierAcceptExpiredItem(int SupplierId)
        {
            if (_supplierProfileContext.Fetch(x => x.Id == SupplierId && !x.IsDeleted).ToList().Any())
            {
                var supplier = _supplierProfileContext.FirstOrDefault(x => x.Id == SupplierId && !x.IsDeleted);
                var SupplierProfileAC = new SupplierProfileAC
                {
                    IsAcceptReturnForExpiredItem = supplier.IsAcceptReturnForExpiredItem,
                    IsActive = supplier.IsActive
                };
                return SupplierProfileAC;
            }
            else
            {
                return null;
            }
        }


        /// <summary>
        /// This method is used to update contact person of supplier in database. - JJ
        /// </summary>
        /// <param name="contactPerson">object of ContactPersonAC </param>
        /// <returns>object of SupplierContactPerson </returns>
        public SupplierContactPerson UpdateContact(ContactPersonAC contactPerson)
        {
            try
            {
                var updateContact = _supplierContactPersonContext.GetById(contactPerson.ContactId);

                updateContact.SupplierId = contactPerson.SupplierId;
                updateContact.ContactNameEn = contactPerson.ContactNameEn;
                updateContact.ContactNameSl = contactPerson.ContactNameSl;
                updateContact.ContactAddressEn = contactPerson.ContactAddressEn;
                updateContact.ContactAddressSl = contactPerson.ContactAddressSl;
                updateContact.ContactPhone = contactPerson.ContactPhone;
                updateContact.ContactFax = contactPerson.ContactFax;
                updateContact.ContactEmail = contactPerson.ContactEmail;
                updateContact.PhoneExtension = contactPerson.PhoneExtension;
                updateContact.JobTitleEn = contactPerson.JobTitleEn;
                updateContact.JobTitleSl = contactPerson.JobTitleSl;
                updateContact.ContactIsDeleted = contactPerson.ContactIsDeleted;
                updateContact.ModifiedDateTime = DateTime.UtcNow;
                _supplierContactPersonContext.Update(updateContact);
                _supplierContactPersonContext.SaveChanges();
                return updateContact;
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
        public void DeleteContactPerson(int id)
        {
            try
            {
                var deletedContact = _supplierContactPersonContext.GetById(id);
                deletedContact.ContactIsDeleted = true;
                deletedContact.ModifiedDateTime = DateTime.UtcNow;
                _supplierContactPersonContext.Update(deletedContact);
                _supplierContactPersonContext.SaveChanges();
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
        public List<ParamType> GetSupplierTypeList()
        {
            try
            {
                var paramType = _paramTypeContext.Fetch(x => x.Param.Value == StringConstants.SupplierType).ToList();
                return paramType;
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
        public List<SupplierDaysLimit> GetSupplierDaysLimitById(int Id)
        {
            try
            {
                var supplierDaysLimitList = _supplierDaysLimitContext.Fetch(x => x.SupplierId == Id).ToList();
                return supplierDaysLimitList;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// This method is used to delete supplier days limit from the system - JJ
        /// </summary>
        /// <param name="id">id of supplier</param>
        /// <returns>null</returns>
        public void DeleteSupplierDaysLimit(int id)
        {
            try
            {
                var supplierDaysLimiList = _supplierDaysLimitContext.Fetch(x => x.SupplierId == id).ToList();
                foreach (var cpodelete in supplierDaysLimiList)
                {
                    _supplierDaysLimitContext.Delete(cpodelete.Id);
                    _supplierDaysLimitContext.SaveChanges();
                }
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        ///This method is used to check whether spo of this supplier is in process-JJ
        /// </summary>
        /// <param name="Id">id of supplier</param>
        /// <returns>return no. of spo</returns>
        public int CheckSPOExist(int Id)
        {
            try
            {
                // as we don't have a common wf for spo
                //we must check spo creation, receiving and payment wf
                //n also icr wf

                var spoCount = _supplierPOContext.Fetch(x => x.SupplierId == Id && !x.IsRejected && !x.IsCanceled && !x.IsPaid).Count();
                return spoCount;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        #endregion public methods

        #region Dispose Method
        public void Dispose()
        {
            try
            {
                _supplierProfileContext.Dispose();
                _supplierContactPersonContext.Dispose();
                _supplierDaysLimitContext.Dispose();
                _paramTypeContext.Dispose();
                _itemSupplierContext.Dispose();
                _supplierPOContext.Dispose();
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
