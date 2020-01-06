import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CategoryService } from './category.service';
import { Category } from './category';
import Swal from 'sweetalert2';
import { Product } from '../products/product';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html'
})
export class CategoriesComponent implements OnInit {

  currentCategories: Category[];
  products: Product[] = [];
  isSuperCategories: boolean;
  superCategory: Category;

  paginator: any = null;
  cardTitle: string = 'Super categories';

  constructor(
    private categoryService: CategoryService,
    private activatedRoute: ActivatedRoute
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
            }, err => {
              Swal.fire({
                position: 'center',
                icon: 'error',
                title: err.error.message,
                text: err.error.error,
                showConfirmButton: true
              });
            });
          }
        })    
  }

  seeCategory(category: Category) {
    this.superCategory = category;
    this.activatedRoute.paramMap.subscribe(params => {
      let page: string = params.get('page');
      this.cardTitle = category.name;
      this.isSuperCategories = false;
      // Despintar todo
      this.categoryService.getSubcategories(category.idCategory, page ? +page : 0).subscribe(result => {        
        this.paginator = result;
        this.currentCategories = this.paginator.content;

        if(this.paginator.totalElements == 0) {
          this.categoryService.getProducts(category.idCategory, page ? +page : 0).subscribe(result => {
            this.paginator = result;
            this.products = this.paginator.content;

            if(this.paginator.totalElements == 0) {
              //Pintar botón agregar subcategoría
            }
            //Pintar productos y botón agregar producto
          });
        } else {
          //Pintar botón agregar subcategoría 
        }
      });
    });
  }

  goHome() {
    this.products = [];
    this.isSuperCategories = true;
    this.cardTitle = 'Super categories';
    this.categoryService.getSuperCategories(0).subscribe(result => {        
      this.paginator = result;
      this.currentCategories = this.paginator.content;
    });
  }

}
