import { WebpackAsyncRoute } from '@angularclass/webpack-toolkit';
import { Routes, RouterModule } from '@angular/router';

import { Home } from './home';
import { NoContent } from './no-content';

import { DataResolver } from './app.resolver';

import { AuthGuard } from './shared/auth.guard';
import { CanDeactivateGuard } from './shared/interfaces/can-deactivate.interface';

// AngularClass
import { provideWebpack } from '@angularclass/webpack-toolkit';
import { providePrefetchIdleCallbacks } from '@angularclass/request-idle-callback';

export const ROUTES: Routes = [
  { path: '',         component: Home },
  { path: 'home',     component: Home },
  // Async Routes
  // Make sure you match the component type string to the require in asyncRoutes
  { path: 'about',
    component: 'About',
    resolve: { 'yourData': DataResolver }
  },
  // Async components with children routes must use WebpackAsync
  { path: 'detail',
    component: 'Detail',
    canActivate: [ WebpackAsyncRoute ],
    children: [ { path: '', component: 'Index' } ]
  },
  { path: 'login',    component: 'LoginComponent' },
  { path: 'recipes',  component: 'Recipes', canActivate: [AuthGuard] },
  { path: 'register', component: 'RegisterComponent', canDeactivate: [CanDeactivateGuard] },
  { path: 'todo',     component: 'Todo' },

  // Catch all other requests and redirect to app `404` view
  { path: '**',       component: NoContent },
];

// Async load a component using `Webpack`'s `require` with `es6-promise-loader`
// and webpack `require`
// `asyncRoutes` is needed for `webpack-toolkit` that will allow us to resolve
// the component correctly
const asyncRoutes: AsyncRoutes = {
  'About': require('es6-promise-loader!./about'),
  'Detail': require('es6-promise-loader!./+detail'),
  'Index': require('es6-promise-loader!./+detail'),
  'LoginComponent': require('es6-promise-loader!./login/login.component'),
  'Recipes': require('es6-promise-loader!./recipes/recipes.component'),
  'RegisterComponent': require('es6-promise-loader!./register/register.component'),
  'Todo': require('es6-promise-loader!./todo/todo.component'),
};

// An array of callbacks to be invoked after bootstrap to prefetch async routes
const prefetchRouteCallbacks: Array<IdleCallbacks> = [
  asyncRoutes[ 'About' ],
  asyncRoutes[ 'Detail' ],
  asyncRoutes[ 'LoginComponent' ],
  asyncRoutes[ 'Recipes' ],
  asyncRoutes[ 'RegisterComponent' ],
  asyncRoutes[ 'Todo' ]
  // es6-promise-loader returns a function
];

// Es6PromiseLoader and AsyncRoutes interfaces are defined in custom-typings

export const ROUTING_PROVIDERS = [
  provideWebpack(asyncRoutes),
  providePrefetchIdleCallbacks(prefetchRouteCallbacks)
];
