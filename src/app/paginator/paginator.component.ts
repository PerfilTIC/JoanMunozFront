import { Component, OnInit, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'paginator-nav',
  templateUrl: './paginator.component.html'
})
export class PaginatorComponent implements OnInit, OnChanges {

  @Input() paginator: any;
  @Input() idCategory: number;
  pages: number[];
  since: number;
  until: number;

  constructor() { }

  ngOnInit() {
    this.computePagesRange();
  }
  
  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    let paginadorActualizado = changes['paginator'];

    if(paginadorActualizado.previousValue)
      this.computePagesRange();
  }
  
  computePagesRange(): void {
    this.since = Math.min(Math.max(1, this.paginator.number-4), this.paginator.totalPages-5);
    this.until = Math.max(Math.min(this.paginator.totalPages, this.paginator.number+4), 6);
  
    if(this.paginator.totalPages > 5)
      this.pages = new Array(this.until - this.since).fill(0).map((_valor, indice) => indice + this.since);
    else
      this.pages = new Array(this.paginator.totalPages).fill(0).map((_valor, indice) => indice + 1);
  }

}
