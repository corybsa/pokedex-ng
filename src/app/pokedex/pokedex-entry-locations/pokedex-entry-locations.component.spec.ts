import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokedexEntryLocationsComponent } from './pokedex-entry-locations.component';

describe('PokedexEntryLocationsComponent', () => {
  let component: PokedexEntryLocationsComponent;
  let fixture: ComponentFixture<PokedexEntryLocationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PokedexEntryLocationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PokedexEntryLocationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
