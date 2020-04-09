import { HttpInterceptor, HttpRequest, HttpHandler , HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs'

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler):Observable<HttpEvent<any>> {
        const authToken = this.authService.getToken();
        console.log(authToken)
        const authRequest = req.clone({
            headers: req.headers.set('Authorization', "Bearer " + authToken)
        });
        console.log(authRequest.headers);
        return next.handle(authRequest);
    }
} 