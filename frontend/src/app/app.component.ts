import { Component, OnInit, ViewChild } from '@angular/core';
import { AccountService } from './_services';
import { User } from './_models';
import { ConnectionService } from 'ng-connection-service';
import IdleTimer from "./IdleTimer";


@Component({ selector: 'app', templateUrl: 'app.component.html' })
export class AppComponent implements OnInit {
    user: User;
    public isOnline: boolean = window.navigator.onLine;
    hasNetworkConnection: boolean;
    hasInternetAccess: boolean;
    private timer: IdleTimer;

    constructor(private accountService: AccountService, private connectionService: ConnectionService) {
        this.accountService.user.subscribe(x => this.user = x);

    }


    ngOnInit() {
        this.connectionService.monitor().subscribe((currentState: any) => {
            this.hasNetworkConnection = currentState;
            this.hasInternetAccess = currentState;
            if (this.hasNetworkConnection && this.hasInternetAccess) {
                this.isOnline = true;
                this.accountService.SetIsOnline(true);
            } else {
                this.isOnline = false;
                this.accountService.SetIsOnline(false);
            }
        });
        this.accountService.SetIsOnline(this.isOnline);
        this.timer = new IdleTimer({
            timeout: 60*30, //expired after 10 secs
            onTimeout: () => {
                this.accountService.logout();
            }
        });
    }


    ngOnDestroy() {
        this.timer.clear();
    }
    logout() {
        this.accountService.logout();
    }
}