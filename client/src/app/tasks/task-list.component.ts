import { Component, OnInit } from '@angular/core';
import { interval } from 'rxjs';

import { TaskService } from './tasks.service'; // this service handles all the task-related server communications for us
import { Task } from './task-class';
import { ActivatedRoute } from '@angular/router';

@Component({
	selector: 'task-list',
	template: `
		<router-outlet>
			<!-- this router outlet switches between tasks -->

			<!--ion-popover-->

				<!--task-detail-->
					<!-- * * * * * * * * * * * * * * * * * * * * * * * * * * -->
					<!-- 'task-detail' displays the details of a single task -->
					<!--   (  see  'app/tasks/task-detail.component.ts'  )   -->
					<!-- * * * * * * * * * * * * * * * * * * * * * * * * * * -->
				<!--/task-detail-->

			<!--/ion-popover-->

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
		interval(500).subscribe( () => this.update() ); // we auto-refresh the task list every 0.5 seconds //// temporary method for easily refreshing tasks
		// observables are just a way of listening to events
			// {observable}.subscribe tells the observable to call the function when something happens
			// it's like a newspaper letting us know 'Extra! Extra!', after which we call `this.update`
			// interval(...) is an observable that notifies its subscriber at the given interval in milliseconds
			// Note: syntax for lambda / anonymous function: {function args} => {function body}
				// Left side of the arrow is input; Right side is body & ouput
	}

	update() {
		// ask the TaskService to update the list of tasks
		this.owner= TaskService.getFromRoute(this.activateRoute, 'groupId');
		this.taskService.getAll(this.owner)
						.subscribe( tasks => this.tasks= tasks.sort(Task.compare) );
						// replace the old task list with the new the new task list from the server (after we receive it)
	}

	/** handles changes to the checkbox */
	onCheck(task: Task) {
		task.onCheck(this.taskService);
	}

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
