import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { IonicModule } from '@ionic/angular';

import { AppComponent, DynamicView } from './app.component';
import { TaskDetailComponent } from './tasks/task-detail.component';
import { TaskListComponent } from './tasks/task-list.component';
import { GroupListComponent } from './groups/group-list.component';
import { GroupDetailComponent } from './groups/group-detail.component';

/** information Angular uses to navigate between components based on the current URL */
const appRoutes: Routes
	=
	[
		{
			path: 'group/:groupId',
			component: TaskListComponent, // the main component when viewed for a specific group
			children: [
				DynamicView.createRoute('tasks', TaskDetailComponent), // the view for creating a new task
				DynamicView.createRoute('tasks/:taskId', TaskDetailComponent) // the view for editing a task
			]
		},
		{
			path: '',
			component: TaskListComponent, // the main component when viewed for all groups
			children: [
				DynamicView.createRoute('tasks', TaskDetailComponent), // the default view for creating a new task
				DynamicView.createRoute('tasks/:taskId', TaskDetailComponent) // the default view for editing a task
			]
		},
		DynamicView.createRoute(':groupId', GroupDetailComponent, 'g'), // the view for modifying an existing group
		DynamicView.createRoute(':', GroupDetailComponent, 'g', 'full') // the view for creating a new group
	];


@NgModule({
  declarations: [
	DynamicView, // wraps the given component in a screen-dependent context
    AppComponent,
	TaskListComponent,
	GroupListComponent,
	TaskDetailComponent,
	GroupDetailComponent
  ],
  imports: [
    BrowserModule,
	FormsModule,
	HttpClientModule,
	IonicModule.forRoot(),
	RouterModule.forRoot(appRoutes,
		{
			onSameUrlNavigation: 'reload',
			anchorScrolling: 'enabled',
			paramsInheritanceStrategy: 'always'
		}
	)
  ],
  exports: [RouterModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }