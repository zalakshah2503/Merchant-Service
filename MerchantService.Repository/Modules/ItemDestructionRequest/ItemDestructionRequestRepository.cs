using MerchantService.DomainModel.Enums;
using MerchantService.DomainModel.Models.CreditNote;
using MerchantService.DomainModel.Models.ItemDestruction;
using MerchantService.Repository.DataRepository;
using MerchantService.Utility.Logger;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Data.Entity;

namespace MerchantService.Repository.Modules.ItemDestructionRequest
{
    public class ItemDestructionRequestRepository : IItemDestructionRequestRepository, IDisposable
    {
        #region "Private Variable(s)"

        private readonly IErrorLog _errorLog;
        private readonly IDataRepository<Destruction> _iDestructionContext;
        private readonly IDataRepository<ItemDestructionDetail> _iItemDestructionDetailContext;

        #endregion

        #region "Constructor & Destructor(s)"
        public ItemDestructionRequestRepository(IErrorLog errorLog, IDataRepository<Destruction> iDestructionContext,
            IDataRepository<ItemDestructionDetail> iItemDestructionDetailContext)
        {
            _errorLog = errorLog;
            _iItemDestructionDetailContext = iItemDestructionDetailContext;
            _iDestructionContext = iDestructionContext;
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
        /// This method used for get item destruction details. -An
        /// </summary>
        /// <param name="itemId"></param>
        /// <returns></returns>
        public List<ItemDestructionDetail> GetItemDestructionDetails(int itemId)
        {
            try
            {
                return _iItemDestructionDetailContext.Fetch(x => x.ItemId == itemId).ToList();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// This method used for add destruction object. -An
        /// </summary>
        /// <param name="destruction"></param>
        /// <returns></returns>
        public Destruction AddDestruction(Destruction destruction)
        {
            try
            {
                _iDestructionContext.Add(destruction);
                _iDestructionContext.SaveChanges();
                return destruction;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }

        }

        /// <summary>
        /// This method used for add destruction item and return primary key. -An
        /// </summary>
        /// <param name="itemDestructionDetail"></param>
        /// <returns></returns>
        public int AddDestructionItem(ItemDestructionDetail itemDestructionDetail)
        {
            try
            {
                _iItemDestructionDetailContext.Add(itemDestructionDetail);
                _iItemDestructionDetailContext.SaveChanges();
                return itemDestructionDetail.Id;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }

        }

        /// <summary>
        /// This method used for get destruction by id. -An 
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public Destruction GetDestructionById(int id)
        {
            try
            {
                return _iDestructionContext.FirstOrDefault(x => x.Id == id);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// This method used for get toda item destruction. -An
        /// </summary>
        /// <returns></returns>
        public List<Destruction> GetTodayItemDestructionListByBranchId(int branchId)
        {
            try
            {
                DateTime dt = DateTime.Today.AddDays(1);
                DateTime yesterdayDate = DateTime.Today.AddDays(-1);
                DateTime currentDateTime = new DateTime(dt.Year, dt.Month, dt.Day, 0, 0, 1);
                DateTime yesterdayDateTime = new DateTime(yesterdayDate.Year, yesterdayDate.Month, yesterdayDate.Day, 23, 59, 00);
                return _iDestructionContext.Fetch(x => x.CreatedDateTime >= yesterdayDateTime && x.CreatedDateTime <= currentDateTime && x.BranchId == branchId && !x.IsDelete).ToList();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// This method used for get destruction detail. -An
        /// </summary>
        /// <returns></returns>
        public List<Destruction> GetDestructionDetailAllBranch()
        {
            try
            {
                return _iDestructionContext.GetAll().OrderByDescending(x => x.CreatedDateTime).ToList();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }

        }

        /// <summary>
        /// This method used for Get Destruction Detail List by branchId. -An
        /// </summary>
        /// <param name="branchId"></param>
        /// <param name="accessAllBranch"></param>
        /// <returns></returns>
        public List<Destruction> GetDestructionDetailByBranchId(int branchId, bool accessAllBranch)
        {
            try
            {
                return (accessAllBranch ? _iDestructionContext.GetAll() : _iDestructionContext.Fetch(x => x.BranchId == branchId)).OrderByDescending(x => x.CreatedDateTime).ToList();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// This method used for getItem Destruction Details.
        /// </summary>
        /// <returns></returns>
        public List<ItemDestructionDetail> GetItemDestructionDetials(int destructionId)
        {
            try
            {
                return _iItemDestructionDetailContext.Fetch(x => x.DestructionId == destructionId).Include(x => x.ItemProfile).ToList();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }

        }


        /// <summary>
        /// This method used for delete item destruction detail by id. -An
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public bool DeleteItemDestructionDetail(int id)
        {
            try
            {
                _iItemDestructionDetailContext.Delete(x => x.Id == id);
                _iItemDestructionDetailContext.SaveChanges();
                return true;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// This method used for update destruction return primary key. -An
        /// </summary>
        /// <param name="destruction"></param>
        /// <returns></returns>
        public int UpdateDestruction(Destruction destruction)
        {
            try
            {
                destruction.ModifiedDateTime = DateTime.UtcNow;
                _iDestructionContext.Update(destruction);
                _iDestructionContext.SaveChanges();
                return destruction.Id;
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
