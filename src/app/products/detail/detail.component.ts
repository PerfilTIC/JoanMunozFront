import { Component, OnInit, Input } from '@angular/core';
import { Product } from '../product';
import { ModalService } from './modal.service';
import { ProductService } from '../product.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'product-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {

  @Input() product: Product;
  priceUSD: number;
  priceCOP: number;

  constructor(
    private modalService: ModalService,
    private productService: ProductService
  ) { }

  ngOnInit() {
    this.priceUSD = this.product.price;
    this.priceCOP = null;
  }

  closeModal() {
    this.product.price = this.priceUSD;
    this.modalService.closeModal();
  }

  transformCurrency(currency: string) { 
    if(currency === 'USD') 
      this.product.price = this.priceUSD;
    else if(this.priceCOP)
        this.product.price = this.priceCOP;
    else
      this.productService.getExchangerate().subscribe(result => {
        if(result.success) {
          this.priceCOP = this.priceUSD * +result.quotes.USDCOP;
          this.product.price = this.priceCOP;
        }
        else
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'There was an error converting the currency',
            text: `Error ${result.error.code}: ${result.error.info}`,
            showConfirmButton: true
          });
      });
  }

}
