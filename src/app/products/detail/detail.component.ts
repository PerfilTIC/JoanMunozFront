import { Component, OnInit, Input } from '@angular/core';
import { Product } from '../product';
import { ModalService } from './modal.service';

@Component({
  selector: 'product-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {

  @Input() product: Product;

  constructor( private modalService: ModalService) { }

  ngOnInit() {
  }

  closeModal() {
    this.modalService.closeModal();
  }

}
