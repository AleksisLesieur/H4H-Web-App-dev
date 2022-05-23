import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExploreResumeComponent } from './explore-resume.component';

describe('ExploreResumeComponent', () => {
  let component: ExploreResumeComponent;
  let fixture: ComponentFixture<ExploreResumeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExploreResumeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExploreResumeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
