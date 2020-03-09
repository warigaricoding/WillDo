import { Component, OnInit } from '@angular/core';

import { GroupService } from './groups.service'; // this service handles all the group-related server communications for us
import { Group } from './group-class';

@Component({
	selector: 'group-list',
	template: `
		<ion-item button routerLink="/groups">
			<ion-icon name="add"></ion-icon>
			<ion-label>
				&nbsp;
				Create a new group...
			</ion-label>
		</ion-item>
		<ion-item button [routerLink]="[ '/groups', group.id ]" *ngFor="let group of groups">
			{{ group.displayName }}
		</ion-item>
	`
})
export class GroupListComponent implements OnInit {

	groups: Group[];

	constructor(private groupService: GroupService) { }

	ngOnInit() {
		this.groups= [ new Group(0, "hey") ]; // fake group
		// this.update();
	}

	update() {
		// ask the GroupService to update the list of groups
		this.groupService.getAll()
						.subscribe( groups => this.groups= groups );
						// replace the old group list with the new the new group list from the server (after we receive it)
	}
}
