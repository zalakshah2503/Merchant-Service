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
using System.Threading.Tasks;
using MerchantService.DomainModel.Models.Globalization;
using MerchantService.Repository.ApplicationClasses.Item;
using MerchantService.DomainModel.Models.Accounting;
using MerchantService.Repository.ApplicationClasses;
using MerchantService.Repository.ApplicationClasses.Admin;
using MerchantService.DomainModel.Models.Branch;
using MerchantService.DomainModel.Models;
using MerchantService.DomainModel.Models.WorkFlow;
using MerchantService.DomainModel.Models.Company;
using MerchantService.Repository.ApplicationClasses.Admin.IncidentReport;
using MerchantService.POS.Data;
using MerchantService.Repository.ApplicationClasses.Globalization;
using MerchantService.Repository.ApplicationClasses.Admin.Company;

namespace MerchantService.POS.Repository
{
    public class PosRepositoryOnline : IDisposable, IPosRepository
    {
        HttpClients httpClient;
        public PosRepositoryOnline()
        {
            httpClient = new HttpClients();
        }

        #region "Add Item View Model"

        public int AddUnregisteredItem(ItemProfile item)
        {
            var jsonString = JsonConvert.SerializeObject(item);
            var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");
            var response = httpClient.PostAsync("api/item/insertitemprofileforpos", httpContent);
            if (response.IsSuccessStatusCode)
                return response.Content.ReadAsAsync<int>().Result;
            return 0;
        }
        public List<SystemParameter> GetUnitType(int companyId)
        {
            var response = httpClient.GetAsync("api/item/getlistofunittypebycompanyidforpos?currentCompanyId=" + companyId);
            if (response.IsSuccessStatusCode)
            {
                var unitTypeData = response.Content.ReadAsAsync<List<SystemParameter>>().Result;
                return unitTypeData;
            }
            return null;
        }
        public bool CheckForUniqueItemcode(string itemCode)
        {
            var response = httpClient.GetAsync("api/item/checkforuniqueitemCode?itemCode=" + itemCode);
            if (response.IsSuccessStatusCode)
            {
                return response.Content.ReadAsAsync<bool>().Result;
            }
            return true;
        }

        #endregion

        #region "Customer View Model"

