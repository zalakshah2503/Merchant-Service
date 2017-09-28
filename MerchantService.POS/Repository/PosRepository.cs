using MerchantService.Core.HttpClients;
using MerchantService.DomainModel.Models.Customer;
using MerchantService.DomainModel.Models.CustomerPurchaseOrder;
using MerchantService.DomainModel.Models.IncidentReport;
using MerchantService.DomainModel.Models.Item;
using MerchantService.DomainModel.Models.POS;
using MerchantService.DomainModel.Models.SystemParameters;
using MerchantService.POS.Utility;
using MerchantService.Repository.ApplicationClasses.CustomerPO;
using System.Net.Http;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using MerchantService.DomainModel.Models.Globalization;
using MerchantService.Repository.ApplicationClasses.Item;
using MerchantService.DomainModel.Models.Accounting;
using MerchantService.Repository.ApplicationClasses;
using MerchantService.Repository.ApplicationClasses.Admin;
using MerchantService.DomainModel.Models.Branch;
using MerchantService.DomainModel.Models;
using MerchantService.DomainModel.Models.WorkFlow;
using MerchantService.DomainModel.Models.Company;
using MerchantService.POS.Data;
using MerchantService.Repository.ApplicationClasses.Globalization;
using System.Data.Entity;
using MerchantService.Repository.ApplicationClasses.Admin.Company;

namespace MerchantService.POS.Repository
{
    public class PosRepository : IDisposable, IPosRepository
    {
        private IDataRepository<ItemProfile> _itemProfile;
        private IDataRepository<CurrencyDetail> _currency;
        private IDataRepository<BranchDetail> _branchDetail;
        private IDataRepository<SystemParameter> _systemParamter;
        private IDataRepository<PosIncidentReport> _posItemIncident;
        private IDataRepository<IncidentReport> _incidentReport;
        private IDataRepository<CustomerProfile> _customerProfile;
        private IDataRepository<POSTempTrans> _posTempTran;
        private IDataRepository<POSTempTransItem> _posTempTranItems;
        private IDataRepository<SecondaryLanguage> _secondaryLanguage;
        private IDataRepository<GlobalizationDetail> _globalization;
        private IDataRepository<RolePermission> _rolePermission;
        private IDataRepository<POSSession> _posSessions;
        private IDataRepository<POSLoginSession> _posLoginSession;
        private IDataRepository<CashierIncidentReport> _cashierIncidentReport;
        private IDataRepository<POSBill> _posBill;
        private IDataRepository<POSBillItem> _posBillItem;
        private IDataRepository<POSBillPayment> _posBillPayment;
        private IDataRepository<DoubleEntry> _accountEntry;
        private IDataRepository<ItemOffer> _itemOffer;
        private IDataRepository<ItemQuantity> _itemQuantity;
        private IDataRepository<POSReturnBill> _posReturnBill;
        private IDataRepository<CompanyConfiguration> _companyConfiguration;
        private IDataRepository<UserLogin> _userLogin;
        private IDataRepository<UserDetail> _userDetails;
        private IDataRepository<Language> _languageDataRepository;

