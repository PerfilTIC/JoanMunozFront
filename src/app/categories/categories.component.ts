import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CategoryService } from './category.service';
import { Category } from './category';
import Swal from 'sweetalert2';
import { Product } from '../products/product';
import { ProductService } from '../products/product.service';
import { ModalService } from '../products/detail/modal.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html'
})
export class CategoriesComponent implements OnInit {

  currentCategories: Category[];
  products: Product[] = [];
  isSuperCategories: boolean;
  superCategory: Category;
  selectedProduct: Product;

  paginator: any = null;
  cardTitle: string = 'Super categories';
  currency: string = 'COP';

  constructor(
    private categoryService: CategoryService,
    private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private modalService: ModalService
  ) { }

  ngOnInit() {
    this.isSuperCategories = true;
    this.activatedRoute.paramMap.subscribe(params => {
      let page: string = params.get('page');

      this.categoryService.getSuperCategories(page ? +page : 0).subscribe(result => {        
        this.paginator = result;
        this.currentCategories = this.paginator.content;
      });
    });
  }

  deleteCategory(category: Category) {
    Swal.fire({
      title: '¿Are you sure?',
      text: `The category ${category.name} will be remove.`,
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Delete',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.categoryService.deleteCategory(category.idCategory).subscribe(result => {  
          this.currentCategories = this.currentCategories.filter(cat => cat !== category);
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

  seeCategory(category: Category) {
    this.paginator = null;
    this.superCategory = category;
    this.activatedRoute.paramMap.subscribe(params => {
      let page: string = params.get('page');
      this.cardTitle = category.name;
      this.isSuperCategories = false;
      
      this.categoryService.getSubcategories(category.idCategory, page ? +page : 0).subscribe(result => {        
        this.paginator = result;
        this.currentCategories = this.paginator.content;

        if(this.paginator.totalElements == 0) {
          this.productService.getProducts(category.idCategory, page ? +page : 0).subscribe(result => {
            this.paginator = result;
            this.products = this.paginator.content;
          });
        }
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

  goHome() {
    this.paginator = null;
    this.products = [];
    this.isSuperCategories = true;
    this.cardTitle = 'Super categories';
    this.categoryService.getSuperCategories(0).subscribe(result => {        
      this.paginator = result;
      this.currentCategories = this.paginator.content;
    });
  }

  openModal(product: Product) {
    this.selectedProduct = product
    this.modalService.openModal();
  }

}
