import { Component } from '@angular/core';

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
			</ion-toolbar>
		</ion-header>
		<ion-split-pane when="md" contentId="mainView">
			<ion-menu contentId="mainView">
				<group-list>
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
	`]
})
export class AppComponent
{
	title= 'WillDo';
}



import { Type } from '@angular/core';
import { Location } from '@angular/common';
import { PopoverController, ModalController } from '@ionic/angular';
import { ActivatedRoute, Route } from '@angular/router';
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
		this.showInModal(activatedRoute.snapshot.data.baseComponent);
	}

	private async showInModal(component: Type<any>)
	{
		let modal= await this.modalController
				   .create( { component: component, componentProps: { paramMap: this.activatedRoute.snapshot.paramMap } } );
		modal.present(); // show the modal
		modal.onWillDismiss().then( (e) => e.role == 'url' || this.location.back() ); // go backwards when the view is closed
		this.location.onUrlChange( () => modal && modal.dismiss(modal= null, 'url') );
	}

	public static createRoute(path: string, baseComponent: Type<any>, outlet?: string, pathMatch?: string): Route {
		return {
			path: path,
			component: DynamicView,
			data: { baseComponent: baseComponent },
			outlet: outlet,
			pathMatch: pathMatch
		}
	}
}