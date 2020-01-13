import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Category } from './category';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { Product } from '../products/product';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(
    private httpClient: HttpClient,
    private router: Router
  ) { }

  getSuperCategories(page: number): Observable<any> {
    return this.httpClient.get(environment.urlSuperCategories +'/'+ page).pipe(
      map((response: any) => {
        response.content as Category[];
        return response;
      })
    );
  }

  getCategory(idCategory: number): Observable<Category> {
    return this.httpClient.get<Category>(environment.urlGetCategory +'/'+ idCategory).pipe(
      catchError(err => {
        return this.responseError(err);
      })
    );
  }

  saveCategory(file: File, category: Category): Observable<Category> {
    let formData = new FormData();
    formData.append('category', JSON.stringify(category));
    formData.append('image', file);

    return this.httpClient.post<Category>(environment.urlSaveCategory, formData).pipe(
      catchError(err => {
        return this.responseError(err);
      })
    );
  }

  deleteCategory(idCategory: number): Observable<any> {
    return this.httpClient.delete(environment.urlDeleteCategory +'/'+ idCategory).pipe(
      catchError(err => {
        return this.responseError(err);
      })
    );
  }

  getSubcategories(idCategory: number, page: number): Observable<Category[]> {
    return this.httpClient.get<Category[]>(environment.urlSubcategories +'/'+ idCategory +'/'+ page).pipe(
      map((response: any) => {
        response.content as Category[];
        return response;
      })
    );
  }

  responseError(err): Observable<any> {
    Swal.fire({
      position: 'center',
      icon: 'error',
      title: err.error.message,
      text: err.error.error,
      showConfirmButton: true
    })
    this.router.navigate(['categories']);        
    return throwError(err);
  }
}
