import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Guard } from '../models/guard.interface';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  /* intermediario en la autenticacion del usuario para verificar el token */
  intercept(req: HttpRequest<any>,
    next: HttpHandler): Observable<HttpEvent<any>> {

      const guard: Guard = JSON.parse(sessionStorage.getItem("guard"))  
      if (guard) {
      const authJwtToken = guard.accessToken;
      const cloned = req.clone({
        headers: req.headers
          .set('Authorization', `Bearer ${authJwtToken}`)
      });
      return next.handle(cloned);
    }
    else {
      return next.handle(req);
    }
  }
}


