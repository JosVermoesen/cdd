import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  // disable any console.log debugging statements in production mode
  window.console.log = function () {
    ('');
  };
  window.console.error = function () {
    ('');
  };
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
