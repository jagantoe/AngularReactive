import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, Routes } from '@angular/router';
import { MAXPOKEMONID } from '../../../../types/pokemon';
import { PokemonViewerComponent } from './pages/pokemon-viewer/pokemon-viewer.component';
import { PokemonService } from './services/pokemon.service';

export const routes: Routes = [
    {
        path: 'pokemon/:id', component: PokemonViewerComponent,
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
        redirectTo: _ => {
            const pokemonService = inject(PokemonService);
            return `/pokemon/${pokemonService.getRandomPokemonId()}`;
        }
    }
];
