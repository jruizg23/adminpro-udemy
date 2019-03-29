import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { Graficas1Component } from './graficas1/graficas1.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { PromesasComponent } from './promesas/promesas.component';
import { RxjsComponent } from './rxjs/rxjs.component';
import { LoginGuardGuard } from '../services/service.index';
import { ProfileComponent } from './profile/profile.component';
import { UsuariosComponent } from './usuarios/usuarios.component';


const routes: Routes = [
    {
        path: '',
        component: PagesComponent,
        canActivate: [LoginGuardGuard],
        children: [
          {path: 'dashboard', component: DashboardComponent, data: { titulo: 'Dashboard' } },
          {path: 'progress', component: ProgressComponent, data: { titulo: 'Progress' } },
          {path: 'graficas1', component: Graficas1Component, data: { titulo: 'Gráficas' } },
          {path: 'promesas', component: PromesasComponent, data: { titulo: 'Promesas' } },
          {path: 'rxjs', component: RxjsComponent, data: { titulo: 'RxJs' } },
          {path: 'account-settings', component: AccountSettingsComponent, data: { titulo: 'Ajustes del Tema' } },
          {path: 'profile', component: ProfileComponent, data: { titulo: 'Mi Perfil' } },
          // Mantenimientos
          {path: 'usuarios', component: UsuariosComponent, data: { titulo: 'Mantenimiento de Usuarios' } },
          {path: '', redirectTo: '/dashboard', pathMatch: 'full'}
        ]
      }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PagesRoutingModule {}
