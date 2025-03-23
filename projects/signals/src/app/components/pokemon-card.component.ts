import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { Pokemon, typeColorMap } from '../../../../../types/pokemon';
import { TeamService } from '../services/team.service';
import { PokemonAbilitiesComponent } from "./pokemon-abilities.component";
import { PokemonMovesComponent } from "./pokemon-moves.component";
import { PokemonStatsComponent } from "./pokemon-stats.component";

@Component({
  selector: 'app-pokemon-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PokemonAbilitiesComponent, PokemonStatsComponent, PokemonMovesComponent, NgClass],
  template: `
    @let poke = pokemon();
    <div class="pokemon-card">
      <div class="relative">
        <button (click)="addToTeam()"
            class="absolute top-0 right-0 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors">
          Add to Team
        </button>
        <div class="text-center">
          <img [src]="poke.sprites.other['official-artwork'].front_default" [alt]="poke.name"
            class="mx-auto h-64 w-64 object-contain">
          <h2 class="text-3xl font-bold capitalize mt-4">{{poke.name}}</h2>
          <div class="flex justify-center gap-2 mt-2">
            @for (type of poke.types; track $index) {
              <span class="px-3 py-1 rounded-full text-white text-sm" [ngClass]="typeColorMap.get(type.type.name)">
                {{type.type.name}}
              </span>
            }
          </div>
        </div>
      </div>

      <div class="mt-6 grid grid-cols-2 gap-4">
        <div class="text-center">
          <p class="text-gray-600">Height</p>
          <p class="font-bold">{{poke.height / 10}}m</p>
        </div>
        <div class="text-center">
          <p class="text-gray-600">Weight</p>
          <p class="font-bold">{{poke.weight / 10}}kg</p>
        </div>
      </div>

      <app-pokemon-abilities [abilities]="poke.abilities"/>
      <app-pokemon-stats [pokemon]="poke"/>
      <app-pokemon-moves [pokemon]="poke"/>
    </div>
  `,
  styles: ``
})
export class PokemonCardComponent {
  private readonly teamService = inject(TeamService);
  readonly typeColorMap = typeColorMap;

  readonly pokemon = input.required<Pokemon>();

  addToTeam() {
    const added = this.teamService.addPokemon(this.pokemon());
    if (!added) {
      alert('Could not add Pokemon to team. Team might be full or Pokemon already in team.');
    }
  }
}
