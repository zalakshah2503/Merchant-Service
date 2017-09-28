using MerchantService.DomainModel.Models.Globalization;
using MerchantService.Repository.ApplicationClasses.Globalization;
using System;
using System.Collections.Generic;

namespace MerchantService.Repository.Modules.Admin.Globalization
{
    public interface IGlobalizationRepository : IDisposable
    {
        /// <summary>
        /// method is used for get module list from database. - ps
        /// </summary>
        /// <returns>return module list</returns>
        List<ModuleInfo> GetModuleList();

        /// <summary>
        /// method is used for get static label list by id from database. - JJ
        /// </summary>
        /// <param name="id">id of Module</param>
        /// <param name="companyId"></param>
        /// <returns>List of object of GlobalizationDetailAc</returns>
        List<GlobalizationDetailAc> GetStaticLabelListById(int id,int companyId);
        
        /// <summary>
        /// method is used for list of entities add in database. - JJ
        /// </summary>
        /// <param name="globalizationDetail">list of object of GlobalizationDetailAc</param>
        /// <retunns>null</retunns>
        void AddListOfSataticLabel(List<GlobalizationDetailAc> globalizationDetail);

    }
}
