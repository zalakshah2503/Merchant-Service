using MerchantService.DomainModel.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MerchantService.DomainModel.Models.Branch;
using MerchantService.DomainModel.Models.Company;
using MerchantService.DomainModel.Models.Customer;
using MerchantService.DomainModel.Models.Role;

namespace MerchantService.Repository.ApplicationClasses.Customer
{
    public class CustomerPaymentReciptAc
    {
        public BranchDetail BranchDetail { get; set; }
        public List<CustomerProfileAc> CustomerDetails { get; set; }
        public long MemberShipNumber { get; set; }
        public string CurrentDate { get; set; }
        public string Invoice { get; set; }
    }

    public class CustomerProfileAc
    {
        public int CustomerId { get; set; }
        public int? RecordId { get; set; }
        public string Name { get; set; }
        public string ArabicName { get; set; }
        public string ArabicAddress { get; set; }
        public string Address { get; set; }
        public string Zipcode { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Mobile { get; set; }
        public int Fax { get; set; }
        public Int64 MembershipCode { get; set; }
        public string PriceCategory { get; set; }
        public string PriceCategoryName { get; set; }
        public decimal AmountLimit { get; set; }
        public decimal BalanceAmount { get; set; }
        public bool IsCreditCustomer { get; set; }
        public decimal TransactionAmount { get; set; }
        public decimal SalesAmount { get; set; }
        public bool IsActive { get; set; }
        public CustomerStatus Status { get; set; }
        public string Comments { get; set; }
        public bool IsAllowToApprove { get; set; }
        public bool IsAllowToReject { get; set; }
        //   public int RecordId { get; set; }
        public IOrderedEnumerable<WorkFlowActionAc> WorkFlowAction { get; set; }
        public bool IsDeleted { get; set; }
        public bool IsCurrentUser { get; set; }
        public UpdateCustomerInfoAc UpdateInformation { get; set; }
        public bool IsRejected { get; set; }
        public bool IsDisabled { get; set; }
        public bool IsUpdated { get; set; }
        public bool IsResubmitRequest { get; set; }
        public bool IsAllowReview { get; set; }
        public bool IsAmountDisabled { get; set; }
        public bool IsAddButtonDisabled { get; set; }
        public string Invoice { get; set; }
    }

    public class UpdateCustomerInfoAc
    {
        public int UpdatedCustomerId { get; set; }
        public int CustomerProfileId { get; set; }
        public int RecordId { get; set; }
        public string Name { get; set; }
        public string ArabicName { get; set; }
        public string ArabicAddress { get; set; }
        public string Address { get; set; }
        public string Zipcode { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Mobile { get; set; }
        public int Fax { get; set; }
        public Int32 MembershipCode { get; set; }
        public string PriceCategory { get; set; }
        public decimal AmountLimit { get; set; }
        public decimal BalanceAmount { get; set; }
        public bool IsCreditCustomer { get; set; }
        public decimal TransactionAmount { get; set; }
        public decimal SalesAmount { get; set; }
        public bool IsActive { get; set; }
        public CustomerStatus Status { get; set; }
        public string Comment { get; set; }
        public bool IsAllowToApprove { get; set; }
        public bool IsAllowToReject { get; set; }
        //   public int RecordId { get; set; }
        public List<WorkFlowActionAc> WorkFlowAction { get; set; }
        public bool IsDeleted { get; set; }
        public bool IsCurrentUser { get; set; }
        public UpdateCustomerInfoAc UpdateInformation { get; set; }
        public bool IsRejected { get; set; }
        public bool IsDisabled { get; set; }
        public bool IsAllowReview { get; set; }
        public bool IsResubmitRequest { get; set; }
        public int CustomerId { get; set; }
        public bool IsUpdated { get; set; }
        public bool IsAllowEnabled { get; set; }
        public bool IsAmountDisabled { get; set; }
    }
    public class WorkFlowActionAc
    {
        public int WorkFlowActionId { get; set; }
        public string Stage { get; set; }
        public string Action { get; set; }
        public string UserName { get; set; }
        public string ActionDate { get; set; }
        public string RoleName { get; set; }
        public string Comment { get; set; }
        public bool IsAllowApproval { get; set; }
        public int? NextActivityId { get; set; }
        public bool IsCondition { get; set; }
        public bool IsReview { get; set; }
        public bool IsRejected { get; set; }
        public string AssignedRole { get; set; }
        public string InitiatorRole { get; set; }
    }
}
