namespace Model {
    export class UserDetail {
        Id: number;
        FullName: string;
        FullNameSl: string;
        UserName: string;
        Email: string;
        BranchId: number;
        EmployeeId: string;
        JoinDate: Date;
        LeaveDate: Date;
        BirthDate: Date;
        TemporaryAddress: string;
        IsSamePermanentAddress: boolean;
        PermanentAddress: string;
        MobileNumber: string;
        PhoneNumber: string;
        RoleId: string;
        RoleName: string;
        CompanyId: number;
        IsActive: boolean;
        CreatedDateTime: Date;
        Password: string;
        ConfirmPassword: string;
        SupervisorId: number;
        Department: string;
        JobTitle: string;
    }
}  