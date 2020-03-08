import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { IonicModule } from '@ionic/angular';

import { AppComponent, DynamicView } from './app.component';
import { TaskDetailComponent } from './tasks/task-detail.component';
import { TaskListComponent } from './tasks/task-list.component';

const appRoutes: Routes
	=
	[
		{
			path: 'tasks',
			component: DynamicView.get(TaskDetailComponent) // wraps the component in a screen-dependent context (currently uses popovers only)
		},
		{
			path: 'tasks/:id',
			component: DynamicView.get(TaskDetailComponent)
		}
	];


@NgModule({
  declarations: [
    AppComponent,
	TaskListComponent
  ].concat(
	DynamicView.getUserComponents(), // array of all components put in a dynamic context
	DynamicView.getGeneratedComponents() // array of all dynamically created components
  ),
  imports: [
    BrowserModule,
	FormsModule,
	HttpClientModule,
	IonicModule.forRoot(),
	RouterModule.forRoot(appRoutes,
		{
			onSameUrlNavigation: 'reload',
			anchorScrolling: 'enabled'
		}
	)
  ],
  exports: [RouterModule],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: DynamicView.getUserComponents() // array of all components put a dynamic context
})
export class AppModule { }