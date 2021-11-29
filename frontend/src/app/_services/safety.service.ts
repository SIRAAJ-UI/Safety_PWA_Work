import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AccountAPIUrls } from '@app/global.urls';
import { Observable } from 'rxjs';
import { ReportType } from '../_models/model'

@Injectable({
  providedIn: 'root'
})
export class SafetyService {

  constructor(private httpClient: HttpClient) { }
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

  GetMachine(): Observable<HttpEvent<any>> {
    const getRequest: HttpRequest<any> = new HttpRequest('GET', AccountAPIUrls.GetMachine);
    return this.httpClient.request(getRequest);
  };

  GetUnsafeDoneBy(): Observable<HttpEvent<any>> {
    const getRequest: HttpRequest<any> = new HttpRequest('GET', AccountAPIUrls.GetUnsafeDoneBy);
    return this.httpClient.request(getRequest);
  };

}
