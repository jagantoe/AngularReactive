import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AbilityDetail } from '../../../../../types/ability-detail';

@Component({
  selector: 'app-pokemon-abilities',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  template: `
    <div class="mt-6">
      <h3 class="font-bold text-lg mb-2">Abilities</h3>
      <div class="flex flex-wrap gap-2">
        @for (ability of abilities(); track $index) {
          <div class="relative group">
            <span class="px-3 py-1 bg-indigo-500 text-white rounded-full capitalize cursor-help">
              {{ability.name}}
            </span>
            <div
              class="absolute z-10 invisible group-hover:visible bg-black text-white p-4 rounded-lg shadow-lg w-64 mt-2 text-sm">
              {{ability.effect_entries[0].effect || 'No description available.'}}
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: ``
})
export class PokemonAbilitiesComponent {
  readonly abilities = input.required<AbilityDetail[]>();
}
