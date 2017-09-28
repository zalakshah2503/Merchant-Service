using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MerchantService.DomainModel.Enums
{
    public enum OperationTypes
    {
        PerCashierLoginSeesion = 51,
        PerPeriodOfTime = 52,
        PerDecreaseOperation = 68,
        Day = 53,
        Week = 54,
        Month = 55,
        FullPeriod=56
    }
}
