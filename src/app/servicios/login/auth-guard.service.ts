import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { CommonService } from '../common.service';
import { CONSTANTES } from '../../componentes/constantes';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(
    public authService: AuthService,
    public router: Router,
    private commonSrv: CommonService
  ) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (!this.authService.isAuth) {
      this.router.navigate([CONSTANTES.LOGIN.route]);
      return false;
    }

    if (route.data.paramComponent) {
      let auxTitle: string = '';
      try {
        auxTitle = route.data.paramComponent.nombre;
      } catch(error) {
        auxTitle = '';
        console.warn('No se encuentra nombre', route.data.paramComponent);
      }
    }

    if (route.data && route.data.paramComponent && route.data.paramComponent.permiso) {
      let permisoNecesario = route.data.paramComponent.permiso;
      let tienePermiso: boolean = false;
      if (this.authService.userAuth && this.authService.userAuth.user && this.authService.userAuth.userDetail.authorities) {
        let habilitado = this.authService.userAuth.userDetail.authorities.filter(row => (row.authority === permisoNecesario) || (permisoNecesario.indexOf(row.authority) >= 0));

        if (habilitado.length >= 1) {
          tienePermiso = true;
        }
      }

      if (!tienePermiso) {
        this.commonSrv.showMsg2("Acceso no permitido", "error",5000);
        let actual = route.data.paramComponent.route;
        let array = route.data.paramComponent.routeArr;
        let posicion = array.indexOf(actual);
        
        if (posicion && array[posicion-1]!="") {
          this.router.navigate([array[posicion-1]]);
        } else if (posicion && array[posicion-1]=="") {
          this.authService.logOut();
        }
      }

      return tienePermiso

    }

    return true;
  }
}