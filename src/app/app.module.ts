import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app.routing';
import { NavbarModule } from './shared/navbar/navbar.module';
import { FooterModule } from './shared/footer/footer.module';
import { SidebarModule } from './sidebar/sidebar.module';

import { AppComponent } from './app.component';

import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { DashboardComponent } from './componentes/dashboard/dashboard.component';
import { LoginComponent } from './componentes/login/login.component';
import { UsuarioComponent } from './componentes/usuario/usuario.component';
import { DatosUsuarioComponent } from './componentes/usuario/datos-usuario/datos-usuario.component';
import { ControlAcceso } from './utils/control-accesso';
import { AuthService } from './servicios/login/auth.service';
import { AuthGuardService } from './servicios/login/auth-guard.service';
import { RequestInterceptor } from './request-interceptor';

@NgModule({
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    DashboardComponent,
    LoginComponent,
    UsuarioComponent,
    DatosUsuarioComponent,
    ControlAcceso
  ],
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    RouterModule,
    HttpClientModule,
    NavbarModule,
    FooterModule,
    SidebarModule,
    AppRoutingModule,
    /* NgSelectModule,
    NgxSpinnerModule, */
  ],
  providers: [
    AuthService,
    AuthGuardService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RequestInterceptor,
      multi: true
    }/* ,
    {provide: LOCALE_ID, useValue: 'es'} */
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
