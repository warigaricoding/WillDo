import { Component, OnInit, Input } from '@angular/core';

import { UserService } from './users.service';
import { User } from './user-class';
import { AuthService } from '../core/auth.service';

@Component({
	selector: 'user-management',
	template: `
		<ion-card>
			<ion-card-header>
				<ion-card-title class="ion-text-center">
					<span [hidden]="advanced">Log In</span>
					<span [hidden]="!advanced">Sign Up</span>
				</ion-card-title>

			</ion-card-header>
			<ion-card-content>

				<ion-item [hidden]="!advanced">
					<ion-label>Display Name:</ion-label>
					<ion-input [(ngModel)]="user.displayName"></ion-input>
				</ion-item>
				<ion-item>
					<ion-label>Username:</ion-label>
					<ion-input [(ngModel)]="user.username"></ion-input>
				</ion-item>
				<ion-item>
					<ion-label>Password:</ion-label>
					<ion-input [(ngModel)]="user['password']" type="password"></ion-input>
				</ion-item>
		
				<ion-item [hidden]="!!user.id">
					<ion-label>Sign Up</ion-label>
					<ion-checkbox [(ngModel)]="advanced"></ion-checkbox>
				</ion-item>

			</ion-card-content>

			<ion-toolbar style="position:absolute;bottom:0px">
					<ion-buttons slot="end">
						<ion-button (click)="onCancel()">Cancel</ion-button>
						<ion-button type="submit" [disabled]="!isValid()" (click)="onSubmit()">
							Submit
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
	authService: AuthService;

	/** whether to show controls for signing up or editing the user */
	advanced: boolean;

 	constructor(
		protected userService: UserService
	) {}

	// component is ready!
	ngOnInit()
	{
		if ( ! this.user )
			this.user= new User();
	}

	onSubmit() {
		if ( this.advanced )
			this.userService.add(this.user)
				.subscribe( user => this.authService.updateState(user) );
		else this.userService.get(null, { _username: this.user.username, Authorization: "Basic " + btoa(this.user.username + ':' + this.user['password']) })
				 .subscribe( user => this.authService.updateState(user) );
	}

	onCancel() {
		this.authService.cancelLogin();
	}

	isValid() {

		if ( ! this.user.username )
			return false;
		if ( ! this.user['password'] )
			return false;

		if ( this.advanced && ! this.user.displayName )
			return false;

		return true;
	}

}
