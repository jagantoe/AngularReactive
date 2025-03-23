import { Routes } from '@angular/router';
import { PokemonViewerComponent } from './pages/pokemon-viewer/pokemon-viewer.component';

export const routes: Routes = [
    { path: '', redirectTo: '/pokemon', pathMatch: 'full' },
    { path: 'pokemon', component: PokemonViewerComponent },
    { path: 'pokemon/:id', component: PokemonViewerComponent }
];
