import { Injectable } from '@angular/core';
import { HttpEvent, HttpRequest, HttpHandler, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { first } from 'rxjs/operators';
import { CanActivate } from '@angular/router';
import { ModalController } from '@ionic/angular';

import { UserService } from '../users/users.service';
import { User } from '../users/user-class';
import { UserManagementComponent } from '../users/user-management.component';

/** In the future, this class could show the login component when needed */
@Injectable({
  providedIn: 'root'
})
export class AuthService implements CanActivate {
	private currentUser: User;
	private userId_observable= new Subject<string>();
	private modal: HTMLIonModalElement;

	constructor(private userService: UserService, private modalController: ModalController) {
		// AuthService can use UserService even with Basic HTTP Authentication
			// i.e. using userService.get(null, {headers}) to login
	}

	get isLoggedIn(): boolean
	{
		return this.currentUser != null
				&&  typeof this.currentUser.id == "string"  &&  !! this.currentUser.id
			;
	}

	canActivate(): boolean
	{
		if ( this.isLoggedIn )
			return true;
		else {
			if ( this.currentUser == null )
				this.userService.get().subscribe( user => this.updateState(user), () => this.showLogin() );
			else this.showLogin();
			return false;
		}
		// this approach can be used regardless of the server's method of authentication
			// whether it uses basic HTTP auth or JSON web tokens
	}

	getId(): Promise<string>
	{
		if ( this.canActivate() )
			return Promise.resolve( this.currentUser.id );
		else return this.userId_observable.pipe( first() ).toPromise(); // returns the user id the first time we recieve it
	}
	
	/** when the server returns with the current user */
	public updateState(user: User): void
	{
		if ( this.modal )
			this.modal.dismiss();
		this.currentUser= user;
		if ( ! this.isLoggedIn )
			this.showLogin();
		else this.userId_observable.next(user.id); // notifies subscribers of the new user id
	}

	private async showLogin()
	{
		if ( this.modal )
			return ;
		this.modal= await this.modalController
						 .create( { component: UserManagementComponent, componentProps: { user: this.currentUser, authService: this } });
		this.modal.present(); // show the login view
	}

	public cancelLogin()
	{
		if ( this.modal )
			this.modal.dismiss();
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