import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Pokemon } from '../../../../../types/pokemon';

const TEAM_STORAGE_KEY = 'pokemon_team';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private readonly MAX_TEAM_SIZE = 6;

  private readonly teamSubject = new BehaviorSubject<Pokemon[]>(this.loadTeamFromStorage());
  readonly team$ = this.teamSubject.asObservable();

  constructor() {
    // Each time the team changes, we save it to local storage
    // Note: if the subject never completes this subscription would create a memory leak but this service is singleton
    // and so the subscription and service will only be cleaned up when the app is destroyed
    this.team$.subscribe(team => this.saveTeamToStorage(team));
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
    const currentTeam = this.teamSubject.value;
    if (currentTeam.length >= this.MAX_TEAM_SIZE || currentTeam.some(p => p.id === pokemon.id)) {
      return false;
    }

    currentTeam.push(pokemon);
    this.teamSubject.next(currentTeam);
    return true;
  }

  removePokemon(pokemonId: number) {
    const currentTeam = this.teamSubject.value;
    const newTeam = currentTeam.filter(p => p.id !== pokemonId);
    this.teamSubject.next(newTeam);
    // Alternative - we can remove only the one item from the array so we don't need to create a large new array
    // currentTeam.splice(currentTeam.findIndex(predicate => predicate.id === pokemonId), 1);
    // this.teamSubject.next(currentTeam);
  }
}
