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

export const CHANGE_DETECTION = ChangeDetectionStrategy.Default;
