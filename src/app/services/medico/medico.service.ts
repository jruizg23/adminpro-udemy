import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UsuarioService } from '../usuario/usuario.service';
import { URL_SERVICIOS } from 'src/app/config/config';
import { map } from 'rxjs/operators';
import swal from 'sweetalert';
import { Medico } from 'src/app/models/medicos.model';

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  private accessToken: string;
  private tokenType: string;

  constructor(
    public http: HttpClient,
    public usuarioService: UsuarioService
  ) {
    this.accessToken = this.usuarioService.accessToken;
    this.tokenType = this.usuarioService.tokenType;
  }


  cargarMedicos( offset: number = 0, limit: number = 5) {
    const url = URL_SERVICIOS + '/medico?offset=' + offset + '&limit=' + limit;

    return this.http.get(url);
  }

  buscarMedico( termino: string ) {
    const url = URL_SERVICIOS + '/busqueda/coleccion/medicos/' + termino;
    return this.http.get(url)
      .pipe( map( (resp: any) => resp.medicos ) );
  }

  borrarMedico( id: string ) {
    const url = URL_SERVICIOS + '/medico/' + id;
    const headers = new HttpHeaders({
      Authorization: `${this.tokenType} ${this.accessToken}`
    });

    return this.http.delete(url, { headers })
      .pipe( map( resp => {
        swal('Médico borrado', 'El médico ha sido eliminado correctamente', 'success');
        return true;
      }));
  }

  guardarMedico( medico: Medico ) {
    let url = URL_SERVICIOS + '/medico';
    const headers = new HttpHeaders({
      Authorization: `${this.tokenType} ${this.accessToken}`
    });

    if (medico._id) {
      url += '/' + medico._id;
      return this.http.put(url, medico, {headers})
      .pipe(map( (resp: any) => {
        swal('Médico guardado', medico.nombre, 'success');
        return resp.medico;
      }));
    } else {
      return this.http.post(url, medico, { headers })
        .pipe(map( (resp: any) => {
          swal('Médico guardado', medico.nombre, 'success');
          return resp.medico;
        }));
    }
  }

  cargarMedico( id: string ) {
    const url = URL_SERVICIOS + '/medico/' + id;

    return this.http.get(url)
            .pipe(map( (resp: any) => resp.medico ));
  }

}
