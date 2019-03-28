import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from 'src/app/config/config';

@Injectable({
  providedIn: 'root'
})
export class UploadFileService {

  constructor() { }

  uploadFile( file: File, tipo: string, id: string ) {

    return new Promise( (resolve, reject) => {

      // Petición AJAX para subir ficheros
      const formData = new FormData();
      const xhr = new XMLHttpRequest();

      formData.append( 'imagen', file, file.name );
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) { // Estado cuando termina el proceso de subida
          if (xhr.status === 200) {
            console.log('Imagen subida');
            resolve(xhr.response);
          } else {
            console.log('Falló la subida');
            reject(xhr.response);
          }
        }
      };

      const url = URL_SERVICIOS + '/upload/' + tipo + '/' + id;

      xhr.open('PUT', url, true);
      xhr.send( formData );
    });

  }
}
