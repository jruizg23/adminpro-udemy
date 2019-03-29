import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from 'src/app/services/service.index';
import swal from 'sweetalert';
import { ModalUploadComponent } from 'src/app/components/modal-upload/modal-upload.component';
import { ModalUploadService } from 'src/app/components/modal-upload/modal-upload.service';

// declare const swal: any;


@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: []
})
export class UsuariosComponent implements OnInit {

  usuarios: Usuario[] = [];
  offset = 0;

  totalRegistros = 0;
  cargando = true;

  constructor(
    private usuarioService: UsuarioService,
    public modalUploadService: ModalUploadService
  ) { }

  ngOnInit() {
    this.cargarUsuarios();

    // Nos subscribimos al modal a sus notificaciones
    this.modalUploadService.notificacion.subscribe( (resp: any) => this.cargarUsuarios());
  }

  cargarUsuarios() {
    this.cargando = true;
    this.usuarioService.cargarUsuarios(this.offset)
        .subscribe( (resp: any) => {
          this.totalRegistros = resp.total;
          this.usuarios = resp.usuarios;
          this.cargando = false;
        });
  }

  cambiarOffset(valor: number) {
    const newOffset = this.offset + valor;

    if (newOffset >= this.totalRegistros) {
      return;
    }

    if (newOffset < 0) {
      return;
    }

    this.offset += valor;
    this.cargarUsuarios();
  }

  buscarUsuario( termino: string ) {

    if (termino.length <= 0) {
      this.cargarUsuarios();
      return;
    }

    this.cargando = true;
    this.usuarioService.buscarUsuarios( termino )
      .subscribe( (usuarios: Usuario[]) => {
        // this.totalRegistros = usuarios.length;
        this.usuarios = usuarios;
        this.cargando = false;
      });
  }

  borrarUsuario( usuario: Usuario, total: number ) {

    if (usuario._id === this.usuarioService.usuario._id) {
      swal('No se puede borrar el usuario', 'No te puedes borrar a ti mismo!!', 'error');
      return;
    }

    swal({
      title: '¿Estás seguro?',
      text: 'Estas a punto de borrar a ' + usuario.email,
      icon: 'warning',
      buttons: ['Cancelar', 'Aceptar'],
      dangerMode: true,
    })
    .then( (borrar: any) => {
      if (borrar) {
        this.usuarioService.borrarUsuario(usuario._id)
            .subscribe( (borrado) => {
              if (total === 1) {
                this.cambiarOffset(-5);
              } else {
                this.cargarUsuarios();
              }
            });
      }
    });
  }

  guardarUsuario( usuario: Usuario ) {
    this.usuarioService.actualizarUsuario(usuario)
      .subscribe();
  }

  mostrarModal( id: string ) {
    this.modalUploadService.mostrarModal('usuarios', id);
  }
}
