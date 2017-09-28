using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MerchantService.Utility.Logger
{
    public interface IErrorLog
    {
        void LogException(Exception exception);
        void LogInfo(string message);
    }
}
