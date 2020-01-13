import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CategoriesComponent } from './categories/categories.component';
import { CategoryFormComponent } from './categories/category.form.component';
import { ProductsFormComponent } from './products/products.form.component';


const routes: Routes = [
  {path: '', redirectTo: '/categories', pathMatch: 'full'},
  {path: 'categories', component: CategoriesComponent},
  {path: 'categories/page/:page', component: CategoriesComponent},
  {path: 'categories/form', component: CategoryFormComponent},
  {path: 'categories/edit/:idCategory', component: CategoryFormComponent},
  {path: 'categories/subcategory/:superCategory', component: CategoryFormComponent},
  {path: 'products/new/:idCategory', component: ProductsFormComponent},
  {path: 'products/edit/:idProduct', component: ProductsFormComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
