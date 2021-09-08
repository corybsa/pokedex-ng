import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemapLocationComponent } from './pokemap-location.component';

describe('PokemapLocationComponent', () => {
  let component: PokemapLocationComponent;
  let fixture: ComponentFixture<PokemapLocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PokemapLocationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PokemapLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
