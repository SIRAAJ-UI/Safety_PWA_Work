import { Component, OnInit } from '@angular/core';
import { User } from '@app/_models';
import { AccountService } from '@app/_services';
import { ConnectionService } from 'ng-connection-service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  user: any;
  AssignedReportUrl: string = "";
  ReportedReportUrl: string = "";

    public isOnline: boolean = window.navigator.onLine;
    hasNetworkConnection: boolean;
    hasInternetAccess: boolean;
    constructor(private accountService: AccountService, private connectionService: ConnectionService) {
        this.accountService.user.subscribe(x => {
            this.user = x;
            this.AssignedReportUrl = `https://ljasafety.com/safetyadmin/#/reports/${this.user?.UserName}`;
            this.ReportedReportUrl = `https://ljasafety.com/safetyadmin/#/reportsreported/${this.user?.UserName}`;
        });
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
    }

    logout() {
        this.accountService.logout();
    }

}
