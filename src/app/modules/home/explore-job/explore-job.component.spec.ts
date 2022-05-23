import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExploreJobComponent } from './explore-job.component';

describe('ExploreJobComponent', () => {
  let component: ExploreJobComponent;
  let fixture: ComponentFixture<ExploreJobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExploreJobComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExploreJobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
