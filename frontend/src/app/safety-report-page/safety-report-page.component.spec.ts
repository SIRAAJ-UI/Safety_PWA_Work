import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SafetyReportPageComponent } from './safety-report-page.component';

describe('SafetyReportPageComponent', () => {
  let component: SafetyReportPageComponent;
  let fixture: ComponentFixture<SafetyReportPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SafetyReportPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SafetyReportPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
