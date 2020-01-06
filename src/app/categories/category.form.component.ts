import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CategoryService } from './category.service';
import { Category } from './category';
import  Swal from 'sweetalert2';

@Component({
  selector: 'app-form',
  templateUrl: './category.form.component.html'
})
export class CategoryFormComponent implements OnInit {

  category: Category = new Category();
  selectedPicture: File = null;
  
  title: string = "Categories form";
  pictureName: string = 'Select one picture';

  constructor(
    private categoryService: CategoryService,
    private router: Router,
    private activatedRouted: ActivatedRoute
  ) { }

  ngOnInit() {
    this.activatedRouted.params.subscribe(params => {
      let idCategory = params['idCategory'];
      if(idCategory) 
        this.categoryService.getCategory(idCategory).subscribe(category => {
          this.category = category;
        })
      else {
        let superCategory = params['superCategory'];
        if(superCategory) 
          this.category.superCategory = superCategory;
      }
    });
  }

  selectImage(event) {
    this.selectedPicture = event.target.files[0];
    this.pictureName = this.selectedPicture.name.toString();

    if(this.selectedPicture.type.indexOf('image') < 0) {
      this.selectedPicture = null;
      this.pictureName = 'Select one picture';
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'The selected file is not an image',
        text: 'If you save now, the last image will be remain.',
        showConfirmButton: true
      });
    }
  }

  public save(): void {
    if(this.selectedPicture)
      this.categoryService.saveCategory(this.selectedPicture, this.category).subscribe(category => {
        this.router.navigate(['/categories']);
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: `The category ${category.name} has been saved succesfully`,
          showConfirmButton: true
        });
      });
    else
      Swal.fire({
        position: 'center',
        icon: 'warning',
        title: 'You must to select a image',
        showConfirmButton: true
      });
  }
}
