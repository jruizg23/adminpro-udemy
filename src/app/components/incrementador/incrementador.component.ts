import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-incrementador',
  templateUrl: './incrementador.component.html',
  styles: []
})
export class IncrementadorComponent implements OnInit {

  // tslint:disable-next-line: no-inferrable-types
  @Input() leyenda: string = 'Leyenda';
// tslint:disable-next-line: no-input-rename no-inferrable-types
  @Input('progreso') porcentaje: number = 50;

  @Output() cambioValor: EventEmitter<number> = new EventEmitter();

  @ViewChild('txtPorcentaje') txtPorcentaje: ElementRef;

  constructor() { }

  ngOnInit() {
  }

  onChanges( valor: number ) {

    // const elemHTML: any = document.getElementsByName('porcentaje')[0];

    if (valor >= 100) {
      this.porcentaje = 100;
    } else if (valor <= 0) {
      this.porcentaje = 0;
    } else {
      this.porcentaje = valor;
    }
    // elemHTML.value = this.porcentaje;
    this.txtPorcentaje.nativeElement.value = this.porcentaje;
    this.cambioValor.emit(this.porcentaje);
  }

  cambiarValor( valor: number ) {
    this.porcentaje += valor;
    if (this.porcentaje >= 100) {
      this.porcentaje = 100;
    }
    if (this.porcentaje <= 0) {
      this.porcentaje = 0;
    }
    this.cambioValor.emit(this.porcentaje);
    this.txtPorcentaje.nativeElement.focus();
  }

}
