using MerchantService.DomainModel.Models.POS;
using MerchantService.Repository.DataRepository;
using MerchantService.Utility.Logger;
using System;
using System.Collections.Generic;
using System.Linq;

namespace MerchantService.Repository.Modules.POS
{
    public class ReturnBillRepository : IReturnBillRepository, IDisposable
    {
        #region "Private Variable(s)"

        private readonly IErrorLog _errorLog;
        private readonly IDataRepository<POSBill> _posBillContext;
        private readonly IDataRepository<POSBillItem> _posBillItemContext;
        private readonly IDataRepository<POSBillPayment> _posBillPaymentContext;
        private readonly IDataRepository<POSReturnBill> _posReturnBillContext;
        private readonly IDataRepository<POSReturnBillItem> _posReturnBillItemContext;

        #endregion

        #region "Constructor & Destructor(s)"

        public ReturnBillRepository(IErrorLog errorLog, IDataRepository<POSBill> posBillContext,
            IDataRepository<POSBillItem> posBillItemContext, IDataRepository<POSBillPayment> posBillPaymentContext,
            IDataRepository<POSReturnBill> posReturnBillContext, IDataRepository<POSReturnBillItem> posReturnBillItemContext)
        {
            _posBillContext = posBillContext;
            _errorLog = errorLog;
            _posReturnBillContext = posReturnBillContext;
            _posReturnBillItemContext = posReturnBillItemContext;
            _posBillPaymentContext = posBillPaymentContext;
            _posBillItemContext = posBillItemContext;
        }
        #endregion

        #region "Dispose Method(s)"

