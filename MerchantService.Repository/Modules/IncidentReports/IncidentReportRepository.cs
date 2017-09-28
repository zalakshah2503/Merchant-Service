using MerchantService.DomainModel.Models;
using MerchantService.DomainModel.Models.Company;
using MerchantService.DomainModel.Models.IncidentReport;
using MerchantService.DomainModel.Models.Item;
using MerchantService.DomainModel.Models.SystemParameters;
using MerchantService.DomainModel.Models.WorkFlow;
using MerchantService.Repository.ApplicationClasses.Customer;
using MerchantService.Repository.ApplicationClasses.IncidentReport;
using MerchantService.Repository.ApplicationClasses.Item;
using MerchantService.Repository.DataRepository;
using MerchantService.Repository.Helper;
using MerchantService.Utility.Constants;
using MerchantService.Utility.Logger;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using NCalc;
using System.Globalization;

namespace MerchantService.Repository.Modules.IncidentReports
{
    public class IncidentReportRepository : IIncidentReportRepository
    {

        #region Private Variable

        private readonly IErrorLog _errorLog;

        private readonly IDataRepository<DomainModel.Models.IncidentReport.PosIncidentReport> _posIncidentReportDataRepository;
        private readonly IDataRepository<IncidentReport> _incidentReportContext;
        private readonly IDataRepository<CashierIncidentReport> _cashierIncidentReportContext;
        private readonly IDataRepository<ItemProfile> _itemProfileContext;
        private readonly IDataRepository<ItemQuantity> _itemQuantityContext;
        private readonly IDataRepository<WorkFlowDetail> _workFlowDetailContext;
        private readonly IDataRepository<ConditionalOperator> _conditionalOperatorContext;
        private readonly IDataRepository<ParentRecord> _parentRecordContext;
        private readonly IDataRepository<WorkFlowLog> _workFLowLogContext;
        private readonly IDataRepository<UserDetail> _userDetailContext;

        #endregion

        #region Constructor
        public IncidentReportRepository(IErrorLog errorLog, IDataRepository<DomainModel.Models.IncidentReport.PosIncidentReport> posIncidentReportDataRepository, IDataRepository<ItemProfile> itemProfileContext, IDataRepository<ItemQuantity> itemQuantityContext, IDataRepository<WorkFlowDetail> workFlowDetailContext, IDataRepository<ConditionalOperator> conditionalOperatorContext,
            IDataRepository<ParentRecord> parentRecordContext, IDataRepository<WorkFlowLog> workFLowLogContext, IDataRepository<UserDetail> userDetailContext,
            IDataRepository<IncidentReport> incidentReportContext, IDataRepository<CashierIncidentReport> cashierIncidentReportContext)
        {
            _errorLog = errorLog;
            _incidentReportContext = incidentReportContext;
            _cashierIncidentReportContext = cashierIncidentReportContext;
            _posIncidentReportDataRepository = posIncidentReportDataRepository;
            _itemProfileContext = itemProfileContext;
            _itemQuantityContext = itemQuantityContext;
            _workFlowDetailContext = workFlowDetailContext;
            _conditionalOperatorContext = conditionalOperatorContext;
            _parentRecordContext = parentRecordContext;
            _workFLowLogContext = workFLowLogContext;
            _userDetailContext = userDetailContext;
        }
        #endregion

        public void Dispose()
        {
            _posIncidentReportDataRepository.Dispose();
            _workFlowDetailContext.Dispose();
        }