        public PosRepository()
        {

        }
        public PosRepository(IDataRepository<GlobalizationDetail> globalization,
            IDataRepository<ItemProfile> itemProfile,
        IDataRepository<CurrencyDetail> currency,
        IDataRepository<BranchDetail> branchDetail,
        IDataRepository<SystemParameter> systemParamter,
        IDataRepository<PosIncidentReport> posItemIncident,
        IDataRepository<IncidentReport> incidentReport,
        IDataRepository<CustomerProfile> customerProfile,
        IDataRepository<POSTempTrans> posTempTran,
        IDataRepository<POSTempTransItem> posTempTranItems,
        IDataRepository<SecondaryLanguage> secondaryLanguage,
        IDataRepository<RolePermission> rolePermission,
        IDataRepository<POSSession> posSessions,
        IDataRepository<POSLoginSession> posLoginSession,
        IDataRepository<CashierIncidentReport> cashierIncidentReport,
        IDataRepository<POSBill> posBill,
        IDataRepository<POSBillItem> posBillItem,
        IDataRepository<POSBillPayment> posBillPayment,
        IDataRepository<DoubleEntry> accountEntry,
        IDataRepository<ItemOffer> itemOffer,
        IDataRepository<ItemQuantity> itemQuantity,
        IDataRepository<POSReturnBill> posReturnBill,
        IDataRepository<CompanyConfiguration> companyConfiguration,
        IDataRepository<UserLogin> userLogin,
        IDataRepository<Language> languageDataRepository,
        IDataRepository<UserDetail> userDetails
            )
        {
            _globalization = globalization;
            _userLogin = userLogin;
            _accountEntry = accountEntry;
            _secondaryLanguage = secondaryLanguage;
            _systemParamter = systemParamter;
            _posSessions = posSessions;
            _posBill = posBill;
            _posBillItem = posBillItem;
            _posBillPayment = posBillPayment;
            _posItemIncident = posItemIncident;
            _posLoginSession = posLoginSession;
            _posReturnBill = posReturnBill;
            _itemProfile = itemProfile;
            _incidentReport = incidentReport;
            _userDetails = userDetails;
            _companyConfiguration = companyConfiguration;
            _itemQuantity = itemQuantity;
            _currency = currency;
            _branchDetail = branchDetail;
            _cashierIncidentReport = cashierIncidentReport;
            _customerProfile = customerProfile;
            _itemOffer = itemOffer;
            _posTempTran = posTempTran;
            _posTempTranItems = posTempTranItems;
            _rolePermission = rolePermission;
            _languageDataRepository = languageDataRepository;
        }

        /// <summary>
        /// get all languages
        /// </summary>
        /// <returns>list of languages</returns>
        public List<Language> GetAllLanguage()
        {
            var languagelsit = _languageDataRepository.GetAll().ToList();
            return languagelsit;
        }

        #region "Add Item View Model"

        public int AddUnregisteredItem(ItemProfile item)
        {
            item = _itemProfile.Add(item);
            _itemProfile.SaveChanges();
            return item != null ? item.Id : 0;
        }
        public List<SystemParameter> GetUnitType(int companyId)
        {
            var unitTypeCollection = _systemParamter.Fetch(x => x.ParamId == 3 && x.IsDelete == false &&
                x.CompanyId == companyId).ToList();
            return unitTypeCollection;
        }
        public bool CheckForUniqueItemcode(string itemCode)
        {
            var item = _itemProfile.FirstOrDefault(x => x.Code.Equals(itemCode, StringComparison.InvariantCultureIgnoreCase));
            return item == null;
        }

        #endregion

        #region "Customer View Model"

        public CustomerProfile GetCustomerByMebershipCodeOrMobileNo(string number)
        {
            if (!string.IsNullOrEmpty(number))
            {
                var customer = _customerProfile.FirstOrDefault(x => x.Mobile == number);
                if (customer == null)
                {
                    long membershipCode = Convert.ToInt64(number);
                    customer = _customerProfile.FirstOrDefault(x => x.MembershipCode == membershipCode);
                }
                return customer;
            }
            return null;
        }
        public CustomerPOAC GetCustomerPurchaseOrderInformation(string poNumber)
        {
            HttpClients client = new HttpClients();
            var result = client.GetAsync("api/customerpo/getcustomerpobyponumber?purchaseOrderNumber=" + poNumber);
            if (result.IsSuccessStatusCode)
            {
                var cpoString = result.Content.ReadAsStringAsync().Result;
                var cpo = JsonConvert.DeserializeObject<CustomerPurchaseOrder>(cpoString);
                result = client.GetAsync("api/customerpo/getcustomerpurchaseorderbycpoid?cpoId=" + cpo.Id);
                if (result.IsSuccessStatusCode)
                {
                    var cpoDetailString = result.Content.ReadAsStringAsync().Result;
                    var cpoDetailData = JsonConvert.DeserializeObject<CustomerPOAC>(cpoDetailString);
                    return cpoDetailData;
                }
            }
            return null;
        }
        public POSReturnBill GetPosReturnBillData(string returnBillNo)
        {
            var client = new HttpClients();
            var result = client.GetAsync("api/returnbill/getposreturnbilldatabyreturnbillno?billNo=" + returnBillNo);
            if (result.IsSuccessStatusCode)
                return result.Content.ReadAsAsync<POSReturnBill>().Result;
            return null;
        }

