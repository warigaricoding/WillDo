import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { UserService } from './users.service';
import { User } from './user-class';

@Component({
	selector: 'user-list',
	template: `
		<ion-chip *ngFor="let user of children; trackBy: trackById">
			<user-compact editable showName [user]="user">
			</user-compact>
			<ion-icon name="close-circle" (click)="remove(user)"></ion-icon>
		</ion-chip>
		<ion-chip>
			<user-compact editable>
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
	children: User[];

	@Output()
	childrenChange= new EventEmitter<User[]>();

 	constructor(
		protected userService: UserService
	) {}

	// component is ready!
	ngOnInit()
	{
	}

	update() {
		this.childrenChange.emit(this.children);
	}

	remove(user: User) {
		this.children.splice(this.children.indexOf(user), 1);
		this.update();
	}

	/** returns what makes each item unique to prevent UI repainting when new data is received */
	trackById(index: number, item: User): string
	{
		return item.id;
	}
}