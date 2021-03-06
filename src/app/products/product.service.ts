import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Product } from './product';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private httpHeaders: HttpHeaders = new HttpHeaders({'Content-Type': 'application/json'})

  constructor(
    private httpClient: HttpClient,
    private router: Router
  ) { }

  getProducts(idCategory: number, page: number): Observable<any> {
    return this.httpClient.get<Product[]>(environment.urlProducts +'/'+ idCategory +'/'+ page).pipe(
      map((response: any) => {
        response.content as Product[];
        return response;
      })
    );
  }
  
  deleteProduct(idProduct: number): Observable<any> {
    return this.httpClient.delete(environment.urlDeleteProduct +'/'+ idProduct).pipe(
      catchError(error => {
        return this.responseError(error);
      })
    );
  }

  getProduct(idProduct: number): Observable<Product> {
    return this.httpClient.get<Product>(environment.urlGetProduct +'/'+ idProduct).pipe(
      catchError(err => {
        return this.responseError(err);
      })
    );
  }

  saveProduct(product: Product, pictures: File[]): Observable<Product> {
    let formData = new FormData();
    formData.append('product', JSON.stringify(product));

    pictures.forEach(picture => {
      formData.append('images', picture)
    });      

    return this.httpClient.post<Product>(environment.urlSaveProduct, formData).pipe(
      catchError(error => {
        return this.responseError(error);
      })
    );
  }

  updateProduct(product: Product): Observable<Product> {
    let productDto: any = {
      idProduct: +product.idProduct,
      idCategory: +product.idCategory,
      name: product.name,
      description: product.description,
      weight: +product.weight,
      price: +product.price
    }
    return this.httpClient.put<Product>(environment.urlUpdateProduct, productDto, { headers: this.httpHeaders }).pipe(
      catchError(error => {
        return this.responseError(error);
      })
    );
  }
  
  getExchangerate(): Observable<any> {
    return this.httpClient.get(environment.urlCurrencyApi);
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
