import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemapIndexComponent } from './pokemap-index.component';

describe('PokemapIndexComponent', () => {
  let component: PokemapIndexComponent;
  let fixture: ComponentFixture<PokemapIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PokemapIndexComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PokemapIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
