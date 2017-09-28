using MerchantService.Repository.DataRepository;
using MerchantService.Utility.Logger;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MerchantService.Repository.Modules.PosIncidentReport
{
    public class PosIncidentReportRepository : IPosIncidentReportRepository
    {
        #region Private Variable

        private readonly IDataRepository<DomainModel.Models.IncidentReport.PosIncidentReport> _posIncidentReportContext;
        
        private readonly IErrorLog _errorLog;
        #endregion

        #region Constructor
        public PosIncidentReportRepository(IDataRepository<DomainModel.Models.IncidentReport.PosIncidentReport> posIncidentReport, IErrorLog errorLog)
        {
            _posIncidentReportContext = posIncidentReport;
            _errorLog = errorLog;
        }
        #endregion

        #region Public Method
        public DomainModel.Models.IncidentReport.PosIncidentReport InsertPosIncidentReport(DomainModel.Models.IncidentReport.PosIncidentReport posIncidentReport)
        {
            try
            {
                _posIncidentReportContext.Add(posIncidentReport);
                _posIncidentReportContext.SaveChanges();
                return posIncidentReport;
            }
            catch (Exception)
            {
                
                throw;
            }
        }
        #endregion

        #region Dispose Method
        public void Dispose()
        {
            try
            {
                _posIncidentReportContext.Dispose();
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
