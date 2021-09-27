import { Component, OnInit } from '@angular/core';
import { LocationStrategy, PlatformLocation, Location } from '@angular/common';

import { CommonService } from './servicios/common.service';
import { PROPERTIES } from '../environments/mensaje.properties';
import { CONSTANTES } from './componentes/constantes';
import { Router } from '@angular/router';
import { AuthService } from './servicios/login/auth.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

     constructor(public location: Location, public common:CommonService,
      public router:Router, public auth: AuthService) {}

    ngOnInit(){
    }

    isMap(path){
      var titlee = this.location.prepareExternalUrl(this.location.path());
      titlee = titlee.slice( 1 );
      if(path == titlee){
        return false;
      }
      else {
        return true;
      }
    }

    logOut() {
      this.common.apagado = true;
      this.auth.logOut();
      this.auth.clearToken();
    }
}
