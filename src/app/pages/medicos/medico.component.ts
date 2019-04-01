import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Hospital } from 'src/app/models/hospital.model';
import { MedicoService } from 'src/app/services/service.index';
import { HospitalService } from 'src/app/services/hospital/hospital.service';
import { Medico } from 'src/app/models/medicos.model';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalUploadService } from 'src/app/components/modal-upload/modal-upload.service';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: []
})
export class MedicoComponent implements OnInit {

  hospitales: Hospital[] = [];
  medico: Medico = new Medico();

  constructor(
    public medicoService: MedicoService,
    public hospitalService: HospitalService,
    public router: Router,
    public activateRoute: ActivatedRoute,
    public modalUploadService: ModalUploadService
  ) {
    const hospital: Hospital = new Hospital('', '', '');
    this.medico.hospital = hospital;

    this.activateRoute.params.subscribe( (params) => {
      const id = params.id;
      if ( id !== 'nuevo' ) {
        this.cargarMedico(id);
      }
    });
  }

  ngOnInit() {
    this.hospitalService.cargarHospitales(0, -1)
      .subscribe( (resp: any) => this.hospitales = resp.hospitales );
    this.modalUploadService.notificacion
        .subscribe( (resp: any) => {
          this.medico.img = resp.medico.img;
        });
  }

  cargarMedico( id: string ) {
    this.medicoService.cargarMedico(id)
        .subscribe( (medico) => {
          this.medico = medico;
        } );
  }

  guardarMedico(form: NgForm) {

    if (form.invalid) {
      return;
    }

    this.medicoService.guardarMedico(this.medico)
        .subscribe( (medico: any) => {
          this.medico._id = medico._id;
          this.router.navigate(['/medico', medico._id]);
        });
  }

  cambioHospital(id: string) {
    this.hospitalService.obtenerHospital(id)
      .subscribe( hospital => this.medico.hospital = hospital);
  }

  cambiarFoto() {
    this.modalUploadService.mostrarModal('medicos', this.medico._id);
  }
}
