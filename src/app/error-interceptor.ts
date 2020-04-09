import { HttpInterceptor, HttpRequest, HttpHandler , HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { Injectable } from '@angular/core';
import { ErrorComponent } from './error/error.component';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(public dialog: MatDialog) { }

    intercept(req: HttpRequest<any>, next: HttpHandler):Observable<HttpEvent<any>> {
    
        return next.handle(req).pipe(
            catchError((error:HttpErrorResponse)=>{
               let errorMessage="An unknow error occured!"
               if(error.error.message){
                    errorMessage=error.error.message
               }
                this.dialog.open(ErrorComponent, {data: {message: errorMessage }})
                return throwError(error);
            })
        );
    }
} 