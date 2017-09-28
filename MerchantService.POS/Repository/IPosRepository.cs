using MerchantService.Repository.ApplicationClasses.Globalization;
using System;
using System.Collections.Generic;
namespace MerchantService.POS.Repository
{
    public interface IPosRepository
    {
        bool AddAccountingEntries(System.Collections.Generic.List<MerchantService.DomainModel.Models.Accounting.DoubleEntry> listOfAccountEntry);
        int AddNewPOSLoginSession(MerchantService.DomainModel.Models.POS.POSLoginSession posLoginSession);
        MerchantService.DomainModel.Models.POS.POSTempTransItem AddPosTempTranItem(MerchantService.DomainModel.Models.POS.POSTempTransItem posTempTransItem);
        MerchantService.DomainModel.Models.POS.POSTempTrans AddPosTempTransaction(MerchantService.DomainModel.Models.POS.POSTempTrans posTempTran);
        int AddUnregisteredItem(MerchantService.DomainModel.Models.Item.ItemProfile item);
        bool CheckForUniqueItemcode(string itemCode);
        MerchantService.DomainModel.Models.POS.POSLoginSession CheckUserLogoutOrNot(int userId);
        void DeleteAllPOSTempTransItem(int tempTransId);
        void DeletePOSTempIransItem(MerchantService.DomainModel.Models.POS.POSTempTransItem posTempTransItem);
        void DeletePOSTempIransItemByBarcode(MerchantService.DomainModel.Models.POS.POSTempTransItem posTempTransItem);
        void DeletePosTempTranscation(int tempTransId);
        void Dispose();
        System.Collections.Generic.List<MerchantService.DomainModel.Models.Globalization.CurrencyDetail> GetAllCurrencyDetail();
        MerchantService.Repository.ApplicationClasses.Admin.BranchDetailAC GetBranchById(int Id);
        MerchantService.DomainModel.Models.IncidentReport.CashierIncidentReport GetCashierIncidentReportByCashierId(int cashierId);
        MerchantService.DomainModel.Models.Company.CompanyConfiguration GetCompanyConfigurationByCompanyId(int companyId);
        MerchantService.DomainModel.Models.Customer.CustomerProfile GetCustomerByMebershipCodeOrMobileNo(string number);
        MerchantService.Repository.ApplicationClasses.CustomerPO.CustomerPOAC GetCustomerPurchaseOrderInformation(string poNumber);
        System.Collections.Generic.List<MerchantService.DomainModel.Models.IncidentReport.IncidentReport> GetIncidentReportList(int companyId);
        MerchantService.DomainModel.Models.Item.ItemOffer GetItemOfferByBarCode(string barcode, int branchId);
        MerchantService.DomainModel.Models.Item.ItemProfile GetItemProfileByBarcode(string barcode, int branchId);
        List<MerchantService.Repository.ApplicationClasses.Admin.Company.BalanceBarcodeAc> GetBalanceBarcodeConfiguration(int companyId);
        MerchantService.DomainModel.Models.Item.ItemQuantity GetItemQuantityByItemId(int itemId, int branchId);
        List<GlobalizationDetailAc> GetLanguageWiseLabels(int languageId);
        MerchantService.DomainModel.Models.POS.POSLoginSession GetLastLogoutRecordByUserId(int userId);
        MerchantService.DomainModel.Models.POS.POSReturnBill GetPosReturnBillData(string returnBillNo);
        MerchantService.DomainModel.Models.POS.POSSession GetPosSessionBySessionLoginId(int userLoginId);
        MerchantService.DomainModel.Models.POS.POSTempTrans GetPosTempTransByTransId(int transId);
        MerchantService.DomainModel.Models.POS.POSTempTrans GetPOSTempTransByUserId(int userId);
        System.Collections.Generic.List<MerchantService.DomainModel.Models.POS.POSTempTransItem> GetPosTempTransItemByTempTransId(int tempTransId);
        System.Collections.Generic.List<MerchantService.DomainModel.Models.WorkFlow.RolePermission> GetRolPermissionByChildPermissionId(int childPermaissionId, int companyId);
        int GetSuspendBillCountByUserId(int UserId);
        System.Collections.Generic.List<MerchantService.DomainModel.Models.POS.POSTempTrans> GetSuspendBillList(int userId);
        int GetTotalBillDataByBillDate();
        System.Collections.Generic.List<MerchantService.DomainModel.Models.SystemParameters.SystemParameter> GetUnitType(int companyId);
        MerchantService.DomainModel.Models.UserDetail GetUserDetailByAspNetUserId(string userId);
        MerchantService.DomainModel.Models.IncidentReport.CashierIncidentReport InsertDataInCashierIncidnetReport(MerchantService.DomainModel.Models.IncidentReport.CashierIncidentReport cashierIncidentReport);
        MerchantService.DomainModel.Models.POS.POSBill InsertPosBillData(MerchantService.DomainModel.Models.POS.POSBill posBill);
        int InsertPosBillItemsData(System.Collections.Generic.List<MerchantService.Repository.ApplicationClasses.Item.POSItemDetail> itemsData, int posBillId);
        int InsertPosBillPaymentData(MerchantService.DomainModel.Models.POS.POSBillPayment posBillPayment);
        void InsertPosIncidentReport(MerchantService.DomainModel.Models.IncidentReport.PosIncidentReport posIncidentReport);
        int InsertPOSSessionsData(MerchantService.DomainModel.Models.POS.POSSession posSession);
        void UpdateIncidentReportByCashierId(int cashierId);
        bool UpdateItemQuantityForPOS(int itemId, int Quantity, int branchId, int currentUserId);
        MerchantService.DomainModel.Models.POS.POSLoginSession UpdatePosLoginSessionForEndSession(MerchantService.DomainModel.Models.POS.POSLoginSession posLoginSession);
        bool UpdatePosReturnBillForPOs(MerchantService.DomainModel.Models.POS.POSReturnBill posReturnBill, MerchantService.DomainModel.Models.POS.POSSession posSession);
        MerchantService.DomainModel.Models.POS.POSSession UpdatePosSessionData(MerchantService.DomainModel.Models.POS.POSSession posSession);
        MerchantService.DomainModel.Models.POS.POSSession UpdatePosSessionForEndSeesion(MerchantService.DomainModel.Models.POS.POSSession posSession);
        void UpdatePosTempTransForSuspendBill(MerchantService.DomainModel.Models.POS.POSTempTrans posTempTrans);
        MerchantService.DomainModel.Models.POS.POSTempTransItem UpdatePosTempTransItem(MerchantService.DomainModel.Models.POS.POSTempTransItem posTempItem);
        MerchantService.Repository.ApplicationClasses.AspNetUsers ValidateLogin(string userName, string password);
        List<MerchantService.DomainModel.Models.Globalization.Language> GetAllLanguage();
    }
}
