import { Injectable } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { URL_SERVICIOS } from 'src/app/config/config';
import { map, catchError } from 'rxjs/operators';
import swal from 'sweetalert';
import { Router } from '@angular/router';
import { UploadFileService } from '../upload-file/upload-file.service';
import { throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuario: Usuario;
  accessToken: string;
  tokenType: string;
  menu: any[] = [];

  constructor(
    public http: HttpClient,
    private router: Router,
    private uploadFileService: UploadFileService
  ) {
    this.cargarStorage();
  }

  isLogged() {
    return (this.accessToken && this.tokenType === 'Bearer') ? true : false;
  }

  cargarStorage() {
    if (localStorage.getItem('access_token')) {
      this.accessToken = localStorage.getItem('access_token');
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
      this.tokenType = localStorage.getItem('token_type');
      this.menu = JSON.parse(localStorage.getItem('menu'));
    } else {
      this.accessToken = '';
      this.tokenType = '';
      this.usuario = null;
      this.menu = [];
    }
  }

  saveStorage(item: any, menu?: any) {
    localStorage.setItem('id', item.id);
    localStorage.setItem('access_token', item.access_token);
    localStorage.setItem('token_type', item.token_type);
    localStorage.setItem('usuario', JSON.stringify(item.usuario));
    localStorage.setItem('menu', JSON.stringify(item.menu || menu));

    this.usuario = item.usuario;
    this.menu = item.menu || menu;
    this.accessToken = item.access_token;
    this.tokenType = item.token_type;
  }

  logout() {
    this.accessToken = '';
    this.tokenType = '';
    this.usuario = null;
    this.menu = [];

    localStorage.removeItem('id');
    localStorage.removeItem('access_token');
    localStorage.removeItem('token_type');
    localStorage.removeItem('usuario');
    localStorage.removeItem('menu');

    this.router.navigate(['/login']);
  }

  loginGoogle( token: string ) {
    const url = URL_SERVICIOS + '/login/google';

    return this.http.post(url, { token }).pipe(
      map( (resp: any) => {
        this.saveStorage(resp);
        return true;
      })
    );
  }

  login( usuario: Usuario, recordar: boolean = false ) {

    if (recordar) {
      localStorage.setItem('email', usuario.email);
    } else {
      localStorage.removeItem('email');
    }

    const url = URL_SERVICIOS + '/login';

    return this.http.post(url, usuario).pipe(
      map( (resp: any) => {
        this.saveStorage(resp);
        return true;
      }),
      catchError( (err) => {
        swal( 'Error en el login', err.error.mensaje, 'error');
        return throwError(err);
      })
    );

  }

  crearUsuario( usuario: Usuario ) {

    const url = URL_SERVICIOS + '/usuario';

    return this.http.post(url, usuario)
              .pipe( map( (resp: any) => {
                swal('Usuario creado', usuario.email, 'success');
                return resp.usuario;
              }),
              catchError( (err) => {
                swal( err.error.mensaje, err.error.errors.message, 'error');
                return throwError(err);
              }));
  }

  actualizarUsuario( usuario: Usuario) {
    const url = URL_SERVICIOS + '/usuario/' + usuario._id;
    const headers = new HttpHeaders({
      Authorization: `${this.tokenType} ${this.accessToken}`
    });
    return this.http.put(url, usuario, { headers })
              .pipe( map( (resp: any) => {
                if (usuario._id === this.usuario._id) {
                  this.saveStorage({
                    id: resp.usuario._id,
                    access_token: this.accessToken,
                    token_type: this.tokenType,
                    usuario: resp.usuario
                  }, this.menu);
                }
                swal('Usuario actualizado', usuario.email, 'success');
                return true;
              }),
              catchError( (err) => {
                swal( err.error.mensaje, err.error.errors.message, 'error');
                return throwError(err);
              }));
  }

  cambiarImagen( file: File, id: string) {
    this.uploadFileService.uploadFile(file, 'usuarios', id)
        .then( (resp: any) => {
          this.usuario.img = resp.usuario.img;
          swal('Imagen actualizada', this.usuario.email, 'success');
          this.saveStorage({
            id,
            access_token: this.accessToken,
            token_type: this.tokenType,
            usuario: this.usuario
          }, this.menu);
        })
        .catch( err => {
          console.error('Error subiendo el fichero', err);
        });
  }

  cargarUsuarios( offset: number = 0, limit: number = 5) {
    const url = URL_SERVICIOS + '/usuario?offset=' + offset + '&limit=' + limit;
    return this.http.get(url);
  }

  buscarUsuarios( termino: string ) {
    const url = URL_SERVICIOS + '/busqueda/coleccion/usuarios/' + termino;
    return this.http.get(url)
      .pipe( map( (resp: any) => resp.usuarios));
  }

  borrarUsuario( id: string ) {
    const url = URL_SERVICIOS + '/usuario/' + id;
    const headers = new HttpHeaders({
      Authorization: `${this.tokenType} ${this.accessToken}`
    });

    return this.http.delete(url, { headers })
            .pipe( map( resp => {
              swal('Usuario borrado', 'El usuario ha sido eliminado correctamente', 'success');
              return true;
            }));
  }
}
