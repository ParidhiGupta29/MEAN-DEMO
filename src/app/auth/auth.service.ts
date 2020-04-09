import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment'

const Backend_Url = environment.apiUrl + '/user'


@Injectable({ providedIn: "root" })
export class AuthService {
    private authToken: string;
    private isAuthenticated = false;
    private tokenTimer: any;
    private userId: string;
    private authStatusListener = new Subject<boolean>();


    constructor(private http: HttpClient, private router: Router) { }

    getToken() {
        return this.authToken;
    }

    getAuthStatusListener() {
        return this.authStatusListener.asObservable();
    }

    getIsAuth() {
        return this.isAuthenticated;
    }

    getUserId() {
        return this.userId;
    }

    logout() {
        this.authToken = null;
        this.isAuthenticated = false;
        this.authStatusListener.next(false);
        clearTimeout(this.tokenTimer);
        this.userId = null;
        this.clearAuthData();
        this.router.navigate(['/']);

    }

    createUser(email: string, password: string) {
        const authData: AuthData = { email: email, password: password }
        this.http.post(Backend_Url + "/signup", authData)
            .subscribe(() => {
                this.router.navigate(["/"]);
            }, error => {
                this.authStatusListener.next(false);
            })


    }

    login(email: string, password: string) {
        const authData: AuthData = { email: email, password: password }
        this.http.post<{ token: string, expiresIn: number, userId: string }>(Backend_Url + "/login", authData)
            .subscribe(data => {
                console.log(data)
                const token = data.token
                this.authToken = token;
                if (token) {
                    const expiresInDuration = data.expiresIn;
                    console.log(expiresInDuration);
                    this.setAuthtimer(expiresInDuration);
                    this.isAuthenticated = true;
                    this.userId = data.userId;
                    this.authStatusListener.next(true);
                    const now = new Date();
                    const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
                    console.log(expirationDate);
                    this.saveAuthData(token, expirationDate, this.userId)
                    this.router.navigate(['/']);
                }
            }, error => {
                this.authStatusListener.next(false);
            })
    }

    autoAuthUser() {
        const authInformation = this.getAuthData();
        if (!authInformation) {
            return;
        }
        const now = new Date();
        const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
        if (expiresIn > 0) {
            this.authToken = authInformation.token;
            this.userId = authInformation.userId
            this.isAuthenticated = true;
            this.setAuthtimer(expiresIn / 1000)
            this.authStatusListener.next(true);
        }
    }

    private setAuthtimer(duration: number) {
        console.log("setting timer: " + duration)
        this.tokenTimer = setTimeout(() => {
            this.logout()
        }, duration * 1000)
    }

    private getAuthData() {
        const token = localStorage.getItem("token");
        const expirationDate = localStorage.getItem("expiration");
        const userId = localStorage.getItem("userId");
        if (!token && !expirationDate) {
            return;
        }
        return {
            token: token,
            expirationDate: new Date(expirationDate),
            userId: userId
        }
    }

    private saveAuthData(token: string, expirationDate: Date, userId: string) {
        localStorage.setItem('userId', userId);
        localStorage.setItem('token', token);
        localStorage.setItem('expiration', expirationDate.toISOString());
    }

    private clearAuthData() {
        localStorage.removeItem('userId');
        localStorage.removeItem('token');
        localStorage.removeItem('expiration');
    }


}