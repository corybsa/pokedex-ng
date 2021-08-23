import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypedexIndexComponent } from './typedex-index.component';

describe('TypedexIndexComponent', () => {
  let component: TypedexIndexComponent;
  let fixture: ComponentFixture<TypedexIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TypedexIndexComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TypedexIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
