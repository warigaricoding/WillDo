import { Injectable } from '@angular/core';
import { HttpEvent, HttpRequest, HttpHandler, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserService } from '../users/users.service';

/** In the future, this class could show the login component when needed */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
	constructor(private userService: UserService) {
		// AuthService can use UserService even with Basic HTTP Authentication
			// i.e. using userService.get(null, {headers}) to login
	}

	get isLoggedIn(): boolean
	{
		return this.userService.get() != null;
		// this approach can be used regardless of the server's method of authentication
			// whether it uses basic HTTP auth or JSON web tokens
	}
}

// ssshh, this class doesn't exist
	// it would likely only be neccessary for implementing JSON web tokens
class AuthInterceptor implements HttpInterceptor {

	constructor(private auth: AuthService) {

	}

	intercept(req: HttpRequest<any>, next: HttpHandler): Observable< HttpEvent<any> >
	{
		// ToDo: use AuthService to handle client authentication checks
		return next.handle(req); // this currently sends the request on its way without changing it
	}

}

export const AuthProvider= { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true };
	// `AuthProvider` should go in app.module.ts's @NgModule providers array