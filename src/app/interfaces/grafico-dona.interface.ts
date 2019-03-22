import { MultiDataSet, Label } from 'ng2-charts';
import { ChartType } from 'chart.js';

export interface GraficoDona {
    labels: Label[];
    data: MultiDataSet;
    type: ChartType;
    leyenda: string;
}
