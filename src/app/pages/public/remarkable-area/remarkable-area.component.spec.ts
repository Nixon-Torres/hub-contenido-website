import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemarkableAreaComponent } from './remarkable-area.component';

describe('RemarkableAreaComponent', () => {
  let component: RemarkableAreaComponent;
  let fixture: ComponentFixture<RemarkableAreaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemarkableAreaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemarkableAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
