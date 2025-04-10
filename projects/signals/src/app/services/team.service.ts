import { effect, Injectable, signal } from '@angular/core';
import { Pokemon } from '../../../../../types/pokemon';

const TEAM_STORAGE_KEY = 'pokemon_team';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private readonly MAX_TEAM_SIZE = 6;
  // We use a regular signal to keep track of the state.
  // Allowing us to read and update it when needed
  private teamStore = signal<Pokemon[]>(this.loadTeamFromStorage());
  // If we expose the WriteableSignal directly anyone who can access it can also modify it directly.
  // To prevent this we use the asReadonly function and expose that signal.
  team = this.teamStore.asReadonly();

  constructor() {
    // Each time the team changes, we save it to local storage.
    // We can use effect to trigger some code when any signals within it are updated.
    // https://angular.dev/guide/signals#use-cases-for-effects
    effect(() => this.saveTeamToStorage(this.team()));
  }

  private loadTeamFromStorage(): Pokemon[] {
    try {
      const savedTeam = localStorage.getItem(TEAM_STORAGE_KEY);
      return savedTeam ? JSON.parse(savedTeam) : [];
    } catch (error) {
      console.error('Error loading team from storage:', error);
      return [];
    }
  }

  private saveTeamToStorage(team: Pokemon[]) {
    try {
      localStorage.setItem(TEAM_STORAGE_KEY, JSON.stringify(team));
    } catch (error) {
      console.error('Error saving team to storage:', error);
    }
  }

  addPokemon(pokemon: Pokemon): boolean {
    // The current team is available by reading the signal which can be done synchronously.
    const currentTeam = this.team();
    if (currentTeam.length >= this.MAX_TEAM_SIZE || currentTeam.some(p => p.id === pokemon.id)) {
      return false;
    }
    // Because signals already do some optimisations for us it will only emit a new value if the value has changed.
    // For objects and arrays this means that it expects a different reference to be passed.
    // So simply pushing into the existing array and setting that as the signal value will not work.
    // We can use the teamStore.set method to set the new value directly.
    // Alternatively we can use the update method to make a change based on the current value.
    this.teamStore.update(t => t.concat(pokemon));
    return true;
  }

  removePokemon(pokemonId: number) {
    // The filter fuction will create a new array so we can use that for updating the value.
    this.teamStore.update(t => t.filter(p => p.id !== pokemonId));
  }
}
