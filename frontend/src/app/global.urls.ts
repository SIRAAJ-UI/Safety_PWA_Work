import { environment } from "@environments/environment";


export class AccountAPIUrls {
  static GetReportType: string = `${environment.apiUrl}/api/ReportTypeCnfg/GetAll`;
  static GetClass: string = `${environment.apiUrl}/api/ClassCnfg/GetAll`;
  static GetReportedBy: string = `${environment.apiUrl}/api/UserProfile/GetAll`;
  static GetAreaLine: string = `${environment.apiUrl}/api/AreaLineCnfg/GetAll`;
  static GetMachine: string = `${environment.apiUrl}/api/MachineCnfg/GetAllByAreaLineId`;
  static GetUnsafeDoneBy: string = `${environment.apiUrl}/api/UserProfile/GetAll`;
  static SaveReportsDetails: string = `${environment.apiUrl}/api/ReportsDetails/save`;
}
