import { Injectable } from '@angular/core';
import { HttpEvent, HttpRequest, HttpHandler, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable } from 'rxjs';

/** In the future, this class could show the login component when needed */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor() { }
}

// ssshh, this class doesn't exist
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
	// this should go in app.module.ts's @NgModule providers array