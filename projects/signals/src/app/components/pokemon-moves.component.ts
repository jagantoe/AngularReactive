import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Pokemon } from '../../../../../types/pokemon';

@Component({
  selector: 'app-pokemon-moves',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  template: `
    <details class="w-full mt-6 p-4 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
      <summary class="font-semibold select-none cursor-pointer">Moves ({{pokemon().moves.length}})</summary>
      <div class="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2">
        @for (move of pokemon().moves; track $index) {
          <div class="p-2 bg-gray-50 rounded capitalize text-sm">
            {{move.move.name}}
          </div>
        }
      </div>
    </details>
  `,
  styles: ``
})
export class PokemonMovesComponent {
  readonly pokemon = input.required<Pokemon>();
  isExpanded = false;
}
