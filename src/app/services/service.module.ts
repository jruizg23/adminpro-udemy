import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SettingsService, SharedService, SidebarService, UsuarioService} from './service.index';

// En caso de no poder usar el provideIn podemos usar este módulo para importar todos los servicios
// Nota con el provideIn no usamos ni mantenemos este módulo
@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    SettingsService,
    SharedService,
    SidebarService,
    UsuarioService
  ]
})
export class ServiceModule { }
