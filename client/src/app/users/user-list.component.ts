import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { UserService } from './users.service';

@Component({
	selector: 'user-list',
	template: `
		<ion-chip *ngFor="let userId of children">
			<user-compact editable showName [(id)]="userId">
			</user-compact>
			<ion-icon name="close-circle" (click)="remove(userId)"></ion-icon>
		</ion-chip>
		<ion-chip>
			<user-compact editable (idChange)="add($event)">
			</user-compact>
		</ion-chip>
	`,
	styles: [`
		ion-icon {
			padding: 8px
		}
	`]
})
export class UserListComponent implements OnInit
{
	@Input()
	children: string[];

	@Output()
	childrenChange= new EventEmitter<string[]>();

 	constructor(
		protected userService: UserService
	) {}

	// component is ready!
	ngOnInit()
	{
		if ( ! this.children )
			this.children= [];
	}

	update() {
		this.childrenChange.emit(this.children);
	}

	add(userId: string) {
		if ( ! this.children )
			this.children= [];
		if ( ! this.children.includes(userId) )
			this.children.push(userId);
		this.update();
	}	

	remove(userId: string) {
		this.children.splice(this.children.indexOf(userId), 1);
		this.update();
	}
}