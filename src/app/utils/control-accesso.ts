import { Directive, ElementRef, Input, AfterViewInit } from '@angular/core';
import { AuthService } from '../servicios/login/auth.service';
import { PermisoDTO } from '../model/permisoDTO';

@Directive({
  selector: '[ctrlAcceso]'
})
export class ControlAcceso implements AfterViewInit {

  @Input('ctrlAcceso') permiso: string = '';
  listaFuncionalidades: PermisoDTO[] = [];
  aux: string = '';

  constructor(
    private el: ElementRef,
    private authSrv: AuthService) {
    this.listaFuncionalidades = this.authSrv.listaFuncionalidades;
  }

  ngAfterViewInit(): void {

    let auxPermiso = this.permiso.split(',');
    let habilitado: boolean = false;

    if(auxPermiso.length > 1) {
      for (let p = 0; p < auxPermiso.length; p++) {
        const element = auxPermiso[p];
        if (element.startsWith('id_')) {
          this.aux = auxPermiso[1];
        } else {
          habilitado = this.listaFuncionalidades.filter(row => row.authority == element).length > 0
          if(habilitado) {
            break;
          }
        }
      }

    } else {
      habilitado = this.listaFuncionalidades.filter(row => auxPermiso[0] === row.authority).length >= 1;
    }

    // this.el.nativeElement.style.visibility = habilitado ? 'visible' : 'hidden';
    if(!habilitado) {
      this.el.nativeElement.remove();
      if (this.aux != '') {
        let element= document.getElementById(this.aux);
        if (element) {
          element.style.display = 'inline-grid';
        }
      }
    }

  }

}
