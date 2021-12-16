import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebcamSnapshotComponentComponent } from './webcam-snapshot-component.component';

describe('WebcamSnapshotComponentComponent', () => {
  let component: WebcamSnapshotComponentComponent;
  let fixture: ComponentFixture<WebcamSnapshotComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WebcamSnapshotComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WebcamSnapshotComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
