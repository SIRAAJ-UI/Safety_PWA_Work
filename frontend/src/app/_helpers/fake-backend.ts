import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';

// array in local storage for registered users
let users = JSON.parse(localStorage.getItem('users')) || [];

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const { url, method, headers, body } = request;

        // wrap in delayed observable to simulate server api call
        return of(null)
            .pipe(mergeMap(handleRoute))
            .pipe(materialize()) // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
            .pipe(delay(500))
            .pipe(dematerialize());

        function handleRoute() {
            switch (true) {
                case url.endsWith('/users/authenticate') && method === 'POST':
                    return authenticate();
                case url.endsWith('/users/register') && method === 'POST':
                    return register();
                case url.endsWith('/users') && method === 'GET':
                    return getUsers();
                // case url.endsWith('/GetReportType') && method === 'GET':
                //     return GetReportType();
                case url.endsWith('/GetClass') && method === 'GET':
                    return GetClass();
                case url.endsWith('/GetReportedBy') && method === 'GET':
                    return GetReportedBy();
                case url.endsWith('/GetAreaLine') && method === 'GET':
                    return GetAreaLine();
                case url.endsWith('/GetMachine') && method === 'GET':
                    return GetMachine();
                case url.endsWith('/GetUnsafeDoneBy') && method === 'GET':
                    return GetUnsafeDoneBy();
                case url.match(/\/users\/\d+$/) && method === 'GET':
                    return getUserById();
                case url.match(/\/users\/\d+$/) && method === 'PUT':
                    return updateUser();
                case url.match(/\/users\/\d+$/) && method === 'DELETE':
                    return deleteUser();
                default:
                    // pass through any requests not handled above
                    return next.handle(request);
            }
        }

        // route functions

        function authenticate() {
            const { username, password } = body;
            const user = users.find(x => x.username === username && x.password === password);
            if (!user) return error('Username or password is incorrect');
            return ok({
                id: user.id,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                token: 'fake-jwt-token'
            })
        }

        function register() {
            const user = body

            if (users.find(x => x.username === user.username)) {
                return error('Username "' + user.username + '" is already taken')
            }

            user.id = users.length ? Math.max(...users.map(x => x.id)) + 1 : 1;
            users.push(user);
            localStorage.setItem('users', JSON.stringify(users));
            return ok();
        }

        function getUsers() {
            if (!isLoggedIn()) return unauthorized();
            return ok(users);
        }

        function GetReportType() {
            return ok([
                { ReportId: "UA0001", "ReportType": "Unsafe Act" },
                { ReportId: "UC0001", "ReportType": "Unsafe Conditions" },
                { ReportId: "NM0001", "ReportType": "Nearmiss" },
                { ReportId: "EUA0001", "ReportType": "Environment Unsafe Act" },
                { ReportId: "EUC0001", "ReportType": "Environment Unsafe Condition" },
                { ReportId: "RT0001", "ReportType": "Red Tag" }
            ])
        }
        function GetClass() {
            return ok([
                { ClassId: "UA0001", "ClassType": "Class 1" },
                { ClassId: "UC0001", "ClassType": "Class 2" },
                { ClassId: "NM0001", "ClassType": "Class 3" },
                { ClassId: "EUA0001", "ClassType": "Class 4" },
                { ClassId: "EUC0001", "ClassType": "Class 5" },
                { ClassId: "RT0001", "ClassType": "Class 6" }
            ])
        }
        function GetReportedBy() {
            return ok([
                { Id: 1, "name": "Shanoop" },
                { Id: 2, "name": "Mannan" },
                { Id: 3, "name": "Philip" },
                { Id: 4, "name": "Sridharan" },
            ])
        }

        function GetAreaLine() {
            return ok([
                { Id: 1, "area": "area 1", "line": "line 1" },
                { Id: 2, "area": "area 2", "line": "line 2" },
                { Id: 3, "area": "area 3", "line": "line 3" },
                { Id: 4, "area": "area 4", "line": "line 4" },
            ])
        }

        function GetMachine() {
            return ok([
                { Id: 1, "name": "Machine 1" },
                { Id: 2, "name": "Machine 2" },
                { Id: 3, "name": "Machine 3" },
                { Id: 4, "name": "Machine 4" },
            ])
        }
        function GetUnsafeDoneBy() {
            return ok([
                { Id: 1, "name": "Shanoop" },
                { Id: 2, "name": "Mannan" },
                { Id: 3, "name": "Philip" },
                { Id: 4, "name": "Sridharan" },
            ])
        }





        function getUserById() {
            if (!isLoggedIn()) return unauthorized();

            const user = users.find(x => x.id === idFromUrl());
            return ok(user);
        }

        function updateUser() {
            if (!isLoggedIn()) return unauthorized();

            let params = body;
            let user = users.find(x => x.id === idFromUrl());

            // only update password if entered
            if (!params.password) {
                delete params.password;
            }

            // update and save user
            Object.assign(user, params);
            localStorage.setItem('users', JSON.stringify(users));

            return ok();
        }

        function deleteUser() {
            if (!isLoggedIn()) return unauthorized();

            users = users.filter(x => x.id !== idFromUrl());
            localStorage.setItem('users', JSON.stringify(users));
            return ok();
        }

        // helper functions

        function ok(body?) {
            return of(new HttpResponse({ status: 200, body }))
        }

        function error(message) {
            return throwError({ error: { message } });
        }

        function unauthorized() {
            return throwError({ status: 401, error: { message: 'Unauthorised' } });
        }

        function isLoggedIn() {
            return headers.get('Authorization') === 'Bearer fake-jwt-token';
        }

        function idFromUrl() {
            const urlParts = url.split('/');
            return parseInt(urlParts[urlParts.length - 1]);
        }
    }
}

export const fakeBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};