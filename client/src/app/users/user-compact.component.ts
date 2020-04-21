import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { IonInput } from '@ionic/angular';

import { UserService } from './users.service';
import { User } from './user-class';
import { interval } from 'rxjs';

@Component({
	selector: 'user-compact',
	template: `
		<div [hidden]="edit" (click)="onClick()" style="padding:8px 0">
			<ion-icon name="contact" [hidden]="showIconState!=1"></ion-icon>
			<ion-text [ngStyle]="getTextStyle()" [title]="user.displayName" [hidden]="showIconState!=2">
				{{ getInitials() }}
			</ion-text>
			<ion-avatar [title]="showName?'':user.displayName" [hidden]="showIconState!=3">
				<ion-img [src]="user.avatar"></ion-img>
			</ion-avatar>
			<ion-label [hidden]="!showName">
				{{ user.displayName }}
			</ion-label>
		</div>
		<ion-input #userInput placeholder="enter a username" [hidden]="!edit" [(ngModel)]="user.username" (ionBlur)="onBlur()" (keyup.enter)="onBlur()">
		</ion-input>
	`,
	styles: [`
		ion-text {
			border-radius: 50%;
			height: 2em;
			width: 2em;
			line-height: 2em;
			display: inline-block;
		}
		ion-icon {
			font-size: 1.5em;
		}
		ion-avatar {
			background-color: #F00
		}
	`]
})
export class UserCompactComponent implements OnInit
{
	@Input()
	showIcon;

	@Input()
	showName= false; // default input value

	@Input()
	user: User;

	@Input()
	id: string;

	@Input()
	editable: boolean;

	edit: boolean;

	@ViewChild("userInput", { static: true })
	userInput: IonInput;

 	constructor(
		protected userService: UserService
	) {}

	// component is ready!
	ngOnInit()
	{

		// html considers an empty string to be `true` like any other string
		if ( this.showIcon === "" )
			this.showIcon= true;
		if ( typeof this.showName === "string" )
			this.showName= true;
		if ( typeof this.editable === "string" )
			this.editable= true;

		if ( ! this.user )
		{
			this.user= new User();
			if ( this.editable )
				this.edit= true;
			else {
				 this.userService.get(this.id).subscribe( user => user && ( this.user= user ) );
				 if ( !this.id)
				 	interval(500).subscribe( () => this.userService.get().subscribe( user => user && ( this.user= user ) ) );
			}
		}
	}

	onClick() {
		if ( this.editable )
			this.edit= true,
			this.userInput.setFocus();
	}

	onBlur() {
		this.userService.getByName(this.user.username)
			.subscribe( user => { if ( user ) { this.edit= false; this.user= user; } } );
	}

	/** generate the user's initials from their display name */
	getInitials(): string
	{
		if ( this.user )
		{
			let name= this.user.displayName;
			if ( name )
				return name.replace(/^\s*(\S)(?:.*?(\S)\S*\s*|.*)$/, "$1$2");
		}
		return "";
	}

	/** use the user's initials to generate their color and background-color */
	getTextStyle() {
		let initials= this.getInitials(),
			shortA= initials.charCodeAt(0) || 0,
			shortB= initials.charCodeAt(1) || 0,
			colorCode=
				( shortB & 0x3F ) << 16
				 |
				( shortB & 0xC0 ) << 5
				 |
				( shortA & 0x07 ) << 8
				 |
				shortA >> 3  &  0x1F
			; // generate text color based on the initials
		return {
			"color": "#" + colorCode.toString(16),
			"background-color": "#" + ( 0xFFFFFF - colorCode ).toString(16)
		};
	}

	get showIconState(): number
	{
		if (  ! this.user  ||  ! this.showIcon && this.showIcon != null  )
			return 0; // don't show anything
		else if ( this.user.avatar )
			return 3; // show the user's avatar
		else if ( ! this.showName )
			return 2; // show the user's initials
		else if ( this.showIcon != null )
			return 1; // show the generic user icon
		else return 0;
	}
}