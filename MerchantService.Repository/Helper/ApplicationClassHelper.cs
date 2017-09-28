using System;
using System.Collections.Generic;
using System.Diagnostics.Contracts;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MerchantService.Repository.Helper
{
   public static class ApplicationClassHelper
    {
        /// <summary>
        /// It will convert model class to application class based on naming conventions
        /// </summary>
        /// <typeparam name="TFrom">type of model from which it will convert</typeparam>
        /// <typeparam name="TDestination">type of application class to which it will convert</typeparam>
        /// <param name="model">model class which is to be converted</param>
        /// <returns>returns new instance of <typeparamref name="TDestination"/> converted from <typeparamref name="TFrom"/> </returns>
        public static TDestination ConvertType<TFrom, TDestination>(TFrom model)
            where TFrom : class
            where TDestination : class
        {
            Contract.Requires(model != null, "Model class can not be null");
            TDestination applicationClass = Activator.CreateInstance<TDestination>();
            var modelClassProperties = typeof(TFrom).GetProperties();
            var applicationClassProperties = typeof(TDestination).GetProperties();
            foreach (var modelClassProperty in modelClassProperties)
            {
                var commonProperty =
                    applicationClassProperties.FirstOrDefault(
                        x => x.Name == modelClassProperty.Name && x.PropertyType == modelClassProperty.PropertyType);
                if (commonProperty != null)
                {
                    commonProperty.SetValue(applicationClass, modelClassProperty.GetValue(model));
                }
            }
            return applicationClass;
        }
    }
}
