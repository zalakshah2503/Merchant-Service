using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MerchantService.Repository.ApplicationClasses.Item
{
    public class ItemOfferAC
    {
        public int Id { get; set; }

        public string BranchName { get; set; }
        public string StatusName { get; set; }
        public string ItemName { get; set; }
        public string ItemUnit { get; set; }
        public string Barcode { get; set; }
        public DateTime StartDateTime { get; set; }
        public DateTime EndDateTime { get; set; }

        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }

        public int? BranchId { get; set; }
        public int StatusId { get; set; }

        public bool IsDeleted { get; set; }
        public string EndDateDemo { get; set; }


    }
}
