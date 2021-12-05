import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AccountAPIUrls } from '@app/global.urls';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ReportType, SaveRecord } from '../_models/model'

@Injectable({
  providedIn: 'root'
})
export class SafetyService {

  public ReportTypes:any[] = null;
  private _CaptureUpdates:Subject<any>;

  constructor(private httpClient: HttpClient) { 
    this._CaptureUpdates = new Subject();
  }

  CaptureUpdates(imageData) {
    this._CaptureUpdates.next(imageData);
  }
  get ImageCaptures():Observable<any> {
    return this._CaptureUpdates.asObservable();
  }
  
  GetReportType(): Observable<HttpEvent<any>> {
    const getRequest: HttpRequest<any> = new HttpRequest('GET', AccountAPIUrls.GetReportType);
    return this.httpClient.request(getRequest);
  };

  GetClass(): Observable<HttpEvent<any>> {
    const getRequest: HttpRequest<any> = new HttpRequest('GET', AccountAPIUrls.GetClass);
    return this.httpClient.request(getRequest);
  };

  GetReportedBy(): Observable<HttpEvent<any>> {
    const getRequest: HttpRequest<any> = new HttpRequest('GET', AccountAPIUrls.GetReportedBy);
    return this.httpClient.request(getRequest);
  };

  GetAreaLine(): Observable<HttpEvent<any>> {
    const getRequest: HttpRequest<any> = new HttpRequest('GET', AccountAPIUrls.GetAreaLine);
    return this.httpClient.request(getRequest);
  };

  GetMachine(areaLineId: number): Observable<HttpEvent<any>> {
    const getRequest: HttpRequest<any> = new HttpRequest('GET',`${AccountAPIUrls.GetMachine}/${areaLineId}`);
    return this.httpClient.request(getRequest);
  };

  GetUnsafeDoneBy(): Observable<HttpEvent<any>> {
    const getRequest: HttpRequest<any> = new HttpRequest('GET', AccountAPIUrls.GetUnsafeDoneBy);
    return this.httpClient.request(getRequest);
  };

  SaveRecord(model:SaveRecord): Observable<HttpEvent<any>> {
    const postRequest: HttpRequest<any> = new HttpRequest('POST', AccountAPIUrls.SaveReportsDetails,model);
    return this.httpClient.request(postRequest);
  };

}
