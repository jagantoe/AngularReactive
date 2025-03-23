import { Component, Input } from '@angular/core';
import { AbilityDetail } from '../../../../../types/ability-detail';
import { Pokemon } from '../../../../../types/pokemon';
import { TeamService } from '../services/team.service';
import { PokemonAbilitiesComponent } from "./pokemon-abilities.component";
import { PokemonMovesComponent } from "./pokemon-moves.component";
import { PokemonStatsComponent } from "./pokemon-stats.component";

@Component({
  selector: 'app-pokemon-card',
  imports: [PokemonAbilitiesComponent, PokemonStatsComponent, PokemonMovesComponent],
  template: `
    <div class="pokemon-card">
        <div class="relative">
            <button (click)="addToTeam()"
                class="absolute top-0 right-0 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors">
                Add to Team
            </button>
            <div class="text-center">
                <img [src]="pokemon.sprites.other['official-artwork'].front_default" [alt]="pokemon.name"
                    class="mx-auto h-64 w-64 object-contain">
                <h2 class="text-3xl font-bold capitalize mt-4">{{pokemon.name}}</h2>
                <div class="flex justify-center gap-2 mt-2">
                    <span *ngFor="let type of pokemon.types" class="px-3 py-1 rounded-full text-white text-sm" [ngClass]="{
                  'bg-red-500': type.type.name === 'fire',
                  'bg-blue-500': type.type.name === 'water',
                  'bg-green-500': type.type.name === 'grass',
                  'bg-yellow-500': type.type.name === 'electric',
                  'bg-purple-500': type.type.name === 'poison',
                  'bg-gray-500': type.type.name === 'normal',
                  'bg-orange-500': type.type.name === 'fighting',
                  'bg-teal-500': type.type.name === 'flying'
                }">
                        {{type.type.name}}
                    </span>
                </div>
            </div>
        </div>

        <div class="mt-6 grid grid-cols-2 gap-4">
            <div class="text-center">
                <p class="text-gray-600">Height</p>
                <p class="font-bold">{{pokemon.height / 10}}m</p>
            </div>
            <div class="text-center">
                <p class="text-gray-600">Weight</p>
                <p class="font-bold">{{pokemon.weight / 10}}kg</p>
            </div>
        </div>

        <app-pokemon-abilities [abilities]="abilityDetails"></app-pokemon-abilities>
        <app-pokemon-stats [pokemon]="pokemon"></app-pokemon-stats>
        <app-pokemon-moves [pokemon]="pokemon"></app-pokemon-moves>
    </div>
  `,
  styles: ``
})
export class PokemonCardComponent {
  @Input() pokemon!: Pokemon;
  @Input() abilityDetails: AbilityDetail[] = [];

  constructor(private teamService: TeamService) { }

  addToTeam() {
    const added = this.teamService.addPokemon(this.pokemon);
    if (!added) {
      alert('Could not add Pokemon to team. Team might be full or Pokemon already in team.');
    }
  }
}
