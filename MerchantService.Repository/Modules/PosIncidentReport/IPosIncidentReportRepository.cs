using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MerchantService.Repository.Modules.PosIncidentReport
{
    public interface IPosIncidentReportRepository : IDisposable
    {
        /// <summary>
        /// This method is used for insert data in posIncidentReport.
        /// </summary>
        /// <param name="posIncidentReport"></param>
        /// <returns></returns>
        DomainModel.Models.IncidentReport.PosIncidentReport InsertPosIncidentReport(DomainModel.Models.IncidentReport.PosIncidentReport posIncidentReport);


    }
}
