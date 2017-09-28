using MerchantService.DomainModel.Models.IncidentReport;
using MerchantService.DomainModel.Models.SystemParameters;
using MerchantService.Repository.ApplicationClasses.Admin.IncidentReport;
using System.Collections.Generic;

namespace MerchantService.Repository.Modules.Admin.IncidentReports
{
    public interface IManageIncidentReportRepository
    {

        /// <summary>
        /// This method used for insert in to incident report and return primary key. -An
        /// </summary>
        /// <param name="incidentReport">incident report contain OperationTypeId,AmountLimit,OperationCounter,Comment,
        /// StatusId,StartDateTime,EndDateTime,DurationTypeId,CompanyId</param>
        /// <returns></returns>
        int AddIncidentReport(IncidentReport incidentReport);

        /// <summary>
        /// This method used for get list of incident report by param Id. -An
        /// </summary>
        /// <returns></returns>
        List<ParamType> GetListOfOpration(int ParamId);

        /// <summary>
        /// This method used for get incident report list by compantId. -An
        /// </summary>
        /// <param name="comapnyId"></param>
        /// <returns></returns>
        List<IncidentReport> GetIncidentReportList(int comapnyId);

        /// <summary>
        /// This method used for update incident report. -An
        /// </summary>
        /// <param name="incidentReport"></param>
        /// <returns></returns>
        int UpdateIncidentReport(IncidentReport incidentReport);

        ///<summary>
        ///This method used for get list Of Incident Report WorList. -An
        ///</summary>
        /// <returns></returns>
        List<IncidentReportWorkListAC> listOfIncidentReportWorkListAC(int companyId);

        /// <summary>
        /// This method is used for insert data in CashierIncidentreprot. -PS
        /// </summary>
        /// <param name="cashierIncidentReport">object of CashierIncidentReport </param>
        /// <returns>object of CashierIncidentReport </returns>
        CashierIncidentReport InsertDataInCashierIncidnetReport(CashierIncidentReport cashierIncidentReport);


        /// <summary>
        /// This method is used for getting cahier record by cashier id. -PS
        /// </summary>
        /// <param name="cashierId"></param>
        /// <returns></returns>
        List<CashierIncidentReport> GetCashierIncidentReportByCashierId(int cashierId);


        /// <summary>
        /// This method used for get cashier incident report by id. -An.
        /// </summary>
        /// <param name="cashierId"></param>
        /// <returns></returns>
        List<CashierIncidentReport> GetCashierIncidentListByCashierId(int cashierId);
             
        /// <summary>
        /// This method used for Get Cashier Incidnet Report By Id. -An
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        CashierIncidentReport GetCashierIncidnetReportById(int id);

        CashierIncidentReport UpdateCashierIncidentReportByCashier(CashierIncidentReport cashierIncidentReport);

        /// <summary>
        /// This method used for get incident report by company id. -An
        /// </summary>
        /// <param name="companyId"></param>
        /// <returns></returns>
        IncidentReport GetIncidentReportByCompanyId(int companyId);

        /// <summary>
        ///This method used for get list of cashier incident report by comapny id. -An 
        /// </summary>
        /// <param name="companyId"></param>
        /// <returns></returns>
        List<CashierIncidentReport> GetListOfCashierIncidentReportByCompanyId(int companyId);


        /// <summary>
        /// This method used for get incident report by id. -An
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        IncidentReport GetIncidentReportById(int id);
    }
}
