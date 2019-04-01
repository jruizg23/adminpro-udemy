import { Component, OnInit } from '@angular/core';
import { HospitalService } from 'src/app/services/hospital/hospital.service';
import { Hospital } from 'src/app/models/hospital.model';
import swal from 'sweetalert';
import { ModalUploadService } from 'src/app/components/modal-upload/modal-upload.service';

// declare const swal: any;

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: []
})
export class HospitalesComponent implements OnInit {

  cargando = true;
  totalRegistros = 0;
  offset = 0;

  hospitales: Hospital[] = [];
  hospitalesNombres: string[] = [];

  constructor(
    private hospitalService: HospitalService,
    public modalUploadService: ModalUploadService
  ) { }

  ngOnInit() {
    this.cargarHospitales();

    // Nos subscribimos al modal a sus notificaciones
    this.modalUploadService.notificacion.subscribe( (resp: any) => this.cargarHospitales());
  }

  crearHospital() {
    swal({
      title: 'Crear un nuevo hospital',
      text: 'Introduce el nombre del hospital: ',
      icon: 'info',
      content: {
        element: 'input',
        attributes: {
          placeholder: 'Nombre del hospital',
          type: 'text',
          required: true
        }
      },
      buttons: ['Cancelar', 'Guardar'],
      dangerMode: true
    })
    .then( (value: string) => {
      if (value && value.trim().length > 0) {
        this.hospitalService.crearHospital(value)
          .subscribe( (resp) => {
            this.totalRegistros++;
            const remain = this.totalRegistros % 5;
            this.offset = this.totalRegistros - (remain > 0 ? remain : 5 ) ;
            this.cargarHospitales();
          });
      }
      if (value && value.trim().length === 0) {
        swal('Nombre inválido', 'El nombre del hospital no es correcto', 'error');
        return;
      }
    });
  }

  cargarHospitales() {
    this.cargando = true;
    this.hospitalService.cargarHospitales(this.offset)
      .subscribe( (resp: any) => {
        this.totalRegistros = resp.total;
        this.hospitales = resp.hospitales;
        this.hospitalesNombres = resp.hospitales.map( (hospital: Hospital) => hospital.nombre);
        this.cargando = false;
      });
  }

  buscarHospital( termino: string ) {

    if (termino.length <= 0) {
      this.cargarHospitales();
      return;
    }

    this.cargando = true;
    this.hospitalService.buscarHospital(termino)
      .subscribe( (hospitales: Hospital[] ) => {
        this.hospitales = hospitales;
        this.cargando = false;
      });
  }

  mostrarModal( id: string ) {
    this.modalUploadService.mostrarModal('hospitales', id);
  }

  guardarHospital( hospital: Hospital, idx: number ) {
    if (! hospital.nombre || hospital.nombre.trim().length === 0) {
      swal('Nombre inválido', 'El nombre del hospital no es correcto', 'error').then( () => {
        hospital.nombre = this.hospitalesNombres[idx];
        document.getElementsByName('nombre')[idx].focus();
      });
      return;
    }
    this.hospitalService.actualizarHospital(hospital)
      .subscribe( (resp) => this.hospitalesNombres[idx] = hospital.nombre );
  }

  borrarHospital( hospital: Hospital, total: number ) {

    swal({
      title: '¿Estás seguro?',
      text: 'Estas a punto de borrar el hospital ' + hospital.nombre,
      icon: 'warning',
      buttons: ['Cancelar', 'Aceptar'],
      dangerMode: true,
    })
    .then( (borrar: any) => {
      if (borrar) {
        this.hospitalService.borrarHospital(hospital._id)
            .subscribe( (borrado) => {
              if (total === 1) {
                this.cambiarOffset(-5);
              } else {
                this.cargarHospitales();
              }
            });
      }
    });
  }

  cambiarOffset( valor: number ) {
    const newOffset = this.offset + valor;

    if (newOffset >= this.totalRegistros) {
      return;
    }

    if (newOffset < 0) {
      return;
    }

    this.offset += valor;
    this.cargarHospitales();
  }

}
