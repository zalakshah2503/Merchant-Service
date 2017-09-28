namespace Model {
    export class WorkFlowAction {
        WorkFlowActionId: number;
        IsAllowApproval: boolean;
        Stage: string;
        Action: string;
        UserName: string;
        ActionDate: Date;
        RoleName: string;
        Comment: string;
        NextActivityId: number;
        IsCondition: boolean;
        IsRejected: boolean;
        IsReview: boolean;
        AssignedRole: string;
        InitiatorRole: string;
    }
}

 