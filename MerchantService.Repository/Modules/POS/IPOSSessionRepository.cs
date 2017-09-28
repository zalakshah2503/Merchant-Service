using MerchantService.DomainModel.Models.POS;
using MerchantService.DomainModel.Models.SystemParameters;
using System;
using System.Collections.Generic;

namespace MerchantService.Repository.Modules.POS
{
    public interface IPOSSessionRepository
    {
        /// <summary>
        /// This method used for insert into POSSession table and return primary key. -An 
        /// </summary>
        /// <param name="posSession">POSsession contains  POSLoginSessionId,MismatchResolveTypeID,StartDate,EndDate,IsMatched,MismatchedValue,
        /// Cash,DebitCard,CreditCard,Coupon,CreditAccount,ReturnedBill,ActualCash,ActualDebitCard,ActualCreditCard,ActualCoupon,ActualCreditAccount</param>
        /// <returns></returns>
        int AddNewPOSSession(POSSession posSession);

        /// <summary>
        /// This method used for insert into table posLoginSession and return primary key. -An
        /// </summary>
        /// <param name="posLoginSession">posLoginSession UserId,LoginDateTime,LogoutDateTime</param> 
        /// <returns></returns>
        int AddNewPOSLoginSession(POSLoginSession posLoginSession);

        /// <summary>
        /// This method used for get pos login session by user id. -An
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        POSLoginSession GetPOSLoginSessionByUserId(int userId);

        /// <summary>
        ///This method used for get posSession by posLoginSession id. -An
        /// </summary>
        /// <param name="posLoginSessionId"></param>
        /// <returns></returns>
        POSSession GetPOSSessionByPOSLoginSessionId(int posLoginSessionId);

        /// <summary>
        /// This method used for get list of transaction type. -An
        /// </summary>
        /// <returns></returns>
        List<ParamType> GetListOfTransactionType();

        /// <summary>
        /// This method is used for checking user is logout from pos system or not.
        /// </summary>
        /// <param name="userId">use id</param>
        /// <returns></returns>
        POSLoginSession CheckUserLogoutOrNot(int userId);


        /// <summary>
        /// This method is used for getting POSSession data by loginid -PS
        /// </summary>
        /// <param name="userLoginId"></param>
        /// <returns></returns>
        POSSession GetPosSessionBySessionLoginId(int userLoginId);

        /// <summary>
        /// This method used for get active POSNonSalesTransactionList. -An
        /// </summary>
        /// <returns></returns>
        List<POSNonSaleTransaction> GetPOSNonSalesTransactionList(int posSessionId);

        /// <summary>
        /// This method used for insert POSNonSaleTransaction and return primary key. -An
        /// </summary>
        /// <param name="posNonSaleTransaction">PosNonSaleTransaction contain CreatedDateTime,POSSessionId,TransactionTypeId,Amount,Remark</param>
        /// <returns></returns>
        int AddPOSNonSaleTransaction(POSNonSaleTransaction posNonSaleTransaction);

        /// <summary>
        /// This method used for update POSNonSaleTransaction and return primary key. -An
        /// </summary>
        /// <param name="posNonSaleTransaction">Id,PosNonSaleTransaction contain CreatedDateTime,POSSessionId,TransactionTypeId,Amount,Remark</param>
        /// <returns></returns>
        int UpdatePOSNonSaleTransaction(POSNonSaleTransaction posNonSaleTransaction);

        /// <summary>
        /// This method used for get POS Non Sales Transaction By Id. -An
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        POSNonSaleTransaction GetPOSNonSalesTransactionById(int id);

        /// <summary>
        /// This method used for get list of POSBill. -An
        /// </summary>
        /// <returns></returns>
        List<POSBill> ListOfPOSBill();


        /// <summary>
        /// This method used for get list of POSBill by Cashier Id. -An
        /// </summary>
        /// <param name="cashierId"></param>
        /// <returns></returns>
        List<POSBill> ListOfPOSBillByCashierId(int cashierId,DateTime startDate ,DateTime endDate);

        /// <summary>
        /// This method used for get POSBillItem List. -An 
        /// </summary>
        /// <param name="posBillId"></param>
        /// <returns></returns>
        List<POSBillItem> GetPOSBillItemByPOSBillId(int posBillId);

        /// <summary>
        /// This method used for get POSSession object by id. -An
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        POSSession GetPOSSessionById(int id);

        /// <summary>
        /// This method used for update pos session. -An
        /// </summary>
        /// <param name="posSession"></param>
        /// <returns></returns>
        int UpdatePOSSession(POSSession posSession);

        /// <summary>
        /// This method used for get pos bill payment by posBillId.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        List<POSBillPayment> GetPOSBillPaymentListById(int posBillId);
        
        /// <summary>
        ///This method used for delete current Payment Type by POSBillId. -An 
        /// </summary>
        /// <param name="posBillId"></param>
        /// <returns></returns>
        bool DeleteCurrentPaymentTYpeByPOSBillId(int posBillId);

        /// <summary>
        /// This method used for insert POSBillPayment. -An
        /// </summary>
        /// <param name="posBillPayment"></param>
        /// <returns></returns>
        int AddNewPOSBillPayment(POSBillPayment posBillPayment);

        /// <summary>
        /// This method used for get posSessionLogin by id. -An
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        POSLoginSession GetPosSessionLoginById(int id);

      
        /// <summary>
        /// Update POSSession  data at the time of Payment. -PS
        /// </summary>
        /// <param name="posSession">object of POSSession </param>
        /// <returns> return object of POSSession </returns>
        POSSession UpdatePosSessionData(POSSession posSession);

        /// <summary>
        /// This method used for get pos session list by branch. -An
        /// </summary>
        /// <returns></returns>
        List<POSSession> GetListOfPOSSession(int branchId);


        /// <summary>
        /// This method used for get pos session list. -An
        /// </summary>
        /// <returns></returns>
        List<POSSession> GetListOfPOSSessionAllBranch();


        /// <summary>
        /// This method is used for update PosSession table for End Session. -PS
        /// </summary>
        /// <param name="posSession"></param>
        /// <returns></returns>
        POSSession UpdatePosSessionForEndSeesion(POSSession posSession);

        /// <summary>
        /// This method is used for update PosSessionLogin table for End Session - PS
        /// </summary>
        /// <param name="posLoginSession"></param>
        /// <returns></returns>
        POSLoginSession UpdatePosLoginSessionForEndSession(POSLoginSession posLoginSession);

        /// <summary>
        /// This method is used for getting last logout record by userId - PS
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        POSLoginSession GetLastLogoutRecordByUserId(int userId);

        /// <summary>
        /// This method usd for get reamining close session list. -An 
        /// </summary>
        /// <returns></returns>
        List<POSSession> GetPosSessionListForReaminingCloseSession();

        /// <summary>
        /// This method is used for update Return bill amount when returned bill is processed by cashier. -PS
        /// </summary>
        /// <param name="posSession"></param>
        void UpdatePosSessionForReturnedBillAmount(POSSession posSession);

        /// <summary>
        /// This method used for get list Of POS Bill by POSSession Id. -An
        /// </summary>
        /// <returns></returns>
        List<POSBill> GetListOfPOSBill(int posSessionId);

    }
}
