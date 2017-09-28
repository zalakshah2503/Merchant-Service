using System;

namespace LocalDBExtractor.Core.Repository.PayLoad
{
    public interface IPayLoadRepository : IDisposable
    {
        /// <summary>
        /// method to add payload into the database
        /// </summary>
        /// <param name="payLoad"></param>
        /// <returns></returns>
        MerchantService.DomainModel.Models.PayLoad AddPayLoad(MerchantService.DomainModel.Models.PayLoad payLoad);
    }
}
