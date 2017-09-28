namespace Model {
    export class LedgersAccount {
        Id: number;
        LedgerName: string;
        Name: string;
        Description: string;
        GroupId: number;
        Address: string;
        State: string;
        LedgerId: number;
        ParentLedgerId: number;
        Balance: number;
        GroupTypeId: number;
        isSubAccountChecked: boolean;
        ledgersDate: Date;
    }
} 