        #endregion

        #region Login Logout View Model"

        public CompanyConfiguration GetCompanyConfigurationByCompanyId(int companyId)
        {
            var companyConfiguration = _companyConfiguration.FirstOrDefault(x => x.CompanyId == companyId);
            return companyConfiguration;
        }
        public List<CurrencyDetail> GetAllCurrencyDetail()
        {
            var getCurrency = _currency.GetAll().ToList();
            return getCurrency;
        }
        public int AddNewPOSLoginSession(POSLoginSession posLoginSession)
        {
            var pos = new POSLoginSession
            {
                CreatedDateTime = DateTime.UtcNow,
                LoginDateTime = DateTime.UtcNow,
                LogoutDateTime = null,
                UserId = posLoginSession.UserId
            };
            _posLoginSession.Add(pos);
            _posLoginSession.SaveChanges();
            return pos.Id;
        }
        public POSLoginSession CheckUserLogoutOrNot(int userId)
        {
            var posLoginObject = _posLoginSession.FirstOrDefault(x => x.UserId == userId && x.LogoutDateTime == null);
            return posLoginObject;
        }
        public int InsertPOSSessionsData(POSSession posSession)
        {
            _posSessions.Add(posSession);
            _posSessions.SaveChanges();
            return posSession.Id;
        }
        public POSLoginSession GetLastLogoutRecordByUserId(int userId)
        {
            var posLoginSessionList = _posLoginSession.GetAll().Where(x => x.UserId == userId).OrderByDescending(x => x.LogoutDateTime).ToList();
            if (posLoginSessionList.Any())
            {
                var posLoginObj = posLoginSessionList[0];
                return posLoginObj;
            }
            return null;
        }
        public POSSession GetPosSessionBySessionLoginId(int userLoginId)
        {
            var posSession = _posSessions.FirstOrDefault(x => x.POSLoginSessionId == userLoginId);
            return posSession;
        }
        public List<IncidentReport> GetIncidentReportList(int companyId)
        {
            return _incidentReport.Fetch(x => x.CompanyId == companyId).ToList();
        }
        public List<GlobalizationDetailAc> GetLanguageWiseLabels(int languageId)
        {
            var globalizationCollection = new List<GlobalizationDetailAc>();
            var globalizationList = _globalization.GetAll();
            if (globalizationList.Any())
            {
                var secondaryLabelList = _secondaryLanguage.GetAll();
                foreach (var globalizationDetail in globalizationList)
                {
                    var globalAc = new GlobalizationDetailAc();
                    globalAc.Key = globalizationDetail.Key;
                    globalAc.ValueEn = globalizationDetail.ValueEn;
                    globalAc.ModuleId = globalizationDetail.ModuleId;
                    if (languageId == 2)
                    {
                        var secondaryLanguageDetails = secondaryLabelList.
                            FirstOrDefault(x => x.GlobalizationDetailId == globalizationDetail.Id);
                        if (secondaryLanguageDetails != null)
                        {
                            globalAc.ValueSl = secondaryLanguageDetails.ValueSl;
                        }
                    }
                    globalizationCollection.Add(globalAc);
                }
            }
            return globalizationCollection;
        }
        public int GetSuspendBillCountByUserId(int UserId)
        {
            return _posTempTran.Fetch(x => x.IsSuspendedBill && x.UserID == UserId).Count();
        }
        public AspNetUsers ValidateLogin(string userName, string password)
        {
            if (SettingHelpers.CheckConnection())
            {
                var httpClient = new HttpClients();
                MerchantService.Repository.ApplicationClasses.LoginViewModel loginViewController = new MerchantService.Repository.ApplicationClasses.LoginViewModel();
                loginViewController.UserName = userName;
                loginViewController.Password = password;
                string jsonString = JsonConvert.SerializeObject(loginViewController);
                var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");
                var response = httpClient.PutAsync("api/poslogin/validatelogin", httpContent);
                if (response.IsSuccessStatusCode)
                {
                    var aspNetUser = response.Content.ReadAsAsync<MerchantService.Repository.ApplicationClasses.AspNetUsers>().Result;
                    if (aspNetUser != null)
                    {
                        AddOrUpdateUserDataInLocalDb(userName, password, aspNetUser.Id);
                    }
                    return aspNetUser;
                }
            }
            else
            {
                var user = _userLogin.FirstOrDefault(x => x.Password == password &&
                     x.Username == userName);
                if (user != null)
                {
                    return new MerchantService.Repository.ApplicationClasses.AspNetUsers()
                    {
                        Id = user.UserId,
                        UserName = user.Username
                    };
                }
            }
            return null;
        }
        private void AddOrUpdateUserDataInLocalDb(string userName, string password, string userId)
        {
            var entity = _userLogin.FirstOrDefault(x => x.Username == userName);
            if (entity != null)
            {
                entity.Username = userName;
                entity.Password = password;
                entity.UserId = userId;
                _userLogin.Update(entity);
            }
            else
                _userLogin.Add(new UserLogin { Username = userName, Password = password, UserId = userId });

            _userLogin.SaveChanges();
        }
        public UserDetail GetUserDetailByAspNetUserId(string userId)
        {
            var user = _userDetails.FirstOrDefault(x => x.UserId == userId
                && x.IsDelete == false && x.IsActive);
            return user;
        }
        public BranchDetailAC GetBranchById(int Id)
        {
            var branchDetail = _branchDetail.GetById(Id);
            if (branchDetail != null)
            {
                var branches = new BranchDetailAC()
                {
                    Id = Id,
                    Name = branchDetail.Name,
                    NameSl = branchDetail.NameSl,
                    Code = branchDetail.Code,
                    Storename = branchDetail.Storename,
                    Email = branchDetail.Email,
                    Fax = branchDetail.Fax,
                    Address = branchDetail.Address,
                    IsAutomaticIssueSPO = branchDetail.IsAutomaticIssueSPO,
                    Phone = branchDetail.Phone,
                    CompanyId = branchDetail.CompanyId,
                    Zipcode = branchDetail.Zipcode,
                    CreatedDateTime = branchDetail.CreatedDateTime,
                };
                return branches;
            }
            return null;
        }
        public List<RolePermission> GetRolPermissionByChildPermissionId(int childPermaissionId, int companyId)
        {
            var listOfRolePermission = new List<RolePermission>();
            listOfRolePermission = _rolePermission.GetAll().Where(x => x.ChildPermissionId == childPermaissionId && x.CompanyId == companyId).ToList();
            return listOfRolePermission;
        }
        public POSSession UpdatePosSessionForEndSeesion(POSSession posSession)
        {
            var posSessionObje = _posSessions.GetById(posSession.Id);
            if (posSessionObje != null)
            {
                posSessionObje.StatusTypeId = posSession.StatusTypeId;
                posSessionObje.ModifiedDateTime = DateTime.UtcNow;
                _posSessions.Update(posSessionObje);
                _posSessions.SaveChanges();
            }
            return posSessionObje;
        }
        public POSLoginSession UpdatePosLoginSessionForEndSession(POSLoginSession posLoginSession)
        {
            var posLoginSessionObj = _posLoginSession.GetById(posLoginSession.Id);
            if (posLoginSessionObj != null)
            {
                posLoginSessionObj.LogoutDateTime = DateTime.UtcNow;
                _posLoginSession.Update(posLoginSession);
                _posLoginSession.SaveChanges();
            }
            return posLoginSessionObj;
        }
        public void UpdateIncidentReportByCashierId(int cashierId)
        {
            var incidentReport = GetCashierIncidentReportList(cashierId);
            if (incidentReport.Count > 0)
            {
                foreach (var cashierIncidnetReport in incidentReport)
                {
                    cashierIncidnetReport.OperationCounter = 0;
                    cashierIncidnetReport.AmountLimit = 0;
                    cashierIncidnetReport.IsRefreshRequset = true;
                    cashierIncidnetReport.IsResetRequest = true;
                    cashierIncidnetReport.ModifiedDateTime = DateTime.UtcNow;
                    UpdateCashierIncidentReport(cashierIncidnetReport);
                }
            }
        }
        public CashierIncidentReport InsertDataInCashierIncidnetReport(CashierIncidentReport cashierIncidentReport)
        {
            _cashierIncidentReport.Add(cashierIncidentReport);
            _cashierIncidentReport.SaveChanges();
            return cashierIncidentReport;
        }
        private void UpdateCashierIncidentReport(CashierIncidentReport cashierIncidentReport)
        {
            cashierIncidentReport.ModifiedDateTime = DateTime.UtcNow;
            _cashierIncidentReport.Update(cashierIncidentReport);
            _cashierIncidentReport.SaveChanges();
        }
        private List<CashierIncidentReport> GetCashierIncidentReportList(int companyId)
        {
            return _cashierIncidentReport.Fetch(x => x.UserDetail.Branch.CompanyId == companyId).ToList();
        }