        public CustomerProfile GetCustomerByMebershipCodeOrMobileNo(string number)
        {
            var response = httpClient.GetAsync("api/customer/getcustomerbymebershipcodeormobileno?number=" + number);
            if (response.IsSuccessStatusCode)
            {
                string data = response.Content.ReadAsStringAsync().Result;
                return JsonConvert.DeserializeObject<CustomerProfile>(data);
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
            var companyConfigurationResponse = httpClient.GetAsync("api/Company/GetCompanyConfigruationByCompanyId?companyId=" + companyId);
            if (companyConfigurationResponse.IsSuccessStatusCode)
            {
                var companyString = companyConfigurationResponse.Content.ReadAsStringAsync().Result;
                return JsonConvert.DeserializeObject<CompanyConfiguration>(companyString);
            }
            return null;
        }
        public List<CurrencyDetail> GetAllCurrencyDetail()
        {
            var currencyResponse = httpClient.GetAsync("api/Company/getAllCurrencyDetail");
            if (currencyResponse.IsSuccessStatusCode)
            {
                return currencyResponse.Content.ReadAsAsync<List<CurrencyDetail>>().Result;
            }
            return null;
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
            string jsonStringPosSession = JsonConvert.SerializeObject(pos);
            var httpContentPosSession = new StringContent(jsonStringPosSession, Encoding.UTF8, "application/json");
            var response = httpClient.PostAsync("api/possession/insertposloginsession", httpContentPosSession);
            if (response.IsSuccessStatusCode)
            {
                var data = response.Content.ReadAsAsync<POSLoginSession>().Result;
                return data.Id;
            }
            return 0;
        }
        public POSLoginSession CheckUserLogoutOrNot(int userId)
        {
            var response = httpClient.GetAsync("api/possession/checkuserlogoutornot?userId=" + userId);
            if (response.IsSuccessStatusCode)
            {
                var data = response.Content.ReadAsAsync<POSLoginSession>().Result;
                return data;
            }
            return null;
        }
        public int InsertPOSSessionsData(POSSession posSession)
        {
            string posSessionJsonString = JsonConvert.SerializeObject(posSession);
            var httpContent = new StringContent(posSessionJsonString, Encoding.UTF8, "application/json");

            var posSesionResponse = httpClient.PostAsync("api/possession/insertpossession", httpContent);
            if (posSesionResponse.IsSuccessStatusCode)
            {
                var posSessionData = posSesionResponse.Content.ReadAsAsync<POSSession>().Result;
                return posSessionData.Id;
            }
            return 0;
        }
        public POSLoginSession GetLastLogoutRecordByUserId(int userId)
        {
            var posLoginResponse = httpClient.GetAsync("api/possession/getlastlogoutrecordbyuserid?userId=" + userId);
            if (posLoginResponse.IsSuccessStatusCode)
            {
                return posLoginResponse.Content.ReadAsAsync<POSLoginSession>().Result;
            }
            return null;
        }
        public POSSession GetPosSessionBySessionLoginId(int userLoginId)
        {
            var responsePosSession = httpClient.GetAsync("api/possession/getpossessionbysessionloginid?userLoginId=" + userLoginId);
            if (responsePosSession.IsSuccessStatusCode)
            {
                return responsePosSession.Content.ReadAsAsync<POSSession>().Result;
            }
            return null;
        }
        public List<IncidentReport> GetIncidentReportList(int companyId)
        {
            var reponseIncidentReport = httpClient.GetAsync("api/incidentreport/getincidentreportforposbycompanyid?companyId=" + companyId);
            {
                return reponseIncidentReport.Content.ReadAsAsync<List<IncidentReport>>().Result;
            }
        }
        public List<GlobalizationDetailAc> GetLanguageWiseLabels(int languageId)
        {
            var labelDetails = httpClient.GetAsync("api/posprocess/getglobalizationdetails?languageId=" + languageId);
            if (labelDetails.IsSuccessStatusCode)
            {
                return labelDetails.Content.ReadAsAsync<List<GlobalizationDetailAc>>().Result;
            }
            return null;
        }
        public List<Language> GetAllLanguage()
        {
            var labelDetails = httpClient.GetAsync("api/posprocess/getalllanguage");
            if (labelDetails.IsSuccessStatusCode)
            {
                return labelDetails.Content.ReadAsAsync<List<Language>>().Result;
            }
            return null;
        }
        public int GetSuspendBillCountByUserId(int userId)
        {
            var suspendBillResponse = httpClient.GetAsync("api/posprocess/getsuspendbillcountbyuserid?UserId=" + userId);
            if (suspendBillResponse.IsSuccessStatusCode)
            {
                return suspendBillResponse.Content.ReadAsAsync<int>().Result;
            }
            return 0;
        }
        public AspNetUsers ValidateLogin(string userName, string password)
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
                    AddOrUpdateUserDataInLocalDb(userName, password);
                }
                return aspNetUser;
            }
            return null;
        }
        private void AddOrUpdateUserDataInLocalDb(string userName, string password)
        {
            //var entity = _userLoginLD.FirstOrDefault(x => x.Username == userName);
            //if (entity != null)
            //{
            //    entity.Username = userName;
            //    entity.Password = password;
            //    _userLoginLD.Update(entity);
            //}
            //else
            //    _userLoginLD.Add(new UserLogin { Username = userName, Password = password });

            //_userLoginLD.SaveChanges();
        }
        public UserDetail GetUserDetailByAspNetUserId(string userId)
        {
            var httpClient = new HttpClients();
            var userDetailResponse = httpClient.GetAsync("api/UserDetail/GetUserDetailByAspNetUserId?userId=" + userId);
            if (userDetailResponse.IsSuccessStatusCode)
            {
                var userDetailString = userDetailResponse.Content.ReadAsStringAsync().Result;
                var userDetail = JsonConvert.DeserializeObject<UserDetail>(userDetailString);
                return userDetail;
            }
            return null;
        }
        public BranchDetailAC GetBranchById(int id)
        {
            var branchResponse = httpClient.GetAsync("api/Branch/getBranchById?branchId=" + id);
            if (branchResponse.IsSuccessStatusCode)
            {
                string branchData = branchResponse.Content.ReadAsStringAsync().Result;
                return JsonConvert.DeserializeObject<BranchDetailAC>(branchData);
            }
            return null;

        }
        public List<RolePermission> GetRolPermissionByChildPermissionId(int childPermaissionId, int companyId)
        {
            var rolepermissionResponse = httpClient.GetAsync("api/RolePermission/GetRolPermissionByChildPermissionId?childPermissionId=" + childPermaissionId + "&companyId=" + companyId);
            if (rolepermissionResponse.IsSuccessStatusCode)
            {
                string rolePermissionString = rolepermissionResponse.Content.ReadAsStringAsync().Result;
                return JsonConvert.DeserializeObject<List<RolePermission>>(rolePermissionString);
            }
            return null;
        }
        public POSSession UpdatePosSessionForEndSeesion(POSSession posSession)
        {
            var jsonString = JsonConvert.SerializeObject(posSession);
            var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");
            var response = httpClient.PostAsync("api/possession/updatepossessionforendseesion", httpContent);
            if (response.IsSuccessStatusCode)
            {
                return response.Content.ReadAsAsync<POSSession>().Result;
            }
            return null;
        }
        public POSLoginSession UpdatePosLoginSessionForEndSession(POSLoginSession posLoginSession)
        {
            var jsonPosLoginSession = JsonConvert.SerializeObject(posLoginSession);
            var httpContentPosLogin = new StringContent(jsonPosLoginSession, Encoding.UTF8, "application/json");
            var posLoginResponse = httpClient.PostAsync("api/possession/updateposloginsessionforendsession", httpContentPosLogin);
            return null;
        }
        public void UpdateIncidentReportByCashierId(int cashierId)
        {
            httpClient.GetAsync("api/incidentreport/updatecashierincidentreportbycashier?cashierId=" + cashierId);
        }
        public CashierIncidentReport InsertDataInCashierIncidnetReport(CashierIncidentReport cashierIncidentReport)
        {
            string jsonString = JsonConvert.SerializeObject(cashierIncidentReport);
            var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");
            var responseCahierIncident = httpClient.PostAsync("api/incidentreport/insertdataincashierincidnetreport", httpContent);
            if (responseCahierIncident.IsSuccessStatusCode)
            {
                return responseCahierIncident.Content.ReadAsAsync<CashierIncidentReport>().Result;
            }
            return null;
        }
        private void UpdateCashierIncidentReport(CashierIncidentReport cashierIncidentReport)
        {
            //cashierIncidentReport.ModifiedDateTime = DateTime.UtcNow.ToString();
            //_cashierIncidentReport.Update(cashierIncidentReport);
            //_cashierIncidentReport.SaveChanges();
        }
        private List<CashierIncidentReport> GetCashierIncidentReportList(int companyId)
        {
            return null;
            //return _cashierIncidentReport.Fetch(x => x.UserDetail.Branch.CompanyId == companyId).ToList();
        }

        #endregion

        #region "Payment View Model"

        public int GetTotalBillDataByBillDate()
        {
            var billCountResponse = httpClient.GetAsync("api/posprocess/gettotalbilldatabybilldate");
            if (billCountResponse.IsSuccessStatusCode)
                return billCountResponse.Content.ReadAsAsync<int>().Result;
            return 0;
        }
        public POSBill InsertPosBillData(POSBill posBill)
        {
            var jsonString = JsonConvert.SerializeObject(posBill);
            var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");
            var response = httpClient.PostAsync("api/posprocess/insertposbilldata", httpContent);
            if (response.IsSuccessStatusCode)
            {
                return response.Content.ReadAsAsync<POSBill>().Result;
            }
            return null;
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

                string jsonBillItem = JsonConvert.SerializeObject(billItem);
                var httpContentItem = new StringContent(jsonBillItem, Encoding.UTF8, "application/json");
                var billItemResponse = httpClient.PostAsync("api/posprocess/insertposbillitemsdata", httpContentItem);
                count++;
            }
            return count;
        }
        public int InsertPosBillPaymentData(POSBillPayment posBillPayment)
        {
            var jsonPayment = JsonConvert.SerializeObject(posBillPayment);
            var httpContentPayment = new StringContent(jsonPayment, Encoding.UTF8, "application/json");
            var paymentResponse = httpClient.PostAsync("api/posprocess/insertposbillpaymentsdata", httpContentPayment);
            if (paymentResponse.IsSuccessStatusCode)
            {
                return paymentResponse.Content.ReadAsAsync<int>().Result;
            }
            return 0;
        }
        public POSSession UpdatePosSessionData(POSSession posSession)
        {
            var jsonString = JsonConvert.SerializeObject(posSession);
            var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");
            var response = httpClient.PostAsync("api/possession/updatepossessiondata", httpContent);
            if (response.IsSuccessStatusCode)
            {
                return response.Content.ReadAsAsync<POSSession>().Result;
            }
            return null;
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
            var jsonString = JsonConvert.SerializeObject(posTempTrans);
            var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");
            var response = httpClient.PostAsync("api/posprocess/updatepostemptransforsuspendbill", httpContent);
        }
        public ItemOffer GetItemOfferByBarCode(string barcode, int branchId)
        {
            var response = httpClient.GetAsync("api/item/getitemofferbybarcode?barcode=" + barcode + "&branchId=" + branchId);
            if (response.IsSuccessStatusCode)
            {
                string data = response.Content.ReadAsStringAsync().Result;
                return JsonConvert.DeserializeObject<ItemOffer>(data);
            }
            return null;
        }
        public List<BalanceBarcodeAc> GetBalanceBarcodeConfiguration(int companyId)
        {
            var response = httpClient.GetAsync("api/Company/getbalancebarcodeconfiguration?companyId=" + companyId);
            if (response.IsSuccessStatusCode)
            {
                List<BalanceBarcodeAc> BBConfiguaration = response.Content.ReadAsAsync<List<BalanceBarcodeAc>>().Result;
                return BBConfiguaration;
            }
            return null;
        }
        public ItemQuantity GetItemQuantityByItemId(int itemId, int branchId)
        {
            var api = string.Format("api/item/getitemquantitybyitemid?itemId={0}&branchId={1}", itemId, branchId);
            var itemQuantityRespone = httpClient.GetAsync(api);
            if (itemQuantityRespone.IsSuccessStatusCode)
            {
                return itemQuantityRespone.Content.ReadAsAsync<DomainModel.Models.Item.ItemQuantity>().Result;
            }
            return null;
        }
        public ItemProfile GetItemProfileByBarcode(string barcode, int branchId)
        {
            var response = httpClient.GetAsync("api/item/getitemprofilebybarcode?barcode=" + barcode + "&branchId=" + branchId);
            if (response.IsSuccessStatusCode)
            {
                string data = response.Content.ReadAsStringAsync().Result;
                return JsonConvert.DeserializeObject<ItemProfile>(data);
            }
            return null;
        }
        public List<POSTempTransItem> GetPosTempTransItemByTempTransId(int tempTransId)
        {
            var tempItemResponse = httpClient.GetAsync("api/posprocess/getpostemptransitembytemptransid?tempTransId=" + tempTransId);
            if (tempItemResponse.IsSuccessStatusCode)
            {
                return tempItemResponse.Content.ReadAsAsync<List<POSTempTransItem>>().Result;
            }
            return null;
        }
        public POSTempTrans GetPOSTempTransByUserId(int userId)
        {
            var response = httpClient.GetAsync("api/posprocess/getpostemptransbyuserid?userId=" + userId);
            if (response.IsSuccessStatusCode)
            {
                return response.Content.ReadAsAsync<POSTempTrans>().Result;
            }
            return null;
        }
        public POSTempTrans GetPosTempTransByTransId(int transId)
        {
            var response = httpClient.GetAsync("api/posprocess/getpostemptransbytransid?transId=" + transId);
            if (response.IsSuccessStatusCode)
            {
                return response.Content.ReadAsAsync<POSTempTrans>().Result;
            }
            return null;
        }
        public CashierIncidentReport GetCashierIncidentReportByCashierId(int cashierId)
        {
            var response = httpClient.GetAsync("api/incidentreport/getcashierincidentreportbycashierid?cashierId=" + SettingHelpers.CurrentUserId);
            if (response.IsSuccessStatusCode)
            {
                return response.Content.ReadAsAsync<CashierIncidentReport>().Result;
            }
            return null;
        }

        #endregion

        #region "Suspend/Unsuspend View Model"

        public List<POSTempTrans> GetSuspendBillList(int userId)
        {
            var response = httpClient.GetAsync("api/posprocess/getunsuspendbilllist?userId=" + userId);
            if (response.IsSuccessStatusCode)
            {
                var responseString = response.Content.ReadAsStringAsync().Result;
                return JsonConvert.DeserializeObject<List<POSTempTrans>>(responseString);
            }
            return null;
        }

        #endregion

        #region "Common Methods"

        private bool CheckForExistingIncident(int itemId, int incidentType)
        {
            var api = string.Format("api/incidentreport/checkifsimilarincidentexists?itemId={0}&incidentType={1}", itemId, incidentType);
            var response = httpClient.GetAsync(api);
            if (response.IsSuccessStatusCode)
            {
                var data = response.Content.ReadAsAsync<bool>().Result;
                return data;
            }
            return false;
        }
        public POSTempTrans AddPosTempTransaction(POSTempTrans posTempTran)
        {
            string jsonString = JsonConvert.SerializeObject(posTempTran);
            var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");
            var response = httpClient.PostAsync("api/posprocess/insertpostemptransdata", httpContent);
            if (response.IsSuccessStatusCode)
            {
                return response.Content.ReadAsAsync<POSTempTrans>().Result;
            }
            return null;
        }
        public POSTempTransItem AddPosTempTranItem(POSTempTransItem posTempTransItem)
        {
            string tempTransString = JsonConvert.SerializeObject(posTempTransItem);
            var httpContentTempItem = new StringContent(tempTransString, Encoding.UTF8, "application/json");
            var tempItemResponse = httpClient.PostAsync("api/posprocess/insertpostemptransitemsdata", httpContentTempItem);
            return null;
        }
        public POSTempTransItem UpdatePosTempTransItem(POSTempTransItem posTempItem)
        {
            string jsonString = JsonConvert.SerializeObject(posTempItem);
            var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");

            var response = httpClient.PostAsync("api/posprocess/updatepostemptransitem", httpContent);
            if (response.IsSuccessStatusCode)
            {
                var data = response.Content.ReadAsAsync<POSTempTransItem>().Result;
                return data;
            }
            return null;
        }
        public void DeletePosTempTranscation(int tempTransId)
        {
            httpClient.GetAsync("api/posprocess/deletepostemptranscation?tempTransId=" + tempTransId);
        }
        public void DeleteAllPOSTempTransItem(int tempTransId)
        {
            httpClient.GetAsync("api/posprocess/deleteallpostemptransitem?tempTransId=" + tempTransId);
        }
        public void DeletePOSTempIransItem(POSTempTransItem posTempTransItem)
        {
            HttpClients httpClient = new HttpClients();
            string jsonString = JsonConvert.SerializeObject(posTempTransItem);
            var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");
            var response = httpClient.PostAsync("api/posprocess/deletepostemptransitem", httpContent);
        }
        public void DeletePOSTempIransItemByBarcode(POSTempTransItem posTempTransItem)
        {
            string jsonString = JsonConvert.SerializeObject(posTempTransItem);
            var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");
            var response = httpClient.PostAsync("api/posprocess/deletepostemptransitembybarcode", httpContent);
        }
        public bool UpdateItemQuantityForPOS(int itemId, int quantity, int branchId, int currentUserId)
        {
            httpClient.GetAsync("api/item/updateitemquantityforpos?itemId=" + itemId + "&Quantity=" + quantity + "&branchId=" + branchId + "&currentUserId=" + currentUserId);
            return true;
        }
        public bool AddAccountingEntries(List<DoubleEntry> listOfAccountEntry)
        {
            string jsonString = JsonConvert.SerializeObject(listOfAccountEntry);
            var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");
            var accountingEntries = httpClient.PostAsync("api/Accounting/AddAccountingEntries", httpContent);
            if (accountingEntries.IsSuccessStatusCode)
            { }
            return true;
        }
        public void InsertPosIncidentReport(PosIncidentReport posIncidentReport)
        {
            if (!CheckForExistingIncident(posIncidentReport.ItemId, posIncidentReport.IncidentType))
            {
                string jsonString = JsonConvert.SerializeObject(posIncidentReport);
                var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");
                var response = httpClient.PostAsync("api/incidentreport/insertposincidentreport", httpContent);
            }
        }

        #endregion

        public void Dispose()
        {
        }
    }
}
