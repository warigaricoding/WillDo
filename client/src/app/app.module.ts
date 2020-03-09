import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { IonicModule } from '@ionic/angular';
import { TaskDetailComponent } from './task-detail/task-detail.component';
import { HttpClientModule } from '@angular/common/http';
import { TaskListComponent } from './task-list/task-list.component';

const appRoutes: Routes
	=
	[
		{
			path: '',
			component: TaskListComponent
		},
		{
			path: 'tasks',
			component: TaskDetailComponent
		},
		{
			path: 'tasks/:id',
			component: TaskDetailComponent
		}
	];


@NgModule({
  declarations: [
    AppComponent,
    TaskDetailComponent,
    TaskListComponent
  ],
  imports: [
    BrowserModule,
	FormsModule,
	HttpClientModule,
	IonicModule.forRoot(),
	RouterModule.forRoot(appRoutes)
  ],
  exports: [RouterModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