        #endregion

        #region "Payment View Model"

        public int GetTotalBillDataByBillDate()
        {
            DateTime today = DateTime.UtcNow.Date;
            int count = _posBill.Fetch(x => DbFunctions.TruncateTime(x.CreatedDateTime) == today).Count();
            return count;
        }
        public POSBill InsertPosBillData(POSBill posBill)
        {
            _posBill.Add(posBill);
            _posBill.SaveChanges();
            return posBill;
        }
        public int InsertPosBillItemsData(List<POSItemDetail> itemsData, int posBillId)
        {
            var count = 0;
            foreach (var item in itemsData)
            {
                POSBillItem billItem = new POSBillItem();
                billItem.BillID = posBillId;
                billItem.ItemID = item.ItemId;
                billItem.Quantity = item.ItemQuantity;
                billItem.SellPrice = item.ItemPrice;
                billItem.WeightedCostPrice = 0;
                billItem.ReturnedQuantity = 0;
                billItem.CreatedDateTime = DateTime.UtcNow;

                _posBillItem.Add(billItem);
                _posBillItem.SaveChanges();
                count++;
            }
            return count;
        }
        public int InsertPosBillPaymentData(POSBillPayment posBillPayment)
        {
            _posBillPayment.Add(posBillPayment);
            _posBillPayment.SaveChanges();
            return posBillPayment.Id;
        }
        public POSSession UpdatePosSessionData(POSSession posSession)
        {
            var posSessionObj = _posSessions.GetById(posSession.Id);
            posSessionObj.Cash = posSession.Cash + posSessionObj.Cash;
            posSessionObj.DebitCard = posSession.DebitCard + posSessionObj.DebitCard;
            posSessionObj.CreditCard = posSession.CreditCard + posSessionObj.CreditCard;
            posSessionObj.Coupon = posSession.Coupon + posSessionObj.Coupon;
            posSessionObj.CreditAccount = posSession.CreditAccount + posSessionObj.CreditAccount;
            posSessionObj.Cheque = posSession.Cheque + posSessionObj.Cheque;
            posSessionObj.ModifiedDateTime = DateTime.UtcNow;
            _posSessions.Update(posSessionObj);
            _posSessions.SaveChanges();
            return posSessionObj;
        }
        public bool UpdatePosReturnBillForPOs(POSReturnBill posReturnBill, POSSession posSession)
        {
            var httpClient = new HttpClients();
            var jsonString = JsonConvert.SerializeObject(posReturnBill);
            var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");
            var response = httpClient.PostAsync("api/returnbill/updateposreturnbillforpos", httpContent);
            if (response.IsSuccessStatusCode)
            {
                string jsonPosSession = JsonConvert.SerializeObject(posSession);
                var httpContentPosSession = new StringContent(jsonPosSession, Encoding.UTF8, "application/json");
                var reponsePosSession = httpClient.PostAsync("api/possession/updatepossessionforreturnedbillamount", httpContentPosSession);
                if (!reponsePosSession.IsSuccessStatusCode)
                    return false;
            }
            else
                return false;
            return true;
        }

