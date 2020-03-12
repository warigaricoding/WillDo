import { Component, OnInit } from '@angular/core';
import { interval, Observable, combineLatest } from 'rxjs';

import { TaskService } from './tasks.service'; // this service handles all the task-related server communications for us
import { Task } from './task-class';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { startWith, switchMap } from 'rxjs/operators';

@Component({
	selector: 'task-list',
	template: `
		<router-outlet>
			<!-- this router outlet switches between tasks -->

			<!--ion-modal-->

				<!--task-detail-->
					<!-- * * * * * * * * * * * * * * * * * * * * * * * * * * -->
					<!-- 'task-detail' displays the details of a single task -->
					<!--   (  see  'app/tasks/task-detail.component.ts'  )   -->
					<!-- * * * * * * * * * * * * * * * * * * * * * * * * * * -->
				<!--/task-detail-->

			<!--/ion-modal-->

		</router-outlet>
		<ion-grid fixed>
			<ion-row>
				<ion-col size="12">
					<ion-item button routerLink="tasks">
						<ion-label>
							Click here to create a new task.
						</ion-label>
					</ion-item>
				</ion-col>
				<ion-col *ngFor="let task of tasks; trackBy: trackById" size="12" disabled="true"><!-- trackBy prevents repaints -->
					<ion-checkbox [indeterminate]="task.isInProgress()" [checked]="task.isCompleted()" (click)="onCheck(task)">
					</ion-checkbox>
					<ion-item style="display:inline-block;width:calc(100% - 55px)" [routerLink]="getLinkFor(task)">
						{{ task.header }}
						<ion-label slot="end">
							{{ task.dueDate | date:'h a, MMMM d, y' }}
						</ion-label>
					</ion-item>
				</ion-col>
			</ion-row>
		</ion-grid>
	`,
	styles: [ `
		ion-checkbox {
			width: 55px;
			height: 55px;
			padding: 15px;
		}
		ion-icon {
			width: 25px;
			height: 25px;
			padding: 15px;		
		}
	` ]
})
export class TaskListComponent implements OnInit {

	tasks: Task[];
	owner: string;

	constructor(private taskService: TaskService, private activateRoute: ActivatedRoute) { }

	ngOnInit() {
		// update the current group whenever the view switches or whenever 500 ms has elapsed
		combineLatest( interval(500).pipe(startWith(0)), this.activateRoute.paramMap )
			.pipe( switchMap( x => this.request(x[1]) ) )
			.subscribe( tasks => this.onRequestReturn(tasks) );
			// interval is a temporary method for easily refreshing tasks
				// observables are just a way of listening to events
					// *.subscribe tells the observable to call the function when something happens
						// in this case when the server returns
					// here, switchMap requests data from the server, cancelling and removing previous requests from memory
					// a pipe, like startWith, simply transfrorms the current observable
						// in this case startWith causes the interval event to trigger in 0 seconds the first time
	}

	/** requests all tasks from the server (for a specific group if it's in the URL) */
	request(paramMap: ParamMap): Observable<Task[]> {
		return this.taskService.getAll(paramMap.get('groupId'));
	}

	/** sorts the list of tasks from the server and updates the view */
	onRequestReturn(tasks: Task[]) {
		this.tasks= tasks.sort(Task.compare);
	}

	/** handles changes to the checkbox */
	onCheck(task: Task) {
		task.onCheck(this.taskService);
	}

	/** returns the URL for opening a specific task (routing is currently configured to show the task in a modal) */
	getLinkFor(task: Task) {
		if ( task.owner )
			return [ '/group', task.owner, 'tasks', task.id ];
		else return [ '/tasks', task.id ];
	}

	/** returns what makes each item unique to prevent UI repainting when new data is received */
	trackById(index: number, item: Task): string
	{
		return item.id;
	}

}
