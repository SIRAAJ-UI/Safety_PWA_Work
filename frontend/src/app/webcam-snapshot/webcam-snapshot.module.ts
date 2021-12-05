import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebcamSnapshotComponent } from './webcam-snapshot-component/webcam-snapshot.component'

@NgModule({
  declarations: [WebcamSnapshotComponent],
  imports: [ CommonModule ],
  exports:[WebcamSnapshotComponent],
})
export class WebcamSnapshotModuleModule { }
