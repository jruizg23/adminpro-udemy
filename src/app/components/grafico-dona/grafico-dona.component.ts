import { Component, OnInit, Input } from '@angular/core';
import { GraficoDona } from 'src/app/interfaces/grafico-dona.interface';
import { ChartOptions } from 'chart.js';

@Component({
  selector: 'app-grafico-dona',
  templateUrl: './grafico-dona.component.html',
  styles: []
})
export class GraficoDonaComponent implements OnInit {

  @Input() grafico: GraficoDona;
  public graphOptions: ChartOptions = {
    responsive: true
  };
  // @Input() leyenda = 'Leyenda';
  // @Input() doughnutChartLabels: Label[] = ['Download Sales', 'In-Store Sales', 'Mail-Order Sales'];
  // @Input() doughnutChartData: MultiDataSet = [
  //   [350, 450, 100],
  // ];
  // @Input() doughnutChartType: ChartType = 'doughnut';

  constructor() { }

  ngOnInit() {
  }

}
