import { Component, Input } from '@angular/core';
import { Pokemon } from '../../../../../types/pokemon';
import { CHANGE_DETECTION } from '../app.module';

@Component({
  selector: 'app-pokemon-moves',
  standalone: false,
  changeDetection: CHANGE_DETECTION,
  template: `
    <details class="w-full mt-6 p-4 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
      <summary class="font-semibold select-none cursor-pointer">Moves ({{pokemon.moves.length}})</summary>
      <div class="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2">
        <div *ngFor="let move of pokemon.moves" class="p-2 bg-gray-50 rounded capitalize text-sm">
          {{move.move.name}}
        </div>
      </div>
    </details>
  `,
  styles: ``
})
export class PokemonMovesComponent {
  @Input() pokemon!: Pokemon;
}
