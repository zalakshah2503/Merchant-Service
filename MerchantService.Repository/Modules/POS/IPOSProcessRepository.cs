using MerchantService.DomainModel.Models.POS;
using System.Collections.Generic;
using MerchantService.Repository.ApplicationClasses.Globalization;
using MerchantService.DomainModel.Models.Globalization;

namespace MerchantService.Repository.Modules.POS
{
    public interface IPOSProcessRepository
    {
        /// <summary>
        /// This method used for get UnsuspendBill list. -An
        /// </summary>
        /// <returns></returns>
        List<POSTempTrans> GetUnSuspendBillList(int userId);

        /// <summary>
        /// This method used for insert pos temp trans data and return primary key. -An
        /// </summary>
        /// <param name="postTempTrans">postTrmpTrans contain UserID,BranchID,CustomerID,ReturnedBillNo,PurchaseOrderNo,TransReference
        /// TransDate,IsSuspendedBill,CreatedDateTime</param>
        /// <returns></returns>
        int InsertPOSTempTransData(POSTempTrans postTempTrans);

        /// <summary>
        /// This method used for insert into post temp Trans Data and retyrn primary key.-An
        /// </summary>
        /// <param name="posTempTransData">posTempTransdata contain TempTransID,ItemID,Barcode,Quantity</param>
        /// <returns></returns>
        int InsertPOSTempTransItemsData(POSTempTransItem posTempTransData);

        /// <summary>
        /// This method used for pos bill items and return primary key. -An
        /// </summary>
        /// <param name="posBillItems">posBillItem contain BillID,ItemID,Quantity,SellPrice,WeightedCostPrice,ReturnedQuantity,CreatedDateTime</param>
        /// <returns></returns>
        int InsertPOSBillItemsData(POSBillItem posBillItems);

        /// <summary>
        /// This method used for insert into pos bill payment . -An
        /// </summary>
        /// <param name="posBillPayment">posBillPayment contain POSBillID,ParamTypeId,Amount,BankPOSTransNo</param>
        /// <returns></returns>
        int InsertPOSBillPaymentsData(POSBillPayment posBillPayment);

        /// <summary>
        /// This method is used for insert POS Bill payment datea. - PS
        /// </summary>
        /// <param name="posBill"></param>
        /// <returns></returns>
        POSBill InsertPOSBillData(POSBill posBill);

        /// <summary>
        /// This method used for insert into pos bill payment . -An
        /// </summary>
        /// <param name="posSession">POSLoginSessionId,MismatchResolveTypeID,StartDate,EndDate,IsMatched,MismatchedValue,Cash,DebitCard,CreditCard,Coupon,CreditAccount,ReturnedBill,ActualCash,ActualDebitCard,ActualCreditCard,ActualCoupon,ActualCreditAccount,ActualReturnedBill</param>
        /// <returns></returns>
        int InsertPOSSessionsData(POSSession posSession);
       
        /// <summary>
       /// This method used for get pos return bill by return bill no. -An
       /// </summary>
       /// <param name="returnbillNo">pass return bill no.</param>
       /// <returns></returns>
        POSReturnBill GetPOSReturnBillByReturnBillNo(string returnbillNo); 

        /// <summary>
        /// This method is used for Delete Temp Item. -PS
        /// </summary>
        /// <param name="?"></param>
        /// <returns>object of POSTempTransItem </returns>
        void DeletePOSTempIransItem(POSTempTransItem posTempTransItem);

        /// <summary>
        /// This method is used for Delete Temp Item. -PS
        /// </summary>
        /// <param name="?"></param>
        /// <returns>object of POSTempTransItem </returns>
        void DeletePOSTempIransItemByBarcode(POSTempTransItem barcode);

        /// <summary>
        /// This method is used for delte all temp trans item. -PS
        /// </summary>
        /// <param name="tempTransId"> tempTransId </param>
        void DeleteAllPOSTempTransItem(int tempTransId);

        /// <summary>
        /// This method is used delete temporary transction of POS data. -PS
        /// </summary>
        /// <param name="tempTransId"></param>
        void DeletePosTempTranscation(int tempTransId);

        /// <summary>
        /// This method is used for update POSTempTransItem. -PS
        /// </summary>
        /// <param name="posTempItem"> object of POSTempTransItem</param>
        /// <returns>object of POSTempTransItem</returns>
        POSTempTransItem UpdatePosTempTransItem(POSTempTransItem posTempItem);

        /// <summary>
        /// This method is used for getting TempTrans table data which is not suspended. -PS
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        POSTempTrans GetPOSTempTransByUserId(int userId);

        /// <summary>
        /// This method is used for getting POSTempTransItem object by tempTransId
        /// </summary>
        /// <param name="tempTransId">tempTransId</param>
        /// <returns>object of POSTempTransItem </returns>
        List<POSTempTransItem> GetPosTempTransItemByTempTransId(int tempTransId);

        /// <summary>
        /// This method is used for getting count today's bill number. -PS
        /// </summary>
        /// <param name="date"></param>
        /// <returns></returns>
        int GetTotalBillDataByBillDate();

        /// <summary>
        /// This method is used for Suspend current Bill. - PS
        /// </summary>
        /// <param name="posTempTrans"></param>
        void UpdatePosTempTransForSuspendBill(POSTempTrans posTempTrans);

        /// <summary>
        /// This method is used for getting PosTempTrans object by id
        /// </summary>
        /// <param name="transId">trans Id</param>
        /// <returns>object of POSTempTrans </returns>
        POSTempTrans GetPosTempTransByTransId(int transId);

        /// <summary>
        /// This method is used for getting count of suspend bill. - PS
        /// </summary>
        /// <param name="UserId"></param>
        /// <returns></returns>
        int GetSuspendBillCountByUserId(int UserId);

        /// <summary>
        /// get all values of labels for pos language wise
        /// </summary>
        /// <param name="UserId"></param>
        /// <returns></returns>
        List<GlobalizationDetailAc> GetLanguageWiseLabels(int languageId);

        /// <summary>
        /// get all language 
        /// </summary>
        /// 
        /// <returns></returns>
        List<Language> GetAllLanguage();

    }
}


