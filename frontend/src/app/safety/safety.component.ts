import { HttpClient, HttpEventType, HttpRequest } from '@angular/common/http';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AreaLine, GetClass, lstMachineCnfg, Machine, ReportType, SaveRecord, UserProfile } from '@app/_models/model';
import { AccountService } from '@app/_services';
import { SafetyService } from '@app/_services/safety.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { forkJoin, Observable } from 'rxjs';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ConnectionService } from 'ng-connection-service';


@Component({
  selector: 'app-safety',
  templateUrl: './safety.component.html',
  styleUrls: ['./safety.component.scss']
})
export class SafetyComponent implements OnInit {

  private subscribes: any[] = [];
  public ReportTypes: Array<ReportType>;
  public GetClass: Array<GetClass>;
  public ReportedBy: Array<UserProfile>
  public AreaLines: Array<AreaLine> = [];
  public Machines: Array<lstMachineCnfg> = [];
  public IsUnsafeDoneBy: boolean = false;
  @BlockUI() blockUI: NgBlockUI;

  modalRef: BsModalRef;
  public IsOnline: boolean = true;
  @ViewChild("ErrorAlertBox") ErrorAlertBox: any;
  @ViewChild("SuccessAlertBox") SuccessAlertBox: any;
  @ViewChild("SyncAlertBox") SyncAlertBox: any;
  @ViewChild("LocalSaveSuccess") LocalSaveSuccess: any;
  public SaveInProgress: boolean = false;
  public IsSafetyReportFormOpen: boolean = false;
  public MachinesCodeAlert: boolean = false;
  public isOnline: boolean = true;
  hasNetworkConnection: boolean;
  hasInternetAccess: boolean;

  public SafetyReportForm: FormGroup = new FormGroup(
    {
      ReportTypeCnfgId: new FormControl("", [Validators.required]),
      ClassCnfgId: new FormControl("", [Validators.required]),
      ReportedById: new FormControl("", [Validators.required]),
      AreaLineCnfgId: new FormControl("", [Validators.required]),
      MachineCnfgId: new FormControl("", [Validators.required]),
      UnsafeActDoneBy: new FormControl("", [Validators.required]),
      Description: new FormControl("", [Validators.required]),
      ReportsImages: new FormControl([], [Validators.required]),
      CreatedUserId: new FormControl('', [Validators.required]),
      UpdatedUserId: new FormControl('', [Validators.required]),
    });

  constructor(private connectionService: ConnectionService, private accountService: AccountService, private safetyService: SafetyService, private modalService: BsModalService, private dbService: NgxIndexedDBService) {
    this.connectionService.monitor().subscribe((currentState: any) => {
      this.hasNetworkConnection = currentState;
      this.hasInternetAccess = currentState;
      if (this.hasNetworkConnection && this.hasInternetAccess) {
        this.isOnline = true;
        console.log("ONLINE");
      } else {
        this.isOnline = false;
        console.log("OFFLINE");
        this.dbService.getAll('OFFLINE_RECORDS').subscribe((safety) => {
          const [Classes, ReportTypes, AreaLines, ReportedBy] = safety;
          this.ReportTypes = ReportTypes["ReportTypes"];
          this.GetClass = Classes["Classes"];
          this.ReportedBy = ReportedBy["ReportedBy"];
          this.AreaLines = AreaLines["AreaLines"];
        });
      }
    });
  }

