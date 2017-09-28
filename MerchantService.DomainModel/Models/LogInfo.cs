using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MerchantService.DomainModel.Models
{
   public class LogInfo 
    {
       [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
       public int Id { get; set; }

       public DateTime LogDate {get; set;}

       public string LogLevel {get; set;}

       public string LogLogger {get; set;}

       public string LogMessage{get; set;}

       public string LogMachineName {get; set;}

       public string LogCallSite {get; set;}

       public string LogThread {get; set;}

       public string LogException {get; set;}

       public string LogStackTrace { get; set; }

   //    public string ErrorClass { get; set; }

    //   public string UserName { get; set; }

     //  public string ErrorMethod { get; set; }

      // public string ErrorMessage { get; set; }

      

       
    }
}
