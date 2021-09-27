import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from '../../../servicios/usuario/usuario.service';
import { CommonService } from '../../../servicios/common.service';
import { PaginationDTO } from '../../../model/paginationDTO';
import { PROPERTIES } from '../../../../environments/mensaje.properties';
import { CONSTANTES } from '../../constantes';
import { Location } from '@angular/common';

declare var M: any;

@Component({
  selector: 'app-datos-usuario',
  templateUrl: './datos-usuario.component.html',
  styleUrls: ['./datos-usuario.component.css']
})
export class DatosUsuarioComponent implements OnInit {

  txt: any;
  location: Location;
  titulo: string = '';
  file: any;
  fileSize: number;
  fileExtension: any;
  formCtrl: FormGroup;
  cedulaFormateado: any;
  dataSelect: Array<RolDTO> = [];
  perfilLoanding: boolean;
  rol:any;
  listaFuncionalidades: any[] = [];
  pagination: PaginationDTO;

  constructor(private router: Router,
    location: Location,
    private service: UsuarioService,
    private commonSrv: CommonService) {
    this.txt = PROPERTIES;
    this.commonSrv.apagado = true;
    this.fileSize = 0;
    this.formCtrl = new FormGroup({
      fileName: new FormControl(undefined, [Validators.required]),
      nombreUsuario: new FormControl(undefined, [Validators.required]),
      apellidoUsuario: new FormControl(undefined, [Validators.required]),
      direccion: new FormControl(undefined, [Validators.required]),
      cedula: new FormControl(undefined, [Validators.required]),
      telefono: new FormControl(undefined, [Validators.required]),
      email: new FormControl(undefined, [Validators.required]),
      rolSeleccion: new FormControl(undefined),
      items: new FormArray([])
    });
    this.location = location;
    this.perfilLoanding = true;

    this.pagination = {
      page: 1,
      pageSize: 6
    }
  }

  ngOnInit(): void {
    let aux = this.location.path().search(CONSTANTES.CREAR_USUARIO.route);
    if (aux !== -1) {
      this.titulo = this.txt.tituloNuevoUsuario;
    } else {
      this.titulo = this.txt.tituloVerUsuario;
    }
    M.updateTextFields();
    this.obtenerRoles();
    this.obtenerFuncionalidades();
    //this.obtenerPerfiles();
  }

  get getFileName(): any {
    return this.formCtrl.get('fileName');
  }

  get getNombreUsuario(): any {
    return this.formCtrl.get('nombreUsuario');
  }

  get getApellidoUsuario(): any {
    return this.formCtrl.get('apellidoUsuario');
  }

  get getDireccion(): any {
    return this.formCtrl.get('direccion');
  }

  get getCedula(): any {
    return this.formCtrl.get('cedula');
  }

  get getTelefono(): any {
    return this.formCtrl.get('telefono');
  }

  get getEmail(): any {
    return this.formCtrl.get('email');
  }

  get getRolSeleccion(): any {
    return this.formCtrl.get('rolSeleccion');
  }

  get getItems(): FormArray {
    return <FormArray>this.formCtrl.get("items");
  }

  fileChangeEvent(fileInput:any) {
    if (fileInput.target.size > 0) {
      this.file = fileInput.target.files[0];
      this.getFileName.setValue(this.file.name);
      this.fileSize = this.file.size;
      this.fileExtension = this.file.name.split('.')[1].toLowerCase();
      /*if (this.fileExtension != 'xlsx') {
        this.alertaExt = true;
      } else {
        this.alertaExt = false;
      }
      if (this.fileSize > 1000000) {
        this.alertaTama = true;
      } else {
        this.alertaTama = false;
      }*/
    }
  }

  formatearCi( element: any ) {
    this.cedulaFormateado = this.miles(this.getCedula.value);
    element.target.value = this.cedulaFormateado;
  }

  private miles(value: any) {
    value = value?.replaceAll('.','');
    const DECIMAL_SEPARATOR = ",";
    const THOUSANDS_SEPARATOR = ".";
    let fractionSize = 0;
    const PADDING = "000000";
    let [ integer, fraction = "" ] = (value || '').toString()
      .split(DECIMAL_SEPARATOR); // Divide entre parte entera y decimal, por la "," en este caso

    fraction = fractionSize > 0
      ? DECIMAL_SEPARATOR + (fraction + PADDING).substring(0, fractionSize)
      : "";

    integer = integer.replace(/\B(?=(\d{3})+(?!\d))/g, THOUSANDS_SEPARATOR);

    return integer + fraction;
  }

  irAUsuario() {
    this.router.navigate([CONSTANTES.USUARIO.route]);
  }

