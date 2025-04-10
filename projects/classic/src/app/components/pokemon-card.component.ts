import { Component, Input, OnChanges } from '@angular/core';
import { AbilityDetail } from '../../../../../types/ability-detail';
import { Pokemon, typeColorMap } from '../../../../../types/pokemon';
import { CHANGE_DETECTION } from '../app.module';
import { PokemonService } from '../services/pokemon.service';
import { TeamService } from '../services/team.service';

@Component({
  selector: 'app-pokemon-card',
  standalone: false,
  changeDetection: CHANGE_DETECTION,
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
            <!-- The *ngFor directive can be used on an element to create an instance for each item of the array -->
            <span *ngFor="let type of pokemon.types" class="px-3 py-1 rounded-full text-white text-sm" [ngClass]="typeColorMap.get(type.type.name)">
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

      <ng-container *ngIf="abilityDetails">
        <app-pokemon-abilities [abilities]="abilityDetails"></app-pokemon-abilities>
      </ng-container>
      <app-pokemon-stats [stats]="pokemon.stats"></app-pokemon-stats>
      <app-pokemon-moves [pokemon]="pokemon"></app-pokemon-moves>
    </div>
  `,
  styles: ``
})
export class PokemonCardComponent implements OnChanges {
  readonly typeColorMap = typeColorMap;

  // We use the @Input decorator to make this property assignable from the parent component.
  @Input() pokemon!: Pokemon;
  abilityDetails: AbilityDetail[] = [];

  constructor(private pokemonService: PokemonService, private teamService: TeamService) { }

  // The only way to know if the input has changed is to use the ngOnChanges lifecycle hook.
  // Here we then fetch the abilities of the pokemon and store them in the abilityDetails array.
  // Because the promises resolve asynchronously without awaits we might get weird behavior when quickly switching between pokemon.
  ngOnChanges() {
    if (this.pokemon) {
      this.abilityDetails = [];
      this.pokemon.abilities.forEach(ability => this.pokemonService.getAbilityDetails(ability.ability.url).then(abilityDetail => {
        this.abilityDetails.push(abilityDetail);
      }));
    }
  }

  addToTeam() {
    const added = this.teamService.addPokemon(this.pokemon);
    if (!added) {
      alert('Could not add Pokemon to team. Team might be full or Pokemon already in team.');
    }
  }
}
