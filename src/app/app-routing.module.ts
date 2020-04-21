import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LayoutComponent } from './layout/layout.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: LayoutComponent,
    loadChildren: './pages/public/home/home.module#HomeModule'
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

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
