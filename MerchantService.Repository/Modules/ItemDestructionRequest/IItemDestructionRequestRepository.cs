using MerchantService.DomainModel.Models.CreditNote;
using MerchantService.DomainModel.Models.ItemDestruction;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MerchantService.Repository.Modules.ItemDestructionRequest
{
    public interface IItemDestructionRequestRepository
    {
        /// <summary>
        /// This method used for add destruction return primary key. -An
        /// </summary>
        /// <param name="destruction"></param>
        /// <returns></returns>
        Destruction AddDestruction(Destruction destruction);

        /// <summary>
        /// This method used for add destruction return primary key. -An
        /// </summary>
        /// <param name="destruction"></param>
        /// <returns></returns>
        int UpdateDestruction(Destruction destruction);

        /// <summary>
        /// This method used for add destruction item and return primary key. -An
        /// </summary>
        /// <param name="itemDestructionDetail"></param>
        /// <returns></returns>
        int AddDestructionItem(ItemDestructionDetail itemDestructionDetail);


        /// <summary>
        /// This method used for Get Destruction Detail List by branchId. -An
        /// </summary>
        /// <param name="branchId"></param>
        /// <param name="accessAllBranch"></param>
        /// <returns></returns>
        List<Destruction> GetDestructionDetailByBranchId(int branchId, bool accessAllBranch);

        /// <summary>
        /// This method used for get destruction detail. -An
        /// </summary>
        /// <returns></returns>
        List<Destruction> GetDestructionDetailAllBranch();


        /// <summary>
        /// This method used for get toda item destruction. -An
        /// </summary>
        /// <returns></returns>
        List<Destruction> GetTodayItemDestructionListByBranchId(int branchId);

        /// <summary>
        /// This method used for getItem Destruction Details.
        /// </summary>
        /// <returns></returns>
        List<ItemDestructionDetail> GetItemDestructionDetials(int destructionId);

        /// <summary>
        /// This method used for get item destruction details. -An
        /// </summary>
        /// <param name="itemId"></param>
        /// <returns></returns>
        List<ItemDestructionDetail> GetItemDestructionDetails(int itemId);


        /// <summary>
        /// This method used for delete item destruction detail by id. -An
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        bool DeleteItemDestructionDetail(int id);

        /// <summary>
        /// This method used for get destruction by id. -An 
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        Destruction GetDestructionById(int id);

        /// <summary>
        /// This method used for add credit notes item. -An
        /// </summary>
        /// <param name="creditNoteItems"></param>
        /// <returns></returns>


    }

}
