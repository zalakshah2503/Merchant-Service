namespace Model {
    export class JournalEntryAc {
        JournalEntryId: number;
        LedgerId: number;
        DebitAmount: number;
        CreditAmount: number;
        Description: string;
        JournalEntryCollection: string;
        JournalDate:Date;
    }
} 