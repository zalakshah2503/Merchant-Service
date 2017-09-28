using MerchantService.DomainModel.Models.Globalization;
using MerchantService.DomainModel.Models.POS;
using MerchantService.Repository.DataRepository;
using MerchantService.Utility.Logger;
using System;
using System.Collections.Generic;
using System.Linq;
using MerchantService.Repository.ApplicationClasses.Globalization;
using System.Data.Entity;

namespace MerchantService.Repository.Modules.POS
{
    public class POSProcessRepository : IPOSProcessRepository, IDisposable
    {
        #region "Private Variable(s)"

        private readonly IErrorLog _errorLog;
        private readonly IDataRepository<POSTempTrans> _posTempTransContext;
        private readonly IDataRepository<POSTempTransItem> _posTempTransItemContext;
        private readonly IDataRepository<POSBillItem> _posBillItemContext;
        private readonly IDataRepository<POSBillPayment> _posBillPaymentContext;
        private readonly IDataRepository<POSBill> _posBillContext;
        private readonly IDataRepository<POSSession> _posSessionContext;
        private readonly IDataRepository<POSReturnBill> _posReturnBillContext;
        private readonly IDataRepository<GlobalizationDetail> _globalizationContext;
        private readonly IDataRepository<SecondaryLanguage> _secondaryLanguageContext;
        private readonly IDataRepository<Language> _languageDataRepository;

        #endregion

        #region "Constructor & Destructor(s)"
        public POSProcessRepository(IErrorLog errorLog, IDataRepository<POSTempTrans> posTempTransContext, IDataRepository<POSTempTransItem> posTempTransItemContext,
            IDataRepository<POSBillItem> posBillItemContext, IDataRepository<POSBillPayment> posBillPaymentContext, IDataRepository<POSSession> posSessionContext,
            IDataRepository<POSReturnBill> posReturnBillContext, IDataRepository<POSBill> posBill, IDataRepository<GlobalizationDetail> globalizationContext,
            IDataRepository<Language> languageDataRepository, IDataRepository<SecondaryLanguage> secondaryLanguageContext)
        {
            _errorLog = errorLog;
            _posTempTransContext = posTempTransContext;
            _posTempTransItemContext = posTempTransItemContext;
            _posBillItemContext = posBillItemContext;
            _posBillPaymentContext = posBillPaymentContext;
            _posSessionContext = posSessionContext;
            _posReturnBillContext = posReturnBillContext;
            _posBillContext = posBill;
            _globalizationContext = globalizationContext;
            _secondaryLanguageContext = secondaryLanguageContext;
            _languageDataRepository = languageDataRepository;
        }

        #endregion

