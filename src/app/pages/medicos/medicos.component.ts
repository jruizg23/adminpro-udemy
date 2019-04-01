import { Component, OnInit } from '@angular/core';
import { Medico } from 'src/app/models/medicos.model';
import { MedicoService } from 'src/app/services/service.index';
import { ModalUploadService } from 'src/app/components/modal-upload/modal-upload.service';
import swal from 'sweetalert';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: []
})
export class MedicosComponent implements OnInit {

  cargando = true;
  totalRegistros = 0;
  offset = 0;
  medicos: Medico[] = [];

  constructor(
    private medicoService: MedicoService,
    public modalUploadService: ModalUploadService
  ) { }

  ngOnInit() {
    this.cargarMedicos();
        // Nos subscribimos al modal a sus notificaciones
    this.modalUploadService.notificacion.subscribe( (resp: any) => this.cargarMedicos());
  }

  cargarMedicos() {
    this.cargando = true;
    this.medicoService.cargarMedicos(this.offset)
      .subscribe( (resp: any) => {
        this.totalRegistros = resp.total;
        this.medicos = resp.medicos;
        this.cargando = false;
      });
  }

  buscarMedico(termino: string) {
    if (termino.length <= 0) {
      this.cargarMedicos();
      return;
    }

    this.cargando = true;
    this.medicoService.buscarMedico(termino)
      .subscribe( (medicos: Medico[] ) => {
        this.medicos = medicos;
        this.cargando = false;
      });
  }

  borrarMedico(medico: Medico, total: number) {
    swal({
      title: '¿Estás seguro?',
      text: 'Estas a punto de borrar el médico ' + medico.nombre,
      icon: 'warning',
      buttons: ['Cancelar', 'Aceptar'],
      dangerMode: true,
    })
    .then( (borrar: any) => {
      if (borrar) {
        this.medicoService.borrarMedico(medico._id)
            .subscribe( (borrado) => {
              if (total === 1) {
                this.cambiarOffset(-5);
              } else {
                this.cargarMedicos();
              }
            });
      }
    });
  }

  mostrarModal(id: string) {
    this.modalUploadService.mostrarModal('medicos', id);
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
    this.cargarMedicos();
  }

}
