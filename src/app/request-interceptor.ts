import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
//import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { CommonService } from './servicios/common.service';
import { tap } from 'rxjs/operators';
import { TokenDTO } from './model/tokenDTO';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {
    intervalCargando: { url: string, interval: any }[] = [];

    constructor(
        public router: Router,
        private commonSrv: CommonService,
        //private spinnerService: NgxSpinnerService
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        request = request.clone({
            setHeaders: {}
        });


        this.activarCargando(request.url, true);
        if (request && request.url) {
            if (!request.url.includes("detalleAcredEnCurso")) {
                //this.spinnerService.show();
            }
        }
        // this.intervalCargando =

        return next.handle(request).pipe(tap(
            (ev: HttpEvent<any>) => {
                if (ev instanceof HttpResponse) {

                    this.clearIntervalFunct(request.url)

                }
            },
            error => {

                if (error.status == '0') {
                    this.commonSrv.showMsg2('No se puede conectar con el servidor, verifique su conexión.', "warning");
                }

                if ((error.status == '400' && error.error.errorCode == 'ACCESS_DENIED') || (error.status == '401' && error.error.exception == 'No autorizado') ) {

                    if(error.status == '401' && error.error.exception == 'No autorizado') {
                        this.commonSrv.showMsg2(error.error.message, "error");
                    } else {
                        this.commonSrv.showMsg2("Usted no tiene permiso para acceder al recurso solicitado.", "error");
                    }

                }

                // Si es un error por token expirado entonces manda al login
                //if (error.error && error.error.error == "invalid_token") {
                if (error.status == '403') {
                    this.commonSrv.showMsg2("Su sesión ha expirado", "error");
                    this.commonSrv.logoutX();
                    //setTimeout(() => {
                        //this.router.navigate( ['/login'] );
                    //}, 0);
                }

                this.clearIntervalFunct(request.url)
            }
        ));
    }

    private clearIntervalFunct(url: string) {
        this.activarCargando(url, false);
        //this.spinnerService.hide();
    }

    activarCargando(url: string, mostrar: boolean) {

        if (!this.commonSrv.isLoading(url)) {

            let pos: number = 0;
            for (let i = 0; i < this.intervalCargando.length; i++) {
                const interval = this.intervalCargando[i];
                if (interval.url === url) {
                    pos = i;
                    break;
                }
            }

            if (mostrar) {

                // if(pos) {
                //     this.intervalCargando[pos].interval = setTimeout(() => {
                //         this.commonSrv.serviceProcesando.next(true);
                //     }, 350);
                // } else {
                this.intervalCargando.push({
                    url: url,
                    interval: setTimeout(() => {
                        this.commonSrv.serviceProcesando.next(true);
                    }, 350)
                });
                // }

            } else {


                clearTimeout(this.intervalCargando[pos].interval);
                this.intervalCargando.splice(pos, 1);


            }

            if (!this.intervalCargando.length) {
                this.commonSrv.serviceProcesando.next(false);
            }

        }

        this.commonSrv.cantidadLlamadasEspera.next(this.intervalCargando.length);

    }

}
