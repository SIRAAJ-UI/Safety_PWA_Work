import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
            let users = (JSON.parse(localStorage.getItem('user')));
            const { Token } = users;
            this.isLoggedIn = true;
            this.AssignedReportUrl = `https://ljasafety.com/safetyadmin/#/login/1/${this.user.UserProfileId}/${Token}`;
            this.ReportedReportUrl = `https://ljasafety.com/safetyadmin/#/login/2/${this.user.UserProfileId}/${Token}`;
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
