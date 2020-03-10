import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { GroupService } from './groups.service'; // this service handles all the group-related server communications for us
import { Group } from './group-class';


@Component({
	selector: 'group-list',
	template: `
		<ion-item [routerLink]="{ outlets: { g: [ '' ] } }">
			<ion-icon name="add"></ion-icon>
			<ion-label>
				&nbsp;
				Create a new group...
			</ion-label>
		</ion-item>
		<ion-item *ngFor="let group of groups">
			<a [class]="'groupLink '+getClassState(group.id)" [routerLink]="[ '/group', group.id ]">
				{{ group.displayName }}
				&nbsp;
			</a>
			<a [class]="getClassState(group.id)" [routerLink]="{ outlets: { g: [ group.id ] } }" slot="end">
				<ion-icon name="create"></ion-icon>
			</a>
		</ion-item>
		<router-outlet name="g">
		</router-outlet>
	`,
	styles: [`
		a.groupLink {
			text-decoration: none;
			width: 100%;
		}
		a.groupUnselected {
			color: var(--ion-text-color) !important
		}
	`]
})
export class GroupListComponent implements OnInit {

	groups: Group[];
	currentGroupId: string;

	constructor(private groupService: GroupService, private activatedRoute: ActivatedRoute, private location: Location) { }

	ngOnInit() {
		this.update();
		this.location.onUrlChange( ()=> this.update() );
	}

	update() {
		// ask the GroupService to update the list of groups
		this.groupService.getAll()
						.subscribe( groups => this.groups= groups );
						// replace the old group list with the new the new group list from the server (after we receive it)
	}

	getClassState( groupId: string ): string {
		if ( groupId !== this.activatedRoute.firstChild.snapshot.paramMap.get('groupId') )
			return 'groupUnselected';
		else return "";
	}

}
