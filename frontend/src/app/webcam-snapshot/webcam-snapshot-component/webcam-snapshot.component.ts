import {  Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'webcam-snapshot-component',
  templateUrl: './webcam-snapshot.component.html',
  styleUrls: ['./webcam-snapshot.component.scss']
})
export class WebcamSnapshotComponent  {


  @ViewChild("canvas")
  public canvas: ElementRef;

  captures: string[] = [];
  error: any;
  isCaptured: boolean;

  validateFileType(event) {
    console.log(event.target.files[0])
    this.Main(event.target.files[0])
  }

  toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

  async Main(file) {
    const values:any = await this.toBase64(file)
    this.captures.push(values);
  }
}
