using System;
using MerchantService.Repository.DataRepository;
using MerchantService.Utility.Logger;

namespace LocalDBExtractor.Core.Repository.PayLoad
{
    public class PayLoadRepository : IPayLoadRepository
    {
        #region Private variables

        private readonly IDataRepository<MerchantService.DomainModel.Models.PayLoad> _payLoadContext;

        private readonly IErrorLog _errorLog;

        #endregion

        #region Constructor

        /// <summary>
        /// Default constructor
        /// </summary>
        public PayLoadRepository(IDataRepository<MerchantService.DomainModel.Models.PayLoad> payLoadContext, IErrorLog errorLog)
        {
            _payLoadContext = payLoadContext;
            _errorLog = errorLog;
        }

        #endregion

        #region Public methods

        /// <summary>
        /// Method to add payload to database
        /// </summary>
        /// <param name="payLoad"></param>
        /// <returns></returns>
        public MerchantService.DomainModel.Models.PayLoad AddPayLoad(MerchantService.DomainModel.Models.PayLoad payLoad)
        {
            try
            {
                _payLoadContext.Add(payLoad);
                _payLoadContext.SaveChanges();
                return payLoad;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        public void Dispose()
        {
            try
            {
                _payLoadContext.Dispose();
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
