import { Component, OnInit, Inject } from '@angular/core';
// import { DOCUMENT } from '@angular/common';
import { SettingsService } from 'src/app/services/service.index';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styles: []
})
export class AccountSettingsComponent implements OnInit {

  constructor( // @Inject(DOCUMENT) private document,
               public ajustes: SettingsService) { }

  ngOnInit() {
    this.colocarCheck();
  }

  cambiarColor(event: Event) {
    const target: any = event.target || event.srcElement || event.currentTarget;
    this.aplicarCheck(target);
    const tema = target.getAttribute('data-theme');
    this.ajustes.aplicarTema(tema);
    // const url = `assets/css/colors/${tema}.css`;
    // // let elemento = document.getElementById('tema');
    // this.document.getElementById('tema').setAttribute('href', url);
  }

  aplicarCheck( target: any ) {
    const selectores: any = document.getElementsByClassName('selector');
    for ( const ref of selectores ) {
      ref.classList.remove('working');
    }
    target.classList.add('working');
  }

  colocarCheck() {
    const selectores: any = document.getElementsByClassName('selector');
    const tema: string = this.ajustes.ajustes.tema;
    for ( const ref of selectores ) {
      if ( ref.getAttribute('data-theme') === tema ) {
        ref.classList.add('working');
        break;
      }
    }
  }
}
