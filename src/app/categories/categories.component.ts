import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from './category.service';
import { ProductService } from '../products/product.service';
import { Category } from './category';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html'
})
export class CategoriesComponent implements OnInit {

  currentCategories: Category[];
  isSuperCategories: boolean;
  superCategory: Category;

  paginator: any;
  cardTitle: string = 'Super categories';

  constructor(
    private categoryService: CategoryService,
    private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {     
    this.paginator = undefined;
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
    this.paginator = undefined;
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
            if(result.totalElements > 0)
              this.router.navigate(['/products/page', category.idCategory, 0]);
          });
        }
      });
    });
  }

  goHome() {
    this.paginator = null;
    this.isSuperCategories = true;
    this.cardTitle = 'Super categories';
    this.categoryService.getSuperCategories(0).subscribe(result => {        
      this.paginator = result;
      this.currentCategories = this.paginator.content;
    });
  }
}
