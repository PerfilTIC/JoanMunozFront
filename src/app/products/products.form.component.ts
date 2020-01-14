import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Product } from './product';
import { ProductService } from './product.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-products',
  templateUrl: './products.form.component.html'
})
export class ProductsFormComponent implements OnInit {

  product: Product = new Product();
  pictures: File[] = [];

  picture1: File = null;
  picture2: File = null;
  picture3: File = null;

  creatingProduct: boolean;

  constructor(
    private productService: ProductService,
    private router: Router,
    private activatedRouted: ActivatedRoute
  ) { }

  ngOnInit() {
    this.activatedRouted.params.subscribe(params => {
      let idProduct = params['idProduct'];
      if (idProduct)
        this.productService.getProduct(idProduct).subscribe(product => {
          this.product = product;
          this.creatingProduct = false;
        })
      else {
        let idCategory = params['idCategory'];
        if (idCategory)
          this.product.idCategory = idCategory;
          this.creatingProduct = true;
      }
    });
  }

  selectImage(event, pictureNumber) {
    let selectedPicture: File = event.target.files[0];

    if (selectedPicture.type.indexOf('image') < 0) {
      switch (pictureNumber) {
        case 1: {
          this.picture1 = null;
          this.product.picture1 = null;
          break;
        }
        case 2: {
          this.picture2 = null;
          this.product.picture2 = null;
          break;
        }
        case 3: {
          this.picture3 = null;
          this.product.picture3 = null;
          break;
        }
      }
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'The selected file is not an image',
        text: 'If you save now, the last image will be remain.',
        showConfirmButton: true
      });
    } else {
      let pictureName = selectedPicture.name.toString();
      switch (pictureNumber) {
        case 1: {
          this.picture1 = selectedPicture;
          this.product.picture1 = pictureName;
          break;
        }
        case 2: {
          this.picture2 = selectedPicture;
          this.product.picture2 = pictureName;
          break;
        }
        case 3: {
          this.picture3 = selectedPicture;
          this.product.picture3 = pictureName;
          break;
        }
      }
    }
  }

  public save(): void {
    if(this.creatingProduct) {
      this.getPictures();
      this.productService.saveProduct(this.product, this.pictures).subscribe(product => {
        this.router.navigate(['/products/page', this.product.idCategory, 0]);
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: `The product ${product.name} has been saved succesfully`,
          showConfirmButton: true
        });
      });
    } else {
      this.productService.updateProduct(this.product).subscribe(product => {
        this.router.navigate(['/products/page', this.product.idCategory, 0]);
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: `The product ${product.name} has been updated succesfully`,
          showConfirmButton: true
        });
      })
    }
  }

  getPictures() {
    if (this.picture1)
      this.pictures.push(this.picture1);

    if (this.picture2)
      this.pictures.push(this.picture2);

    if (this.picture3)
      this.pictures.push(this.picture3);
  }

}
