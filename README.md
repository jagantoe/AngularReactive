# Angular Reactive

Angular is trending towards being a lot more reactive with the addition of Signals.
This project is inteded to showcase the differences in:
- old vs new Angular project setup
- reactive vs imperative code
- observables vs signals

Before taking a look at the code it's recommended to have a rudimentary understanding of [Signals in Angular](https://angular.dev/guide/signals) and [Observables](https://rxjs.dev/guide/observable).


General things to mention:
- All components are made with an inline template, this is solely to to keep this project compact. Separate template files are still recommended in real projects.
- The classic project is set up using the older app.module.ts structure and the others use newer app.config.ts setup with standalone components.
- Some comments describe conventions for writing code, this all comes down to preferences in the end. They are intended as general guidelines and not hard rules.

Each projects contains the same parts and offers the same functionality and use Tailwind for styling.
You can start each project using 'npm start {projectName}'.

Useful resources:
- [Angular blog](https://blog.angular.dev/)
- [All RxJS operators](https://rxjs.dev/api)
- [When to use firstValueFrom vs lastValueFrom](https://rxjs.dev/deprecations/to-promise)
