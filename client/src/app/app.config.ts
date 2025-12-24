import { APP_INITIALIZER, ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { errorInterceptor } from './core/interceptors/error-interceptor';
import { loadingInterceptor } from './core/interceptors/loading-interceptor';
import { InitService } from './core/services/init';
import { lastValueFrom } from 'rxjs';
import { authInterceptor } from './core/interceptors/auth-interceptor';

function initializeApp(InitService : InitService){ // we need to get hold of the observable from our init Service (understand this method)
  return() =>   lastValueFrom(InitService.init()).finally(()=>{// the idea of this that we r gonna create some HTML that we r gonna display whilst the initialization is taking place
    const splash = document.getElementById('initial-splash');
    if(splash){
      splash.remove();
    }
  })
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([
      errorInterceptor,
      loadingInterceptor,
      authInterceptor
    ])),
    { // understand this too
      provide : APP_INITIALIZER,
      useFactory : initializeApp,
      multi : true,
      deps : [InitService]
    }
  ]
};
