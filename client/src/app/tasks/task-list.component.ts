import { Component, OnInit } from '@angular/core';
import { interval } from 'rxjs';

import { TaskService } from './tasks.service'; // this service handles all the task-related server communications for us
import { Task } from './task-class';

@Component({
	selector: 'task-list',
	template: `
		<ion-grid fixed>
			<ion-row>
				<ion-col size="10">
					<ion-item button routerLink="/tasks">
						<ion-label>
							Click here to create a new task.
						</ion-label>
					</ion-item>
				</ion-col>
				<ion-col *ngFor="let task of tasks; trackBy: trackById" size="10"><!-- trackBy prevents repaints -->
					<ion-checkbox [indeterminate]="task.isInProgress()" [checked]="task.isCompleted()" (click)="onCheck(task)">
					</ion-checkbox>
					<ion-item button style="display:inline-block;width:80%" [routerLink]="[ '/tasks', task.id ]">
						{{ task.header }}
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
	` ]
})
export class TaskListComponent implements OnInit {

	tasks: Task[];

	constructor(private taskService: TaskService) { }

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
		this.taskService.getAll()
						.subscribe( tasks => this.tasks= tasks );
						// replace the old task list with the new the new task list from the server (after we receive it)
	}

	/** handles changes to the checkbox */
	onCheck(task: Task) {
		task.onCheck(this.taskService);
	}

	/** returns what makes each item unique to prevent UI repainting when new data is received */
	trackById(index: number, item: Task): string
	{
		return item.id;
	}

}
