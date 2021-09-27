import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { environment } from '../../environments/environment.prod';
import { AuthService } from './login/auth.service';

declare var M: any;
@Injectable({
  providedIn: 'root'
})
export class CommonService {
  url: string = environment.base_url;
  apagado: boolean = false;
  serviceProcesando = new Subject<boolean>();
  cantidadLlamadasEspera = new Subject<number>();
  urlSinLoading: string[] = [];
  horaServer: Date = new Date();
  constructor(
    private authService: AuthService,
    private titleSrv: Title
  ) { }

  set setTitle(title: string) {
    this.titleSrv.setTitle('MtSolutions - ' + title);
  }

  isLoading(url: string): boolean {

    return this.urlSinLoading.filter(row => row == url).length > 0;

  }

  clearToken(token: any) {
    this.authService.authData =  token;
  }

  logoutX() {
    this.apagado = true;
    this.authService.logOut();
  }

  private _getHeaders(opt:any=null): { headers: HttpHeaders } {

    let headers;

    headers = {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
    };


    return headers;
  }


  showMsg2(mensaje: string, tipo: string, tiempo:number=5000) {
      //tipo: info - error - success
    M.toast({html: `<div><h6 font-weight: 600'>${mensaje}</h6></div>`,
    classes: `rounded ${tipo}`,
    displayLength: tiempo});
  }

  alertaAviso(mensaje: string, tipo: string) {
    let elemn = document.getElementById("modalAlerta");
    var instance = M.Modal.getInstance(elemn);
    instance.open();
    let icono = '<i style="color: #de6e2a7a;" class="material-icons large">report</i>';
    let id = document.getElementById("iconoModalAlerta");
    if (id) {
      id.innerHTML = icono;
    }
    let cont = '<p style="font-size: 20px;">'+mensaje+'</p>';
    let idCont = document.getElementById("contenidoModalAlerta");
    if (idCont) {
      idCont.innerHTML = cont;
    }
  }
}
