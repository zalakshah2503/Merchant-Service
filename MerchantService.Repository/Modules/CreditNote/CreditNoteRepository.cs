using MerchantService.DomainModel.Models.CreditNote;
using MerchantService.DomainModel.Models.Item;
using MerchantService.DomainModel.Models.ItemDestruction;
using MerchantService.DomainModel.Models.SupplierReturn;
using MerchantService.Repository.DataRepository;
using MerchantService.Utility.Logger;
using System;
using System.Collections.Generic;
using System.Linq;

namespace MerchantService.Repository.Modules.CreditNote
{
    public class CreditNoteRepository : ICreditNoteRepository
    {
        private readonly IErrorLog _errorLog;
        private readonly IDataRepository<CreditNoteDetail> _creditNoteDetailContext;
        private readonly IDataRepository<CreditNoteItem> _iCreditNoteItemContext;
        private readonly IDataRepository<ItemOfferCreditNote> _itemOfferCreditNoteContext;
        private readonly IDataRepository<ItemDestructionCreditNote> _itemDestructionreditNoteContext;
        private readonly IDataRepository<SupplierReturnCreditNote> _supplierReturnCreditNoteContext;
        private readonly IDataRepository<RecevingCreditNotePaymentDetail> _recevingCreditNotePaymentDetailContext;

        public CreditNoteRepository(IDataRepository<CreditNoteDetail> creditNoteDetailContext, IDataRepository<CreditNoteItem> CreditNoteItemContext
            , IDataRepository<ItemOfferCreditNote> itemOfferCreditNoteContext, IDataRepository<ItemDestructionCreditNote> itemDestructionreditNoteContext,
            IDataRepository<SupplierReturnCreditNote> supplierReturnCreditNoteContext, IDataRepository<RecevingCreditNotePaymentDetail> recevingCreditNotePaymentDetailContext, IErrorLog errorLog)
        {
            _creditNoteDetailContext = creditNoteDetailContext;
            _itemOfferCreditNoteContext = itemOfferCreditNoteContext;
            _supplierReturnCreditNoteContext = supplierReturnCreditNoteContext;
            _itemDestructionreditNoteContext = itemDestructionreditNoteContext;
            _iCreditNoteItemContext = CreditNoteItemContext;
            _recevingCreditNotePaymentDetailContext = recevingCreditNotePaymentDetailContext;
            _errorLog = errorLog;
        }


        /// <summary>
        /// This method used for get list of credit note detail. -An
        /// </summary>
        /// <returns></returns>
        public List<CreditNoteDetail> GetListOfCreditNoteDetailByBranchId(int branchId, bool accessToAllBranch)
        {
            try
            {
                return (accessToAllBranch ? _creditNoteDetailContext.GetAll() : _creditNoteDetailContext.Fetch(x => x.BranchId == branchId)).OrderByDescending(x => x.CreatedDateTime).ToList();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }

        }


