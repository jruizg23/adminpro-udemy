import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from 'src/app/services/service.index';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styles: []
})
export class ProfileComponent implements OnInit {

  usuario: Usuario;

  constructor(
    private usuarioService: UsuarioService
  ) {
    this.usuario = this.usuarioService.usuario;
  }

  ngOnInit() {
  }

  guardar( usuario: Usuario ) {
    this.usuario.nombre = usuario.nombre;
    if (!this.usuario.google) {
      this.usuario.email = usuario.email;
    }

    this.usuarioService.actualizarUsuario(this.usuario)
        .subscribe();
  }

}
