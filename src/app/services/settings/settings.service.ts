import { Injectable } from '@angular/core';
import { Ajustes } from '../../interfaces/ajustes.interface';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  ajustes: Ajustes = {
    temaUrl: 'assets/css/colors/default.css',
    tema: 'default'
  };

  constructor() {
    this.cargarAjustes();
  }

  guardarAjustes() {
    localStorage.setItem('ajustes', JSON.stringify(this.ajustes));
  }

  cargarAjustes() {
    if (localStorage.getItem('ajustes')) {
      this.ajustes = JSON.parse( localStorage.getItem('ajustes') );
      this.aplicarTema(this.ajustes.tema);
    } else {
      this.aplicarTema('default');
    }
  }

  aplicarTema( tema: string ) {
    const url = `assets/css/colors/${tema}.css`;
    // let elemento = document.getElementById('tema');
    document.getElementById('tema').setAttribute('href', url);
    // elemento.setAttribute('href', url);
    this.ajustes.tema = tema;
    this.ajustes.temaUrl = url;
    this.guardarAjustes();
  }
}
