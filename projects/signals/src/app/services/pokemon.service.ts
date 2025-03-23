import { httpResource } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MAXPOKEMONID } from '../../../../../types/pokemon';
import { PokemonListResponse } from '../../../../../types/pokemon-list-response';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private readonly baseUrl = 'https://pokeapi.co/api/v2';

  private readonly pokemonList = httpResource<PokemonListResponse>(() => `${this.baseUrl}/pokemon?limit=${MAXPOKEMONID}`);

  searchPokemon(query: string): Array<{ name: string, id: number }> {
    var pokemons = this.pokemonList.value();
    if (!pokemons || !query) return [];

    const normalizedQuery = query.toLowerCase();
    return pokemons.results
      .filter(pokemon => pokemon.name.includes(normalizedQuery))
      .map(pokemon => ({
        name: pokemon.name,
        id: parseInt(pokemon.url.split('/').slice(-2, -1)[0])
      }))
      .slice(0, 10);
  }

  getPokemon(id: number): string {
    return `${this.baseUrl}/pokemon/${id}`;
  }

  getRandomPokemonId(): number {
    return Math.floor(Math.random() * MAXPOKEMONID) + 1;
  }
}
