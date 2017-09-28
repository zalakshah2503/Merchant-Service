using MerchantService.DomainModel.Models.POS;
using MerchantService.DomainModel.Models.SystemParameters;
using MerchantService.Repository.DataRepository;
using MerchantService.Utility.Constants;
using MerchantService.Utility.Logger;
using System;
using System.Collections.Generic;
using System.Linq;

namespace MerchantService.Repository.Modules.POS
{
    public class POSSessionRepository : IPOSSessionRepository, IDisposable
    {
        #region "Private Variable(s)"

        private readonly IErrorLog _errorLog;
        private readonly IDataRepository<POSSession> _posSessionsContext;
        private readonly IDataRepository<POSLoginSession> _posLoginSessionsContext;
        private readonly IDataRepository<ParamType> _paramTypeContext;
        private readonly IDataRepository<POSNonSaleTransaction> _posNonSalesTransactionContext;
        private readonly IDataRepository<POSBill> _posBillContext;
        private readonly IDataRepository<POSBillItem> _posBillItemContext;
        private readonly IDataRepository<POSBillPayment> _POSBillPayment;

        #endregion

        #region "Constructor & Destructor(s)"
        public POSSessionRepository(IErrorLog errorLog, IDataRepository<POSSession> posSessionsContext, IDataRepository<POSLoginSession> posLoginSessionsContext,
            IDataRepository<ParamType> paramTypeContext, IDataRepository<POSNonSaleTransaction> posNonSalesTransactionContext, IDataRepository<POSBill> posBillContext,
            IDataRepository<POSBillItem> posBillItemContext, IDataRepository<POSBillPayment> POSBillPayment)
        {
            _posSessionsContext = posSessionsContext;
            _posBillItemContext = posBillItemContext;
            _posBillContext = posBillContext;
            _posNonSalesTransactionContext = posNonSalesTransactionContext;
            _errorLog = errorLog;
            _posLoginSessionsContext = posLoginSessionsContext;
            _paramTypeContext = paramTypeContext;
            _POSBillPayment = POSBillPayment;
        }
        #endregion

        #region "Dispose Method(s)"

        public void Dispose()
        {
            try
            {
                _posSessionsContext.Dispose();
                _posLoginSessionsContext.Dispose();
                GC.SuppressFinalize(this);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
            }
        }

        #endregion

        #region "Public Method(s)"


