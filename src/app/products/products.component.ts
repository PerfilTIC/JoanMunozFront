import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from './product';
import { ProductService } from './product.service';
import { ModalService } from './detail/modal.service';
import Swal from 'sweetalert2';
import { CategoryService } from '../categories/category.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html'
})
export class ProductsComponent implements OnInit {

  products: Product[] = [];
  selectedProduct: Product;

  idCategory: number;
  categoryName: string;
  paginator: any;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private activatedRoute: ActivatedRoute,
    private modalService: ModalService
  ) {};

  ngOnInit(): void {
    this.paginator = undefined;
    this.activatedRoute.paramMap.subscribe(params => {
      this.idCategory = +params.get('idCategory');
      this.categoryService.getCategory(this.idCategory).subscribe(category => {
        this.categoryName = category.name;
      });

      let page: string = params.get('page');
      this.productService.getProducts(this.idCategory, page ? +page : 0).subscribe(result => {
        this.paginator = result;
        this.products = this.paginator.content;
      });
    });
  }

  deleteProduct(product: Product) {
    Swal.fire({
      title: '¿Are you sure?',
      text: `The product ${product.name} will be remove.`,
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Delete',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.productService.deleteProduct(product.idProduct).subscribe(result => {  
          this.products = this.products.filter(pro => pro !== product);
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: result.message,
            showConfirmButton: true
          });
        });
      }
    })
  }
  
  openModal(product: Product) {
    this.selectedProduct = product
    this.modalService.openModal();
  }
}