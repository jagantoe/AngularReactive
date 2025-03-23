import { httpResource } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { AbilityDetail } from '../../../../../types/ability-detail';

@Component({
  selector: 'app-pokemon-ability',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  template: `
    @if(ability(); as ability){
      <div class="relative group">
        <span class="px-3 py-1 bg-indigo-500 text-white rounded-full capitalize cursor-help">
          {{ability.name}}
        </span>
        <div
          class="absolute z-10 invisible group-hover:visible bg-black text-white p-4 rounded-lg shadow-lg w-64 mt-2 text-sm animate-expand">
          {{ability.effect_entries[0].effect || 'No description available.'}}
        </div>
      </div>
    }
  `,
  styles: ``
})
export class PokemonAbilityComponent {
  abilityUrl = input.required<string>();
  abilityResource = httpResource<AbilityDetail>(() => this.abilityUrl());

  ability = computed(() => {
    const value = this.abilityResource.value();
    if (value) {
      const englishEffect = value.effect_entries.find(
        entry => entry.language.name === 'en'
      );

      const processedAbility: AbilityDetail = {
        name: value.name,
        effect_entries: englishEffect
          ? [englishEffect]
          : [{ effect: 'No English description available.', language: { name: 'en' } }]
      };

      return processedAbility;
    }
    else return value;
  });
}
