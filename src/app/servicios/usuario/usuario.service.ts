import { Injectable } from '@angular/core';
import { MtSolutionsResponse } from '../../model/mtSolutionsDTO';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../login/auth.service';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment.prod';
import { FiltroDTO } from '../../model/filtroDTO';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private http: HttpClient,
    private auth: AuthService) { }

  getListaUsuarios(cantidad: number, origen: number): Observable<MtSolutionsResponse> {
    return this.http.get<MtSolutionsResponse>(`${environment.base_url}/usuarios/lista?cantidad=${cantidad}&origen=${origen}`, this.auth.getHeaders());
  }
  buscarListaUsuarios(filtro: FiltroDTO, cantidad: number, origen: number): Observable<MtSolutionsResponse> {
    return this.http.post<MtSolutionsResponse>(`${environment.base_url}/usuarios/buscador?cantidad=${cantidad}&origen=${origen}`, filtro, this.auth.getHeaders());
  }
  crearUsuario(dto: Object): Observable<MtSolutionsResponse> {
    return this.http.post<MtSolutionsResponse>(`${environment.base_url}/usuarios/crear`, dto, this.auth.getHeaders());
  }
  getListaRoles(): Observable<MtSolutionsResponse> {
    return this.http.get<MtSolutionsResponse>(`${environment.base_url}/usuarios/roles`, this.auth.getHeaders());
  }
  getListaFuncionalidades(): Observable<MtSolutionsResponse> {
    return this.http.get<MtSolutionsResponse>(`${environment.base_url}/usuarios/funcionalidades`, this.auth.getHeaders());
  }
  /*getListaPerfiles(): Observable<MtSolutionsResponse> {
    return this.http.get<MtSolutionsResponse>(`${environment.base_url}/usuarios/perfiles`, this.auth.getHeaders());
  }*/

}

