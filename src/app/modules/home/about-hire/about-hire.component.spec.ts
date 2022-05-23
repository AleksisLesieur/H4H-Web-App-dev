import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutHireComponent } from './about-hire.component';

describe('AboutHireComponent', () => {
  let component: AboutHireComponent;
  let fixture: ComponentFixture<AboutHireComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AboutHireComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutHireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
