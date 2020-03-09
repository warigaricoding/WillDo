import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { GroupService } from './groups.service';
import { Group } from './group-class';

@Component({
	selector: 'group-detail',
	template: `
		<ion-header>
			<ion-title class="ion-text-center">
				<ion-input [(ngModel)]="group.displayName" placeholder="[enter group name]" name="name"></ion-input>
			</ion-title>
		</ion-header>

		<ion-content>

			<ion-item>
				<ion-label>Members:</ion-label>
			</ion-item>

		</ion-content>

		<ion-footer>
			<ion-toolbar>
				<ion-buttons slot="end">
					<ion-button [routerLink]="{ outlets: { g: null } }">Cancel</ion-button>
					<ion-button type="submit" [disabled]="!group.isValid()" [routerLink]="{ outlets: { g: null } }" (click)="onSubmit()">Submit</ion-button>	
				</ion-buttons>
			</ion-toolbar>
		</ion-footer>
	`
})
export class GroupDetailComponent implements OnInit
{
	group: Group;

	@Input()
	activatedRoute;

 	constructor(
		protected groupService: GroupService,
		private router: Router
	) {}

	// component is ready!
	ngOnInit()
	{
		// get the group's id from the current url
		
		var groupId= GroupService.getFromRoute(this.activatedRoute, 'groupId');

		// create a new group if one has not been given
		if ( ! groupId )
			this.group= new Group();
		else {
			this.group= new Group(groupId);
			this.groupService.get(groupId)
							.subscribe(
								group => {
									this.group= group;
								}
							);
		}
	}

	onSubmit() {
		if ( this.group.isValid() )
			this.group.push(this.groupService)
					.subscribe(
						group => {
							this.router.navigate([{outlets:{g:[]}}]);
						}
					);
	}
	
}
