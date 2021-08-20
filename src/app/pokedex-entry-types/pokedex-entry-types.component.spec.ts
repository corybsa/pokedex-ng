import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokedexEntryTypesComponent } from './pokedex-entry-types.component';

describe('PokedexEntryTypesComponent', () => {
  let component: PokedexEntryTypesComponent;
  let fixture: ComponentFixture<PokedexEntryTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PokedexEntryTypesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PokedexEntryTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