        /// <summary>
        /// This method used for add receving credit note detail. -An
        /// </summary>
        /// <param name="recevingCreditNotePaymentDetail"></param>
        /// <returns></returns>
        public int AddRecevingCreditNotePaymantDetal(RecevingCreditNotePaymentDetail recevingCreditNotePaymentDetail)
        {
            try
            {
                _recevingCreditNotePaymentDetailContext.Add(recevingCreditNotePaymentDetail);
                _recevingCreditNotePaymentDetailContext.SaveChanges();
                return recevingCreditNotePaymentDetail.Id;

            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// This method used for get credit note detail by id. -An
        /// </summary>
        /// <param name="creditNoteId"></param>
        /// <returns></returns>
        public CreditNoteDetail GetCreditNoteDetailById(int creditNoteId)
        {
            try
            {
                return _creditNoteDetailContext.FirstOrDefault(x => x.Id == creditNoteId);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// This method used for update credit note. -An
        /// </summary>
        /// <param name="creditNoteDetail"></param>
        /// <returns></returns>
        public int UpdateCreditNoteDetail(CreditNoteDetail creditNoteDetail)
        {
            try
            {
                creditNoteDetail.ModifiedDateTime = DateTime.UtcNow;
                _creditNoteDetailContext.Update(creditNoteDetail);
                _creditNoteDetailContext.SaveChanges();
                return creditNoteDetail.Id;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// This method used for get item offer credit note by credit number. -An
        /// </summary>
        /// <param name="creditNumber"></param>
        /// <returns></returns>
        public ItemOfferCreditNote GetItemOfferCreditNoteByCreditId(int creditNoteId)
        {
            try
            {
                return _itemOfferCreditNoteContext.FirstOrDefault(x => x.CreditNoteId == creditNoteId);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }

        }

        public ItemDestructionCreditNote GetItemDestructionCreditNoteByCreditId(int creditNoteId)
        {
            try
            {
                return _itemDestructionreditNoteContext.FirstOrDefault(x => x.CreditNoteId == creditNoteId);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        public SupplierReturnCreditNote GetSupplierReturnCreditNoteByCreditNoteId(int creditNoteId)
        {
            try
            {
                return _supplierReturnCreditNoteContext.FirstOrDefault(x => x.CreditNoteId == creditNoteId);

            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }

        }

        /// <summary>
        /// This method used for add credit note destruciton. -An
        /// </summary>
        /// <param name="itemDestructionCreditNote"></param>
        /// <returns></returns>
        public int AddCreditNoteDestruciton(ItemDestructionCreditNote itemDestructionCreditNote)
        {
            try
            {
                _itemDestructionreditNoteContext.Add(itemDestructionCreditNote);
                _itemDestructionreditNoteContext.SaveChanges();
                return itemDestructionCreditNote.Id;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }

        }

        /// <summary>
        /// This method used for add credit Note item offer. -An
        /// </summary>
        /// <param name="itemOfferCreditNote"></param>
        /// <returns></returns>
        public int AddCreditNoteItemOffer(ItemOfferCreditNote itemOfferCreditNote)
        {
            try
            {
                _itemOfferCreditNoteContext.Add(itemOfferCreditNote);
                _itemOfferCreditNoteContext.SaveChanges();
                return itemOfferCreditNote.Id;

            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// This method used for add credit notes item. -An
        /// </summary>
        /// <param name="creditNoteItems"></param>
        /// <returns></returns>
        public int AddCreditNotesItem(CreditNoteItem creditNoteItems)
        {
            try
            {
                _iCreditNoteItemContext.Add(creditNoteItems);
                _iCreditNoteItemContext.SaveChanges();
                return creditNoteItems.Id;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }

        }

        /// <summary>
        /// This method used for add credit notes detail. -An
        /// </summary>
        /// <param name="creditNoteItems"></param>
        /// <returns></returns>
        public int AddCreditNoteDetail(CreditNoteDetail creditNoteDetail)
        {
            try
            {
                _creditNoteDetailContext.Add(creditNoteDetail);
                _creditNoteDetailContext.SaveChanges();
                return creditNoteDetail.Id;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// This method used for get today list of credit notes. -An
        /// </summary>
        /// <param name="branchId"></param>
        /// <param name="typeId"></param>
        /// <returns></returns>
        public List<CreditNoteDetail> GetTodayListOfCreditNotes(int branchId, int typeId)
        {
            try
            {
                DateTime dt = DateTime.Today.AddDays(1);
                DateTime yesterdayDate = DateTime.Today.AddDays(-1);
                DateTime currentDateTime = new DateTime(dt.Year, dt.Month, dt.Day, 0, 0, 1);
                DateTime yesterdayDateTime = new DateTime(yesterdayDate.Year, yesterdayDate.Month, yesterdayDate.Day, 23, 59, 00);
                return _creditNoteDetailContext.Fetch(x => x.CreatedDateTime >= yesterdayDateTime && x.CreatedDateTime <= currentDateTime && x.BranchId == branchId && x.TypeId == typeId).ToList();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        #region Dispose Method
        public void Dispose()
        {
            try
            {
                _creditNoteDetailContext.Dispose();
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
