import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, Routes } from '@angular/router';
import { MAXPOKEMONID } from '../../../../types/pokemon';
import { PokemonViewerComponent } from './pages/pokemon-viewer/pokemon-viewer.component';
import { PokemonService } from './services/pokemon.service';

export const routes: Routes = [
    {
        path: 'pokemon/:id', component: PokemonViewerComponent,
        // Introduced in Angular 14.2, we can now provide a functional guard instead of a class guard.
        // As it's run in injection context we can use the inject function to get any needed dependencies.
        canActivate: [(route: ActivatedRouteSnapshot, _: RouterStateSnapshot) => {
            const router = inject(Router);
            const id = +route.paramMap.get('id')!;
            if (id <= 0) return router.parseUrl('/pokemon/1');
            if (id > MAXPOKEMONID) return router.parseUrl(`/pokemon/${MAXPOKEMONID}`);
            return true;
        }]
    },
    {
        path: '**',
        // Introduced in Angular 18, we can now provide a function for redirect logic instead of a static route.
        // In the past this was achievable with route guards but now it's more convenient.
        redirectTo: _ => {
            const pokemonService = inject(PokemonService);
            return `/pokemon/${pokemonService.getRandomPokemonId()}`;
        }
    }
];
