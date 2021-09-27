import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from '../../servicios/usuario/usuario.service';
import { CommonService } from '../../servicios/common.service';
import { PaginationDTO } from '../../model/paginationDTO';
import { PROPERTIES } from '../../../environments/mensaje.properties';
import { CONSTANTES } from '../constantes';
import { FiltroDTO } from '../../model/filtroDTO';

declare var M: any;

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {
  txt: any;
  path: any;
  formCtrl: FormGroup;
  arrayUsuario:any[] = [];
  totalUsuario:number=0;
  cantActualUsuario: number=0;
  pagination: PaginationDTO;
  filtroActivo: boolean= false;

  constructor(public router:Router,
    public service: UsuarioService,
    private commonSrv: CommonService) {
    this.txt = PROPERTIES;
    this.path = CONSTANTES;
    this.commonSrv.apagado = true;
    this.formCtrl = new FormGroup({
      buscador: new FormControl()
    });
    this.pagination = {
      page: 1,
      pageSize: 8
    }
  }

  ngOnInit(): void {
    M.updateTextFields();
    var elems = document.getElementById('buscador_id');
    M.CharacterCounter.init(elems);
    this.obtenerUsuarios(this.pagination.pageSize, 0);
  }

  get getBuscador(): any {
    return this.formCtrl.get('buscador');
  }

  focusEvent(id: string, clasIn: string, clasOut: string) {
    let elem = document.getElementById(id);
    if (elem) {
      elem.classList.remove(clasOut);
      elem.classList.add(clasIn);
    }
  }

  blurEvent(id: string, clasIn: string, clasOut: string) {
    let elem = document.getElementById(id);
    if (elem) {
      elem.classList.remove(clasOut);
      elem.classList.add(clasIn);
    }
    var elems = document.getElementById('buscador_id');
    M.CharacterCounter.init(elems);
  }

  obtenerUsuarios(cantidad:number, origen:number) {
    this.service.getListaUsuarios(cantidad, origen).subscribe(
      respuesta => {
          this.arrayUsuario = respuesta.data?.lista;
          this.totalUsuario = respuesta.data?.totalRegistros;
          this.cantActualUsuario = respuesta.data?.cantActualRegistros;
      },
      error => {
        if(error && error.status != 403) {
          //console.log(error.error.mensaje)
          this.commonSrv.showMsg2(error.error.mensaje, "error",5000);
        }
      }
    )
  }

  verAction() {
    this.router.navigate([CONSTANTES.CREAR_USUARIO.route]);
  }


  cambioPagina(p: number) {
    this.pagination.page = p;
    if (this.filtroActivo) {
      this.buscador(this.pagination.pageSize, (this.pagination.page -1) * this.cantActualUsuario);
    } else  {
      this.obtenerUsuarios(this.pagination.pageSize, (this.pagination.page -1) * this.cantActualUsuario);
    }
  }

  crearNuevoUsuario() {
    this.router.navigate([CONSTANTES.CREAR_USUARIO.route]);
  }

  buscarAccion(e:any) {
    if (e.keyCode === 13) {
      if (this.getBuscador.value && this.getBuscador.value.trim() != '') {
        e.preventDefault();
        e.stopImmediatePropagation();
        this.filtroActivo = true;
        this.buscador(this.pagination.pageSize, 0);
      }
    }
  }

  buscador(cantidad:number, origen:number) {
    let filtro:FiltroDTO = {valor: this.getBuscador.value.trim()};
        this.service.buscarListaUsuarios(filtro, cantidad, origen).subscribe(
          respuesta => {
              this.arrayUsuario = respuesta.data?.lista;
              this.totalUsuario = respuesta.data?.totalRegistros;
              this.cantActualUsuario = respuesta.data?.cantActualRegistros;
          },
          error => {
            if(error && error.status != 403) {
              //console.log(error.error.mensaje)
              this.commonSrv.showMsg2(error.error.mensaje, "error",5000);
            }
          }
        )
  }

  limpiarFiltro() {
    this.filtroActivo = false;
    this.getBuscador.reset();
    this.obtenerUsuarios(this.pagination.pageSize, 0);
  }


}
