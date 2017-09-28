using MerchantService.DomainModel.Models.Branch;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MerchantService.Repository.Modules.Admin
{
    public interface IAdditionalServiceRepository : IDisposable
    {
        /// <summary>
        ///This method is used to get Additional Services list -JJ
        ///<param name="companyId">Company Id</param>
        /// </summary>
        /// <returns>return list of Additional Services</returns>
        List<AdditionalService> GetAdditionalServicesList(int companyId);
    }
}