  ngOnInit(): void {
    this.subscribes.push(
      this.accountService.getOnlineStatus().subscribe((isonline: boolean) => {
        this.IsOnline = isonline;
        if (this.IsOnline === true) {
          this.isCheckPendingRecords();
        } else {
          this.dbService.getAll('OFFLINE_RECORDS').subscribe((safety) => {
            const [Classes, ReportTypes, AreaLines, ReportedBy] = safety;
            this.ReportTypes = ReportTypes["ReportTypes"];
            this.GetClass = Classes["Classes"];
            this.ReportedBy = ReportedBy["ReportedBy"];
            this.AreaLines = AreaLines["AreaLines"];
          });
        }
      }),
      this.safetyService.GetReportType().subscribe(response => {
        if (response.type == HttpEventType.DownloadProgress) {
        } else if (response.type === HttpEventType.Response) {
          if (typeof response.body !== 'undefined' && response.body !== null) {
            const isActiveFlags = response.body.filter((item: ReportType) => {
              return (item.ActiveFlag === true)
            })
            this.ReportTypes = isActiveFlags;
            this.dbService.add('OFFLINE_RECORDS', {
              ReportTypes: this.ReportTypes
            }).subscribe((key: any) => {
            });
          }
        }
      }, error => {
        console.log(error);
      }),
      this.safetyService.GetClass().subscribe(response => {
        if (response.type == HttpEventType.DownloadProgress) {
        } else if (response.type === HttpEventType.Response) {
          if (typeof response.body !== 'undefined' && response.body !== null) {
            const isActiveFlags = response.body.filter((item: ReportType) => {
              return (item.ActiveFlag === true)
            })
            this.GetClass = isActiveFlags;
            this.dbService.add('OFFLINE_RECORDS', {
              Classes: response.body
            }).subscribe((key) => {
            });
          }
        }
      }, error => {
        console.log(error);
      }),
      this.safetyService.GetReportedBy().subscribe(response => {
        if (response.type == HttpEventType.DownloadProgress) {
        } else if (response.type === HttpEventType.Response) {
          if (typeof response.body !== 'undefined' && response.body !== null) {
            const isActiveFlags = response.body.filter((item: ReportType) => {
              return (item.ActiveFlag === true)
            })
            this.ReportedBy = isActiveFlags;
            this.dbService.add('OFFLINE_RECORDS', {
              ReportedBy: this.ReportedBy
            }).subscribe((key) => {
            });
          }
        }
      }, error => {
        console.log(error);
      }),
      this.safetyService.GetAreaLine().subscribe(response => {
        if (response.type == HttpEventType.DownloadProgress) {
        } else if (response.type === HttpEventType.Response) {
          if (typeof response.body !== 'undefined' && response.body !== null) {
            const isActiveFlags = response.body.filter((item: AreaLine) => {
              return (item.ActiveFlag === true)
            })
            this.AreaLines = isActiveFlags;
            this.dbService.add('OFFLINE_RECORDS', {
              AreaLines: this.AreaLines
            }).subscribe((key) => {
            });
          }
        }
      }, error => {
        console.log(error);
      })
    );
  }

  onUpdateFormImages(blobImages: Array<string>) {
    this.SafetyReportForm.get("ReportsImages").setValue(blobImages);
  }
  onReportByChange() {
    const ReportedTypeId = this.SafetyReportForm.get("ReportedById").value;
    this.SafetyReportForm.get("CreatedUserId").setValue(ReportedTypeId);
    this.SafetyReportForm.get("UpdatedUserId").setValue(ReportedTypeId);
  }
  onReportTypeChange() {
    const ReportTypeId = this.SafetyReportForm.get("ReportTypeCnfgId").value;
    if (ReportTypeId === 1) {
      this.IsUnsafeDoneBy = true;
    } else {
      this.IsUnsafeDoneBy = false;
    }
  }

  private isCheckPendingRecords() {
    this.dbService.getAll('OFFLINE_SAVE_RECORDS').subscribe((safetySaved: any) => {
      if (safetySaved.length > 0) {
        this.modalRef = this.modalService.show(this.SyncAlertBox, {
          backdrop: 'static',
          keyboard: false,
          class: 'gray modal-md'
        });
        this.getData(safetySaved).subscribe(result => { console.log("Finished") })
      }
    });
  }

