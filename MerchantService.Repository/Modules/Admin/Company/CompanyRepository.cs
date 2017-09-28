using MerchantService.DomainModel.Enums;
using MerchantService.DomainModel.Models;
using MerchantService.DomainModel.Models.Branch;
using MerchantService.DomainModel.Models.Company;
using MerchantService.DomainModel.Models.Globalization;
using MerchantService.Repository.ApplicationClasses.Admin.Company;
using MerchantService.Repository.DataRepository;
using MerchantService.Repository.Helper;
using MerchantService.Utility.Logger;
using System;
using System.Collections.Generic;
using System.Linq;

namespace MerchantService.Repository.Modules.Admin.Company
{
    public class CompanyRepository : ICompanyRepository
    {
        #region "Private Variable(s)"


        private readonly IErrorLog _errorLog;
        private readonly IDataRepository<CompanyConfiguration> _companyConfigurationContext;
        private readonly IDataRepository<AdditionalService> _cpoConfigurationContext;
        private readonly IDataRepository<CompanyDetail> _companyDataRepository;
        private readonly IDataRepository<UserDetail> _userDetailContext;
        private readonly IDataRepository<Language> _languageDataRepository;
        private readonly IDataRepository<CurrencyDetail> _currencyDataRepository;
        private readonly IDataRepository<CompanyBarcodeConfiguration> _companyBarcodeConfiguration;
        private readonly IDataRepository<BalanceBarcodeSection> _balanceBarcodeSection;
        private readonly IDataRepository<BalanceBarcodeConfiguration> _balanceBarcodeConfiguration;

        #endregion

