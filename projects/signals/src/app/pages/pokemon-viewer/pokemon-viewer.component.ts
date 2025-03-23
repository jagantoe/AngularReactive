import { httpResource } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, effect, inject, input } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MAXPOKEMONID, Pokemon } from '../../../../../../types/pokemon';
import { PokemonCardComponent } from "../../components/pokemon-card.component";
import { PokemonSearchComponent } from "../../components/pokemon-search.component";
import { PokemonTeamBeltComponent } from "../../components/pokemon-team-belt.component";
import { PokemonService } from '../../services/pokemon.service';

@Component({
  selector: 'app-pokemon-viewer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PokemonSearchComponent, PokemonTeamBeltComponent, PokemonCardComponent],
  template: `
    <div class="min-h-screen bg-gray-100 p-4">
      <app-pokemon-team-belt/>

      @if(pokemonResource.isLoading()) {
        <div class="text-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p class="mt-4 text-gray-600">Loading Pokemon...</p>
        </div>
      } @else if (pokemonResource.error()) {
        <div class="text-center py-12">
          <p class="text-red-500">Error loading Pokemon. Please try again.</p>
        </div>
      }
      @if (pokemonResource.value(); as pokemon) {\
        <div class="flex gap-2 justify-center mb-6">
          <button (click)="navigateToPokemon(-1)" class="nav-button font-mono"
              [disabled]="pokemon.id === 1" [class.opacity-50]="pokemon.id === 1">
            ←
          </button>

          <app-pokemon-search/>

          <button (click)="navigateToPokemon(1)" class="nav-button font-mono"
              [disabled]="pokemon.id === maxPokemonId" [class.opacity-50]="pokemon.id === maxPokemonId">
            →
          </button>
        </div>

        <app-pokemon-card [pokemon]="pokemon"/>
      }
    </div>
  `,
  styles: ``
})
export class PokemonViewerComponent {
  private readonly pokemonService = inject(PokemonService);
  private readonly router = inject(Router);
  private titleSerivce = inject(Title);
  readonly maxPokemonId = MAXPOKEMONID;

  id = input.required<number>();
  pokemonResource = httpResource<Pokemon>(() => this.pokemonService.getPokemon(this.id()));

  constructor() {
    effect(() => {
      if (this.pokemonResource.hasValue()) {
        this.titleSerivce.setTitle(this.pokemonResource.value().name);
      }
    })
  }

  navigateToPokemon(offset: number) {
    const value = this.pokemonResource.value();
    if (!value) return;
    const newId = value.id + offset;
    if (newId > 0 && newId <= MAXPOKEMONID) {
      this.router.navigate(['/pokemon', newId]);
    }
  }
}
