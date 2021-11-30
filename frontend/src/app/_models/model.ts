// static GetReportType: string = "api/Master/GetReportType";
// static GetClass: string = "api/Master/GetClass";
// static GetReportedBy: string = "api/Master/GetReportedBy";
// static GetAreaLine: string = "api/Master/GetAreaLine";
// static GetMachine: string = "api/Master/GetMachine";
// static GetUnsafeDoneBy: string = "api/Master/GetUnsafeDoneBy";

export class ReportType  {
    ReportTypeCnfgId: number;
    ReportTypeName: string;
    PrefixCode: string;
    ActiveFlag: boolean;
}
export class GetClass {
    ClassCnfgId: number;
    ClassName: string;
    ActiveFlag: boolean;
   
}
export class UserProfile {
    UserProfileId: number;
    UserName: string;
    FirstName: string;
    LastName: string;
    Email: string;
    PhoneNo: string;
    ActiveFlag: boolean;
}

export class AreaLine {
    AreaLineCnfgId: number;
    AreaLineName: string;
    ActiveFlag: boolean;
}
export class Machine  {
    MachineCnfgId: number;
    MachineName: string;
    AreaLineCnfgId: number;
    ActiveFlag: boolean;
}

export class SaveRecord {
    ReportTypeCnfgId: number;
    ClassCnfgId: number;
    ReportedById: number;
    AreaLineCnfgId: number;
    MachineCnfgId: number;
    UnsafeActDoneBy: string;
    Description: string;
    CreatedUserId: number;
    UpdatedUserId: number;
    ReportsImages:Array<string>;
}