        public bool CheckIfAnyActiveIncidentForBarcode(int itemId, int incidentId)
        {
            try
            {
                var incident = _posIncidentReportDataRepository.Fetch(x => x.ItemId == itemId
                    && x.IncidentType == incidentId && x.IsProcess);
                return incident.Any();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// this method is used to get all incident report list.
        /// </summary>
        /// <param name="branchId"></param>
        /// <param name="isAllowToAccessAllBranch"></param>
        /// <returns></returns>
        public List<PosIncidentReportAc> GetAllIncidentReportWorkList(int? branchId, bool isAllowToAccessAllBranch)
        {
            try
            {
                var incidentReportCollection = new List<PosIncidentReportAc>();
                if (isAllowToAccessAllBranch)
                {
                    foreach (var incidentReportDetails in _posIncidentReportDataRepository.GetAll().ToList())
                    {
                        incidentReportCollection.Add(MapPosIncidentReportAc(incidentReportDetails));
                    }
                }
                else
                {
                    foreach (var incidentReportDetails in _posIncidentReportDataRepository.Fetch(x => x.BranchId == branchId).ToList())
                    {
                        incidentReportCollection.Add(MapPosIncidentReportAc(incidentReportDetails));
                    }
                }
                return new List<PosIncidentReportAc>(incidentReportCollection.OrderByDescending(x => x.PosIncidentReportId));
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// Update CashierIncidnetReport and return primary key. - An
        /// </summary>
        /// <param name="cashierIncidentReport"></param>
        /// <returns></returns>
        public int UpdateCashierIncidentReport(CashierIncidentReport cashierIncidentReport)
        {
            try
            {
                cashierIncidentReport.ModifiedDateTime = DateTime.UtcNow;
                _cashierIncidentReportContext.Update(cashierIncidentReport);
                _cashierIncidentReportContext.SaveChanges();
                return cashierIncidentReport.Id;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// This method used for get cashier list by comapny id. -An
        /// </summary>
        /// <param name="companyId"></param>
        /// <returns></returns>
        public List<CashierIncidentReport> getCashierIncidentReportList(int companyId)
        {
            try
            {
                return _cashierIncidentReportContext.Fetch(x => x.UserDetail.Branch.CompanyId == companyId).ToList();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// This method used for get incident report by id. -An
        /// </summary>
        /// <param name="incidentReport"></param>
        /// <returns></returns>
        public IncidentReport GetIncidentReportById(int id)
        {
            try
            {
                return _incidentReportContext.FirstOrDefault(x => x.Id == id);

            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// this method is used to get incident report details by id.
        /// </summary>
        /// <param name="incidentId"></param>
        /// <param name="userDetail"></param>
        /// <returns></returns>
        public PosIncidentReportAc GetIncidentReportDetailsById(int incidentId, UserDetail userDetail, bool isAllowToAccessAllBranch)
        {
            try
            {
                var incidentReportDetail = _posIncidentReportDataRepository.FirstOrDefault(x => x.Id == incidentId);
                var incidentAc = new PosIncidentReportAc();
                incidentAc = ApplicationClassHelper.ConvertType<DomainModel.Models.IncidentReport.PosIncidentReport, PosIncidentReportAc>(incidentReportDetail);
                incidentAc.PosIncidentReportId = incidentReportDetail.Id;
                incidentAc.IncidentTypeName = incidentReportDetail.IncidentTypes.ValueEn;
                incidentAc.LossValue = incidentReportDetail.CommittedLossValue;
                incidentAc.GainValue = incidentReportDetail.CommittedGainValue;
                incidentAc.ResolveQuantity = incidentReportDetail.CommitedQuantity;
                incidentAc.ItemName = incidentReportDetail.ItemProfile.ItemNameEn;
                incidentAc.BranchName = incidentReportDetail.BranchDetail.Name;
                incidentAc.IsDisabledInfo = true;
                incidentAc.CostPrice = incidentReportDetail.ItemProfile.CostPrice;
                incidentAc.IncidentDate = incidentReportDetail.CreatedDateTime.ToString("dd/MM/yyyy hh:mm");
                incidentAc.SellPrice = incidentReportDetail.ItemProfile.SellPrice;
                var itemQuantityDetails =
                    _itemQuantityContext.FirstOrDefault(x => x.ItemId == incidentReportDetail.ItemId && x.BranchId == incidentReportDetail.BranchId);
                if (itemQuantityDetails != null)
                {
                    incidentAc.CurrentSystemQuantity = itemQuantityDetails.ActualQuantity;
                }
                var itemOfferDetail = new ItemOfferDetailAC
                {
                    ItemId = incidentReportDetail.ItemId,
                    Barcode = incidentReportDetail.ItemProfile.Barcode,
                    ItemNameEn = incidentReportDetail.ItemProfile.ItemNameEn,
                    FlavourEn = incidentReportDetail.ItemProfile.FlavourEn,
                    ItemCode = incidentReportDetail.ItemProfile.Code,
                    SellPriceA = incidentReportDetail.ItemProfile.SellPriceA,
                    SellPrice = incidentReportDetail.ItemProfile.SellPrice,
                    SellPriceB = incidentReportDetail.ItemProfile.SellPriceB,
                    SellPriceC = incidentReportDetail.ItemProfile.SellPriceC,
                    SellPriceD = incidentReportDetail.ItemProfile.SellPriceD,
                    UnitType = incidentReportDetail.ItemProfile.SystemParameter.ValueEn,
                    BaseUnitCount = incidentReportDetail.ItemProfile.BaseUnit,
                    CostPrice = incidentReportDetail.ItemProfile.CostPrice,
                    ItemNameAr = incidentReportDetail.ItemProfile.ItemNameSl,
                    FlavourAr = incidentReportDetail.ItemProfile.FlavourSl,
                    ItemType = incidentReportDetail.ItemProfile.Category.BrandParamType.ValueEn + "-" + incidentReportDetail.ItemProfile.Category.GroupParamType.ValueEn,
                    IsOfferItem = incidentReportDetail.ItemProfile.IsOfferItem == true ? "Yes" : "No",
                    PreviousCostPrice = incidentReportDetail.ItemProfile.PreviousCostPrice,
                    AverageCostPrice = incidentReportDetail.ItemProfile.AverageCostPrice,
                    IsActiveItem = incidentReportDetail.ItemProfile.IsActive == true ? "Yes" : "No"
                };
                incidentAc.ItemDetails = itemOfferDetail;
                if (isAllowToAccessAllBranch)
                {
                    incidentAc.IsCurrentUser = true;
                }
                else
                {
                    if (incidentReportDetail.BranchId == userDetail.BranchId)
                    {
                        incidentAc.IsCurrentUser = true;
                    }
                }
                var workflowCollection = new List<WorkFlowActionAc>();
                if (incidentReportDetail.RecordId != null)
                {
                    foreach (var workflowInfo in _workFLowLogContext.Fetch(x => x.RecordId == incidentReportDetail.RecordId).ToList())
                    {
                        var workFlowActionAc = new WorkFlowActionAc();
                        workFlowActionAc.Stage = workflowInfo.Stage;
                        workFlowActionAc.Action = workflowInfo.Action;
                        workFlowActionAc.WorkFlowActionId = workflowInfo.Id;
                        workFlowActionAc.RoleName = workflowInfo.RoleDetails.RoleName;
                        workFlowActionAc.Comment = workflowInfo.Comments;
                        workFlowActionAc.ActionDate = workflowInfo.CreatedDateTime.ToString("dd/MM/yyyy hh:mm"); ;
                        var userNames = _userDetailContext.FirstOrDefault(x => x.UserId == workflowInfo.UserId);
                        if (userNames != null)
                        {
                            workFlowActionAc.UserName = userNames.UserName;
                        }
                        workflowCollection.Add(workFlowActionAc);
                    }
                    incidentAc.WorkFlowAction = workflowCollection.OrderBy(x => x.WorkFlowActionId);
                    var workFLowLastDetails = _workFLowLogContext.Fetch(x => x.RecordId == incidentReportDetail.RecordId).ToList().Last();
                    if (incidentReportDetail.IsReject)
                    {
                        var workFlowCurrentDetails =
                      _workFlowDetailContext.FirstOrDefault(x => x.Id == workFLowLastDetails.WorkFlowDetail.ParentActivityId);
                        if (workFlowCurrentDetails != null)
                        {
                            WorkFlowDetail workDetailsById = _workFlowDetailContext.FirstOrDefault(x => x.Id == workFlowCurrentDetails.ParentActivityId && x.AssignedId == userDetail.RoleId);
                            if (workDetailsById != null)
                            {
                                incidentAc.IsReview = workDetailsById.IsReview;
                                incidentAc.IsApproval = workDetailsById.IsApproval;
                            }
                        }
                    }
                    else
                    {
                        var workFlowCurrentDetails =
                       _workFlowDetailContext.FirstOrDefault(x => x.Id == workFLowLastDetails.WorkFlowId && x.AssignedId == userDetail.RoleId);
                        if (workFlowCurrentDetails != null)
                        {
                            incidentAc.IsReview = workFlowCurrentDetails.IsReview;
                            incidentAc.IsApproval = workFlowCurrentDetails.IsApproval;
                        }
                    }
                }
                return incidentAc;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// this methos is used to get item details by item id.
        /// </summary>
        /// <param name="itemId"></param>
        /// <returns></returns>
        public ItemProfileAC GetItemProfileByItemId(int itemId)
        {
            try
            {
                var itemProfile = new ItemProfileAC();
                var itemProfileDetail = _itemProfileContext.FirstOrDefault(x => x.Id == itemId && x.IsDeleted == false);
                if (itemProfileDetail != null)
                {
                    var itemQuantiyCollection = new List<ItemQuantityList>();
                    var itemQuantityList = new ItemQuantityList();
                    itemProfile = ApplicationClassHelper.ConvertType<ItemProfile, ItemProfileAC>(itemProfileDetail);
                    itemProfile.ItemProfileId = itemProfileDetail.Id;
                    itemProfile.ItemType = itemProfileDetail.Category.BrandParamType.ValueEn + "-" + itemProfileDetail.Category.GroupParamType.ValueEn;
                    var posIncidentReportDetails = _posIncidentReportDataRepository.FirstOrDefault(x => x.ItemId == itemProfileDetail.Id);
                    itemProfile.PosIncidentReportId = posIncidentReportDetails.Id;
                    var posIncidentDetails = _posIncidentReportDataRepository.FirstOrDefault(x => x.ItemId == itemId);
                    if (posIncidentDetails != null)
                    {
                        itemProfile.BranchId = (int)posIncidentDetails.BranchId;
                        itemProfile.BranchName = posIncidentDetails.BranchDetail.Name;
                    }
                    var itemQuantityDetails = _itemQuantityContext.FirstOrDefault(x => x.ItemId == itemProfile.Id && x.Branch.CompanyId == itemProfileDetail.CompanyId);
                    if (itemQuantityDetails != null)
                    {
                        itemQuantityList = ApplicationClassHelper.ConvertType<ItemQuantity, ItemQuantityList>(itemQuantityDetails);
                        itemQuantityList.ItemQuantityId = itemQuantityDetails.Id;
                        itemProfile.BranchId = itemQuantityDetails.BranchId;
                        itemProfile.ActualQuantity = itemQuantityDetails.ActualQuantity;
                        itemQuantityList.MaximumQuantity = itemQuantityDetails.MaxQuantity;
                        itemQuantityList.MinimumQuantity = itemQuantityDetails.MinQuantity;
                    }
                    itemQuantiyCollection.Add(itemQuantityList);
                    itemProfile.ListOfItemQuantityList = itemQuantiyCollection;
                }
                return itemProfile;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// this method is used to update item details.
        /// </summary>
        /// <param name="itemDetails"></param>
        /// <returns></returns>
        public int UpdateItemDetails(ItemProfileAC itemDetails)
        {
            try
            {
                //used for update item profile
                var itemProfileDetail = _itemProfileContext.FirstOrDefault(x => x.Id == itemDetails.ItemProfileId);
                int posIncidentReportId = 0;
                if (itemProfileDetail != null)
                {
                    itemProfileDetail.ItemNameEn = itemDetails.ItemNameEn;
                    itemProfileDetail.ItemNameSl = itemDetails.ItemNameSl;
                    itemProfileDetail.FlavourEn = itemDetails.FlavourEn;
                    itemProfileDetail.FlavourSl = itemDetails.FlavourSl;
                    itemProfileDetail.Barcode = itemDetails.Barcode;
                    itemProfileDetail.UnitParamTypeId = itemDetails.UnitParamTypeId;
                    itemProfileDetail.Code = itemDetails.Code;
                    itemProfileDetail.BaseUnit = itemDetails.BaseUnit;
                    itemProfileDetail.CategoryId = itemDetails.CategoryId;
                    itemProfileDetail.IsOfferItem = itemDetails.IsOfferItem;
                    itemProfileDetail.IsActive = itemDetails.IsActive;
                    itemProfileDetail.IsAutomaticPO = itemDetails.IsAutomaticPO;
                    itemProfileDetail.ProfitMargin = itemDetails.ProfitMargin;
                    itemProfileDetail.SellPrice = itemDetails.SellPrice;
                    itemProfileDetail.SellPriceA = itemDetails.SellPriceA;
                    itemProfileDetail.SellPriceB = itemDetails.SellPriceB;
                    itemProfileDetail.SellPriceB = itemDetails.SellPriceB;
                    itemProfileDetail.SellPriceC = itemDetails.SellPriceC;
                    itemProfileDetail.SellPriceD = itemDetails.SellPriceD;
                    itemProfileDetail.CostPrice = itemDetails.CostPrice;
                    itemProfileDetail.ModifiedDateTime = DateTime.UtcNow;
                    _itemProfileContext.Update(itemProfileDetail);
                    _itemProfileContext.SaveChanges();

                    foreach (var itemQuantityObject in itemDetails.ListOfItemQuantityList)
                    {
                        var itemQuantityDetails =
                            _itemQuantityContext.FirstOrDefault(
                                x => x.ItemId == itemProfileDetail.Id && x.BranchId == itemQuantityObject.BranchId);
                        if (itemQuantityDetails != null)
                        {
                            if (itemQuantityDetails.BranchId != 0)
                            {
                                itemQuantityDetails.ActualQuantity = itemQuantityObject.ActualQuantity;
                                itemQuantityDetails.MaxQuantity = itemQuantityObject.MaximumQuantity;
                                itemQuantityDetails.MinQuantity = itemQuantityObject.MinimumQuantity;
                                itemQuantityDetails.ModifiedDateTime = DateTime.UtcNow;
                                _itemQuantityContext.Update(itemQuantityDetails);
                                _itemQuantityContext.SaveChanges();
                            }
                        }
                        else
                        {
                            var itemQuantity = new ItemQuantity
                            {
                                ActualQuantity = itemQuantityObject.ActualQuantity,
                                BranchId = itemDetails.BranchId,
                                CreatedDateTime = DateTime.UtcNow,
                                ItemId = itemProfileDetail.Id,
                                MaxQuantity = itemQuantityObject.MaximumQuantity,
                                MinQuantity = itemQuantityObject.MinimumQuantity
                            };
                            _itemQuantityContext.Add(itemQuantity);
                            _itemQuantityContext.SaveChanges();
                        }
                    }
                }
                return posIncidentReportId = itemDetails.PosIncidentReportId;

            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// this method is used to submit the incident report.
        /// </summary>
        /// <param name="incidentReportDetails"></param>
        /// <param name="userDetail"></param>
        /// <param name="companyDetail"></param>
        /// <returns></returns>

        public string SubmitIncidentReport(PosIncidentReportAc incidentReportDetails, UserDetail userDetail, CompanyDetail companyDetail)
        {
            try
            {
                string condtionOperation = "";
                var workDetailCollection = _workFlowDetailContext.Fetch(x => x.ParentPermission.Name == StringConstants.IncidentReport && x.CompanyId == companyDetail.Id).ToList();
                var incidentReportInfo = _posIncidentReportDataRepository.FirstOrDefault(x => x.Id == incidentReportDetails.PosIncidentReportId);
                incidentReportInfo.ShelfQuantity = incidentReportDetails.ShelfQuantity;
                incidentReportInfo.ItemOverQuantity = incidentReportDetails.ItemOverQuantity;
                if (workDetailCollection.Count == 0)
                {
                    return "Work Flow Not Created";
                }
                else
                {
                    var activityWorkFlow = workDetailCollection.FirstOrDefault(x => x.InitiatorId == userDetail.RoleId && x.IsParentAction && x.Activity.Name == StringConstants.InitiateIcr);
                    if (activityWorkFlow != null)
                    {
                        if (activityWorkFlow.IsCondition)
                        {
                            var conditionalCollection = GetListOfConditionalOperator(activityWorkFlow.Id);
                            string finalExpression = "";
                            if (conditionalCollection.Any())
                            {
                                foreach (var condition in conditionalCollection)
                                {
                                    if (condition.Condition != null)
                                    {

                                        switch (condition.Condition)
                                        {
                                            case "AND":
                                                condtionOperation = "&&";
                                                break;
                                            case "OR":
                                                condtionOperation = "||";
                                                break;
                                        }
                                    }
                                                                       
                                    string expression = GetExpression(condition.Variable1, incidentReportInfo);
                                    finalExpression = string.Concat(string.Concat(finalExpression, condtionOperation), expression);
                                }
                            }

                            Expression e = new Expression(finalExpression);
                            var finalResult = e.Evaluate();
                            if (Convert.ToBoolean(finalResult))
                                activityWorkFlow = workDetailCollection.FirstOrDefault(x => x.ParentActivityId == activityWorkFlow.Id && x.IsApprovePanel);
                            else
                                activityWorkFlow = workDetailCollection.FirstOrDefault(x => x.ParentActivityId == activityWorkFlow.Id && x.IsRejectPanel);
                            SaveIncidentReportDetails(incidentReportInfo, activityWorkFlow, incidentReportDetails.Comment, userDetail);
                            return "Work Flow Created";
                        }
                        else
                        {
                            var reportInformation = SaveIncidentReportDetails(incidentReportInfo, activityWorkFlow, incidentReportDetails.Comment, userDetail);
                            if (activityWorkFlow.NextActivity.IsClosed && reportInformation != null)
                            {
                                var reportDetails = _posIncidentReportDataRepository.FirstOrDefault(x => x.Id == reportInformation.Id);
                                reportDetails.IsActive = true;
                                UpdateItemCommitQuantity(reportDetails);
                                reportDetails.ModifiedDateTime = DateTime.UtcNow;
                                _posIncidentReportDataRepository.Update(reportDetails);
                                _posIncidentReportDataRepository.SaveChanges();

                            }
                            return "Work Flow Created";
                        }
                    }
                    else
                    {
                        return "Work Flow Not Created";
                    }
                }
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        private void UpdateItemCommitQuantity(DomainModel.Models.IncidentReport.PosIncidentReport reportDetails)
        {
            try
            {
                var itemQuantityDetails = _itemQuantityContext.FirstOrDefault(x => x.ItemId == reportDetails.ItemId && x.BranchId == reportDetails.BranchId);
                if (itemQuantityDetails != null)
                {
                    itemQuantityDetails.ActualQuantity = reportDetails.CommitedQuantity;
                    itemQuantityDetails.ModifiedDateTime = DateTime.UtcNow;
                    _itemQuantityContext.Update(itemQuantityDetails);
                    _itemQuantityContext.SaveChanges();
                }
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        private PosIncidentReportAc MapPosIncidentReportAc(DomainModel.Models.IncidentReport.PosIncidentReport incidentReportDetails)
        {
            try
            {
                var incidentAc = new PosIncidentReportAc();
                incidentAc = ApplicationClassHelper.ConvertType<DomainModel.Models.IncidentReport.PosIncidentReport, PosIncidentReportAc>(incidentReportDetails);
                if (incidentReportDetails.RecordId != null)
                {
                    var parentRecredDetails = _parentRecordContext.FirstOrDefault(x => x.Id == incidentReportDetails.RecordId);
                    if (parentRecredDetails != null)
                    {
                        var workFlowStatusDetails = _workFLowLogContext.Fetch(x => x.RecordId == parentRecredDetails.Id).ToList().Last();
                        if (workFlowStatusDetails != null)
                        {
                            incidentAc.WorkFlowStatus = workFlowStatusDetails.Action;
                        }
                    }
                }
                incidentAc.PosIncidentReportId = incidentReportDetails.Id;
                incidentAc.IncidentTypeName = incidentReportDetails.IncidentTypes.ValueEn;
                incidentAc.LossValue = incidentReportDetails.CommittedLossValue;
                incidentAc.GainValue = incidentReportDetails.CommittedGainValue;
                incidentAc.ResolveQuantity = incidentReportDetails.CommitedQuantity;
                incidentAc.ItemName = incidentReportDetails.ItemProfile.ItemNameEn;
                incidentAc.BranchName = incidentReportDetails.BranchDetail.Name;
                incidentAc.BranchId = (int)incidentReportDetails.BranchId;
                incidentAc.CostPrice = incidentReportDetails.ItemProfile.CostPrice;
                incidentAc.IncidentDate = incidentReportDetails.CreatedDateTime.ToString("dd/MM/yyyy hh:mm");
                return incidentAc;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        private DomainModel.Models.IncidentReport.PosIncidentReport SaveIncidentReportDetails(DomainModel.Models.IncidentReport.PosIncidentReport incidentReportInfo, WorkFlowDetail activityWorkFlow, string comment, UserDetail userDetail)
        {
            try
            {
                if (incidentReportInfo != null)
                {
                    ParentRecord parentRecord = new ParentRecord();
                    parentRecord.BranchId = incidentReportInfo.BranchId;
                    parentRecord.CreatedDateTime = DateTime.UtcNow;
                    parentRecord.InitiationComment = comment;
                    parentRecord.InitiationDate = DateTime.UtcNow;
                    parentRecord.ModificationDate = DateTime.UtcNow;
                    parentRecord.InitiatorId = userDetail.UserId;
                    parentRecord.ModifiedUserId = userDetail.UserId;
                    parentRecord.WorkFlowId = activityWorkFlow.Id;
                    _parentRecordContext.Add(parentRecord);
                    _parentRecordContext.SaveChanges();

                    if (parentRecord.Id != 0)
                    {
                        WorkFlowLog workFlowLog = new WorkFlowLog();
                        workFlowLog.Comments = comment;
                        workFlowLog.CreatedDateTime = DateTime.UtcNow;
                        workFlowLog.RecordId = parentRecord.Id;
                        workFlowLog.RoleId = userDetail.RoleId;
                        workFlowLog.UserId = userDetail.UserId;
                        workFlowLog.WorkFlowId = activityWorkFlow.Id;
                        workFlowLog.Action = StringConstants.InitiateAction;
                        workFlowLog.Stage = (userDetail.RoleName) + " " + (activityWorkFlow.Activity != null ? activityWorkFlow.Activity.Name : "");
                        _workFLowLogContext.Add(workFlowLog);
                        _workFLowLogContext.SaveChanges();

                        if (workFlowLog.Id != 0)
                        {
                            incidentReportInfo.IsProcess = false;
                            incidentReportInfo.RecordId = parentRecord.Id;
                            incidentReportInfo.ModifiedDateTime = DateTime.UtcNow;
                            _posIncidentReportDataRepository.Update(incidentReportInfo);
                            _posIncidentReportDataRepository.SaveChanges();
                        }
                    }
                    return incidentReportInfo;
                }
                else
                {
                    return null;
                }
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// this private method used for get expression. -An
        /// </summary>
        /// <param name="var1"></param>
        /// <param name="posIncidentReport"></param>
        /// <returns></returns>
        private string GetExpression(string var1, DomainModel.Models.IncidentReport.PosIncidentReport posIncidentReport)
        {
            try
            {
                string value1 = "";
                value1 = posIncidentReport.GetType().GetProperty(var1).GetValue(posIncidentReport, null).ToString();
                string str = (value1);
                return str.ToLower(CultureInfo.InvariantCulture);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// This method used for get list of conditional operator. -An
        /// </summary>
        /// <param name="workFlowId"></param>
        /// <returns></returns>
        public List<ConditionalOperator> GetListOfConditionalOperator(int workFlowId)
        {
            try
            {
                return _conditionalOperatorContext.Fetch(x => x.WorkFlowDetailId == workFlowId).ToList();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// this method is used to review the incident report request by the id.
        /// </summary>
        /// <param name="incidentReportDetails"></param>
        /// <param name="userDetails"></param>
        /// <param name="companyDetails"></param>
        /// <returns></returns>
        public string ReviewIncidentReportDetails(PosIncidentReportAc incidentReportDetails, UserDetail userDetails,
            CompanyDetail companyDetails)
        {
            try
            {
                var incidentReportInfo = _posIncidentReportDataRepository.FirstOrDefault(x => x.Id == incidentReportDetails.PosIncidentReportId);
                if (incidentReportInfo != null)
                {
                    var workFLowLastDetails = _workFLowLogContext.Fetch(x => x.RecordId == incidentReportInfo.RecordId).ToList().Last();
                    WorkFlowDetail workFlowCurrentDetails;
                    if (incidentReportInfo.IsReject)
                    {
                        workFlowCurrentDetails = _workFlowDetailContext.FirstOrDefault(x => x.Id == workFLowLastDetails.WorkFlowDetail.ParentActivityId);
                        if (workFlowCurrentDetails != null)
                        {
                            var workFlowLogDetails = SaveWorkFlowDetails(workFlowCurrentDetails, incidentReportInfo,
                                userDetails, incidentReportDetails.Comment, StringConstants.ReviewAction);
                            if (workFlowLogDetails.Id != 0)
                            {
                                incidentReportInfo.IsReject = false;
                                incidentReportInfo.ModifiedDateTime = DateTime.UtcNow;
                                _posIncidentReportDataRepository.Update(incidentReportInfo);
                                _posIncidentReportDataRepository.SaveChanges();
                            }
                            return "Work Flow Created";
                        }
                        else
                        {
                            return "Work Flow Not Created";
                        }
                    }
                    else
                    {
                        workFlowCurrentDetails = _workFlowDetailContext.FirstOrDefault(x => x.ParentActivityId == workFLowLastDetails.WorkFlowId);
                        if (workFlowCurrentDetails != null)
                        {
                            if (workFlowCurrentDetails.IsCondition)
                            {
                                var workLFowCollection =
                                    _workFlowDetailContext.Fetch(x => x.ParentActivityId == workFlowCurrentDetails.Id)
                                        .ToList();
                                var conditionalCollection = GetListOfConditionalOperator(workFlowCurrentDetails.Id);

                                StringBuilder finalExpression = new StringBuilder("");
                                if (conditionalCollection.Any())
                                {
                                    foreach (var condition in conditionalCollection)
                                    {
                                        string condtionOperation = null;
                                        if (condition.Condition != null)
                                        {

                                            switch (condition.Condition)
                                            {
                                                case "AND":
                                                    condtionOperation = "&&";
                                                    break;
                                                case "OR":
                                                    condtionOperation = "||";
                                                    break;
                                            }
                                        }
                                        string expressions = GetExpression(condition.Variable1, incidentReportInfo);
                                        finalExpression.Append(condtionOperation).Append(expressions);
                                    }
                                }
                                string expression = finalExpression.ToString();
                                Expression e = new Expression(expression);
                                var finalResult = e.Evaluate();
                                if (Convert.ToBoolean(finalResult))
                                    workFlowCurrentDetails = workLFowCollection.FirstOrDefault(x => x.ParentActivityId == workFlowCurrentDetails.Id && x.IsApprovePanel);
                                else
                                    workFlowCurrentDetails = workLFowCollection.FirstOrDefault(x => x.ParentActivityId == workFlowCurrentDetails.Id && x.IsRejectPanel);
                                var workFlowLogDetails = SaveWorkFlowDetails(workFlowCurrentDetails, incidentReportInfo, userDetails, incidentReportDetails.Comment, StringConstants.ReviewAction);
                                if (workFlowCurrentDetails != null && workFlowCurrentDetails.NextActivity.IsClosed)
                                {
                                    if (workFlowLogDetails.Id != 0)
                                    {
                                        incidentReportInfo.IsActive = true;
                                        var itemQuantityDetails = _itemQuantityContext.FirstOrDefault(x => x.ItemId == incidentReportInfo.ItemId && x.BranchId == incidentReportInfo.BranchId);
                                        if (itemQuantityDetails != null)
                                        {
                                            itemQuantityDetails.ActualQuantity = incidentReportInfo.CommitedQuantity;
                                            itemQuantityDetails.ModifiedDateTime = DateTime.UtcNow;
                                            _itemQuantityContext.Update(itemQuantityDetails);
                                            _itemQuantityContext.SaveChanges();
                                        }
                                        incidentReportInfo.ModifiedDateTime = DateTime.UtcNow;
                                        _posIncidentReportDataRepository.Update(incidentReportInfo);
                                        _posIncidentReportDataRepository.SaveChanges();
                                    }
                                    return "Work Flow Created";
                                }
                                else
                                {
                                    return "Work Flow Not Created";
                                }
                            }
                            else
                            {
                                var workFlowLogDetails = SaveWorkFlowDetails(workFlowCurrentDetails, incidentReportInfo, userDetails, incidentReportDetails.Comment, StringConstants.ReviewAction);
                                if (workFlowCurrentDetails.NextActivity.IsClosed && workFlowLogDetails.Id != 0)
                                {
                                    UpdateItemCommitQuantity(incidentReportInfo);
                                    incidentReportInfo.IsActive = true;
                                    incidentReportInfo.ModifiedDateTime = DateTime.UtcNow;
                                    _posIncidentReportDataRepository.Update(incidentReportInfo);
                                    _posIncidentReportDataRepository.SaveChanges();
                                }
                                return "Work Flow Created";
                            }
                        }
                        else
                        {
                            return "Work Flow Not Created";
                        }
                    }
                }
                else
                {
                    return "No Record Found";
                }
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        private WorkFlowLog SaveWorkFlowDetails(WorkFlowDetail workFlowCurrentDetails, DomainModel.Models.IncidentReport.PosIncidentReport incidentReportInfo, UserDetail userDetails, string comment, string action)
        {
            try
            {
                WorkFlowLog workFlowLog = new WorkFlowLog();
                workFlowLog.Comments = comment;
                workFlowLog.CreatedDateTime = DateTime.UtcNow;
                workFlowLog.RecordId = (int)incidentReportInfo.RecordId;
                workFlowLog.RoleId = userDetails.RoleId;
                workFlowLog.UserId = userDetails.UserId;
                workFlowLog.WorkFlowId = workFlowCurrentDetails.Id;
                workFlowLog.Action = action;
                workFlowLog.Stage = (userDetails.RoleName) + " " + (workFlowCurrentDetails.Activity != null ? workFlowCurrentDetails.Activity.Name : "");
                _workFLowLogContext.Add(workFlowLog);
                _workFLowLogContext.SaveChanges();
                return workFlowLog;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// this method is used to either approve or reject the incident request by the id.
        /// </summary>
        /// <param name="incidentReportDetails"></param>
        /// <param name="userDetails"></param>
        /// <param name="companyDetails"></param>
        /// <returns></returns>
        public string IncidentReportApproval(PosIncidentReportAc incidentReportDetails, UserDetail userDetails,
            CompanyDetail companyDetails)
        {
            try
            {
                var incidentReportInfo = _posIncidentReportDataRepository.FirstOrDefault(x => x.Id == incidentReportDetails.PosIncidentReportId);
                if (incidentReportInfo != null)
                {
                    var workFLowLastDetails = _workFLowLogContext.Fetch(x => x.RecordId == incidentReportInfo.RecordId).ToList().Last();
                    var workFlowCollection = _workFlowDetailContext.Fetch(x => x.ParentActivityId == workFLowLastDetails.WorkFlowId).ToList();
                    if (workFlowCollection.Count() != 0)
                    {
                        WorkFlowDetail currentWorkFlowDetails;
                        if (incidentReportDetails.IsStatus)
                        {
                            currentWorkFlowDetails = workFlowCollection.FirstOrDefault(x => x.IsApprovePanel);
                            if (currentWorkFlowDetails != null)
                            {
                                var workFlowLogDetails = SaveWorkFlowDetails(currentWorkFlowDetails, incidentReportInfo, userDetails, incidentReportDetails.Comment, StringConstants.ApprovAction);
                                if (currentWorkFlowDetails.NextActivity.IsClosed && workFlowLogDetails.Id != 0)
                                {
                                    UpdateItemCommitQuantity(incidentReportInfo);
                                    incidentReportInfo.IsActive = true;
                                    if (incidentReportInfo.IsReject)
                                    {
                                        incidentReportInfo.IsReject = false;
                                    }
                                    incidentReportInfo.ModifiedDateTime = DateTime.UtcNow;
                                    _posIncidentReportDataRepository.Update(incidentReportInfo);
                                    _posIncidentReportDataRepository.SaveChanges();
                                }
                                return "Work Flow Created";
                            }
                        }
                        else
                        {
                            currentWorkFlowDetails = workFlowCollection.FirstOrDefault(x => x.IsRejectPanel);
                            if (currentWorkFlowDetails != null)
                            {
                                var workFlowLogDetails = SaveWorkFlowDetails(currentWorkFlowDetails, incidentReportInfo, userDetails, incidentReportDetails.Comment, StringConstants.RejectAction);

                                if (!currentWorkFlowDetails.NextActivity.IsClosed && workFlowLogDetails.Id != 0)
                                {
                                    incidentReportInfo.IsReject = true;
                                    incidentReportInfo.ModifiedDateTime = DateTime.UtcNow;
                                    _posIncidentReportDataRepository.Update(incidentReportInfo);
                                    _posIncidentReportDataRepository.SaveChanges();
                                }
                                return "Work Flow Created";
                            }
                        }
                        return "Work Flow Created";
                    }
                    else
                    {
                        return "Work Flow Not Created";
                    }
                }
                else
                {
                    return "No Record Found";
                }
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// this method is used to update incide report details.
        /// </summary>
        /// <param name="incidentReportDetail"></param>
        public void UpdateIncidentReportDetails(PosIncidentReportAc incidentReportDetail)
        {
            try
            {
                var incidentdetails =
                    _posIncidentReportDataRepository.FirstOrDefault(
                        x => x.Id == incidentReportDetail.PosIncidentReportId);
                if (incidentdetails != null)
                {
                    incidentdetails.CommitedQuantity = incidentReportDetail.CommitedQuantity;
                    incidentdetails.CommittedGainValue = incidentReportDetail.CommittedGainValue;
                    incidentdetails.CommittedLossValue = incidentReportDetail.CommittedLossValue;
                    incidentdetails.ModifiedDateTime = DateTime.UtcNow;
                    _posIncidentReportDataRepository.Update(incidentdetails);
                    _posIncidentReportDataRepository.SaveChanges();
                }
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// This method is used for insert data in posIncidentReport.
        /// </summary>
        /// <param name="posIncidentReport"></param>
        /// <returns></returns>
        public DomainModel.Models.IncidentReport.PosIncidentReport InsertPosIncidentReport(DomainModel.Models.IncidentReport.PosIncidentReport posIncidentReport)
        {
            try
            {
                posIncidentReport.CreatedDateTime = DateTime.UtcNow;
                _posIncidentReportDataRepository.Add(posIncidentReport);
                _posIncidentReportDataRepository.SaveChanges();
                return posIncidentReport;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }
    }
}