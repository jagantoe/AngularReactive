import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Pokemon } from '../../../../../types/pokemon';

const TEAM_STORAGE_KEY = 'pokemon_team';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private readonly MAX_TEAM_SIZE = 6;

  // Because we can load the team from localStorage synchronously we can use a BehaviorSubject.
  // If the team was loaded asynchronously we would use a ReplaySubject with a buffer size of 1,
  // that way we can set it's value when able and any subscriptions to the subject will be waiting until that value is set.
  private readonly teamSubject = new BehaviorSubject<Pokemon[]>(this.loadTeamFromStorage());
  // In general we don't want to expose the subject directly as it allows the code that accesses it to modify the state directly.
  readonly team$ = this.teamSubject.asObservable();

  constructor() {
    // Each time the team changes, we save it to local storage
    // Note: if the subject never completes this subscription would create a memory leak but this service is a singleton so no other instances of it will be created.
    // The subscription and service will only be cleaned up when the app is destroyed.
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
    // Because we are using BehaviorSubject we can synchronously get the current value of the subject.
    // If it was a ReplaySubject we would use a firstValueFrom and await to receive the value, making this method asynchronous.
    const currentTeam = this.teamSubject.value;
    if (currentTeam.length >= this.MAX_TEAM_SIZE || currentTeam.some(p => p.id === pokemon.id)) {
      return false;
    }

    // Usually it is recommended to create a new array instead of mutating the existing one.
    // Otherwise you can cause unexpected behavior somewhere with missmatches in emitted values,
    // new subscriptions will receive the latest value but others might still show an older value.
    // That way subscribers can be certain a change has occurred because the reference has changed.
    currentTeam.push(pokemon);
    // To notify any existing subscribers we need to call next with the new value.
    // If we don't do this the current subscribers won't be notified but new subscribers will get the current value which has been modified.
    this.teamSubject.next(currentTeam);
    return true;
  }

  removePokemon(pokemonId: number) {
    // Here the filter will create a new array and we push that to the subject.
    const currentTeam = this.teamSubject.value;
    const newTeam = currentTeam.filter(p => p.id !== pokemonId);
    this.teamSubject.next(newTeam);
    // Alternative - we can remove only the one item from the array so we don't need to create a large new array.
    // currentTeam.splice(currentTeam.findIndex(predicate => predicate.id === pokemonId), 1);
    // this.teamSubject.next(currentTeam);
  }
}
