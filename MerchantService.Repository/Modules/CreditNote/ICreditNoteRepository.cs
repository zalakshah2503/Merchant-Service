using MerchantService.DomainModel.Models.CreditNote;
using MerchantService.DomainModel.Models.Item;
using MerchantService.DomainModel.Models.ItemDestruction;
using MerchantService.DomainModel.Models.SupplierReturn;
using MerchantService.Utility.Logger;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MerchantService.Repository.Modules.CreditNote
{
    public interface ICreditNoteRepository
    {
        /// <summary>
        /// This method used for get list of credit note detail. -An
        /// </summary>
        /// <returns></returns>
        List<CreditNoteDetail> GetListOfCreditNoteDetailByBranchId(int branchId, bool accessToAllBranch);



        int AddCreditNotesItem(CreditNoteItem creditNoteItems);

        /// <summary>
        /// This method used for get credit note detail by id. -An
        /// </summary>
        /// <param name="creditNoteId"></param>
        /// <returns></returns>
        CreditNoteDetail GetCreditNoteDetailById(int creditNoteId);


        /// <summary>
        /// This method used for update credit note. -An
        /// </summary>
        /// <param name="creditNoteDetail"></param>
        /// <returns></returns>
        int UpdateCreditNoteDetail(CreditNoteDetail creditNoteDetail);


        /// <summary>
        /// This method used for add credit notes detail. -An
        /// </summary>
        /// <param name="creditNoteItems"></param>
        /// <returns></returns>
        int AddCreditNoteDetail(CreditNoteDetail creditnoteDetail);




        /// <summary>
        /// This method used for get today list of credit notes. -An
        /// </summary>
        /// <param name="branchId"></param>
        /// <param name="typeId"></param>
        /// <returns></returns>
        List<CreditNoteDetail> GetTodayListOfCreditNotes(int branchId, int typeId);


        /// <summary>
        /// This method used for add credit Note item offer. -An
        /// </summary>
        /// <param name="itemOfferCreditNote"></param>
        /// <returns></returns>
        int AddCreditNoteItemOffer(ItemOfferCreditNote itemOfferCreditNote);


        /// <summary>
        /// This method used for add credit note destruciton. -An
        /// </summary>
        /// <param name="itemDestructionCreditNote"></param>
        /// <returns></returns>
        int AddCreditNoteDestruciton(ItemDestructionCreditNote itemDestructionCreditNote);

        /// <summary>
        /// This method used for add receving credit note detail. -An
        /// </summary>
        /// <param name="recevingCreditNotePaymentDetail"></param>
        /// <returns></returns>
        int AddRecevingCreditNotePaymantDetal(RecevingCreditNotePaymentDetail recevingCreditNotePaymentDetail);

        /// <summary>
        /// This method used for get item offer credit note by credit number. -An
        /// </summary>
        /// <param name="creditNumber"></param>
        /// <returns></returns>
        ItemOfferCreditNote GetItemOfferCreditNoteByCreditId(int creditNoteId);

        ItemDestructionCreditNote GetItemDestructionCreditNoteByCreditId(int creditNoteId);

        SupplierReturnCreditNote GetSupplierReturnCreditNoteByCreditNoteId(int creditNoteId);

    }
}

