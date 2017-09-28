namespace Model {
    export class IncidentReportModel {
        Id: number;
        OperationTypeId: number;
        AmountLimit: number;
        OperationCounter: number;
        Comment: string;
        StartDateTime: Date;
        EndDateTime: Date;
        DurationId: number;
    }
}