using MerchantService.DomainModel.Models.Company;
using MerchantService.DomainModel.Models.Globalization;
using MerchantService.Repository.ApplicationClasses.Admin.Company;
using System;
using System.Collections.Generic;

namespace MerchantService.Repository.Modules.Admin.Company
{
    public interface ICompanyRepository : IDisposable
    {
         /// <summary>
       /// check log is allowed or not. - ps
       /// </summary>
       /// <returns>return true if log is allowed,otherwise return false</returns>
       bool CheckLogAllowedOrNot();

       /// <summary>
       /// check secondary labguage is selcted or not. - ps
       /// </summary>
       /// <returns>return true if secondary language is selected otherwise false</returns>
       bool CheckSecondaryLanguageSelectedOrNot();

       /// <summary>
       /// add new company details
       /// </summary>
       /// <param name="companyDetail">company detailAC with company details</param>
       /// <returns>object of company detail</returns>
       CompanyDetailAC AddCompanyDetail(CompanyDetailAC companyDetail,string userId);

       /// <summary>
       /// get all company list
       /// </summary>
       /// <returns>list of company</returns>
       List<CompanyDetail> GetAllCompanyDetail();

       /// <summary>
       /// get company detials by the companyId
       /// </summary>
       /// <param name="companyId">contain comapnyId to get company basic details.</param>
       /// <returns>object of company detail with the basic details of company</returns>
       CompanyDetailAC GetCompanyDetailsById(int companyId,string userId);

       /// <summary>
       /// update the company details
       /// </summary>
       /// <param name="companyDetail">compant detailAC with updated company detail.</param>
       /// <returns>object company detail with updated company details</returns>
       CompanyDetailAC UpdateCompanyDetail(CompanyDetailAC companyDetail);

       /// <summary>
       /// get all languages
       /// </summary>
       /// <returns>list of languages</returns>
       List<Language> GetAllLanguage();

       /// <summary>
       /// delete the comapany information
       /// </summary>
       /// <param name="companyId">contain company id to delete company details.</param>
       void DeleteCompanyDetails(int companyId);


        /// <summary>
        /// this method is used to add system settings to database. -JJ
        /// </summary>
        /// <param name="companyDetail">object of CompanyDetailAC</param>
        /// <returns>saved object of CompanyDetailAC</returns>
        CompanyDetailAC AddSystemSetting(CompanyDetailAC systemSetting, string userName);


        /// <summary>
        /// this method is used to get system setting - JJ
        /// </summary>
        /// <param name="userName">Currently logged in userName</param>
        /// <returns> Object of CompanyConfiguration </returns>
        CompanyConfiguration GetSystemSetting(string userName);

       /// <summary>
       /// get the current user company list
       /// </summary>
       /// <param name="UserId"></param>
       /// <returns>object of company deatil with the comapny basic details</returns>
        List<CompanyDetail> GetCurrentUserCompanyDetailList(string UserId);

       /// <summary>
       /// Get the list of Company Detail object by user id. -SP
       /// </summary>
       /// <param name="userName">user id</param>
       /// <returns>object of Company Detail</returns>
        CompanyDetail GetCompanyDetailByUserId(string userId);

       /// <summary>
       /// get the list of currency .
       /// </summary>
       /// <returns></returns>
        List<CurrencyDetail> GetAllCurrencyDetail();

       /// <summary>
       /// get the Company Configuration by company Id.-PS
       /// </summary>
       /// <param name="companyId">company Id</param>
       /// <returns>CompanyConfiguration object</returns>
        CompanyConfiguration GetCompanyConfigurationByCompanyId(int companyId);

        /// <summary>
        /// get the balance barcode configuration by Company Id
        /// </summary>
        /// <param name="companyId"></param>
        /// <returns></returns>
        List<BalanceBarcodeAc> GetBalanceBarcodeConfiguration(int companyId);
    }
}
