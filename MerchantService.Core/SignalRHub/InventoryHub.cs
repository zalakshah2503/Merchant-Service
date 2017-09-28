using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MerchantService.Repository.ApplicationClasses.Inventory;
using Microsoft.AspNet.SignalR;

namespace MerchantService.Core.SignalRHub
{
   public class InventoryHub : Hub
    {
       public void InventoryMoniter(int issueInventoryId, string moniterPath)
       {
           var hubAc = new InventoryHubAc
           {
               IssueInventoryId = issueInventoryId,
               MoniterPath = moniterPath
           };

           //Call the addNewMessageToPage method to update clients.
           Clients.All.inventoryMoniter(hubAc);
       }
    }
}
