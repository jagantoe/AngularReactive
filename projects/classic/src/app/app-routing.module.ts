import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PokemonGuard } from "./guards/pokemon.guard";
import { PokemonViewerComponent } from "./pages/pokemon-viewer/pokemon-viewer.component";

const routes: Routes = [
    { path: 'pokemon/:id', component: PokemonViewerComponent, canActivate: [PokemonGuard] },
    { path: '**', redirectTo: '/pokemon/0' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
