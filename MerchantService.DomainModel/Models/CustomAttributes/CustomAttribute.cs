using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel;

namespace MerchantService.DomainModel.Models.CustomAttributes
{

    [AttributeUsage(AttributeTargets.Property, AllowMultiple = false)]
    public class CustomAttribute : Attribute
    {
    }
}
