import { Component, OnInit } from '@angular/core';
import { GraficoDona } from 'src/app/interfaces/grafico-dona.interface';

@Component({
  selector: 'app-graficas1',
  templateUrl: './graficas1.component.html',
  styles: []
})
export class Graficas1Component implements OnInit {

  public graficos: { [key: string]: GraficoDona } = {
    grafico1: {
      labels: ['Con Frijoles', 'Con Natilla', 'Con tocino'],
      data:  [
        [24, 30, 46]
      ],
      type: 'doughnut',
      leyenda: 'El pan se come con'
    },
    grafico2: {
      labels: ['Hombres', 'Mujeres'],
      data:  [
        [4500, 6000]
      ],
      type: 'doughnut',
      leyenda: 'Entrevistados'
    },
    grafico3: {
      labels: ['Si', 'No'],
      data:  [
        [95, 5]
      ],
      type: 'doughnut',
      leyenda: '¿Le dan gases los frijoles?'
    },
    grafico4: {
      labels: ['No', 'Si'],
      data:  [
        [85, 15]
      ],
      type: 'doughnut',
      leyenda: '¿Le importa que le den gases?'
    },
  };

  constructor() { }

  ngOnInit() {
  }

  getGraph( row: number , col: number ): any {
    if (row === 1 && col === 1) {
      return this.graficos.grafico1;
    }
    if (row === 1 && col === 2) {
      return this.graficos.grafico2;
    }
    if (row === 2 && col === 1) {
      return this.graficos.grafico3;
    }
    if (row === 2 && col === 2) {
      return this.graficos.grafico4;
    }
  }

}
