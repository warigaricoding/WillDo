import { Component } from '@angular/core';

@Component({
	selector: 'app-root',
	template: `
		<ion-content>
			<!-- Note: ion-content creates the main, scrollable view of the application -->

			<router-outlet>
				<!-- router outlet switches between tasks -->

				<!--ion-popover-->

					<!--task-detail-->
						<!-- * * * * * * * * * * * * * * * * * * * * * * * * * * -->
						<!-- 'task-detail' displays the details of a single task -->
						<!--   (  see  'app/tasks/task-detail.component.ts'  )   -->
						<!-- * * * * * * * * * * * * * * * * * * * * * * * * * * -->
					<!--/task-detail-->

				<!--/ion-popover-->

			</router-outlet>

			<task-list>
				<!-- * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * -->
				<!-- 'task-list' is list of tasks in any kind of context i.e. different groups -->
				<!--               (  see  'app/tasks/task-list.component.ts'  )               -->
				<!-- * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * -->
			</task-list>

		</ion-content>
	`,
	styles: []
})
export class AppComponent
{
	title= 'WillDo';
}



import { Type } from '@angular/core';
import { Location } from '@angular/common';
import { PopoverController, ModalController } from '@ionic/angular';
/** Loads the given component in a context most friendly for the current screen */
export class DynamicView
{
	/** retrieves or generates a dynamic view of this component */
	static get(componentClass: Type<any>): Type<any>
	{
		var base= this.map.get(componentClass);
		if ( ! base )
			this.map.set(componentClass, base= this.generate(componentClass));
		return base;
	}

	private static generate(component: Type<any>)
	{
		@Component({template:``})
		class dynamicClass
		{
			constructor(
				private location: Location,
				private popoverController: PopoverController,
				private modalController: ModalController
			)
			{
				this.showInPopover();
			}
			private async showInPopover()
			{
				const popover= await this.popoverController.create( { component: component, translucent: true } );
				popover.present(); // show the popover
				popover.onWillDismiss().then( () => this.location.back() ); // go backwards when the view is close
			}
		}
		return dynamicClass;
	}

	/** stores the components used by and created by DynamicView  */
	public static readonly map= new Map< Type<any>, Type<any> >();
}