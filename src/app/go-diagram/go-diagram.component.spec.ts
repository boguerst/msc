import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoDiagramComponent } from './go-diagram.component';

describe('GoDiagramComponent', () => {
  let component: GoDiagramComponent;
  let fixture: ComponentFixture<GoDiagramComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GoDiagramComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GoDiagramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
