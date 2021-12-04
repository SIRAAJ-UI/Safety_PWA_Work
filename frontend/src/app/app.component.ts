import { Component, OnInit, ViewChild } from '@angular/core';
import { AccountService } from './_services';
import { User } from './_models';
import { ConnectionService } from 'ng-connection-service';


@Component({ selector: 'app', templateUrl: 'app.component.html' })
export class AppComponent implements OnInit {
    user: User;
    public isOnline: boolean = true;
    hasNetworkConnection: boolean;
    hasInternetAccess: boolean;

    constructor(private accountService: AccountService, private connectionService: ConnectionService) {
        this.accountService.user.subscribe(x => this.user = x);
        this.connectionService.monitor().subscribe((currentState: any) => {
            this.hasNetworkConnection = currentState;
            this.hasInternetAccess = currentState;
            if (this.hasNetworkConnection && this.hasInternetAccess) {
                this.isOnline = true;
            } else {
                this.isOnline = false;
            }
        });
    }

    ngOnInit() {
    }

    logout() {
        this.accountService.logout();
    }
}