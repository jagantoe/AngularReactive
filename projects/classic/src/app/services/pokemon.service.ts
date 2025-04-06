import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AbilityDetail } from '../../../../../types/ability-detail';
import { MAXPOKEMONID, Pokemon } from '../../../../../types/pokemon';
import { PokemonListResponse } from '../../../../../types/pokemon-list-response';
import { AbilityCacheService } from './ability-cache.service';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private readonly baseUrl = 'https://pokeapi.co/api/v2';

  pokemonList: { name: string; id: number; }[] | undefined;

  constructor(private httpClient: HttpClient, private abilityCache: AbilityCacheService) {
    this.httpClient.get<PokemonListResponse>(`${this.baseUrl}/pokemon?limit=${MAXPOKEMONID}`).subscribe(x =>
      this.pokemonList = x.results.map(pokemon => ({ name: pokemon.name, id: parseInt(pokemon.url.split('/').slice(-2, -1)[0]) }))
    );
  }

  async getPokemon(id: number): Promise<Pokemon> {
    return await firstValueFrom(this.httpClient.get<Pokemon>(`${this.baseUrl}/pokemon/${id}`));
  }

  async getAbilityDetails(url: string): Promise<AbilityDetail> {
    if (this.abilityCache.has(url)) {
      return this.abilityCache.get(url)!;
    }

    const ability = await firstValueFrom(this.httpClient.get<AbilityDetail>(url));
    const englishEffect = ability.effect_entries.find(entry => entry.language.name === 'en');

    const processedAbility: AbilityDetail = {
      name: ability.name,
      effect_entries: englishEffect
        ? [englishEffect]
        : [{ effect: 'No English description available.', language: { name: 'en' } }]
    };

    this.abilityCache.set(url, processedAbility);
    return processedAbility;
  }

  getRandomPokemonId(): number {
    return Math.floor(Math.random() * 898) + 1;
  }
}