  deleteRecordById(count: number) {
    this.dbService.deleteByKey('OFFLINE_SAVE_RECORDS', count).subscribe((status) => {
      this.modalRef = this.modalService.show(this.LocalSaveSuccess, {
        backdrop: 'static',
        keyboard: false,
        class: 'gray modal-md'
      });
    });

  }
  getData(safetySaved: Array<any>): Observable<any> {
    let arrayRequest = [];
    let count = 1;
    safetySaved.forEach((element, index) => {
      arrayRequest.push(this.safetyService.SaveRecord(element.SaveSafetyRecords).subscribe(response => {
        if (response.type == HttpEventType.DownloadProgress) {
        } else if (response.type === HttpEventType.Response) {
          if (typeof response.body !== 'undefined' && response.body !== null) {
            const { ErrorMessage } = response.body;
            if (ErrorMessage === null) {
              this.deleteRecordById(count);
            } else {
            }
            count += 1;
          }
        }
      }));
    });
    return forkJoin(arrayRequest)
  }

  onChangeAreaLineCode() {
    const areaLineCode = this.SafetyReportForm.get("AreaLineCnfgId").value;
    const filterByArea = this.AreaLines.find((arealine: any) => {
      return (arealine.AreaLineCnfgId === areaLineCode);
    })
    // const isActiveFlags = filterByArea.lstMachineCnfg.filter((item: any) => {
    //    return (item.ActiveFlag === true)
    // })
    this.Machines = filterByArea.lstMachineCnfg;
    if (this.Machines.length === 0) {
      this.MachinesCodeAlert = true;
    } else {
      this.MachinesCodeAlert = false;
    }
  }
  openForm() {
    this.SafetyReportForm.reset();
    this.IsSafetyReportFormOpen = true;
    this.IsOnline = navigator.onLine;
    
  }
  onSubmit() {
    this.SaveInProgress = false;
    const {
      ReportTypeCnfgId,
      ClassCnfgId,
      ReportedById,
      AreaLineCnfgId,
      MachineCnfgId,
      UnsafeActDoneBy,
      Description,
      CreatedUserId,
      UpdatedUserId,
      ReportsImages
    } = this.SafetyReportForm.value;
    const saveRecord: SaveRecord = new SaveRecord();
    saveRecord.ReportTypeCnfgId = ReportTypeCnfgId;
    saveRecord.ClassCnfgId = ClassCnfgId;
    saveRecord.ReportedById = ReportedById;
    saveRecord.AreaLineCnfgId = AreaLineCnfgId;
    saveRecord.MachineCnfgId = MachineCnfgId;
    saveRecord.UnsafeActDoneBy = UnsafeActDoneBy;
    saveRecord.Description = Description;
    saveRecord.CreatedUserId = Description;
    saveRecord.UpdatedUserId = UpdatedUserId;
    saveRecord.ReportsImages = ReportsImages;
    saveRecord.CreatedUserId = CreatedUserId;

    //Save in index DB
    if (this.IsOnline === false) {
      this.dbService.add('OFFLINE_SAVE_RECORDS', {
        SaveSafetyRecords: saveRecord
      }).subscribe((key) => {
        this.modalRef = this.modalService.show(this.LocalSaveSuccess, {
          backdrop: 'static',
          keyboard: false,
          class: 'gray modal-md'
        });
      });
    } else {
      this.blockUI.start("Loading");

      this.safetyService.SaveRecord(saveRecord).subscribe(response => {
        if (response.type == HttpEventType.DownloadProgress) {
        } else if (response.type === HttpEventType.Response) {
          if (typeof response.body !== 'undefined' && response.body !== null) {
            const { ErrorMessage } = response.body;
            this.blockUI.stop();
            if (ErrorMessage === null) {
              if (this.modalRef) {
                this.modalRef.hide();
              }
              this.modalRef = this.modalService.show(this.SuccessAlertBox, {
                backdrop: 'static',
                keyboard: false,
                class: 'gray modal-md'
              });
            } else {
              if (this.modalRef) {
                this.modalRef.hide();
              }
              this.modalRef = this.modalService.show(this.ErrorAlertBox, {
                backdrop: 'static',
                keyboard: false,
                class: 'gray modal-md'
              });
            }
          }
        }
      }, error => {
        this.blockUI.stop();
      })
    }

  }

  goToDasboard() {
    this.modalRef.hide();
    this.IsSafetyReportFormOpen = false;
  }

  ngOnDestroy() {
    this.subscribes.forEach(sub => {
      sub.unsubcribes();
    })
  }
}
