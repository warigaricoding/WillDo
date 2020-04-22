import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';

import { UserService } from './users.service';
import { User } from './user-class';
import { AuthService } from '../core/auth.service';

@Component({
	selector: 'user-management',
	template: `
		<ion-card (keyup.enter)="isValid() && onSubmit()">

			<ion-card-header>
				<ion-card-title class="ion-text-center">
					<span [hidden]="advanced">Sign In</span>
					<span [hidden]="!advanced || user.id">Sign Up</span>
					<span [hidden]="!user.id">User Profile</span>
				</ion-card-title>
			</ion-card-header>

			<ion-card-content>

				<ion-item [hidden]="!advanced">
					<ion-label>Display Name:</ion-label>
					<ion-input [(ngModel)]="user.displayName" required="true"></ion-input>
				</ion-item>
				<ion-item>
					<ion-label>Username:</ion-label>
					<ion-input [(ngModel)]="user.username" required="true" autofocus="true" autocomplete="true" inputmode="email"></ion-input>
				</ion-item>
				<ion-item>
					<ion-label>Password:</ion-label>
					<ion-input [(ngModel)]="user['password']" required="true" clearOnEdit="false" autocomplete="true" type="password"></ion-input>
				</ion-item>

				<ion-item [hidden]="!user.id">
					<ion-label>Change Password:</ion-label>
					<ion-input [(ngModel)]="user['password2']" type="password" clearOnEdit="false"></ion-input>
				</ion-item>

				<ion-item [hidden]="!advanced">
					<ion-label>Confirm Password:</ion-label>
					<ion-input [(ngModel)]="confirmPassword" type="password" clearOnEdit="false" [pattern]="newPasswordRegEx" required="true"></ion-input>
				</ion-item>
		
				<ion-item [hidden]="!!user.id">
					<ion-label>Sign Up</ion-label>
					<ion-checkbox [(ngModel)]="advanced"></ion-checkbox>
				</ion-item>

			</ion-card-content>

			<ion-toolbar style="position:absolute;bottom:0px">
			
					<ion-buttons slot="end">
						<ion-button (click)="onCancel()">Cancel</ion-button>
						<!--ion-button [hidden]="!user.id">Sign Out</ion-button-->
						<ion-button type="submit" [disabled]="!isValid()" (click)="onSubmit()" fill="outline">
							{{ user.id ?  'Update Account'  :  advanced ?  'Create Account' : 'Sign In' }}
						</ion-button>	
					</ion-buttons>
			</ion-toolbar>
		</ion-card>
	`,
	styles: [`
		ion-card {
			margin: 0;
			width: 100%;
			height: 100%;
		}
	`]
})
export class UserManagementComponent implements OnInit
{
	@Input()
	user: User;

	@Input()
	parentRoute: ActivatedRoute

	/** whether to show controls for signing up or editing the user */
	advanced: boolean;
	confirmPassword: string;
	get newPasswordRegEx(): string {
		return ( this.user[ this.user.id ?  "password2" : "password" ] || "" ).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	}

 	constructor(
		protected userService: UserService,
		protected authService: AuthService,
		protected router: Router
	) {}

	// component is ready!
	ngOnInit()
	{
		this.user= Object.assign(new User(), this.user); // make a copy of any user object we're given
		if ( this.authService.isLoggedIn )
			if ( this.user.id )
				this.advanced= true;
			else this.userService.get()
					.subscribe( user => this.onRequestReturn(user) );
	}

	onRequestReturn(user: User) {
		if ( user && user.id )
			Object.assign(this.user, user),
			this.advanced= true;
	}

	onSubmit() {
		if ( this.advanced )
			this.userService.add(this.user)
				.subscribe( user => this.onSubmitSuccess(user), this.onSubmitError );
		else this.userService.get(null, { _username: this.user.username, Authorization: "Basic " + btoa(this.user.username + ':' + this.user['password']) })
				.subscribe( user => this.onSubmitSuccess(user), this.onSubmitError );
	}

	onSubmitSuccess(user: User)
	{
		if ( ! user )
			return this.onSubmitError();
		this.authService.hideLogin() || this.close();
		this.authService.updateState(user);
	}

	onSubmitError(e?)
	{
		window.alert("There was an error with your Username/Password combination. Please try again.");
	}

	onCancel() {
		this.authService.hideLogin() || this.close();
	}
	

	isValid() {

		if ( ! this.user.username )
			return false;
		if ( ! this.user['password'] )
			return false;

		if ( this.advanced && ! this.user.displayName )
			return false;
			
		if ( this.user.id )
			return this.user['password2'] == this.confirmPassword;
		else if ( this.advanced )
			return this.user['password'] == this.confirmPassword;
		else return true;
	}

	close() {
		this.router.navigate(['.'], { relativeTo: this.parentRoute });
	}

}