        /// <summary>
        /// This method used for get list Of POS Bill by POSSession Id. -An
        /// </summary>
        /// <returns></returns>
        public List<POSBill> GetListOfPOSBill(int posSessionId)
        {
            try
            {
                return _posBillContext.Fetch(x => x.POSSessionID == posSessionId).ToList();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// This method used for get pos session list. -An
        /// </summary>
        /// <returns></returns>
        public List<POSSession> GetListOfPOSSession(int branchId)
        {
            try
            {
                return _posSessionsContext.Fetch(x => x.ParentRecordId != null && x.POSLoginSession.UserDetail.BranchId == branchId).OrderByDescending(x => x.CreatedDateTime).ToList();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }

        }


        public List<POSSession> GetListOfPOSSessionAllBranch()
        {
            try
            {
                return _posSessionsContext.Fetch(x => x.ParentRecordId != null).OrderByDescending(x => x.CreatedDateTime).ToList();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }

        }

        /// <summary>
        ///This method used for delete current Payment Type by POSBillId. -An 
        /// </summary>
        /// <param name="posBillId"></param>
        /// <returns></returns>
        public bool DeleteCurrentPaymentTYpeByPOSBillId(int posBillId)
        {
            try
            {
                List<POSBillPayment> listOfPOSBillPayment = _POSBillPayment.Fetch(x => x.POSBillID == posBillId).ToList();
                POSSession posSession = new POSSession();
                foreach (var posBillPayment in listOfPOSBillPayment)
                {
                    posSession = _posSessionsContext.FirstOrDefault(x => x.POSLoginSessionId == posBillPayment.POSBill.POSSessionID);
                    if (posSession != null)
                    {
                        switch (posBillPayment.ParamType.ValueEn)
                        {
                            case StringConstants.Cash:
                                posSession.Cash -= posBillPayment.Amount;
                                break;

                            case StringConstants.DebitCard:
                                posSession.DebitCard -= posBillPayment.Amount;
                                break;

                            case StringConstants.CreditCardPOS:
                                posSession.CreditCard -= posBillPayment.Amount;
                                break;

                            case StringConstants.Coupon:
                                posSession.Coupon -= posBillPayment.Amount;
                                break;

                            case StringConstants.Cheque:
                                posSession.Cheque -= posBillPayment.Amount;
                                break;
                            default:
                                break;
                        }
                        _posSessionsContext.Update(posSession);
                        _posSessionsContext.SaveChanges();
                    }
                    _POSBillPayment.Delete(posBillPayment.Id);
                    _POSBillPayment.SaveChanges();
                }
                return true;

            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }

        }

        /// <summary>
        /// This method usd for get reamining close session list. -An 
        /// </summary>
        /// <returns></returns>
        /// change change change change change 
        /// change change change change change 
        public List<POSSession> GetPosSessionListForReaminingCloseSession()
        {
            try
            {
                return _posSessionsContext.Fetch(x => x.ParentRecordId == null).ToList();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// This method used for insert into POSSession table and return primary key. -An 
        /// </summary>
        /// <param name="posSession">POSsession contains  POSLoginSessionId,MismatchResolveTypeID,StartDate,EndDate,IsMatched,MismatchedValue,
        /// Cash,DebitCard,CreditCard,Coupon,CreditAccount,ReturnedBill,ActualCash,ActualDebitCard,ActualCreditCard,ActualCoupon,ActualCreditAccount</param>
        /// <returns></returns>
        public int AddNewPOSSession(POSSession posSession)
        {
            try
            {
                posSession.CreatedDateTime = DateTime.UtcNow;
                _posSessionsContext.Add(posSession);
                _posSessionsContext.SaveChanges();
                return posSession.Id;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }

        }

        /// <summary>
        /// This method used for get active POSNonSalesTransactionList. -An
        /// </summary>
        /// <returns></returns>
        public List<POSNonSaleTransaction> GetPOSNonSalesTransactionList(int posSessionId)
        {
            try
            {
                return _posNonSalesTransactionContext.Fetch(x => x.IsDeleted == false && x.POSSessionId == posSessionId).ToList();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }

        }

        /// <summary>
        /// This method used for insert POSNonSaleTransaction and return primary key. -An
        /// </summary>
        /// <param name="posNonSaleTransaction">PosNonSaleTransaction contain CreatedDateTime,POSSessionId,TransactionTypeId,Amount,Remark</param>
        /// <returns></returns>
        public int AddPOSNonSaleTransaction(POSNonSaleTransaction posNonSaleTransaction)
        {
            try
            {
                _posNonSalesTransactionContext.Add(posNonSaleTransaction);
                _posNonSalesTransactionContext.SaveChanges();
                return posNonSaleTransaction.Id;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }

        }

        /// <summary>
        /// This method used for get list of POSBill. -An
        /// </summary>
        /// <returns></returns>
        public List<POSBill> ListOfPOSBill()
        {
            try
            {
                return _posBillContext.GetAll().OrderByDescending(x => x.BillDate).ToList();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        public List<POSBill> ListOfPOSBillByCashierId(int cashierId, DateTime startDate, DateTime endDate)
        {
            try
            {
                return _posBillContext.Fetch(x => x.UserID == cashierId && x.BillDate >= startDate && x.BillDate <= endDate).OrderByDescending(x => x.BillDate).ToList();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// This method used for get POSBillItem List. -An 
        /// </summary>
        /// <param name="posBillId"></param>
        /// <returns></returns>
        public List<POSBillItem> GetPOSBillItemByPOSBillId(int posBillId)
        {
            try
            {
                return _posBillItemContext.Fetch(x => x.BillID == posBillId).ToList();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }

        }

        /// <summary>
        /// This method used for update POSNonSaleTransaction and return primary key. -An
        /// </summary>
        /// <param name="posNonSaleTransaction">Id,PosNonSaleTransaction contain CreatedDateTime,POSSessionId,TransactionTypeId,Amount,Remark</param>
        /// <returns></returns>
        public int UpdatePOSNonSaleTransaction(POSNonSaleTransaction posNonSaleTransaction)
        {
            try
            {
                posNonSaleTransaction.ModifiedDateTime = DateTime.UtcNow;
                _posNonSalesTransactionContext.Update(posNonSaleTransaction);
                _posNonSalesTransactionContext.SaveChanges();
                return posNonSaleTransaction.Id;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// This method used for insert into table posLoginSession and return primary key. -An
        /// </summary>
        /// <param name="posLoginSession">posLoginSession UserId,LoginDateTime,LogoutDateTime</param> 
        /// <returns></returns>
        public int AddNewPOSLoginSession(POSLoginSession posLoginSession)
        {
            try
            {
                var pos = new POSLoginSession
                {
                    CreatedDateTime = DateTime.UtcNow,
                    LoginDateTime = DateTime.UtcNow,
                    LogoutDateTime = null,
                    UserId = posLoginSession.UserId
                };
                _posLoginSessionsContext.Add(pos);
                _posLoginSessionsContext.SaveChanges();
                return pos.Id;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }

        }


        /// <summary>
        /// This method used for get POS Non Sales Transaction By Id. -An
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public POSNonSaleTransaction GetPOSNonSalesTransactionById(int id)
        {
            try
            {
                return _posNonSalesTransactionContext.FirstOrDefault(x => x.Id == id && x.IsDeleted == false);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// This method used for get pos login session by user id. -An
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        public POSLoginSession GetPOSLoginSessionByUserId(int userId)
        {
            try
            {
                return _posLoginSessionsContext.Fetch(x => x.UserId == userId).OrderByDescending(x => x.CreatedDateTime).FirstOrDefault();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        ///This method used for get posSession by posLoginSession id. -An
        /// </summary>
        /// <param name="posLoginSessionId"></param>
        /// <returns></returns>
        public POSSession GetPOSSessionByPOSLoginSessionId(int posLoginSessionId)
        {
            try
            {
                return _posSessionsContext.Fetch(x => x.POSLoginSessionId == posLoginSessionId).OrderByDescending(x => x.CreatedDateTime).FirstOrDefault();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// This method used for get list of transaction type. -An
        /// </summary>
        /// <returns></returns>
        public List<ParamType> GetListOfTransactionType()
        {
            try
            {
                return _paramTypeContext.Fetch(x => x.ParamId == 55).ToList();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }

        }


        /// <summary>
        /// this method is used for checking user logout or not. if return true that menas it is not log out
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        public POSLoginSession CheckUserLogoutOrNot(int userId)
        {
            try
            {

                var PosLoginObject = _posLoginSessionsContext.FirstOrDefault(x => x.UserId == userId && x.LogoutDateTime == null);
                return PosLoginObject;

            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        public POSSession GetPosSessionBySessionLoginId(int userLoginId)
        {
            try
            {
                POSSession posSession = _posSessionsContext.FirstOrDefault(x => x.POSLoginSessionId == userLoginId);
                return posSession;
            }
            catch (Exception)
            {

                throw;
            }
        }


        /// <summary>
        /// This method used for get POSSession object by id. -An
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public POSSession GetPOSSessionById(int id)
        {
            try
            {
                return _posSessionsContext.FirstOrDefault(x => x.Id == id);

            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }

        }

        /// <summary>
        /// This method used for get posSessionLogin by id. -An
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public POSLoginSession GetPosSessionLoginById(int id)
        {
            try
            {
                return _posLoginSessionsContext.FirstOrDefault(x => x.Id == id);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }

        }


        /// <summary>
        /// This method used for update pos session. -An
        /// </summary>
        /// <param name="posSession"></param>
        /// <returns></returns>
        public int UpdatePOSSession(POSSession posSession)
        {
            try
            {
                posSession.ModifiedDateTime = DateTime.UtcNow;
                _posSessionsContext.Update(posSession);
                _posSessionsContext.SaveChanges();
                return posSession.Id;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// This method used for get pos bill payment by posBillId.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public List<POSBillPayment> GetPOSBillPaymentListById(int posBillId)
        {
            try
            {
                return _POSBillPayment.Fetch(x => x.POSBillID == posBillId).ToList();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// This method used for insert POSBillPayment. -An
        /// </summary>
        /// <param name="posBillPayment"></param>
        /// <returns></returns>
        public int AddNewPOSBillPayment(POSBillPayment posBillPayment)
        {
            try
            {
                _POSBillPayment.Add(posBillPayment);
                _POSBillPayment.SaveChanges();
                var paramType = _paramTypeContext.FirstOrDefault(x => x.Id == posBillPayment.ParamTypeId);

                var posSession = _posSessionsContext.FirstOrDefault(x => x.POSLoginSessionId == posBillPayment.POSBill.POSSessionID);
                switch (paramType.ValueEn)
                {
                    case StringConstants.Cash:
                        posSession.Cash += posBillPayment.Amount;
                        break;

                    case StringConstants.DebitCard:
                        posSession.DebitCard += posBillPayment.Amount;
                        break;

                    case StringConstants.CreditCardPOS:
                        posSession.CreditCard += posBillPayment.Amount;
                        break;

                    case StringConstants.Coupon:
                        posSession.Coupon += posBillPayment.Amount;
                        break;

                    case StringConstants.Cheque:
                        posSession.Cheque += posBillPayment.Amount;
                        break;
                    default:
                        break;
                }
                posSession.ModifiedDateTime = DateTime.UtcNow;
                _posSessionsContext.Update(posSession);
                _posSessionsContext.SaveChanges();
                return posBillPayment.Id;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        public POSSession UpdatePosSessionData(POSSession posSession)
        {
            try
            {
                var posSessionObj = _posSessionsContext.GetById(posSession.Id);

                posSessionObj.Cash = posSession.Cash + posSessionObj.Cash;
                posSessionObj.DebitCard = posSession.DebitCard + posSessionObj.DebitCard;
                posSessionObj.CreditCard = posSession.CreditCard + posSessionObj.CreditCard;
                posSessionObj.Coupon = posSession.Coupon + posSessionObj.Coupon;
                posSessionObj.CreditAccount = posSession.CreditAccount + posSessionObj.CreditAccount;
                posSessionObj.Cheque = posSession.Cheque + posSessionObj.Cheque;
                posSessionObj.ModifiedDateTime = DateTime.UtcNow;
                _posSessionsContext.Update(posSessionObj);
                _posSessionsContext.SaveChanges();
                return posSessionObj;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        public POSSession UpdatePosSessionForEndSeesion(POSSession posSession)
        {
            try
            {
                var posSessionObje = _posSessionsContext.GetById(posSession.Id);
                if (posSessionObje != null)
                {
                    posSessionObje.StatusTypeId = posSession.StatusTypeId;
                    posSessionObje.ModifiedDateTime = DateTime.UtcNow;
                    _posSessionsContext.Update(posSessionObje);
                    _posSessionsContext.SaveChanges();

                }
                return posSessionObje;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        public POSLoginSession UpdatePosLoginSessionForEndSession(POSLoginSession posLoginSession)
        {
            try
            {
                var posLoginSessionObj = _posLoginSessionsContext.GetById(posLoginSession.Id);
                if (posLoginSessionObj != null)
                {
                    posLoginSessionObj.LogoutDateTime = DateTime.UtcNow;
                    posLoginSessionObj.ModifiedDateTime = DateTime.UtcNow;
                    _posLoginSessionsContext.Update(posLoginSessionObj);
                    _posLoginSessionsContext.SaveChanges();
                }
                return posLoginSessionObj;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        public POSLoginSession GetLastLogoutRecordByUserId(int userId)
        {
            try
            {
                var posLoginSessionList = _posLoginSessionsContext.GetAll().Where(x => x.UserId == userId).OrderByDescending(x => x.LogoutDateTime).ToList();
                if (posLoginSessionList.Count > 0)
                {
                    var posLoginObj = posLoginSessionList[0];
                    return posLoginObj;
                }
                return null;
            }
            catch (Exception)
            {

                throw;
            }
        }

        public void UpdatePosSessionForReturnedBillAmount(POSSession posSession)
        {
            try
            {
                var posSessionObject = _posSessionsContext.GetById(posSession.Id);
                if (posSessionObject != null)
                {
                    posSessionObject.ReturnedBill = Convert.ToDecimal(posSessionObject.ReturnedBill) + posSession.ReturnedBill;
                    posSessionObject.ModifiedDateTime = DateTime.UtcNow;
                    _posSessionsContext.Update(posSessionObject);
                    _posSessionsContext.SaveChanges();
                }
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

