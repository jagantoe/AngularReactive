import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { forkJoin, switchMap } from 'rxjs';
import { Pokemon, typeColorMap } from '../../../../../types/pokemon';
import { PokemonService } from '../services/pokemon.service';
import { TeamService } from '../services/team.service';
import { PokemonAbilitiesComponent } from "./pokemon-abilities.component";
import { PokemonMovesComponent } from "./pokemon-moves.component";
import { PokemonStatsComponent } from "./pokemon-stats.component";

@Component({
  selector: 'app-pokemon-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PokemonAbilitiesComponent, PokemonStatsComponent, PokemonMovesComponent, AsyncPipe],
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
              <!--
                In Angular 19.2 they introduced the ability to bind on directly on class attribute instead of having to use ngClass
                https://blog.angular.dev/angular-19-2-is-now-available-673ec70aea12
              -->
              <span class="px-3 py-1 rounded-full text-white text-sm" [class]="typeColorMap.get(type.type.name)">
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

      @if(abilities$ | async; as abilities) {
        <app-pokemon-abilities [abilities]="abilities"/>
      }
      <app-pokemon-stats [stats]="poke.stats"/>
      <app-pokemon-moves [pokemon]="poke"/>
    </div>
  `,
  styles: ``
})
export class PokemonCardComponent {
  private readonly teamService = inject(TeamService);
  private readonly pokemonService = inject(PokemonService);
  readonly typeColorMap = typeColorMap;

  readonly pokemon = input.required<Pokemon>();

  readonly abilities$ = toObservable(this.pokemon).pipe(
    // Each pokemon has multiple abilities but the details need to be fetched separately.
    // By mapping the abilities to Observables we get an array of Observables, we still need to subscribe to each of them to get the results.
    // To make all the requests in parallel we can use forkJoin, this will return an array of the results similar to Promise.all.
    switchMap(pokemon => forkJoin(pokemon.abilities.map(a => this.pokemonService.getAbilityDetails(a.ability.url)))),
  );

  addToTeam() {
    const added = this.teamService.addPokemon(this.pokemon());
    if (!added) {
      alert('Could not add Pokemon to team. Team might be full or Pokemon already in team.');
    }
  }
}
