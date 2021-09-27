import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthPermService } from './auth-perm.service';
import { TokenDTO } from '../../model/tokenDTO';
import { environment } from '../../../environments/environment.prod';
import { PermisoDTO } from '../../model/permisoDTO';
import { UsuarioDTO } from '../../model/usuarioDTO';
import { Observable } from 'rxjs';
import { cloneValue } from '../../utils/Utils';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _auth: TokenDTO;
  private url: string;
  private CLAVE: string = 'oauthData';

  constructor(
    private http: HttpClient,
    public router: Router,
    public permService: AuthPermService
  ) {
    this.url = environment.base_url;
    let sessAuth = window.sessionStorage.getItem(btoa(this.CLAVE));
    if (sessAuth) {
      this._auth = JSON.parse(atob(sessAuth));
      this.permService.actualizarPermisos(this._auth.userDetail.authorities?this._auth.userDetail.authorities:[], false);
    } else {
      this._auth = {
        user: '',
        userDetail : {}
      }
    }
   }
   
  get listaFuncionalidades(): PermisoDTO[] {
    return this._auth && this._auth.user && this._auth.userDetail.authorities? cloneValue(this._auth.userDetail.authorities) : [];
  }

  get userAuth(): TokenDTO {
    return cloneValue(this._auth);
  }

  get isAuth(): boolean {
    return (this._auth != null && this._auth.token != null && this._auth.token != "" && this._auth.user != null) ;
  }

  habilitado(permiso: string): boolean {
    if (this._auth && this._auth.user && this._auth.userDetail.authorities) {
      return this._auth.userDetail.authorities.filter(row => row.authority === permiso).length>0;
    }
    return false;
  }

  set authData(param: TokenDTO) {
    this.regDataUser(param);
  }

  private regDataUser(param: TokenDTO) {
    if (param && param.user == '') {
      window.sessionStorage.removeItem(btoa(this.CLAVE));
    } else {
      let userdto: UsuarioDTO = {};
      if (param) {
          let x = param.token;
          if (x) {
            let obj= JSON.parse(window.atob(x.split(".")[1]));
            if (obj) {
              userdto.authorities = JSON.parse(obj.authorities);
              userdto.username = param.user;
              userdto.enabled = param.enable;
              param.userDetail = userdto;
              this.permService.actualizarPermisos(userdto.authorities?userdto.authorities:[], false);
            }
          }
          
      }
      
      window.sessionStorage.setItem(btoa(this.CLAVE), btoa(JSON.stringify(param)));
    }
    this._auth = param;
  }

  public getHeaders(opt = 'img'): {headers: HttpHeaders} {
    let headers;
    if((opt === 'img')) {
      headers = {
        headers: new HttpHeaders()
          .set('Authorization', `Bearer ${this._auth.token}`)
          .set('user-token', this.userAuth.user)
      };
    } else {
      headers = {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/json')
          .set('Authorization', `Bearer ${this._auth.token}`)
          .set('user-token', this.userAuth.user)
      }
    }
    return headers;
  }

  logIn(param: { username: string, password: string}): Observable<TokenDTO> {
    let headers = {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
    };
    return this.http.post<TokenDTO>(`${environment.base_url}/login`, param, headers);
  }

  logOut() {
    this.clearToken().subscribe(() => {
       let token: TokenDTO = {
        user: '',
        userDetail: {}
      }
      this.permService.reiniciarPermisos();
      this.regDataUser(token);
      setTimeout(() => {
        this.router.navigate(['/login'])
      }, 0);
      
    });
  }

  clearToken(): Observable<TokenDTO> {
    let data = { username: this._auth.user }
    let headers = {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('user', this._auth.user)
    };
    return this.http.post<TokenDTO>(`${environment.base_url}/logout`, data, headers);
  }
}
