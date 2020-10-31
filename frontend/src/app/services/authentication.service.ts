import { Injectable } from "@angular/core";
import {
    HttpClient,
} from "@angular/common/http";
import { Observable } from "rxjs";
@Injectable({
    providedIn: "root"
})
export class AuthenticationService {
    url = "http://localhost:3000/auth/";

    constructor(private http: HttpClient) { }

    posts: Observable<any>;

    public register(username: string, password: string): Observable<any> {
        return this.http.post(this.url + "register", { username, password });
    }

    public login(username: string, password: string): Observable<any> {
        return this.http.post(this.url + "login", { username, password });
    }

    public checkToken(): Observable<any> {
        return this.http.get(this.url + "check-token", { headers: { authorization: localStorage.getItem('token') } });
    }

    isLogged() {
        if (localStorage.getItem('token') && localStorage.getItem('username')) {
            return true;
        }
        return false;
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
    }
}
