import { ThrowStmt } from '@angular/compiler';
import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Route, Router } from '@angular/router';
import { AccountService } from '@app/_services';
import { ConnectionService } from 'ng-connection-service';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

    user: any;
    isLoggedIn: boolean = false;
    AssignedReportUrl: string = "";
    ReportedReportUrl: string = "";
    Subscriptions:any[] = [];
    public isOnline: boolean = window.navigator.onLine;
    hasNetworkConnection: boolean;
    hasInternetAccess: boolean;
    public showmenu: boolean = false;
    
    constructor(private accountService: AccountService, private router: Router,private connectionService: ConnectionService) {
      
    }

    ngOnInit() {
        this.Subscriptions.push(
            this.accountService.IsActivate.subscribe( (isLoggedIn: boolean) => {
                this.isLoggedIn = isLoggedIn;
            })
          )
        this.accountService.user.subscribe((x:any) => {
            this.user = x;
            if(x === null){
                return false;
            }
            if(x){
                const { ErrorMessage } = x;
                if(ErrorMessage !== null){
                    this.isLoggedIn = false;
                    return false;
                }
            }
           
            this.isLoggedIn = true;
            this.AssignedReportUrl = `https://ljasafety.com/safetyadmin/#/reports/${this.user?.UserName}`;
            this.ReportedReportUrl = `https://ljasafety.com/safetyadmin/#/reportsreported/${this.user?.UserName}`;
        });
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

   
    ShowHideMenu() {
        this.showmenu = !this.showmenu;
    }
}