        #endregion

        #region "Pos View Model"

        public void UpdatePosTempTransForSuspendBill(POSTempTrans posTempTrans)
        {
            var posTempOjb = _posTempTran.GetById(posTempTrans.Id);
            if (posTempOjb != null)
            {
                posTempOjb.IsSuspendedBill = posTempTrans.IsSuspendedBill;
                posTempOjb.TransReference = posTempTrans.TransReference;
                posTempOjb.CustomerID = posTempTrans.CustomerID;
                posTempOjb.ModifiedDateTime = DateTime.UtcNow;
                _posTempTran.Update(posTempOjb);
                _posTempTran.SaveChanges();
            }
        }
        public ItemOffer GetItemOfferByBarCode(string barcode, int branchId)
        {
            return _itemOffer.Fetch(x => x.ItemProfile.Barcode == barcode
                && x.BranchId == branchId && x.IsDeleted == false).ToList().OrderByDescending(y => y.CreatedDateTime).FirstOrDefault();
        }
        public ItemQuantity GetItemQuantityByItemId(int itemId, int branchId)
        {
            var itemQuantity = _itemQuantity.FirstOrDefault(x => x.ItemId == itemId && x.BranchId == branchId);
            return itemQuantity;
        }
        public ItemProfile GetItemProfileByBarcode(string barcode, int branchId)
        {
            return _itemProfile.FirstOrDefault(x => x.Barcode == barcode);
        }
        public List<BalanceBarcodeAc> GetBalanceBarcodeConfiguration(int companyId)
        {
            return SettingHelpers.BalanceBarcodeConfigurationObject;
        }
        public List<POSTempTransItem> GetPosTempTransItemByTempTransId(int tempTransId)
        {
            List<POSTempTransItem> PosTempItemList = _posTempTranItems.GetAll().Where(x => x.TempTransID == tempTransId).ToList();
            return PosTempItemList;
        }
        public POSTempTrans GetPOSTempTransByUserId(int userId)
        {
            var PosTempTransObj = _posTempTran.GetAll().Where(x => x.UserID == userId && !x.IsSuspendedBill).FirstOrDefault();
            return PosTempTransObj;
        }
        public POSTempTrans GetPosTempTransByTransId(int transId)
        {
            var posTransObj = _posTempTran.GetById(transId);
            return posTransObj;
        }
        public CashierIncidentReport GetCashierIncidentReportByCashierId(int cashierId)
        {
            var cashierRecordObj = _cashierIncidentReport.Fetch(x => x.UserId == cashierId).FirstOrDefault();
            return cashierRecordObj;
        }

