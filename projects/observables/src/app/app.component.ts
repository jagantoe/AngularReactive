import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  // When using standalone components we have to specify any dependencies and import them.
  // Standalone components help to simplify configuration because we no longer need to depend on NgModules to have all required dependencies.
  // They also provide us with a guide to easily migrate our applications: https://angular.dev/reference/migrations/standalone
  imports: [RouterOutlet],
  template: `
    <router-outlet />
  `,
  styles: [],
})
export class AppComponent {
  title = 'Observables';
}