        public void Dispose()
        {
            try
            {
                _posBillContext.Dispose();
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
        /// This method used for get POS Return Bill by Id. -An
        /// </summary>
        /// <param name="returnBillNumber"></param>
        /// <returns>object of POSReturnBill</returns>
        public POSReturnBill GetPOSReturnBillByReturnBillNumber(string returnBillNumber)
        {
            try
            {
                return _posReturnBillContext.FirstOrDefault(x => x.ReturnedBillNo == returnBillNumber);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// This method used for get list of pos return bill. -An
        /// </summary>
        /// <returns>list of object of POSReturnBill</returns>
        public List<POSReturnBill> GetListOfPOSRetunBill()
        {
            try
            {
                return _posReturnBillContext.GetAll().ToList().Where(x => x.CreatedDateTime.Date == DateTime.UtcNow.Date).ToList();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// This method used for get list of pos return bill by branch id. -An
        /// </summary>
        /// <param name="branchId"></param>
        /// <returns>list of POSReturnBill</returns>
        public List<POSReturnBill> GetListOfPOSReturnBillByBranchId(int branchId)
        {
            try
            {
                return _posReturnBillContext.Fetch(x => x.IssuingBranchID == branchId && !x.IsDeleted).OrderByDescending(x => x.CreatedDateTime).ToList();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// This method used for get customer pay toatl amount. -An
        /// </summary>
        /// <param name="posBillId">passs posBillId</param>
        /// <returns>total amount</returns>
        public decimal GetCustomerPayTotalAmount(int posBillId)
        {
            try
            {
                decimal totalAmt = 0;
                List<POSBillPayment> listOfPOSBillPayment = _posBillPaymentContext.Fetch(x => x.POSBillID == posBillId).ToList();
                foreach (var posBillPayment in listOfPOSBillPayment)
                {
                    totalAmt = posBillPayment.Amount + totalAmt;
                }
                return totalAmt;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// This method used for get pos bill item by id. -An
        /// </summary>
        /// <param name="id"></param>
        /// <returns>object of POSBillItem</returns>
        public POSBillItem GetPOSBillItemById(int id)
        {
            try
            {
                return _posBillItemContext.FirstOrDefault(x => x.Id == id);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// This method used for get list of pos return bill item by pos bill item id. -An
        /// </summary>
        /// <param name="posBillItemId"></param>
        /// <returns>list of POSReturnBillItem</returns>
        public List<POSReturnBillItem> GetListOfPOSRetunBillItemByPOSBillItemId(int posBillItemId)
        {
            try
            {
                return _posReturnBillItemContext.Fetch(x => x.POSBiillItemID == posBillItemId && !x.IsDeleted).ToList();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// This method used for update pos return bill item and return primary key. -An
        /// </summary>
        /// <param name="posRetunrBillItem"></param>
        /// <returns>id of bill</returns>
        public int UpdatePosReturnBillItem(POSReturnBillItem posRetunrBillItem)
        {
            try
            {
                posRetunrBillItem.ModifiedDateTime = DateTime.UtcNow;
                _posReturnBillItemContext.Update(posRetunrBillItem);
                _posReturnBillItemContext.SaveChanges();
                return posRetunrBillItem.Id;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// This method used for get list of pos return bill item by return bill id. -An
        /// </summary>
        /// <param name="returnBillId"></param>
        /// <returns>list of POSReturnBillItem</returns>
        public List<POSReturnBillItem> GetListOfPOSReturnBillItemByReturnBillId(int returnBillId)
        {
            try
            {
                return _posReturnBillItemContext.Fetch(x => x.ReturnedBillID == returnBillId && !x.IsDeleted).ToList();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// This method used for get pos bill by bill number. -An
        /// </summary>
        /// <param name="billNumber"></param>
        /// <param name="branchId"></param>
        /// <returns>object of POSBill</returns>
        public POSBill GetPOSBillByBillNumber(string billNumber, int branchId)
        {
            try
            {
                return _posBillContext.FirstOrDefault(x => x.BillNo == billNumber && x.BranchID == branchId);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// This method used for get pos bill item by id. -An
        /// </summary>
        /// <param name="billId"></param>
        /// <returns></returns>
        public List<POSBillItem> GetPOSBillItemListByBillId(int billId)
        {
            try
            {
                return _posBillItemContext.Fetch(x => x.BillID == billId).ToList();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// This method uesd for get pos bill payment list by bill id. -An
        /// </summary>
        /// <param name="billId"></param>
        /// <returns></returns>
        public List<POSBillPayment> GetPOSBillPaymentListByBillId(int billId)
        {
            try
            {
                return _posBillPaymentContext.Fetch(x => x.POSBillID == billId).ToList();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// This method used for get pos bill list by branch id. -An
        /// </summary>
        /// <param name="companyId"></param>
        /// <returns></returns>
        public List<POSBill> GetPOSBillListByBranchId(int branchId)
        {
            try
            {
                return _posBillContext.Fetch(x => x.BranchID == branchId).OrderByDescending(x => x.BillDate).ToList();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// This method used for insert into POSReturnBill. -An
        /// </summary>
        /// <param name="posReturnBill"></param>
        /// <returns></returns>
        public int AddPOSReturnBill(POSReturnBill posReturnBill)
        {
            try
            {
                _posReturnBillContext.Add(posReturnBill);
                _posReturnBillContext.SaveChanges();
                return posReturnBill.Id;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// This method used for nsert into posReturnBillItem and return primary key. -An
        /// </summary>
        /// <param name="posReturnBillItem">posReturnBillItem Contains POSBiillItemID,ReturnedQuantity</param>
        /// <returns></returns>
        public int AddPOSReturnBillItem(POSReturnBillItem posReturnBillItem)
        {
            try
            {
                _posReturnBillItemContext.Add(posReturnBillItem);
                _posReturnBillItemContext.SaveChanges();
                return posReturnBillItem.Id;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// This method used for get pos return bill item bu id. -An
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public POSReturnBillItem GetPOSReturnBillItemById(int id)
        {
            try
            {
                return _posReturnBillItemContext.FirstOrDefault(x => x.Id == id && !x.IsDeleted);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// This method used for get list Of Pos return Bill. -An
        /// </summary>
        /// <returns></returns>
        public List<POSReturnBill> GetListOfPOSReturnBillByPOSBillId(int posBillId)
        {
            try
            {
                return _posReturnBillContext.Fetch(x => x.POSBillId == posBillId).ToList();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        public POSReturnBill GetPosReturnBillDataByReturnBillNo(string billNo)
        {
            try
            {
                return _posReturnBillContext.FirstOrDefault(x => x.ReturnedBillNo == billNo && !x.IsDeleted);

            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        public bool UpdatePosReturnBillForPOs(POSReturnBill posReturnBill)
        {
            try
            {
                var posOjb = _posReturnBillContext.GetById(posReturnBill.Id);
                if (posOjb != null)
                {
                    posOjb.IsProcessed = posReturnBill.IsProcessed;
                    posOjb.ProcessorID = posReturnBill.ProcessorID;
                    posOjb.ProcessingBranchID = posReturnBill.ProcessingBranchID;
                    posOjb.ModifiedDateTime = DateTime.UtcNow;
                    _posReturnBillContext.Update(posOjb);
                    _posReturnBillContext.SaveChanges();
                    return true;
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
        /// 
        /// </summary>
        /// <param name="posBillItemId"></param>
        /// <returns></returns>
        public int GetReturnedQuantityByPosBillItemId(int posBillItemId)
        {
            var records = _posReturnBillItemContext.Fetch(x => x.POSBiillItemID == posBillItemId);
            if (records.Any())
            {
                return records.Sum(x => x.ReturnedQuantity);
            }
            return 0;
        }
        #endregion

    }
}