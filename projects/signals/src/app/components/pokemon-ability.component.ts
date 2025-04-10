import { httpResource } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { AbilityDetail } from '../../../../../types/ability-detail';

@Component({
  selector: 'app-pokemon-ability',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  template: `
    <!--
      Much like with the async pipe for observables we will get undefined here if no value is available yet.
      So we need an @if to check when the value is available and then we can use it.
    -->
    @if(ability(); as ability){
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
  `,
  styles: ``
})
export class PokemonAbilityComponent {
  // Here the url of the ability is passed as an input.
  abilityUrl = input.required<string>();
  // Using the httpResource we trigger an api call when that url changes.
  abilityResource = httpResource<AbilityDetail>(() => this.abilityUrl());

  // Because we expect the result in a different format we can use a computed signal that transforms the result once it becomes available.
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
    // While there is no value we simply return undefined.
    else return value;
  });
}
