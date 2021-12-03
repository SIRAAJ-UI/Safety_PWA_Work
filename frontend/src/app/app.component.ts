import { Component, OnInit, ViewChild } from '@angular/core';

import { AccountService } from './_services';
import { User } from './_models';

@Component({ selector: 'app', templateUrl: 'app.component.html' })
export class AppComponent implements OnInit {
    user: User;
    @ViewChild("status") statusDisplay: any;


    constructor(private accountService: AccountService) {
        this.accountService.user.subscribe(x => this.user = x);
    }

    ngOnInit() {
        const statusDisplay = document.getElementById("status");
        statusDisplay.textContent = window.navigator.onLine ? 'Online' : 'OFFline'
        window.addEventListener('online', () => {
            statusDisplay.textContent = "Online"
            this.accountService.SetIsOnline(true);
        });
        window.addEventListener('offline', () => {
            statusDisplay.textContent = "OFFline";
            this.accountService.SetIsOnline(false);
        });
    }


    logout() {
        this.accountService.logout();
    }
}