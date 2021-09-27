import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PROPERTIES } from '../../../environments/mensaje.properties';
import { CommonService } from '../../servicios/common.service';
import { AuthService } from '../../servicios/login/auth.service';
import { CONSTANTES } from '../constantes';

declare var M:any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  formCtrl: FormGroup;
  texto: any;
  band: boolean;
  textoojo: string;

  constructor(
    public router:Router,
    private auth: AuthService,
    private routerActi: ActivatedRoute,
    private commonSrv: CommonService) {
    this.formCtrl = new FormGroup({
      user: new FormControl(undefined, [Validators.required]),
      pass: new FormControl(undefined, [Validators.required]),
      recordar: new FormControl(undefined)
    });
    this.texto = PROPERTIES;

    this.commonSrv.apagado = false;
    this.band = false;
    this.textoojo = "Mostrar contraseña";
   }

  ngOnInit(): void {
    M.updateTextFields();
  }

  get getUser(): any {
    return this.formCtrl.get('user');
  }

  get getPass(): any {
    return this.formCtrl.get('pass');
  }

  get getRecordar(): any {
    return this.formCtrl.get('recordar');
  }

  pulsar(e:any) {
    let pass = document.getElementById('idPass');
    let email = document.getElementById('idUser');
    if (pass && pass.className.search('invalid') != -1) {
      pass.classList.remove('invalid')
      pass.classList.add('valid');
    }

    if (email && email.className.search('invalid') != -1) {
      email.classList.remove('invalid')
      email.classList.add('valid');
    }

    if (e.keyCode === 13) {
      e.preventDefault();
      e.stopImmediatePropagation();
      if (this.formCtrl.valid) {
        this.loginAction(e);
      }

    }
  }

  cambioVision() {
    this.band = !this.band;
    let id = document.getElementById("visor-password-id");
    if (id) {
      if (this.band) {
        id?.classList.remove('ojo');
        id?.classList.add('ojopintado');
        this.textoojo = "Ocultar contraseña";
        this.cambiarType();
      } else {
        id?.classList.remove('ojopintado');
        id?.classList.add('ojo');
        this.textoojo = "Mostrar contraseña";
        this.cambiarType();
      }
    }
  }

  cambiarType() {
    let inp:any = document.getElementById("idPass");
    if (inp) {
      if (inp.type == "password") {
        inp.type = "text";
      } else  {
        inp.type = "password";
      }
    }
  }

    loginAction(event:any) {
      event.preventDefault();
      event.stopImmediatePropagation();

      let usuario= {
        username: this.getUser.value,
        password: this.getPass.value
      };

      if (this.getRecordar.touched) {
        if (this.getRecordar.value && this.getUser.value.trim() != '') {
          localStorage.setItem('record',this.getUser.value);
        } else {
          localStorage.removeItem('record');
        }
      }
      this.auth.logIn(usuario).subscribe(
        respuesta => {
          if(respuesta.token) {
            if (respuesta.mensaje) {

              this.auth.authData = respuesta;
              if (respuesta.enable) {
                this.router.navigate( [CONSTANTES.DASHBOARD.route] );
              } else {
                this.commonSrv.showMsg2("Usuario inactivo", "error",5000);
              }
            }
          }
        },
        error => {
          if(error && error.error && error.error.mensaje) {
            this.commonSrv.showMsg2(error.error.mensaje, "error",5000);
          }
        }
      )
    }
}