        #region "Constructor(s)"
        public CompanyRepository(IErrorLog errorLog, IDataRepository<CompanyConfiguration> companyConfigurationContext, IDataRepository<UserDetail> userDetailContext, IDataRepository<CompanyDetail> companyDataRepository,
            IDataRepository<Language> languageDataRepository, IDataRepository<CurrencyDetail> currencyDataRepository, IDataRepository<BalanceBarcodeSection> balanceBarcodeSection,
        IDataRepository<AdditionalService> cpoConfigurationContext, IDataRepository<CompanyBarcodeConfiguration> companyBarcodeConfiguration, IDataRepository<BalanceBarcodeConfiguration> balanceBarcodeConfiguration)
        {
            _errorLog = errorLog;
            _companyConfigurationContext = companyConfigurationContext;
            _companyDataRepository = companyDataRepository;
            _userDetailContext = userDetailContext;
            _languageDataRepository = languageDataRepository;
            _currencyDataRepository = currencyDataRepository;
            _cpoConfigurationContext = cpoConfigurationContext;
            _companyBarcodeConfiguration = companyBarcodeConfiguration;
            _balanceBarcodeSection = balanceBarcodeSection;
            _balanceBarcodeConfiguration = balanceBarcodeConfiguration;
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
                _companyConfigurationContext.Dispose();
                _companyDataRepository.Dispose();
                _userDetailContext.Dispose();
                _languageDataRepository.Dispose();
                _currencyDataRepository.Dispose();
                GC.SuppressFinalize(this);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);

            }
        }

        #endregion

        #region "Public Method(s)"


        public bool CheckLogAllowedOrNot()
        {
            try
            {

                return _companyConfigurationContext.GetAll().ToList().Count == '0' ? true : _companyConfigurationContext.Fetch(x => x.IsLogAllowed).Any();

            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }

        }

        public bool CheckSecondaryLanguageSelectedOrNot()
        {
            try
            {
                return _companyConfigurationContext.Fetch(x => x.LanguageId != 0).Any();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }

        }



        /// <summary>
        /// add new company details
        /// </summary>
        /// <param name="companyDetail">company detailAC with company details</param>
        /// <returns>object of company detail</returns>
        public CompanyDetailAC AddCompanyDetail(CompanyDetailAC companyDetail, string userId)
        {
            try
            {
                //its check company name already exist or not.
                int companyCount = _companyDataRepository.Fetch(x => x.Name == companyDetail.Name).Count();
                if (companyCount != 0)
                {
                    throw new ArgumentException("Company name already exists.");
                }

                //its check company created or not.
                int multipleCount = _companyDataRepository.Fetch(x => x.UserId == userId).Count();
                if (multipleCount != 0)
                {
                    throw new ArgumentException("User can not create multiple company.");
                }


                //save the company basic details
                var companyDetails = new CompanyDetail
                {
                    Name = companyDetail.Name,
                    Location = companyDetail.Location,
                    Email = companyDetail.Email,
                    Zipcode = companyDetail.Zipcode,
                    PhoneNumber = companyDetail.PhoneNumber,
                    CreatedDateTime = DateTime.UtcNow,
                    UserId = userId,
                    NameSL = companyDetail.NameSL
                };
                _companyDataRepository.Add(companyDetails);
                _companyDataRepository.SaveChanges();

                //save the company custom cinfiguration.
                var companyCongig = new CompanyConfiguration
                {
                    CompanyId = companyDetails.Id,
                    NormalBarcodeFrom = companyDetail.NormalBarcodeFrom,
                    NormalBarcodeTo = companyDetail.NormalBarcodeTo,
                    PriceStartFrom = companyDetail.PriceStartFrom,
                    PriceDigitLength = companyDetail.PriceDigitLength,
                    CreditCardPayment = companyDetail.CreditCardPayment,
                    DebitCardPayment = companyDetail.DebitCardPayment,
                    ChequePayment = companyDetail.ChequePayment,
                    CoupanPayment = companyDetail.CoupanPayment,
                    CreditAccountPayment = companyDetail.CreditAccountPayment,
                    AllowCreditAccountLimit = companyDetail.AllowCreditAccountLimit,
                    CPODownPaymentDiscount = companyDetail.CPODownPaymentDiscount,
                    ReturnItem = companyDetail.ReturnItem,
                    InvoiceNo = companyDetail.InvoiceNo,
                    ReturnInvoiceNo = companyDetail.ReturnInvoiceNo,
                    CPOInvoiceNo = companyDetail.CPOInvoiceNo,
                    ValidNumberOfDaysForReturnItem = companyDetail.ValidNumberOfDaysForReturnItem,
                    SPOInvoiceNo = companyDetail.SPOInvoiceNo,
                    ItemDestructionNo = companyDetail.ItemDestructionNo,
                    SupplierReturnNo = companyDetail.SupplierReturnNo,
                    ProfitMargin = companyDetail.ProfitMargin,
                    LanguageId = companyDetail.LanguageId,
                    CreatedDateTime = DateTime.UtcNow,
                    CashPayment = companyDetail.CashPayment,
                    CurrencyId = companyDetail.CurrencyId,
                    UpperBound = companyDetail.UpperBound,
                    LowerBound = companyDetail.LowerBound
                };

                _companyConfigurationContext.Add(companyCongig);
                _companyConfigurationContext.SaveChanges();

                #region Added Barcode Details 

                #region Company Barcode Details
                companyDetail.CompanyId = companyDetails.Id;
                AddCompanyBarcodeConfigurationDetail(companyDetail);
                #endregion

                #region Balance Barcode Details
                AddedBalanceBarcode(companyDetail);
                #endregion

                #endregion

                var cpoConfigurationList = new List<AdditionalService>();
                companyDetail.CPOConfigurations.ForEach(x =>
                {
                    var cpoConfiguration = new AdditionalService
                    {
                        Name = x.AdditionalCostType,
                        CompanyId = companyDetails.Id
                    };
                    cpoConfigurationList.Add(cpoConfiguration);
                });

                if (cpoConfigurationList.Any())
                {
                    _cpoConfigurationContext.AddRange(cpoConfigurationList);
                    _cpoConfigurationContext.SaveChanges();
                }

                companyDetail.CompanyId = companyDetails.Id;
                companyDetail.CompanyConfigId = companyCongig.Id;

                return companyDetail;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        



        /// <summary>
        /// get all company list
        /// </summary>
        /// <returns>list of company</returns>
        public List<CompanyDetail> GetAllCompanyDetail()
        {
            try
            {
                var companyList = _companyDataRepository.Fetch(x => !x.IsDeleted).ToList();
                return companyList;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// get company detials by the companyId
        /// </summary>
        /// <param name="companyId">contain comapnyId to get company basic details.</param>
        /// <returns>object of company detail with the basic details of company</returns>
        public CompanyDetailAC GetCompanyDetailsById(int companyId, string userId)
        {
            try
            {
                var companyDetail = _companyConfigurationContext.FirstOrDefault(x => x.CompanyId == companyId);
                if (companyDetail != null)
                {
                    var companyDetails = _companyDataRepository.FirstOrDefault(x => x.Id == companyDetail.CompanyId && x.UserId == userId);
                    var copConfigurations = _cpoConfigurationContext.Fetch(x => x.CompanyId == companyDetails.Id).ToList();
                    if (companyDetails != null)
                    {
                        var companyAC = new CompanyDetailAC();
                        companyAC = ApplicationClassHelper.ConvertType<CompanyConfiguration, CompanyDetailAC>(companyDetail);
                        companyAC.CompanyConfigId = companyDetail.Id;
                        companyAC.LowerBound = companyDetail.LowerBound != null ? companyDetail.LowerBound.Value : 0;
                        companyAC.UpperBound = companyDetail.UpperBound != null ? companyDetail.UpperBound.Value : 0;
                        companyAC.ReturnItem = companyDetail.ReturnItem;
                        companyAC.CurrencyId = companyDetail.CurrencyId;
                        companyAC.Name = companyDetail.CompanyDetail.Name;
                        companyAC.NameSL = companyDetail.CompanyDetail.NameSL;
                        companyAC.Location = companyDetail.CompanyDetail.Location;
                        companyAC.Email = companyDetail.CompanyDetail.Email;
                        companyAC.Zipcode = companyDetail.CompanyDetail.Zipcode;
                        companyAC.PhoneNumber = companyDetail.CompanyDetail.PhoneNumber;
                        companyAC.CompanyBarcodeConfiguration = GetCompanyBarcodeConfiguration(companyDetail.Id);
                        companyAC.ListOfBalanceBarcodeConfiguration = GetBalanceBarcodeConfiguration(companyDetail.Id);
                        companyAC.CPOConfigurations = GetCpoConfiguration(copConfigurations);
                        return companyAC;
                    }
                    else
                    {
                        throw new ArgumentException("No Record Found.");
                    }

                }
                else
                {
                    throw new ArgumentException("No Record Found.");
                }

            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }




        /// <summary>
        /// update the company details
        /// </summary>
        /// <param name="companyDetail">compant detailAC with updated company detail.</param>
        /// <returns>object company detail with updated company details</returns>
        public CompanyDetailAC UpdateCompanyDetail(CompanyDetailAC companyDetail)
        {
            try
            {
                int companyCount = _companyDataRepository.Fetch(x => x.Name == companyDetail.Name && x.Id != companyDetail.CompanyId).Count();
                if (companyCount != 0)
                {
                    throw new ArgumentException("Company name already exists.");
                }
                var companyinfo = _companyDataRepository.GetById(companyDetail.CompanyId);
                companyinfo.Name = companyDetail.Name;
                companyinfo.Location = companyDetail.Location;
                companyinfo.Email = companyDetail.Email;
                companyinfo.Zipcode = companyDetail.Zipcode;
                companyinfo.PhoneNumber = companyDetail.PhoneNumber;
                companyinfo.NameSL = companyDetail.NameSL;
                companyinfo.ModifiedDateTime = DateTime.UtcNow;
                _companyDataRepository.Update(companyinfo);
                _companyDataRepository.SaveChanges();

                var companyConfig = _companyConfigurationContext.FirstOrDefault(x => x.CompanyId == companyDetail.CompanyId);
                companyConfig.CreditCardPayment = companyDetail.CreditCardPayment;
                companyConfig.DebitCardPayment = companyDetail.DebitCardPayment;
                companyConfig.ChequePayment = companyDetail.ChequePayment;
                companyConfig.CoupanPayment = companyDetail.CoupanPayment;
                companyConfig.CreditAccountPayment = companyDetail.CreditAccountPayment;
                companyConfig.AllowCreditAccountLimit = companyDetail.AllowCreditAccountLimit;
                companyConfig.CPODownPaymentDiscount = companyDetail.CPODownPaymentDiscount;
                companyConfig.ValidNumberOfDaysForReturnItem = companyDetail.ValidNumberOfDaysForReturnItem;
                companyConfig.UpperBound = companyDetail.UpperBound;
                companyConfig.LowerBound = companyDetail.LowerBound;
                companyConfig.ReturnItem = companyDetail.ReturnItem;
                companyConfig.NormalBarcodeFrom = companyDetail.NormalBarcodeFrom;
                companyConfig.NormalBarcodeTo = companyDetail.NormalBarcodeTo;
                companyConfig.ModifiedDateTime = DateTime.UtcNow;
                _companyConfigurationContext.Update(companyConfig);
                _companyConfigurationContext.SaveChanges();

                #region Update Balance and Company Barcode details
                UpdateBalanceBarcode(companyDetail);
                UpdateCompanyBarcode(companyDetail);
                #endregion

                companyDetail.CPOConfigurations.ForEach(x =>
                {
                    var cpoConfiguration = _cpoConfigurationContext.FirstOrDefault(y => y.Id == x.Id && x.CompanyId != 0);
                    if (cpoConfiguration != null)
                    {
                        cpoConfiguration.Name = x.AdditionalCostType;
                        _cpoConfigurationContext.Update(cpoConfiguration);
                        _cpoConfigurationContext.SaveChanges();
                    }
                    else
                    {
                        cpoConfiguration = new AdditionalService
                        {
                            Name = x.AdditionalCostType,
                            CompanyId = companyDetail.CompanyId
                        };
                        _cpoConfigurationContext.Add(cpoConfiguration);
                        _cpoConfigurationContext.SaveChanges();
                    }
                });


                return companyDetail;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// get all languages
        /// </summary>
        /// <returns>list of languages</returns>
        public List<Language> GetAllLanguage()
        {
            try
            {
                var languagelsit = _languageDataRepository.GetAll().ToList();
                return languagelsit;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// delete the comapany information
        /// </summary>
        /// <param name="companyId">contain company id to delete company details.</param>
        public void DeleteCompanyDetails(int companyId)
        {
            try
            {
                var company = _companyDataRepository.FirstOrDefault(x => x.Id == companyId);
                company.IsDeleted = true;
                company.ModifiedDateTime = DateTime.UtcNow;
                _companyDataRepository.Update(company);
                _companyDataRepository.SaveChanges();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// this method is used to add system settings to database. -JJ
        /// </summary>
        /// <param name="companyDetail">object of CompanyDetailAC</param>
        /// <returns>saved object of CompanyDetailAC</returns>
        public CompanyDetailAC AddSystemSetting(CompanyDetailAC systemSetting, string userName)
        {
            try
            {
                var user = _userDetailContext.FirstOrDefault(x => x.UserName == userName);
                var companyDetails = _companyDataRepository.FirstOrDefault(x => x.UserId == user.UserId);
                if (companyDetails != null)
                {
                    var companyConfiguration = _companyConfigurationContext.FirstOrDefault(x => x.CompanyId == companyDetails.Id);
                    companyConfiguration.IsIcrrGeneratedAtAddItem = systemSetting.IsIcrrGeneratedAtAddItem;
                    companyConfiguration.IsOfferCreatedBelowCostPrice = systemSetting.IsOfferCreatedBelowCostPrice;
                    companyConfiguration.IsIcrCreatedBelowCostPrice = systemSetting.IsIcrCreatedBelowCostPrice;
                    companyConfiguration.ModifiedDateTime = DateTime.UtcNow;
                    _companyConfigurationContext.Update(companyConfiguration);
                    _companyConfigurationContext.SaveChanges();

                }
                return systemSetting;

            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// this method is used to get system setting - JJ
        /// </summary>
        /// <returns> Object of CompanyConfiguration </returns>
        public CompanyConfiguration GetSystemSetting(string userName)
        {
            try
            {
                var user = _userDetailContext.FirstOrDefault(x => x.UserName == userName);
                var companyDetails = _companyDataRepository.FirstOrDefault(x => x.UserId == user.UserId);
                if (companyDetails != null)
                {
                    var companyConfiguration = _companyConfigurationContext.FirstOrDefault(x => x.CompanyId == companyDetails.Id);
                    return companyConfiguration;

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
        /// get the current user company list
        /// </summary>
        /// <param name="UserId"></param>
        /// <returns>object of company deatil with the comapny basic details</returns>
        public List<CompanyDetail> GetCurrentUserCompanyDetailList(string UserId)
        {
            try
            {
                var companyDetails = _companyDataRepository.Fetch(x => x.UserId == UserId).ToList();
                return companyDetails;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        public CompanyDetail GetCompanyDetailByUserId(string userId)
        {
            try
            {
                var userDetail = _companyDataRepository.FirstOrDefault(x => x.UserId == userId);
                return userDetail;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        #endregion

        #region Private Method(s)

        /// <summary>
        /// This method used for update balance barcode details
        /// </summary>
        /// <param name="companyDetail"></param>
        private void UpdateBalanceBarcode(CompanyDetailAC companyDetail)
        {
            try
            {
                var balanceBarcodeConfiguration = _balanceBarcodeConfiguration.Fetch(x => x.CompanyId == companyDetail.CompanyId).ToList();
                _balanceBarcodeConfiguration.DeleteRange(balanceBarcodeConfiguration);
                _balanceBarcodeConfiguration.SaveChanges(); 
                 AddedBalanceBarcode(companyDetail);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        /// <summary>
        /// This method used for update company barcode details
        /// </summary>
        /// <param name="companyDetail"></param>
        private void UpdateCompanyBarcode(CompanyDetailAC companyDetail)
        {
            try
            {
                CompanyBarcodeConfiguration companyBarcodeConfiguration = _companyBarcodeConfiguration.FirstOrDefault(x => x.CompanyId == companyDetail.CompanyId);
                if (companyBarcodeConfiguration != null)
                {
                    companyBarcodeConfiguration.From = companyDetail.CompanyBarcodeConfiguration.From;
                    companyBarcodeConfiguration.To = companyDetail.CompanyBarcodeConfiguration.To;
                    companyBarcodeConfiguration.StartWith = companyDetail.CompanyBarcodeConfiguration.StartWith;
                    _companyBarcodeConfiguration.Update(companyBarcodeConfiguration);
                    _companyBarcodeConfiguration.SaveChanges();
                }
                else
                {
                    AddCompanyBarcodeConfigurationDetail(companyDetail);

                }
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);


                throw;
            }
        }

        /// <summary>
        /// This method used for added company barcode configuration. 
        /// </summary>
        /// <param name="companyDetail"></param>
        private void AddCompanyBarcodeConfigurationDetail(CompanyDetailAC companyDetail)
        {
            CompanyBarcodeConfiguration companyBarcodeConfiguration = new CompanyBarcodeConfiguration();
            companyBarcodeConfiguration.CompanyId = companyDetail.CompanyId;
            companyBarcodeConfiguration.StartWith = companyDetail.CompanyBarcodeConfiguration.StartWith;
            companyBarcodeConfiguration.From = companyDetail.CompanyBarcodeConfiguration.From;
            companyBarcodeConfiguration.To = companyDetail.CompanyBarcodeConfiguration.To;
            companyBarcodeConfiguration.CreatedDateTime = DateTime.UtcNow;
            _companyBarcodeConfiguration.Add(companyBarcodeConfiguration);
            _companyBarcodeConfiguration.SaveChanges();
        }

        /// <summary>
        /// This method used for get company barocde configuration. -An
        /// </summary>
        /// <param name="companyId"></param>
        /// <returns></returns>
        private CompanyBarcodeConfiguration GetCompanyBarcodeConfiguration(int companyId)
        {
            try
            {
                return _companyBarcodeConfiguration.FirstOrDefault(x => x.CompanyId == companyId);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }

        }


        /// <summary>
        /// This method used for get balance barcode configuration. -An
        /// </summary>
        /// <param name="companyId"></param>
        /// <returns></returns>
        public List<BalanceBarcodeAc> GetBalanceBarcodeConfiguration(int companyId)
        {
            try
            {
                List<BalanceBarcodeAc> listOfBalanceBarcode = new List<BalanceBarcodeAc>();
                List<BalanceBarcodeConfiguration> getBalanceBarcodeConfiguration = _balanceBarcodeConfiguration.Fetch(x => x.CompanyId == companyId).ToList();

                foreach (var balanceBarcodeConfiguration in getBalanceBarcodeConfiguration)
                {
                    BalanceBarcodeAc balanceBarcodeAC = new BalanceBarcodeAc();
                    balanceBarcodeAC.Name = balanceBarcodeConfiguration.Name;
                    balanceBarcodeAC.Id = balanceBarcodeConfiguration.Id;
                    var balanceBarcodeSectionList = _balanceBarcodeSection.Fetch(x => x.ConfigurationId == balanceBarcodeConfiguration.Id).ToList();
                    foreach (var barcodesection in balanceBarcodeSectionList)
                    {
                        if (barcodesection.Section == BarcodeSection.Prefix)
                        {
                            balanceBarcodeAC.PrefixLength = Convert.ToInt32(barcodesection.Length);
                            balanceBarcodeAC.PrefixStartPosition = Convert.ToInt32(barcodesection.StartPosition);
                        }
                        else if (barcodesection.Section == BarcodeSection.Amount)
                        {
                            balanceBarcodeAC.AmountLength = barcodesection.Length;
                            balanceBarcodeAC.AmountStartPosition = barcodesection.StartPosition;
                        }
                        else if (barcodesection.Section == BarcodeSection.AmountDecimalPoint)
                        {
                            balanceBarcodeAC.AmountDecimalLength = barcodesection.Length;
                            balanceBarcodeAC.AmountDecimalStartPosition = barcodesection.StartPosition;
                        }
                        else if (barcodesection.Section == BarcodeSection.Checksum)
                        {
                            balanceBarcodeAC.CheckSumLength = barcodesection.Length;
                            balanceBarcodeAC.CheckSumStartPosition = barcodesection.StartPosition;
                        }
                        else if (barcodesection.Section == BarcodeSection.Other)
                        {
                            balanceBarcodeAC.OtherLength = barcodesection.Length;
                            balanceBarcodeAC.OtherStartPosition = barcodesection.StartPosition;
                        }
                        else if (barcodesection.Section == BarcodeSection.Weight)
                        {
                            balanceBarcodeAC.WeightLength = Convert.ToInt32(barcodesection.Length);
                            balanceBarcodeAC.WeightStartPosition = Convert.ToInt32(barcodesection.StartPosition);
                        }
                        else if (barcodesection.Section == BarcodeSection.WeightDecimalPoint)
                        {
                            balanceBarcodeAC.WeightDecimalLength = Convert.ToInt32(barcodesection.Length);
                            balanceBarcodeAC.WeightDecimalStartPosition = Convert.ToInt32(barcodesection.StartPosition);
                        }
                        else if (barcodesection.Section == BarcodeSection.WeightUnit)
                        {
                            balanceBarcodeAC.WeightUnitLength = barcodesection.Length;
                            balanceBarcodeAC.WeightUnitStartPosition = barcodesection.StartPosition;
                        }
                        else if (barcodesection.Section == BarcodeSection.Suffix)
                        {
                            balanceBarcodeAC.SuffixLength = barcodesection.Length;
                            balanceBarcodeAC.SuffixStartPosition = barcodesection.StartPosition;
                        }
                        else if (barcodesection.Section == BarcodeSection.SubBarcode)
                        {
                            balanceBarcodeAC.SubBarcodeLength = Convert.ToInt32(barcodesection.Length);
                            balanceBarcodeAC.SubBarcodeStartPosition = Convert.ToInt32(barcodesection.StartPosition);
                        }
                    }
                    listOfBalanceBarcode.Add(balanceBarcodeAC);
                }
                return listOfBalanceBarcode;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// This method used for added balance barcode. -An
        /// </summary>
        /// <param name="companyDetail"></param>
        private void AddedBalanceBarcode(CompanyDetailAC companyDetail)
        {
            try
            {
                foreach (var balanceBarcodeConfiguration in companyDetail.ListOfBalanceBarcodeConfiguration)
                {
                    BalanceBarcodeConfiguration balanceBarcodeConfig = new BalanceBarcodeConfiguration();
                    balanceBarcodeConfig.CompanyId = companyDetail.CompanyId;
                    balanceBarcodeConfig.CreatedDateTime = DateTime.UtcNow;
                    balanceBarcodeConfig.Name = balanceBarcodeConfiguration.Name;
                    _balanceBarcodeConfiguration.Add(balanceBarcodeConfig);
                    _balanceBarcodeConfiguration.SaveChanges();

                    //This method used for added balance barcode section.
                    AddedBalanceBarcodeSection(balanceBarcodeConfiguration, balanceBarcodeConfig.Id);
                }

            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// This method used for added balance barcode configuration. -An
        /// </summary>
        /// <param name="balanceBarcodeConfiguration"></param>
        /// <param name="balanceBarcodeConfigurationId"></param>
        private void AddedBalanceBarcodeSection(BalanceBarcodeAc balanceBarcodeConfiguration, int balanceBarcodeConfigurationId)
        {
            try
            {
                AddedBalanceBarcodeSectionDetail(BarcodeSection.Prefix, balanceBarcodeConfiguration.PrefixStartPosition, balanceBarcodeConfiguration.PrefixLength, balanceBarcodeConfigurationId);
                AddedBalanceBarcodeSectionDetail(BarcodeSection.Amount, balanceBarcodeConfiguration.AmountStartPosition, balanceBarcodeConfiguration.AmountLength, balanceBarcodeConfigurationId);
                AddedBalanceBarcodeSectionDetail(BarcodeSection.AmountDecimalPoint, balanceBarcodeConfiguration.AmountDecimalStartPosition, balanceBarcodeConfiguration.AmountDecimalLength, balanceBarcodeConfigurationId);
                AddedBalanceBarcodeSectionDetail(BarcodeSection.WeightDecimalPoint, balanceBarcodeConfiguration.WeightDecimalStartPosition, balanceBarcodeConfiguration.WeightDecimalLength, balanceBarcodeConfigurationId);
                AddedBalanceBarcodeSectionDetail(BarcodeSection.Weight, balanceBarcodeConfiguration.WeightStartPosition, balanceBarcodeConfiguration.WeightLength, balanceBarcodeConfigurationId);
                AddedBalanceBarcodeSectionDetail(BarcodeSection.WeightUnit, balanceBarcodeConfiguration.WeightUnitStartPosition, balanceBarcodeConfiguration.WeightUnitLength, balanceBarcodeConfigurationId);
                AddedBalanceBarcodeSectionDetail(BarcodeSection.Checksum, balanceBarcodeConfiguration.CheckSumStartPosition, balanceBarcodeConfiguration.CheckSumLength, balanceBarcodeConfigurationId);
                AddedBalanceBarcodeSectionDetail(BarcodeSection.Other, balanceBarcodeConfiguration.OtherStartPosition, balanceBarcodeConfiguration.OtherLength, balanceBarcodeConfigurationId);
                AddedBalanceBarcodeSectionDetail(BarcodeSection.SubBarcode, balanceBarcodeConfiguration.SubBarcodeStartPosition, balanceBarcodeConfiguration.SubBarcodeLength, balanceBarcodeConfigurationId);
                AddedBalanceBarcodeSectionDetail(BarcodeSection.Suffix, balanceBarcodeConfiguration.SuffixStartPosition, balanceBarcodeConfiguration.SuffixLength, balanceBarcodeConfigurationId);

            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }


        /// <summary>
        /// This method used for added balance barocde section details. -An
        /// </summary>
        /// <param name="section"></param>
        /// <param name="startPosition"></param>
        /// <param name="length"></param>
        /// <param name="balanceBarcodeConfigurationId"></param>
        private void AddedBalanceBarcodeSectionDetail(BarcodeSection section, int? startPosition, int? length, int balanceBarcodeConfigurationId)
        {
            try
            {
                BalanceBarcodeSection balanceBarcodeSection = new BalanceBarcodeSection();
                balanceBarcodeSection.ConfigurationId = balanceBarcodeConfigurationId;
                balanceBarcodeSection.StartPosition = startPosition;
                balanceBarcodeSection.Length = length;
                balanceBarcodeSection.Section = section;
                _balanceBarcodeSection.Add(balanceBarcodeSection);
                _balanceBarcodeSection.SaveChanges();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        private List<AdditionalServiceAC> GetCpoConfiguration(List<AdditionalService> copConfigurationList)
        {
            var cpoConfigurations = new List<AdditionalServiceAC>();
            copConfigurationList.ForEach(x =>
            {
                cpoConfigurations.Add(new AdditionalServiceAC { AdditionalCostType = x.Name, CompanyId = x.CompanyId, Id = x.Id });
            });
            return cpoConfigurations;
        }

        #endregion

        public List<CurrencyDetail> GetAllCurrencyDetail()
        {
            try
            {
                var getCurrency = _currencyDataRepository.GetAll().ToList();
                return getCurrency;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        public CompanyConfiguration GetCompanyConfigurationByCompanyId(int companyId)
        {
            try
            {
                var companyConfiguration = _companyConfigurationContext.FirstOrDefault(x => x.CompanyId == companyId);
                return companyConfiguration;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }
    }
}
