import { Component, OnInit, ViewChild } from '@angular/core';

import { AccountService } from './_services';
import { User } from './_models';

@Component({ selector: 'app', templateUrl: 'app.component.html' })
export class AppComponent implements OnInit {
    user: User;
    public isOnline: boolean = true;


    constructor(private accountService: AccountService) {
        this.accountService.user.subscribe(x => this.user = x);
    }

    ngOnInit() {
        window.navigator.onLine ? 'Online' : 'OFFline';
        this.isOnline = window.navigator.onLine ? true : false;
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.accountService.SetIsOnline(true);

        });
        window.addEventListener('offline', () => {
            this.isOnline = false;
            this.accountService.SetIsOnline(false);
        });
    }


    logout() {
        this.accountService.logout();
    }
}