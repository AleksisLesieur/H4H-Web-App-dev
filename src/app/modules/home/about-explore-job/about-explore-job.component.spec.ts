import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutExploreJobComponent } from './about-explore-job.component';

describe('AboutExploreJobComponent', () => {
  let component: AboutExploreJobComponent;
  let fixture: ComponentFixture<AboutExploreJobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AboutExploreJobComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutExploreJobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
