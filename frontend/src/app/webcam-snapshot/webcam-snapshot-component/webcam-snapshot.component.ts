import {  Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { SafetyService } from '@app/_services/safety.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ImageCompress } from './image.compress';

@Component({
  selector: 'webcam-snapshot-component',
  templateUrl: './webcam-snapshot.component.html',
  styleUrls: ['./webcam-snapshot.component.scss']
})
export class WebcamSnapshotComponent implements OnInit {

  @ViewChild("canvas")
  public canvas: ElementRef;
  @ViewChild("AlertBox") AlertBox: any;
  @ViewChild("ErrorInImages") ErrorInImages: any;
  @Output("UpdateBlobImages") UpdateBlobImages:EventEmitter<Array<string>> = new EventEmitter();
  public captureIndex: number = 0;
  public selectedCaptureId: number = null;
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
  ngOnDestory(){
    this.subscribes.forEach( sub => {
      sub.unsubcribes();
    })
  }
  validateFileType(event) {
    this.imageCompress.onCustomImageLoad(event.target.files[0]);
    // this.Main(event.target.files[0])
  }

  
  // toBase64 = file => new Promise((resolve, reject) => {
  //   const reader = new FileReader();
  //   reader.readAsDataURL(file);
  //   reader.onload = () => resolve(reader.result);
  //   reader.onerror = error => reject(error);
  // });

  // async Main(file) {
  //   const blob:any = await this.toBase64(file)
  //   let data = { id: ++this.captureIndex, source:blob,file:file}
  //   this.captures.push(data);
  //   this.UpdateBlobImages.emit(this.captures);
  // }

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
}


