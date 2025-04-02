import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Pokemon } from '../../../../../types/pokemon';
import { TeamService } from '../services/team.service';

@Component({
  selector: 'app-pokemon-team-belt',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AsyncPipe],
  template: `
    @let slots = [0,1,2,3,4,5];
    @if(team$ | async; as team) {
      <div class="bg-white shadow-md p-4 mb-6">
      <h2 class="text-xl font-bold mb-4">Your Team</h2>
      <div class="grid grid-cols-6 gap-2">
        @for (slot of slots; track $index) {
          <div class="aspect-square border-2 border-dashed border-gray-300 rounded-lg p-2 relative">
            @if (team[slot]; as pokemon) {
              <img [src]="pokemon.sprites.front_default" [alt]="pokemon.name" class="w-full h-full object-contain">
              <span
                  class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 text-center truncate capitalize">
                {{pokemon.name}}
              </span>
              <button (click)="removePokemon(pokemon)"
                  class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 font-mono">
                ×
              </button>
            }
          </div>
        }
      </div>
    </div>
    }
  `,
  styles: ``
})
export class PokemonTeamBeltComponent {
  private readonly teamService = inject(TeamService);
  readonly team$ = this.teamService.team$;

  removePokemon(pokemon: Pokemon) {
    this.teamService.removePokemon(pokemon.id);
  }
}
