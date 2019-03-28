import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import swal from 'sweetalert';
import { UsuarioService } from '../services/service.index';
import { Usuario } from '../models/usuario.model';
import { Router } from '@angular/router';

declare function init_plugins();

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: [
    './login.component.css'
  ]
})
export class RegisterComponent implements OnInit {

  form: FormGroup;

  constructor(
    public usuarioService: UsuarioService,
    public router: Router
  ) { }

  sonIguales( campoA: string, campoB: string) {

    return ( group: FormGroup ) => {

      const pass1 = group.controls[campoA].value;
      const pass2 = group.controls[campoB].value;

      if (pass1 === pass2) {
        return null;
      }

      return {
        // Es el error que impide que el formulario sea válido
        sonIguales: true
      };

    };

  }

  ngOnInit() {
    init_plugins();

    this.form = new FormGroup({
      nombre: new FormControl(null, Validators.required),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required]),
      password2: new FormControl(null, [Validators.required]),
      condiciones: new FormControl(false)
    }, {validators: this.sonIguales('password', 'password2') });

    this.form.setValue({
      nombre: 'Test ',
      email: 'test@test.com',
      password: '123456',
      password2: '123456',
      condiciones: true
    });
  }

  registrarUsuario() {
    if (this.form.invalid) {
      return;
    }

    if (!this.form.value.condiciones) {
      swal('Importante', 'Debes aceptar las condiciones', 'warning');
      return;
    }

    const usuario = new Usuario(
      this.form.value.nombre,
      this.form.value.email,
      this.form.value.password
    );

    // En caso de tener error como lo controlamos en el BE no va a disparar el subcribe va a hacer catch del error
    this.usuarioService.crearUsuario(usuario)
        .subscribe( (resp) => this.router.navigate(['/login']));
  }
}
