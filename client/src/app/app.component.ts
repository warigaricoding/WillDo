import { Component } from '@angular/core';

@Component({
	selector: 'app-root',
	template: `
		<ion-content>
			<!-- Note: ion-content creates the main, scrollable view of the application -->

			<task-list>
				<!-- * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * -->
				<!-- 'task-list' is list of tasks in any kind of context i.e. different groups -->
				<!--               (  see  'app/tasks/task-list.component.ts'  )               -->
				<!-- * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * -->
			</task-list>

			<!--ion-popover-->
				<router-outlet>
					<!-- router outlet switches between tasks -->
					<!--task-detail-->
						<!-- * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * -->
						<!-- 'task-detail' dynamically displays the details of a single task -->
						<!--         (  see  'app/tasks/task-detail.component.ts'  )         -->
						<!-- * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * -->
					<!--/task-detail-->
				</router-outlet>
			<!--/ion-popover-->

		</ion-content>
	`,
	styles: []
})
export class AppComponent
{
	title= 'WillDo';
}
