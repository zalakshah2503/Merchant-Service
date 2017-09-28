using MerchantService.DomainModel.Models;
using MerchantService.DomainModel.Models.Company;
using MerchantService.DomainModel.Models.IncidentReport;
using MerchantService.DomainModel.Models.SystemParameters;
using MerchantService.DomainModel.Models.WorkFlow;
using MerchantService.Repository.ApplicationClasses.Admin.IncidentReport;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MerchantService.Repository.ApplicationClasses.IncidentReport;
using MerchantService.Repository.ApplicationClasses.Item;

namespace MerchantService.Repository.Modules.IncidentReports
{
    public interface IIncidentReportRepository :IDisposable
    {
        bool CheckIfAnyActiveIncidentForBarcode(int itemId,int incidentId);

        /// <summary>
        /// this method is used to get all incident report list.
        /// </summary>
        /// <param name="branchId"></param>
        /// <param name="isAllowToAccessAllBranch"></param>
        /// <returns></returns>
        List<PosIncidentReportAc> GetAllIncidentReportWorkList(int? branchId, bool isAllowToAccessAllBranch);
       
        /// <summary>
        /// this method is used to get incident report details by id.
        /// </summary>
        /// <param name="incidentId"></param>
        /// <param name="userDetail"></param>
        /// <returns></returns>
        PosIncidentReportAc GetIncidentReportDetailsById(int incidentId, UserDetail userDetail, bool isAllowToAccessAllBranch);

        /// <summary>
        /// This method is used for insert data in posIncidentReport.
        /// </summary>
        /// <param name="posIncidentReport"></param>
        /// <returns></returns>
        DomainModel.Models.IncidentReport.PosIncidentReport InsertPosIncidentReport(DomainModel.Models.IncidentReport.PosIncidentReport posIncidentReport);

       /// <summary>
       /// this methos is used to get item details by item id.
       /// </summary>
       /// <param name="itemId"></param>
       /// <returns></returns>
        ItemProfileAC GetItemProfileByItemId(int itemId);

        /// <summary>
        /// this method is used to update item details.
        /// </summary>
        /// <param name="itemDetails"></param>
        /// <returns></returns>
        int UpdateItemDetails(ItemProfileAC itemDetails);

        /// <summary>
        /// this method is used to submit the incident report.
        /// </summary>
        /// <param name="incidentReportDetails"></param>
        /// <param name="userDetail"></param>
        /// <param name="companyDetail"></param>
        /// <returns></returns>
        string SubmitIncidentReport(PosIncidentReportAc incidentReportDetails, UserDetail userDetail, CompanyDetail companyDetail);


        /// <summary>
        /// This method used for get list of conditional operator. -An
        /// </summary>
        /// <param name="workFlowId"></param>
        /// <returns></returns>
        List<ConditionalOperator> GetListOfConditionalOperator(int workFlowId);

        /// <summary>
        /// this method is used to review the incident report request by the id.
        /// </summary>
        /// <param name="incidentReportDetails"></param>
        /// <param name="userDetails"></param>
        /// <param name="companyDetails"></param>
        /// <returns></returns>
        string ReviewIncidentReportDetails(PosIncidentReportAc incidentReportDetails, UserDetail userDetails, CompanyDetail companyDetails);
     
        /// <summary>
        /// this method is used to either approve or reject the incident request by the id.
        /// </summary>
        /// <param name="incidentReportDetails"></param>
        /// <param name="userDetails"></param>
        /// <param name="companyDetails"></param>
        /// <returns></returns>
        string IncidentReportApproval(PosIncidentReportAc incidentReportDetails, UserDetail userDetails, CompanyDetail companyDetails);

        /// <summary>
        /// this method is used to update incide report details.
        /// </summary>
        /// <param name="incidentReportDetail"></param>
        void UpdateIncidentReportDetails(PosIncidentReportAc incidentReportDetail);

        /// <summary>
        /// This method used for get incident report by id. -An
        /// </summary>
        /// <returns></returns>
        IncidentReport GetIncidentReportById(int id);

        /// <summary>
        /// This method used for get cashier list by comapny id. -An
        /// </summary>
        /// <param name="companyId"></param>
        /// <returns></returns>
        List<CashierIncidentReport> getCashierIncidentReportList(int companyId);

        /// <summary>
        /// Update CashierIncidnetReport and return primary key. - An
        /// </summary>
        /// <param name="cashierIncidentReport"></param>
        /// <returns></returns>
        int UpdateCashierIncidentReport(CashierIncidentReport cashierIncidentReport);
    }
}
