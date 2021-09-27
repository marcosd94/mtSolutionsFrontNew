import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { CONSTANTES } from './componentes/constantes';
import { DashboardComponent } from './componentes/dashboard/dashboard.component';
import { LoginComponent } from './componentes/login/login.component';
import { AuthGuardService } from './servicios/login/auth-guard.service';
import { UsuarioComponent } from './componentes/usuario/usuario.component';
import { DatosUsuarioComponent } from './componentes/usuario/datos-usuario/datos-usuario.component';

const routes: Routes =[
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  }, {
    path: '',
    component: AdminLayoutComponent,
    children: [
        {
      path: '',
      loadChildren: './layouts/admin-layout/admin-layout.module#AdminLayoutModule'
  }]},
  /* {
    path: '**',
    redirectTo: 'dashboard'
  }, */
  {
    path: "", pathMatch: 'full', redirectTo: CONSTANTES.LOGIN.route
  },
  {
    path: CONSTANTES.LOGIN.route, component: LoginComponent
  },
  {
    path: CONSTANTES.DASHBOARD.route,
    canActivate: [AuthGuardService],
    component: DashboardComponent,
    data: {paramComponent: CONSTANTES.DASHBOARD}
  },
  {
    path: CONSTANTES.USUARIO.route,
    canActivate: [AuthGuardService],
    component: UsuarioComponent,
    data: {paramComponent: CONSTANTES.USUARIO}
  },
  {
    path: CONSTANTES.CREAR_USUARIO.route,
    canActivate: [AuthGuardService],
    component: DatosUsuarioComponent,
    data: {paramComponent: CONSTANTES.CREAR_USUARIO}
  },
  {
    path: CONSTANTES.EDITAR_USUARIO.route,
    canActivate: [AuthGuardService],
    component: DatosUsuarioComponent,
    data: {paramComponent: CONSTANTES.EDITAR_USUARIO}
  },
  {
    path: '**', pathMatch: 'full', redirectTo: CONSTANTES.LOGIN.route
  }
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes,{
       useHash: true
    })
  ],
  exports: [
  ],
})
export class AppRoutingModule { }
