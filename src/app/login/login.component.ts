import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { UsuarioService } from '../services/service.index';
import { Usuario } from '../models/usuario.model';

declare function init_plugins();
declare const gapi: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [
    './login.component.css'
  ]
})
export class LoginComponent implements OnInit {

  recuerdame = false;
  email: string;

  auth2: any;

  constructor(
    public router: Router,
    public usuarioService: UsuarioService,
    private ngZone: NgZone
    ) { }

  ngOnInit() {
    init_plugins();
    this.googleInit();

    this.email = localStorage.getItem('email') || '';
    if (this.email.length > 0) {
      this.recuerdame = true;
    }
  }

  googleInit() {
    gapi.load('auth2', () => {
      this.auth2 = gapi.auth2.init({
        client_id: '89534809330-0fs6icao266u78sqjrvuccccosjrjaik.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin',
        scope: 'profile email'
      });

      this.attachSignin(document.getElementById('btnGoogle'));
    });
  }

  attachSignin(element) {
    this.auth2.attachClickHandler(element, {}, (googleUser) => {
      // const profile = googleUser.getBasicProfile();
      const token = googleUser.getAuthResponse().id_token;

      this.usuarioService.loginGoogle(token)
          .subscribe( resp => {
            //window.location.href = '#/dashboard'
            this.ngZone.run(() => {
              this.router.navigate(['/dashboard']);
            });
          }); // Problema de carga con el google, se fuerza la redirección
    });
  }

  ingresar( form: NgForm ) {
    // this.router.navigate(['/dashboard']);
    if (form.invalid) {
      return;
    }

    const usuario = new Usuario(
      null,
      form.value.email,
      form.value.password
    );

    this.usuarioService.login(usuario, form.value.recuerdame)
        .subscribe( resp => this.router.navigate(['/dashboard']));
  }

}
