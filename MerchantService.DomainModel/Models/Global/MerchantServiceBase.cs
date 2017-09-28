using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MerchantService.DomainModel.Models.Global
{
    public class MerchantServiceBase
    {
     
       [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
       public int Id { get; set; }

       /// <summary>
       /// The Created Date & Time when value is created in entity.
       /// </summary>
       public DateTime CreatedDateTime { get; set; }

       /// <summary>
       /// The Modified Date & Time when value is updated in entity.
       /// </summary>
       public DateTime? ModifiedDateTime { get; set; }
      
    }
}
