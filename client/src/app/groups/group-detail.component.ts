import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { GroupService } from './groups.service';
import { Group } from './group-class';

@Component({
	selector: 'group-detail',
	template: `
		<ion-card>

			<ion-card-header>
				<ion-card-title class="ion-text-center">
					<ion-input [(ngModel)]="group.displayName" placeholder="[enter group name]"></ion-input>
				</ion-card-title>
			</ion-card-header>

			<ion-card-content>

				<!--ion-item>
					<ion-label>Members:</ion-label>
				</ion-item-->
					
			</ion-card-content>
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

 	constructor(
		protected groupService: GroupService,
		private activatedRoute: ActivatedRoute
	) {}

	// component is ready!
	ngOnInit()
	{
		// get the group's id from the current url
		var groupId= this.activatedRoute.snapshot.paramMap.get('id') || this.activatedRoute.firstChild.snapshot.paramMap.get('id');

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
	
}
