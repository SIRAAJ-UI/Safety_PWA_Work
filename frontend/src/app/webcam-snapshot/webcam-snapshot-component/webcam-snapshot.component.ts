import {  Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SafetyService } from '@app/_services/safety.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'webcam-snapshot-component',
  templateUrl: './webcam-snapshot.component.html',
  styleUrls: ['./webcam-snapshot.component.scss']
})
export class WebcamSnapshotComponent  {


  @ViewChild("canvas")
  public canvas: ElementRef;
  @ViewChild("AlertBox") AlertBox: any;
  public captureIndex: number = 0;
  public selectedCaptureId: number = null;
  captures: any[] = [];
  error: any;
  isCaptured: boolean;
  modalRef: BsModalRef;

  constructor(private safetyService: SafetyService,private modalService: BsModalService) { }

  validateFileType(event) {
    this.Main(event.target.files[0])
  }

  toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

  async Main(file) {
    const blob:any = await this.toBase64(file)
    let data = { id: ++this.captureIndex, source:blob}
    this.captures.push(data);
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
  }
  noToDelete() {
    this.selectedCaptureId = null;
    this.modalRef.hide();
  }
}
