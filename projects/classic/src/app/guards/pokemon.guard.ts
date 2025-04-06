import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { MAXPOKEMONID } from '../../../../../types/pokemon';

@Injectable({
    providedIn: 'root'
})
export class PokemonGuard implements CanActivate {

    constructor(private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
        const id = +route.paramMap.get('id')!;
        if (id <= 0) return this.router.parseUrl('/pokemon/1');
        if (id > MAXPOKEMONID) return this.router.parseUrl(`/pokemon/${MAXPOKEMONID}`);
        return true;
    }
}