        #region "Dispose Method(s)"
        /// <summary>
        /// Method disposes the repository context 
        /// </summary>
        public void Dispose()
        {
            try
            {
                _posTempTransItemContext.Dispose();
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
        /// This method used for get UnsuspendBill list. -An
        /// </summary>
        /// <returns></returns>
        public List<POSTempTrans> GetUnSuspendBillList(int userId)
        {
            try
            {
                return _posTempTransContext.Fetch(x => x.IsSuspendedBill && x.UserID == userId).ToList();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }

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

        public List<GlobalizationDetailAc> GetLanguageWiseLabels(int languageId)
        {
            try
            {
                var globalizationCollection = new List<GlobalizationDetailAc>();
                List<GlobalizationDetail> globalizationList = _globalizationContext.Fetch(x => x.ModuleId == 23).ToList();
                var secondaryLabelList = _secondaryLanguageContext.GetAll();
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
                return globalizationCollection;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// This method used for insert pos temp trans data and return primary key. -An
        /// </summary>
        /// <param name="postTempTrans">postTrmpTrans contain UserID,BranchID,CustomerID,ReturnedBillNo,PurchaseOrderNo,TransReference
        /// TransDate,IsSuspendedBill,CreatedDateTime</param>
        /// <returns></returns>
        public int InsertPOSTempTransData(POSTempTrans postTempTrans)
        {
            try
            {
                postTempTrans.CreatedDateTime = DateTime.UtcNow;
                _posTempTransContext.Add(postTempTrans);
                _posTempTransContext.SaveChanges();
                return postTempTrans.Id;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// This method used for insert into post temp Trans Data and retyrn primary key.-An
        /// </summary>
        /// <param name="posTempTransData">posTempTransdata contain TempTransID,ItemID,Barcode,Quantity</param>
        /// <returns></returns>
        public int InsertPOSTempTransItemsData(POSTempTransItem posTempTransItem)
        {
            try
            {
                posTempTransItem.CreatedDateTime = DateTime.UtcNow;
                _posTempTransItemContext.Add(posTempTransItem);
                _posTempTransItemContext.SaveChanges();
                return posTempTransItem.Id;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// This method used for pos bill items and return primary key. -An
        /// </summary>
        /// <param name="posBillItems">posBillItem contain BillID,ItemID,Quantity,SellPrice,WeightedCostPrice,ReturnedQuantity,CreatedDateTime</param>
        /// <returns></returns>
        public int InsertPOSBillItemsData(POSBillItem posBillItems)
        {
            try
            {
                posBillItems.CreatedDateTime = DateTime.UtcNow;
                _posBillItemContext.Add(posBillItems);
                _posBillItemContext.SaveChanges();
                return posBillItems.Id;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// This method used for insert into pos bill payment . -An
        /// </summary>
        /// <param name="posBillPayment">posBillPayment contain POSBillID,ParamTypeId,Amount,BankPOSTransNo</param>
        /// <returns></returns>
        public int InsertPOSBillPaymentsData(POSBillPayment posBillPayment)
        {
            try
            {
                posBillPayment.CreatedDateTime = DateTime.UtcNow;
                _posBillPaymentContext.Add(posBillPayment);
                _posBillPaymentContext.SaveChanges();
                return posBillPayment.Id;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        public POSBill InsertPOSBillData(POSBill posBill)
        {
            try
            {
                posBill.CreatedDateTime = DateTime.UtcNow;
                _posBillContext.Add(posBill);
                _posBillContext.SaveChanges();
                return posBill;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// This method used for insert into pos bill payment . -An
        /// </summary>
        /// <param name="posSession">POSLoginSessionId,MismatchResolveTypeID,StartDate,EndDate,IsMatched,MismatchedValue,Cash,DebitCard,CreditCard,Coupon,CreditAccount,ReturnedBill,ActualCash,ActualDebitCard,ActualCreditCard,ActualCoupon,ActualCreditAccount,ActualReturnedBill</param>
        /// <returns></returns>
        public int InsertPOSSessionsData(POSSession posSession)
        {
            try
            {
                _posSessionContext.Add(posSession);
                _posSessionContext.SaveChanges();
                return posSession.Id;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// This method used for get pos return bill by return bill no.-An
        /// </summary>
        /// <param name="returnbillNo"></param>
        /// <returns></returns>
        public POSReturnBill GetPOSReturnBillByReturnBillNo(string returnbillNo)
        {
            try
            {
                return _posReturnBillContext.FirstOrDefault(x => x.ReturnedBillNo == returnbillNo);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        public void DeletePOSTempIransItem(POSTempTransItem posTempTransItem)
        {
            try
            {
                var tempItem = _posTempTransItemContext.GetAll().
                    Where(x => x.Barcode == posTempTransItem.Barcode
                        && x.TempTransID == posTempTransItem.TempTransID
                        && x.Quantity == posTempTransItem.Quantity &&
                        x.IsOfferItem == posTempTransItem.IsOfferItem)
                    .FirstOrDefault();
                if (tempItem != null)
                {
                    _posTempTransItemContext.Delete(tempItem.Id);
                    _posTempTransItemContext.SaveChanges();
                }
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        public void DeletePOSTempIransItemByBarcode(POSTempTransItem posTempTransItem)
        {
            try
            {
                var posTempItemList = _posTempTransItemContext.Fetch(x => x.Barcode == posTempTransItem.Barcode
                    && x.TempTransID == posTempTransItem.TempTransID).ToList();
                if (posTempItemList.Any())
                {
                    foreach (var item in posTempItemList)
                    {
                        _posTempTransItemContext.Delete(item.Id);
                        _posTempTransItemContext.SaveChanges();
                    }
                }
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        public void DeleteAllPOSTempTransItem(int tempTransId)
        {
            try
            {
                List<POSTempTransItem> posTempItemList = _posTempTransItemContext.GetAll().Where(x => x.TempTransID == tempTransId).ToList();
                if (posTempItemList.Count > 0)
                {
                    foreach (var item in posTempItemList)
                    {
                        _posTempTransItemContext.Delete(item.Id);
                        _posTempTransItemContext.SaveChanges();
                    }
                }
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        public void DeletePosTempTranscation(int tempTransId)
        {
            try
            {
                _posTempTransContext.Delete(tempTransId);
                _posTempTransContext.SaveChanges();
            }
            catch (Exception)
            {

                throw;
            }
        }
        public POSTempTransItem UpdatePosTempTransItem(POSTempTransItem posTempItem)
        {
            try
            {
                var PosTempObj = _posTempTransItemContext.
                    FirstOrDefault(x => x.Barcode == posTempItem.Barcode
                        && x.IsOfferItem == posTempItem.IsOfferItem
                        && x.TempTransID == posTempItem.TempTransID);

                if (PosTempObj != null)
                {
                    PosTempObj.Quantity = posTempItem.Quantity;
                    posTempItem.ModifiedDateTime = DateTime.UtcNow;
                    _posTempTransItemContext.Update(PosTempObj);
                    _posTempTransItemContext.SaveChanges();
                }
                return PosTempObj;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }
        public POSTempTrans GetPOSTempTransByUserId(int userId)
        {
            try
            {
                var PosTempTransObj = _posTempTransContext.GetAll().Where(x => x.UserID == userId && !x.IsSuspendedBill).FirstOrDefault();

                return PosTempTransObj;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        public List<POSTempTransItem> GetPosTempTransItemByTempTransId(int tempTransId)
        {
            try
            {
                List<POSTempTransItem> PosTempItemList = _posTempTransItemContext.GetAll().Where(x => x.TempTransID == tempTransId).ToList();
                return PosTempItemList;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        public int GetTotalBillDataByBillDate()
        {
            try
            {
                DateTime today = DateTime.UtcNow.Date;
                int count = _posBillContext.Fetch(x => DbFunctions.TruncateTime(x.CreatedDateTime) == today).Count();
                return count;
            }
            catch (Exception)
            {
                throw;
            }
        }
        public void UpdatePosTempTransForSuspendBill(POSTempTrans posTempTrans)
        {
            try
            {
                var posTempOjb = _posTempTransContext.GetById(posTempTrans.Id);
                if (posTempOjb != null)
                {
                    posTempOjb.IsSuspendedBill = posTempTrans.IsSuspendedBill;
                    posTempOjb.TransReference = posTempTrans.TransReference;
                    posTempOjb.CustomerID = posTempTrans.CustomerID;
                    posTempOjb.ModifiedDateTime = DateTime.UtcNow;
                    _posTempTransContext.Update(posTempOjb);
                    _posTempTransContext.SaveChanges();
                }
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        public POSTempTrans GetPosTempTransByTransId(int transId)
        {
            try
            {
                var posTransObj = _posTempTransContext.GetById(transId);
                return posTransObj;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }
        public int GetSuspendBillCountByUserId(int UserId)
        {
            try
            {
                int count = _posTempTransContext.Fetch(x => x.IsSuspendedBill && x.UserID == UserId).Count();
                return count;
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