        #endregion

        #region "Suspend/Unsuspend View Model"

        public List<POSTempTrans> GetSuspendBillList(int userId)
        {
            return _posTempTran.Fetch(x => x.IsSuspendedBill && x.UserID == userId).ToList();
        }

        #endregion

        #region "Common Methods"

        private bool CheckForExistingIncident(int itemId, int incidentType)
        {
            var existingIncident = _posItemIncident.FirstOrDefault(x => x.ItemId == itemId
                  && x.IncidentType == incidentType && x.IsProcess);
            return existingIncident == null;
        }
        public POSTempTrans AddPosTempTransaction(POSTempTrans posTempTran)
        {
            var item = _posTempTran.Add(posTempTran);
            _posTempTran.SaveChanges();
            return item;
        }
        public POSTempTransItem AddPosTempTranItem(POSTempTransItem posTempTransItem)
        {
            var item = _posTempTranItems.Add(posTempTransItem);
            _posTempTranItems.SaveChanges();
            return item;
        }
        public POSTempTransItem UpdatePosTempTransItem(POSTempTransItem posTempItem)
        {
            var posTempObj = _posTempTranItems.
                FirstOrDefault(x => x.Barcode == posTempItem.Barcode
                    && x.IsOfferItem == posTempItem.IsOfferItem
                    && x.TempTransID == posTempItem.TempTransID);

            if (posTempObj != null)
            {
                posTempObj.Quantity = posTempItem.Quantity;
                posTempItem.ModifiedDateTime = DateTime.UtcNow;
                _posTempTranItems.Update(posTempObj);
                _posTempTranItems.SaveChanges();
            }
            return posTempObj;
        }
        public void DeletePosTempTranscation(int tempTransId)
        {
            _posTempTran.Delete(tempTransId);
            _posTempTran.SaveChanges();
        }
        public void DeleteAllPOSTempTransItem(int tempTransId)
        {
            List<POSTempTransItem> posTempItemList = _posTempTranItems.GetAll().Where(x => x.TempTransID == tempTransId).ToList();
            if (posTempItemList.Count > 0)
            {
                foreach (var item in posTempItemList)
                {
                    _posTempTranItems.Delete(item.Id);
                    _posTempTranItems.SaveChanges();
                }
            }
        }
        public void DeletePOSTempIransItem(POSTempTransItem posTempTransItem)
        {
            var tempItem = _posTempTranItems.GetAll().
                Where(x => x.Barcode == posTempTransItem.Barcode
                    && x.TempTransID == posTempTransItem.TempTransID
                    && x.Quantity == posTempTransItem.Quantity &&
                    x.IsOfferItem == posTempTransItem.IsOfferItem)
                .FirstOrDefault();
            if (tempItem != null)
            {
                _posTempTranItems.Delete(tempItem.Id);
                _posTempTranItems.SaveChanges();
            }
        }
        public void DeletePOSTempIransItemByBarcode(POSTempTransItem posTempTransItem)
        {
            var posTempItemList = _posTempTranItems.Fetch(x => x.Barcode == posTempTransItem.Barcode
                && x.TempTransID == posTempTransItem.TempTransID).ToList();
            if (posTempItemList.Any())
            {
                foreach (var item in posTempItemList)
                {
                    _posTempTranItems.Delete(item.Id);
                    _posTempTranItems.SaveChanges();
                }
            }
        }
        public bool UpdateItemQuantityForPOS(int itemId, int Quantity, int branchId, int currentUserId)
        {
            ItemQuantity itemQuantityObj = _itemQuantity.FirstOrDefault(x => x.ItemId == itemId && x.BranchId == branchId);
            if (itemQuantityObj != null)
            {
                if ((itemQuantityObj.ActualQuantity - Quantity) <= 0)
                {
                    itemQuantityObj.ActualQuantity = 0;
                    if (itemQuantityObj.ItemProfile.IsOfferItem)
                    {
                        itemQuantityObj.ItemProfile.IsActive = false;
                        itemQuantityObj.ItemProfile.ModifiedDateTime = DateTime.UtcNow;
                    }
                }
                else
                    itemQuantityObj.ActualQuantity = (itemQuantityObj.ActualQuantity - Quantity);
                itemQuantityObj.ModifiedDateTime = DateTime.UtcNow;
                _itemQuantity.Update(itemQuantityObj);
                _itemQuantity.SaveChanges();
                return true;
            }
            return false;
        }
        public bool AddAccountingEntries(List<DoubleEntry> listOfAccountEntry)
        {
            foreach (var accountEntry in listOfAccountEntry)
            {
                _accountEntry.Add(accountEntry);
                _accountEntry.SaveChanges();
            }
            return true;
        }
        public void InsertPosIncidentReport(PosIncidentReport posIncidentReport)
        {
            if (CheckForExistingIncident(posIncidentReport.ItemId, posIncidentReport.IncidentType))
            {
                _posItemIncident.Add(posIncidentReport);
                _posItemIncident.SaveChanges();
            }
        }

        #endregion

        public void Dispose()
        {
        }
    }
}
