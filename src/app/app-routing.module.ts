import { NgModule } from '@angular/core';
import {Routes, RouterModule, ExtraOptions} from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LayoutComponent } from './layout/layout.component';
import {ThankyouComponent} from './pages/public/thankyou/thankyou.component';
import {PreferencesComponent} from './pages/public/preferences/preferences.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'preferences',
    component: PreferencesComponent
  },
  {
    path: 'thankyou',
    component: ThankyouComponent
  },
  {
    path: 'home',
    component: LayoutComponent,
    loadChildren: './pages/public/home/home.module#HomeModule'
  },
  {
    path: 'edit_confirmation',
    component: LayoutComponent,
    loadChildren: './pages/public/confirmation/confirmation.module#ConfirmationModule'
  },
  {
    path: 'edit_completed_confirmation',
    component: LayoutComponent,
    loadChildren: './pages/public/confirmation/confirmation.module#ConfirmationModule'
  },
  {
    path: 'sub2factor_confirmation',
    component: LayoutComponent,
    loadChildren: './pages/public/confirmation/confirmation.module#ConfirmationModule'
  },
  {
    path: 'subscribe_confirmation',
    component: LayoutComponent,
    loadChildren: './pages/public/confirmation/confirmation.module#ConfirmationModule'
  },
  {
    path: 'unsubscribe_confirmation',
    component: LayoutComponent,
    loadChildren: './pages/public/confirmation/confirmation.module#ConfirmationModule'
  },
  {
    path: 'unsubscribe_completed_confirmation',
    component: LayoutComponent,
    loadChildren: './pages/public/confirmation/confirmation.module#ConfirmationModule'
  },
  {
    path: 'reports/:id',
    component: LayoutComponent,
    loadChildren: './pages/public/report/report.module#ReportModule'
  },
  {
    path: 'search',
    component: LayoutComponent,
    loadChildren: './pages/public/search-results/search-results.module#SearchResultsModule'
  },
  {
    path: 'categories/:id',
    component: LayoutComponent,
    loadChildren: './pages/public/categories/categories.module#CategoriesModule'
  },
  {
    path: 'categories/:id/type/:typeid',
    component: LayoutComponent,
    loadChildren: './pages/public/categories/categories.module#CategoriesModule'
  },
  {
    path: 'book',
    component: LayoutComponent,
    loadChildren: './pages/public/book/book.module#BookModule'
  },
  {
    path: 'indicators',
    component: LayoutComponent,
    loadChildren: './pages/public/ifx/ifx.module#IfxModule'
  },
  {
    path: 'confirmation',
    component: LayoutComponent,
    loadChildren: './pages/public/confirmation/confirmation.module#ConfirmationModule'
  },
  {
    path: 'multimedia',
    component: LayoutComponent,
    loadChildren: './pages/public/multimedia/multimedia.module#MultimediaModule'
  },
  {
    path: 'multimedia/:id',
    component: LayoutComponent,
    loadChildren: './pages/public/multimedia-detail/multimedia-detail.module#MultimediaDetailModule'
  }
];

const routerOptions: ExtraOptions = {
  useHash: false,
  anchorScrolling: 'enabled',
};

@NgModule({
  imports: [RouterModule.forRoot(routes, routerOptions)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
