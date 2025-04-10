import { HttpClientModule } from '@angular/common/http';
import { ChangeDetectionStrategy, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PokemonAbilitiesComponent } from './components/pokemon-abilities.component';
import { PokemonCardComponent } from './components/pokemon-card.component';
import { PokemonMovesComponent } from './components/pokemon-moves.component';
import { PokemonSearchComponent } from './components/pokemon-search.component';
import { PokemonStatsComponent } from './components/pokemon-stats.component';
import { PokemonTeamBeltComponent } from './components/pokemon-team-belt.component';
import { PokemonViewerComponent } from './pages/pokemon-viewer/pokemon-viewer.component';

// Using NgModules has been the standard for a long time but brings some minor annoyances with it.
// It contains all the dependencies for the application and their configuration, which can be a bit overwhelming at first glance.
// However we don't know the individual dependencies of each components. The only this we have to go off of is the component selector.
// It is then up to the NgModule to make sure a component with that selector is available in the application.
@NgModule({
    declarations: [
        AppComponent,
        PokemonAbilitiesComponent,
        PokemonCardComponent,
        PokemonMovesComponent,
        PokemonSearchComponent,
        PokemonStatsComponent,
        PokemonTeamBeltComponent,
        PokemonViewerComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpClientModule,
        AppRoutingModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }

// For most people using Angular the default change detection is sufficient.
// However to improve performance in some cases we can use the OnPush strategy.
// But your application has to be designed with this in mind.
// Try changing the change detection strategy to OnPush and see what happens to the Classic application.
export const CHANGE_DETECTION = ChangeDetectionStrategy.Default;
