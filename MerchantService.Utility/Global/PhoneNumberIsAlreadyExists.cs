using System;

namespace MerchantService.Utility.Global
{
    public class PhoneNumberIsAlreadyExists : Exception
    { 
        /// <summary>
        /// Initializes exception for phone number is already exists
        /// </summary>
        public PhoneNumberIsAlreadyExists() : base()
        {

        }
    }
}
