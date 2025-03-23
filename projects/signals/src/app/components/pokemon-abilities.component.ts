import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { PokemonAbilityComponent } from "./pokemon-ability.component";

@Component({
  selector: 'app-pokemon-abilities',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PokemonAbilityComponent],
  template: `
    <div class="mt-6">
      <h3 class="font-bold text-lg mb-2">Abilities</h3>
      <div class="flex flex-wrap gap-2">
        @for (ability of abilities(); track $index) {
          <app-pokemon-ability [abilityUrl]="ability.ability.url"/>
        }
      </div>
    </div>
  `,
  styles: ``
})
export class PokemonAbilitiesComponent {
  readonly abilities = input.required<{
    ability: {
      name: string;
      url: string;
    };
    is_hidden: boolean;
  }[]>();
}
