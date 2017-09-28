using MerchantService.DomainModel.Models.Branch;
using MerchantService.Repository.DataRepository;
using MerchantService.Utility.Logger;
using System;
using System.Linq;
using System.Collections.Generic;

namespace MerchantService.Repository.Modules.Admin
{
    public class AdditionalServiceRepository : IAdditionalServiceRepository
    {
        #region "Private Variable(s)"

        private readonly IDataRepository<AdditionalService> _additionalServiceContext;
        private readonly IErrorLog _errorLog;

        #endregion

        #region "Constructor"
        public AdditionalServiceRepository(IDataRepository<AdditionalService> additionalServiceContext, IErrorLog errorLog)
        {
            _additionalServiceContext = additionalServiceContext;
            _errorLog = errorLog;

        }
        #endregion

        #region Public Method(s)

        /// <summary>
        ///This method is used to get Additional Services list -JJ
        ///<param name="companyId">Company Id</param>
        /// </summary>
        /// <returns>return list of Additional Services</returns>
        public List<AdditionalService> GetAdditionalServicesList(int companyId)
        {
            try
            {
                var additionalServiceList = _additionalServiceContext.Fetch(x => x.CompanyId == companyId).ToList();
                return additionalServiceList;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
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
                _additionalServiceContext.Dispose();
                GC.SuppressFinalize(this);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);

            }
            finally
            {

            }
        }

        #endregion

    }
}
