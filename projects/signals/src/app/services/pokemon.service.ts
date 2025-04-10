import { httpResource } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MAXPOKEMONID } from '../../../../../types/pokemon';
import { PokemonListResponse } from '../../../../../types/pokemon-list-response';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private readonly baseUrl = 'https://pokeapi.co/api/v2';

  // Introduced in Angular 18, we can now use the resource & httpResource signals for making api calls.
  // This gives us an alternative to the HttpClient which returns observables.
  // The resource has isLoading/error/value signals that indicate the status of the request.
  // Because of the synchronous nature of signals some sort of value always need to be available.
  // We are notified by the isLoading signal when the actual value becomes available.
  // In this example it's a static url meaning it will never retrigger the request.
  // https://angular.dev/guide/signals/resource
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

  // Because we cannot create resource signals dynamically, we simply return the url for the api call.
  getPokemon(id: number): string {
    return `${this.baseUrl}/pokemon/${id}`;
  }

  getRandomPokemonId(): number {
    return Math.floor(Math.random() * MAXPOKEMONID) + 1;
  }
}
