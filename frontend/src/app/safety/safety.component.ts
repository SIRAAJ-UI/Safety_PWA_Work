import { HttpEventType } from '@angular/common/http';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AreaLine, GetClass, Machine, ReportType, SaveRecord, UserProfile } from '@app/_models/model';
import { AccountService } from '@app/_services';
import { SafetyService } from '@app/_services/safety.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { NgxIndexedDBService } from 'ngx-indexed-db';


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
  public Machines: Array<Machine> = [];
  public IsUnsafeDoneBy: boolean = false;
  modalRef: BsModalRef;
  public IsOnline: boolean = true;
  @ViewChild("ErrorAlertBox") ErrorAlertBox: any;
  @ViewChild("SuccessAlertBox") SuccessAlertBox: any;
  public IsSafetyReportFormOpen: boolean = false;

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

  constructor(private accountService: AccountService, private safetyService: SafetyService, private modalService: BsModalService, private dbService: NgxIndexedDBService) {
    console.log("refresh")
  }

  ngOnInit(): void {
    this.IsOnline = navigator.onLine;
    this.dbService.clear('OFFLINE_RECORDS').subscribe((successDeleted) => {
      console.log('success? ', successDeleted);
    });
  
    // if(this.IsOnline === true){
    //   this.dbService.clear('people').subscribe((successDeleted) => {
    //     console.log('success? ', successDeleted);
    //   });
    // }
    // this.dbService.deleteDatabase().subscribe((deleted) => {
    //   console.log('Database deleted successfully: ', deleted);
    // });
    
    this.subscribes.push(
      this.accountService.getOnlineStatus().subscribe((isonline: boolean) => {
        this.IsOnline = isonline;
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
            }).subscribe((key) => {
              console.log(key)
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
              console.log(key)
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
              console.log(key)
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
            const isActiveFlags = response.body.filter((item: ReportType) => {
              return (item.ActiveFlag === true)
            })
            this.AreaLines = isActiveFlags;
            this.dbService.add('OFFLINE_RECORDS', {
              AreaLines: this.AreaLines
            }).subscribe((key) => {
              console.log(key)
            });
          }
        }
      }, error => {
        console.log(error);
      })
    );
  }
  private checkStatusIsOline() {
    console.log("Check")
    this.dbService.getAll('OFFLINE_RECORDS').subscribe((safety) => {
      console.log(safety);
    });

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
  onChangeAreaLineCode() {
    const areaLineCode = this.SafetyReportForm.get("AreaLineCnfgId").value;
    this.safetyService.GetMachine(areaLineCode).subscribe(response => {
      if (response.type == HttpEventType.DownloadProgress) {
      } else if (response.type === HttpEventType.Response) {
        if (typeof response.body !== 'undefined' && response.body !== null) {
          const isActiveFlags = response.body.filter((item: ReportType) => {
            return (item.ActiveFlag === true)
          })
          this.Machines = isActiveFlags;
          this.dbService.add('OFFLINE_RECORDS', {
            Machines: this.Machines
          }).subscribe((key) => {
            console.log(key)
          });
        }
      }
    })
  }
  openForm() {
    this.IsSafetyReportFormOpen = true;
    console.log(navigator.onLine);
    this.IsOnline = navigator.onLine;
    this.checkStatusIsOline()
  }
  onSubmit() {
    console.log(this.SafetyReportForm.value);

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
    // storeName: string, value: T, key?: any
    // this.dbService.add("people","Sirajudeen","name");
    // this.dbService.add("people","ksiraj2002@gmail.com","email");

    // this.safetyService.SaveRecord(saveRecord).subscribe(response => {
    //   if (response.type == HttpEventType.DownloadProgress) {
    //   } else if (response.type === HttpEventType.Response) {
    //     if (typeof response.body !== 'undefined' && response.body !== null) {
    //       const { ErrorMessage }  = response.body;
    //       if(ErrorMessage === null){
    //         if (this.modalRef) {
    //           this.modalRef.hide();
    //         }
    //         this.modalRef = this.modalService.show(this.SuccessAlertBox, {
    //           backdrop: 'static',
    //           keyboard: false,
    //           class: 'gray modal-md'
    //         });
    //       } else {
    //         if (this.modalRef) {
    //           this.modalRef.hide();
    //         }
    //         this.modalRef = this.modalService.show(this.ErrorAlertBox, {
    //           backdrop: 'static',
    //           keyboard: false,
    //           class: 'gray modal-md'
    //         });
    //       }
    //     }
    //   }
    // })
  }

  goToDasboard() {
    this.modalRef.hide();
    this.IsSafetyReportFormOpen = false;
  }
}
