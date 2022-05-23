import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllAccessComponent } from './all-access.component';

describe('AllAccessComponent', () => {
  let component: AllAccessComponent;
  let fixture: ComponentFixture<AllAccessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllAccessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
