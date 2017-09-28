using MerchantService.DomainModel.Models.Globalization;
using MerchantService.Repository.ApplicationClasses.Globalization;
using MerchantService.Repository.DataRepository;
using MerchantService.Utility.Logger;
using System;
using System.Collections.Generic;
using System.Linq;

namespace MerchantService.Repository.Modules.Admin.Globalization
{
    public class GlobalizationRepository : IGlobalizationRepository
    {
        #region "Private Variable(s)"

        private readonly IDataRepository<GlobalizationDetail> _globalizationContext;
        private readonly IDataRepository<ModuleInfo> _moduleContext;
        private readonly IDataRepository<SecondaryLanguage> _secondaryLanguageContext;
        private readonly IErrorLog _errorLog;

        #endregion

        #region "Constructor & Destructor(s)"

        public GlobalizationRepository(IErrorLog errorLog, IDataRepository<SecondaryLanguage> secondaryLanguageContext, IDataRepository<ModuleInfo> moduleContext, IDataRepository<GlobalizationDetail> globalizationContext)
        {
            _errorLog = errorLog;
            _moduleContext = moduleContext;
            _secondaryLanguageContext = secondaryLanguageContext;
            _globalizationContext = globalizationContext;
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
                _moduleContext.Dispose();
                _globalizationContext.Dispose();
                GC.SuppressFinalize(this);
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);

            }
        }

        #endregion

        #region "Public Method(s)"

        public List<ModuleInfo> GetModuleList()
        {
            try
            {
                return _moduleContext.Fetch(x => x.IsActive).ToList();
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        public List<GlobalizationDetailAc> GetStaticLabelListById(int id, int CompnayId)
        {
            try
            {
                var globalizationDetailList = new List<GlobalizationDetailAc>();
                var globalizationDetail = _globalizationContext.Fetch(x => x.ModuleId == id).ToList();

                var secondary = GetSecondaryLanguage(id, CompnayId);
                foreach (var globalization in globalizationDetail)
                {
                    var count = 0;
                    foreach (var valuesl in secondary)
                    {

                        if (valuesl.GlobalizationDetailId == globalization.Id)
                        {
                            GlobalizationDetailAc globalize = new GlobalizationDetailAc
                            {
                                Id = globalization.Id,
                                Key = globalization.Key,
                                ValueEn = globalization.ValueEn,
                                ModuleId = globalization.ModuleId,
                                ModuleInfo = globalization.ModuleInfo,
                                ValueSl = valuesl.ValueSl
                            };
                            globalizationDetailList.Add(globalize);
                            count = 1;
                        }
                    }

                    if (count == 0)
                    {
                        GlobalizationDetailAc globalizes = new GlobalizationDetailAc
                        {
                            Id = globalization.Id,
                            Key = globalization.Key,
                            ValueEn = globalization.ValueEn,
                            ModuleId = globalization.ModuleId,
                            ModuleInfo = globalization.ModuleInfo
                        };
                        globalizationDetailList.Add(globalizes);
                    }
                }
                return globalizationDetailList;
            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }

        private List<SecondaryLanguage> GetSecondaryLanguage(int Id, int CompanyId)
        {
            var secondary = _secondaryLanguageContext.Fetch(y => y.CompanyId == CompanyId && y.GlobalizationDetail.ModuleId == Id).ToList();
            return secondary;
        }


        public void AddListOfSataticLabel(List<GlobalizationDetailAc> globalizationDetail)
        {
            try
            {
                foreach (var globalization in globalizationDetail)
                {
                    if (string.IsNullOrEmpty(globalization.ValueSl))
                    {
                        globalization.ValueSl = null;
                    }
                    if (_secondaryLanguageContext.Fetch(y => y.GlobalizationDetailId == globalization.Id && y.CompanyId == globalization.CompanyId).Any())
                    {
                        var secondary = _secondaryLanguageContext.First(y => y.GlobalizationDetailId == globalization.Id && y.CompanyId == globalization.CompanyId);
                        secondary.ValueSl = globalization.ValueSl;
                        secondary.CompanyId = globalization.CompanyId;
                        secondary.ModifiedDateTime = DateTime.UtcNow;

                        _secondaryLanguageContext.Update(secondary);
                        _secondaryLanguageContext.SaveChanges();
                    }
                    else
                    {
                        SecondaryLanguage language = new SecondaryLanguage()
                        {
                            GlobalizationDetailId = globalization.Id,
                            ValueSl = globalization.ValueSl,
                            CompanyId = globalization.CompanyId,
                            CreatedDateTime = DateTime.UtcNow
                        };
                        _secondaryLanguageContext.Add(language);
                        _secondaryLanguageContext.SaveChanges();
                    }
                }

            }
            catch (Exception ex)
            {
                _errorLog.LogException(ex);
                throw;
            }
        }
        #endregion

    }
}
