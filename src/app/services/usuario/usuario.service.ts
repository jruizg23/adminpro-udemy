import { Injectable } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from 'src/app/config/config';
import { map } from 'rxjs/operators';
import swal from 'sweetalert';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuario: Usuario;
  accessToken: string;
  tokenType: string;

  constructor(
    public http: HttpClient,
    private router: Router
  ) {
    console.log('Servicio de usuario listo');
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
    } else {
      this.accessToken = '';
      this.tokenType = '';
      this.usuario = null;
    }
  }

  saveStorage(item: any) {
    localStorage.setItem('id', item.id);
    localStorage.setItem('access_token', item.access_token);
    localStorage.setItem('token_type', item.token_type);
    localStorage.setItem('usuario', JSON.stringify(item.usuario));

    this.usuario = item.usuario;
    this.accessToken = item.access_token;
    this.tokenType = item.token_type;
  }

  logout() {
    this.accessToken = '';
    this.tokenType = '';
    this.usuario = null;

    localStorage.removeItem('id');
    localStorage.removeItem('access_token');
    localStorage.removeItem('token_type');
    localStorage.removeItem('usuario');

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
      })
    );

  }

  crearUsuario( usuario: Usuario ) {

    const url = URL_SERVICIOS + '/usuario';

    return this.http.post(url, usuario)
              .pipe( map( (resp: any) => {
                swal('Usuario creado', usuario.email, 'success');
                return resp.usuario;
              }));
  }

}
