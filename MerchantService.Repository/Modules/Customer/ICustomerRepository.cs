using MerchantService.DomainModel.Models;
using MerchantService.DomainModel.Models.Company;
using MerchantService.DomainModel.Models.Customer;
using MerchantService.DomainModel.Models.Global;
using MerchantService.Repository.ApplicationClasses.Customer;
using System;
using System.Collections.Generic;

namespace MerchantService.Repository.Modules.Customer
{
    public interface ICustomerRepository : IDisposable
    {
       /// <summary>
       /// this method is used for adding a new customer details.
       /// </summary>
       /// <param name="customerProfile"></param>
       /// <param name="companyDetail"></param>
       /// <param name="permission"></param>
       /// <param name="userDetail"></param>
       /// <returns></returns>
       string AddNewCustomerDetails(CustomerProfileAc customerProfile, CompanyDetail companyDetail, Permission permission, UserDetail userDetail);

       /// <summary>
       /// this method is used for to get all customer deatils.
       /// </summary>
       /// <returns></returns>
       List<CustomerProfile> GetAllCustomerList();

       CustomerProfileAc ViewCustomerDetailsById(int customerId, string userName, bool isAllowToReview, UserDetail userDetail, bool isAllowToCreateCustomerProfile);

       void CustomerRequestApproval(WorkFlowLogAc workFlow, UserDetail userDetail);


       /// <summary>
       /// this method is used for to get  customer details.- JJ
       /// </summary>
       /// <params name="id"></params>
       /// <returns>object of Customer Profile</returns>
       CustomerProfile GetCustomerById(int id);

     // CustomerProfileAc ReSubmitCustomerInformation(CustomerProfileAc customerProfile,, List<WorkFlowActivityAc> list, Permission permission,UserDetail userDetail);

       CustomerProfileAc ReSubmitCustomerInformation(CustomerProfileAc customerProfile, Permission permission, UserDetail userDetail, CompanyDetail companyDetail);
      CustomerProfile DeleteCustomerDetail(int customerId, UserDetail userDetail, CompanyDetail companyDetail);

      CustomerProfileAc UpdateCustomerInformation(CustomerProfileAc customerProfile, CompanyDetail companyDetail, Permission permission, UserDetail userDetail);
       /// <summary>
       /// This method used for get customer by member ship code or mobile no. -An 
       /// </summary>
       /// <param name="number"></param>
       /// <returns></returns>
       CustomerProfile GetCustomerByMebershipCodeOrMobileNo(string number);

       /// <summary>
       /// This method is used for update custome profile for pos transction .
       /// </summary>
       /// <param name="customerProfile">object of customer</param>
       /// <returns>object of customer</returns>
       CustomerProfile UpdateCustomerTransctionAmount(CustomerProfile customerProfile);


       /// <summary>
       /// get random membership code.
       /// </summary>
       /// <returns></returns>
       Int64 GetMembershipCode();

       bool CheckNumberAlreadyExistOrNot(CustomerProfileAc customerProfile);



       /// <summary>
       /// this method is used for to get all customer deatils. - jj
       /// </summary>
       /// <returns></returns>
       List<CustomerProfile> GetCustomerList();

       void SaveBalanceAmount(CustomerProfileAc customerInfo,int companyId);
    }
}
