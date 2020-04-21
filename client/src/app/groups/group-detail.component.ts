import { Component, OnInit, Input } from '@angular/core';
import { Router, ParamMap } from '@angular/router';

import { GroupService } from './groups.service';
import { Group } from './group-class';

@Component({
	selector: 'group-detail',
	template: `
		<ion-card>
		
			<ion-card-header>
				<ion-title class="ion-text-center">
					<ion-input [(ngModel)]="group.displayName" placeholder="[enter group name]"></ion-input>
				</ion-title>
			</ion-card-header>

			<ion-card-content>

				<ion-item>
					<ion-label>Members:</ion-label>
					<user-list [(children)]="group.members">
					</user-list>
				</ion-item>

			</ion-card-content>

			<ion-toolbar style="position:absolute;bottom:0px">
				<ion-buttons slot="end">
					<ion-button [routerLink]="{ outlets: { g: null } }">Cancel</ion-button>
					<!-- since group-detail is in the 'g' outlet, navigating to null closes the view --> 
					<ion-button type="submit" [disabled]="!group.isValid()" [routerLink]="{ outlets: { g: null } }" (click)="onSubmit()">
						{{ group.id ?  'Update' : 'Create' }}
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
export class GroupDetailComponent implements OnInit
{
	group: Group;

	@Input()
	paramMap: ParamMap;

 	constructor(
		protected groupService: GroupService,
		private router: Router
	) {}

	// component is ready!
	ngOnInit()
	{
		// get the group's id from the current url
		var groupId= this.paramMap.get('groupId');

		// create a new group if one has not been given
		if ( ! groupId )
			this.group= new Group();
		else {
			this.group= new Group(groupId);
			this.groupService.get(groupId)
							.subscribe(
								group => {
									this.group= group; // updates the UI with the group from the server
								}
							); // subscribe a service's observable or nothing happens
		}
	}

	onSubmit() {
		if ( this.group.isValid() )
			this.group.pushChanges(this.groupService);
	}
	
}
