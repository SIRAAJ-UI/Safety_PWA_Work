import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '@environments/environment';
import { User } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class AccountService {
    private userSubject: BehaviorSubject<User>;
    private _activate: Subject<any>;
    public user: Observable<User>;
    private _isOnline: Subject<boolean>;
    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        this._activate = new Subject();
        this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
        this.user = this.userSubject.asObservable();
        this._isOnline = new Subject();
    }

    public get userValue(): User {
        return this.userSubject.value;
    }

    SetIsOnline( isOnline:boolean ){
        this._isOnline.next(isOnline);
    }

    DoActivate(isactivate:boolean){
        this._activate.next(isactivate);
    }

    public get IsActivate():Observable<boolean>{
        return this._activate.asObservable()
    }
    

    getOnlineStatus():Observable<boolean>{
        return this._isOnline.asObservable();
    }

    login(username, password) {
        return this.http.post<any>(`${environment.apiUrl}/api/UserProfile/GetLogin`, { username, password })
            .pipe(map(user => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('user', JSON.stringify(user));
                this.userSubject.next(user);
                return user;
            }));
    }

    logout() {
        // remove user from local storage and set current user to null
        this.DoActivate(false);
        localStorage.removeItem('user');
        this.userSubject.next(null);
        location.reload(true);
        location.href="index.html"
    }

  
    

    
}