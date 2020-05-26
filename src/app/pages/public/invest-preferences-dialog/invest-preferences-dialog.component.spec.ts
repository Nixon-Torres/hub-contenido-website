import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestPreferencesDialogComponent } from './invest-preferences-dialog.component';

describe('AddWordsDialogComponent', () => {
  let component: InvestPreferencesDialogComponent;
  let fixture: ComponentFixture<InvestPreferencesDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvestPreferencesDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestPreferencesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