  obtenerPerfiles() {
    /*this.service.getListaPerfiles().subscribe(
      respuesta => {
          this.cargarSelect(respuesta.data?.lista);
          this.perfilLoanding = false;
      },
      error => {
        if(error && error.status != 403) {
          this.commonSrv.showMsg2(error.error.mensaje, "error",5000);
          this.perfilLoanding = false;
        }
      }
    )*/
  }

  obtenerRoles() {
    this.service.getListaRoles().subscribe(
      respuesta => {
          this.cargarSelect(respuesta.data?.lista);
      },
      error => {
        if(error && error.status != 403) {
          this.commonSrv.showMsg2(error.error.mensaje, "error",5000);
        }
      }
    )
  }

  obtenerFuncionalidades() {
    this.service.getListaFuncionalidades().subscribe(
      respuesta => {
          this.listaFuncionalidades=respuesta.data?.lista;
          //this.perfilLoanding = false;
      },
      error => {
        if(error && error.status != 403) {
          this.commonSrv.showMsg2(error.error.mensaje, "error",5000);
          //this.perfilLoanding = false;
        }
      }
    )
  }

  onChange() {
    this.dataSelect.forEach(obj => {
      if (obj?.id == this.getRolSeleccion.value) {
        this.getRolSeleccion.setValue(obj.id);
        this.rol = obj
        setTimeout(() => {
          this.loadItems()
        }, 0);
      }
    })
  }

  onClear() {
    this.getRolSeleccion.setValue(this.dataSelect[0].id);
    this.rol = this.dataSelect[0];
    this.loadItems()
  }

  cargarSelect(lista: Array<any>) {
    //let obj: RolDTO;
    //this.dataSelect = new Array<RolDTO>();
    this.dataSelect = lista;

    if (lista) {
      setTimeout(() => {
        this.getRolSeleccion.setValue(this.dataSelect[0].id);
        this.rol = this.dataSelect[0];
        this.loadItems()
      }, 100);
    }

  }

  cambioPagina(p: number) {
    this.pagination.page = p;
  }

  loadItems() {
    this.getItems.clear();
    let control: FormGroup;

    if (this.listaFuncionalidades && this.listaFuncionalidades.length) {
      this.listaFuncionalidades.forEach( x => {
        control = new FormGroup({
          activo: new FormControl({value:false, disabled:true}),
          id: new FormControl(x.id),
          nombre: new FormControl(x.nombre),
          descripcion: new FormControl(x.descripcion)
        });
        this.getItems.push(control);
      });
      if (this.getItems.value) {
        this.getItems.controls.forEach(e=> {
          this.rol?.perfiles.forEach((z:any) => {
            if (z) {
              z.funcionalidades.forEach((element:any) => {
                if (e?.get('id')?.value == element?.id) {
                  e.get('activo')?.setValue(true);
                }
              });
            }
          })
        })
      }
    }
  }

  crearUsuario() {
      if ((!this.getNombreUsuario.value || this.getNombreUsuario.value?.trim() == ' ') ||
          (!this.getApellidoUsuario.value || this.getApellidoUsuario.value?.trim() == ' ') ||
          (!this.getDireccion.value && this.getDireccion.value?.trim() == ' ') ||
          (!this.getCedula.value && this.getCedula.value?.trim() == ' ') ||
          (!this.getTelefono.value && this.getTelefono.value?.trim() == ' ')) {
          this.commonSrv.showMsg2(this.txt.alerta, 'info', 5000);
      } else {
        let obj= {
          nombre: this.getNombreUsuario.value.trim(),
          apellido: this.getApellidoUsuario.value.trim(),
          direccion: this.getDireccion.value.trim(),
          documento: this.getCedula.value.trim().replaceAll('.',''),
          telefono: this.getTelefono.value.trim(),
          email: this.getEmail.value.trim(),
          rol: this.getRolSeleccion.value
        }
        this.service.crearUsuario(obj).subscribe(
          respuesta => {
              this.commonSrv.showMsg2(respuesta?.data, "success", 5000);
              setTimeout(() => {
                this.irAUsuario();
              }, 300);
          },
          error => {
            if(error && error.status != 403) {
              this.commonSrv.showMsg2(error.error.message, "error",5000);
            }
          }
        )
      }

  }

}

export interface RolDTO {
  id:string,
  nombre:string,
  descripcion:string,
  activo:boolean,
  perfiles?:PerfDTO[]
}
export interface PerfDTO {
  id:string,
  nombre:string,
  descripcion:string,
  activo:boolean,
  funcionalidades?:FuncDTO[]
}
export interface FuncDTO {
  id:string,
  nombre:string,
  descripcion:string,
  activo:boolean
}
