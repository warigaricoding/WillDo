import { Component } from '@angular/core';
import { Router, ActivatedRoute, Route } from '@angular/router';

/** the root of angular's component heirachy, displaying the entire application */
@Component({
	selector: 'app-root',
	template: `
		<ion-header>
			<ion-toolbar>
				<ion-buttons slot="start">
					<ion-menu-button></ion-menu-button>
					<ion-back-button></ion-back-button>
				</ion-buttons>
				<ion-title routerLink="/">WillDo</ion-title>
				<ion-buttons slot="end">
					<ion-button class="profile" (click)="goToProfile()">
						<user-compact showIcon showName></user-compact>
					</ion-button>
				</ion-buttons>
			</ion-toolbar>
		</ion-header>
		<ion-split-pane when="md" contentId="mainView">
			<ion-menu contentId="mainView">
				<group-list>
						<!-- * * * * * * * * * * * * * * * * * * * * * * * * * * * -->
						<!-- 'group-list' is a menu of groups for the current user -->
						<!--    (  see  'app/groups/group-list.component.ts'  )    -->
						<!-- * * * * * * * * * * * * * * * * * * * * * * * * * * * -->
				</group-list>
			</ion-menu>
			<ion-content id="mainView">
				<!-- Note: ion-content creates the main, scrollable view of the application -->

				<router-outlet>
					<!-- this router outlet switches between groups -->
					
					<!--task-list>
						< !-- * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * -- >
						< !-- 'task-list' is list of tasks in any kind of context i.e. different groups -- >
						< !--               (  see  'app/tasks/task-list.component.ts'  )               -- >
						< !-- * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * -- >
					</task-list-->
				</router-outlet>			

			</ion-content>
		</ion-split-pane>
	`,
	styles: [`
		ion-split-pane {
			margin-top: 56px;
		}
		.profile {
			margin-right: 20px
		}
	`]
})
export class AppComponent
{
	title= 'WillDo';

	constructor(
		private router: Router,
		private rootRoute: ActivatedRoute
	) {
	}

	goToProfile() {
		this.router.navigate(['profile'], { relativeTo: this.rootRoute.firstChild || this.rootRoute });
	}
}



import { Subject } from 'rxjs';
import { first } from 'rxjs/operators';
import { Type } from '@angular/core';
import { Location } from '@angular/common';
import { PopoverController, ModalController } from '@ionic/angular';
/** Loads the given component in a context most friendly for the current screen */
@Component({template:``})
export class DynamicView
{
	constructor(
		private location: Location,
		private modalController: ModalController,
		private activatedRoute: ActivatedRoute
	)
	{
		this.initLocation();
		this.showInModal(activatedRoute.snapshot.data.baseComponent);
	}

	private async showInModal(component: Type<any>)
	{
		let modal= await this.modalController
				   .create( { component: component, componentProps: { paramMap: this.activatedRoute.snapshot.paramMap, parentRoute: this.activatedRoute.parent } } );
		modal.present(); // show the modal
		modal.onWillDismiss().then( (e) => e.role == 'url' || this.location.back() ); // go backwards when the view is closed
		DynamicView.onLocationChange().then( () => modal.dismiss(modal, 'url') ); // closes the modal when the current URL changes
	}

	/** returns a Route configuration for mapping the given URL to the given component in a dynamic context */
	public static createRoute(path: string, baseComponent: Type<any>, outlet?: string, pathMatch?: string): Route {
		// used in app.module.ts
		return {
			path: path,
			component: DynamicView,
			data: { baseComponent: baseComponent },
			outlet: outlet,
			pathMatch: pathMatch
		}
	}

	private static location: Subject<string>;
	private initLocation() {
		if ( ! DynamicView.location )
		{
			DynamicView.location= new Subject<string>();
			this.location.onUrlChange( url => DynamicView.location.next(url) );
		}
	}
	private static onLocationChange(): Promise<string> {
		return DynamicView.location.pipe( first() ).toPromise(); // returns the first location change that occurs from this point forward
	}
}