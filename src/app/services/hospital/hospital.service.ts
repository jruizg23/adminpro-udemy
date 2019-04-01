import { Injectable } from '@angular/core';
import { Hospital } from 'src/app/models/hospital.model';
import { URL_SERVICIOS } from 'src/app/config/config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UsuarioService } from '../usuario/usuario.service';
import { map } from 'rxjs/operators';
import swal from 'sweetalert';

@Injectable({
  providedIn: 'root'
})
export class HospitalService {

  hospital: Hospital;
  private accessToken: string;
  private tokenType: string;

  constructor(
    private http: HttpClient,
    private usuarioService: UsuarioService
  ) {
    this.accessToken = this.usuarioService.accessToken;
    this.tokenType = this.usuarioService.tokenType;
  }

  cargarHospitales( offset: number = 0, limit: number = 5) {
    const url = URL_SERVICIOS + '/hospital?offset=' + offset + '&limit=' + limit;

    return this.http.get(url);
  }

  obtenerHospital( id: string ) {
    const url = URL_SERVICIOS + '/hospital/' + id;
    const headers = new HttpHeaders({
      Authorization: `${this.tokenType} ${this.accessToken}`
    });
    return this.http.get(url, {headers})
      .pipe(map( (resp: any) => resp.hospital));
  }

  borrarHospital( id: string ) {
    const url = URL_SERVICIOS + '/hospital/' + id;
    const headers = new HttpHeaders({
      Authorization: `${this.tokenType} ${this.accessToken}`
    });

    return this.http.delete(url, { headers })
      .pipe( map( resp => {
        swal('Hospital borrado', 'El hospital ha sido eliminado correctamente', 'success');
        return true;
      }));
  }

  crearHospital( nombre: string ) {
    const url = URL_SERVICIOS + '/hospital';
    const headers = new HttpHeaders({
      Authorization: `${this.tokenType} ${this.accessToken}`
    });

    const hospital = new Hospital( nombre );

    return this.http.post(url, hospital, { headers })
      .pipe(map( (resp: any) => {
        swal('Hospital creado', hospital.nombre, 'success');
        return true;
      }));
  }

  buscarHospital( termino: string ) {
    const url = URL_SERVICIOS + '/busqueda/coleccion/hospitales/' + termino;
    return this.http.get(url)
      .pipe( map( (resp: any) => resp.hospitales ) );
  }

  actualizarHospital( hospital: Hospital ) {
    const url = URL_SERVICIOS + '/hospital/' + hospital._id;
    const headers = new HttpHeaders({
      Authorization: `${this.tokenType} ${this.accessToken}`
    });

    return this.http.put(url, hospital, { headers })
      .pipe(map( (resp: any) => {
        swal('Hospital actualizado', hospital.nombre, 'success');
        return true;
      }));
  }

}
