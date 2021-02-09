import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MyspaceComponent } from './myspace.component';

describe('MyspaceComponent', () => {
  let component: MyspaceComponent;
  let fixture: ComponentFixture<MyspaceComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MyspaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyspaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
