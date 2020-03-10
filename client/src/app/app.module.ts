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

const appRoutes: Routes
	=
	[
		{
			path: 'group/:groupId',
			component: TaskListComponent,
			children: [
				DynamicView.createRoute('tasks', TaskDetailComponent),
				DynamicView.createRoute('tasks/:taskId', TaskDetailComponent)
			]
		},
		{
			path: '',
			component: TaskListComponent,
			children: [
				DynamicView.createRoute('tasks', TaskDetailComponent),
				DynamicView.createRoute('tasks/:taskId', TaskDetailComponent)
			]
		},
		DynamicView.createRoute(':groupId', GroupDetailComponent, 'g'),
		DynamicView.createRoute(':', GroupDetailComponent, 'g', 'full')
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