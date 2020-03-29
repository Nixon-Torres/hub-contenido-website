import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IfxComponent } from './ifx.component';

describe('IfxComponent', () => {
  let component: IfxComponent;
  let fixture: ComponentFixture<IfxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IfxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IfxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
