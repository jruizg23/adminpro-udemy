import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert';
import { UploadFileService } from 'src/app/services/service.index';
import { ModalUploadService } from './modal-upload.service';

@Component({
  selector: 'app-modal-upload',
  templateUrl: './modal-upload.component.html',
  styles: []
})
export class ModalUploadComponent implements OnInit {

  imagenSubir: File;
  imagenTemp: string;

  constructor(
    private uploadFileService: UploadFileService,
    private modalUploadService: ModalUploadService
  ) { }

  ngOnInit() {
  }

  subirImagen() {
    this.uploadFileService.uploadFile(this.imagenSubir, this.modalUploadService.tipo, this.modalUploadService.id)
      .then( (resp: any) => {
        // Notifican a cualquiera que esté escuchando que se suba la imagen
        this.modalUploadService.notificacion.emit( resp );
        this.cerrarModal();
      })
      .catch(err => {
        console.error('Error en la carga...', err);
      })
  }

  seleccionImagen( archivo: File ) {

    if (!archivo) {
      this.imagenSubir = null;
      return;
    }

    if ( archivo.type.indexOf('image') < 0) {
      swal('Sólo imágenes', 'El archivo seleccionado no es una imagen', 'error');
      this.imagenSubir = null;
      return;
    }

    this.imagenSubir = archivo;

    // JavaScript
    const reader = new FileReader();

    const urlImagenTemp = reader.readAsDataURL(archivo);

    // Devuelve un base64 con la imagen
    reader.onloadend = () => this.imagenTemp = (reader.result as string);
  }

  cerrarModal() {
    this.imagenTemp = null;
    this.imagenSubir = null;
    this.modalUploadService.ocultarModal();
  }

}
