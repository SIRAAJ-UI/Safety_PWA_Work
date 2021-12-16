import {  Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { SafetyService } from '@app/_services/safety.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ImageCompress } from './image.compress';

@Component({
  selector: 'webcam-snapshot-component',
  templateUrl: './webcam-snapshot.component.html',
  styleUrls: ['./webcam-snapshot.component.scss']
})
export class WebcamSnapshotComponent implements OnInit,OnDestroy {

  @ViewChild("canvas")
  public canvas: ElementRef;
  @ViewChild("AlertBox") AlertBox: any;
  @ViewChild("ErrorInImages") ErrorInImages: any;
  @Output("UpdateBlobImages") UpdateBlobImages:EventEmitter<Array<string>> = new EventEmitter();
  public captureIndex: number = 0;
  public selectedCaptureId: number = null;
  @Input("Reset") set ResetPhotos(value:boolean){
    if(value === true){

    }
  }
  captures: any[] = [];
  error: any;
  isCaptured: boolean;
  modalRef: BsModalRef;
  subscribes:any[] = [];
  imageCompress:ImageCompress = new ImageCompress(this.safetyService);
  constructor(private safetyService: SafetyService,private modalService: BsModalService) { }

  ngOnInit() {
    this.subscribes.push(
      this.safetyService.ImageCaptures.subscribe( result => {
        if(this.captures.length <3){
          this.captures.push(result);
          this.UpdateBlobImages.emit(this.captures);
        } else {
          if (this.modalRef) {
            this.modalRef.hide();
          }
          this.modalRef = this.modalService.show(this.ErrorInImages, {
            backdrop: 'static',
            keyboard: false,
            class: 'gray modal-md'
          });
        }
      
      })
    )
  }
 
  validateFileType(event) {
    this.imageCompress.onCustomImageLoad(event.target.files[0]);
    // this.Main(event.target.files[0])
  }

  

  onDeleteImage(captureId: number) {
    this.selectedCaptureId = captureId;
    if (this.modalRef) {
      this.modalRef.hide();
    }
    this.modalRef = this.modalService.show(this.AlertBox, {
      backdrop: 'static',
      keyboard: false,
      class: 'gray modal-md'
    });
  }

  yesToDelete() {
    this.modalRef.hide();
    const findIndex = this.captures.findIndex ( capture => capture.id === this.selectedCaptureId)
    if(findIndex >= 0) {
      this.captures.splice(findIndex,1)
    }
    this.UpdateBlobImages.emit(this.captures);
  }
  noToDelete() {
    this.selectedCaptureId = null;
    this.modalRef.hide();
  }
  ngOnDestroy(){
    this.subscribes.forEach(sub => {
      sub.unsubscribe();
    })
    
  }
}


