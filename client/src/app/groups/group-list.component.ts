import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
		<ion-item *ngFor="let group of groups"><!-- *ngFor repeats the element for each item in the array (groups) -->
			<a [class]="'groupLink '+getClassState(group.id)" [routerLink]="[ '/group', group.id ]">
				<!-- where 'x' is an element's property i.e. every element in angular can have a 'routerLink'
				     [x] denotes model -> view binding, where javascript is the input and the view is the output
				     (x) denotes view -> model binding, where the view triggers an event handled by javascript
				     [(x)] denotes two-way binding, where the view and model are kept in sync -->
				{{ group.displayName }}
				<!-- {{ x }} is used outside of <> tags to evaluate javascript expressions -->
				&nbsp;
			</a>
			<a [class]="getClassState(group.id)" [routerLink]="{ outlets: { g: [ group.id ] } }" slot="end">
				<ion-icon name="create"><!--our group edit icon--></ion-icon>
			</a>
		</ion-item>
		<router-outlet name="g">
			<!-- the 'group-detail' component is put here by the router when the user clicks the edit icon -->
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

	constructor(private groupService: GroupService, private activatedRoute: ActivatedRoute, private location: Location) { }

	// component is ready!
	ngOnInit() {
		this.update();
		this.location.onUrlChange( ()=> this.update() ); // only update groups when the user navigates the app
	}

	/** asks the GroupService to update the list of groups */
	update() {
		this.groupService.getAll()
						.subscribe( groups => this.groups= groups );
						// replace the UI's list with the new list of groups from the server (after we receive it)
	}

	/** used by each row in the list to determine its CSS properties */
	getClassState( groupId: string ): string {
		const selectedGroup: string =  this.activatedRoute.firstChild.snapshot.paramMap.get('groupId');
										// what a mouthful this is for simply getting the current groupId given to the TaskListComponent

		if ( groupId !== selectedGroup )
			return 'groupUnselected'; // causes groups that aren't selected to have the default text color
		else return ""; // highlights the current group
	}

}
