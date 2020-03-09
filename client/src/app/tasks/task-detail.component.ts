import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from './tasks.service';
import { Task } from './task-class';

@Component({
	selector: 'task-detail',
	template: `
		<ion-card>

			<ion-card-header>
				<ion-card-title class="ion-text-center">
					<ion-input [(ngModel)]="task.header" placeholder="[enter task name]" (ionChange)="onChange()"></ion-input>
				</ion-card-title>
			</ion-card-header>

			<ion-card-content>

				<ion-item>
					<ion-label position="fixed">Progress:</ion-label>
					<ion-checkbox [indeterminate]="task.isInProgress()" [checked]="task.isCompleted()" (click)="onCheck()"></ion-checkbox>
					<ion-label>&nbsp;&nbsp;{{task.getStatusString()}}</ion-label>
				</ion-item>

				<ion-item>
					<ion-label position="fixed">Due-Date:</ion-label>
					<ion-datetime [(ngModel)]="task.dueDate" displayFormat="h a, MMMM D, YYYY" min="2010" max="2030" (ionChange)="onChange()">
					</ion-datetime>
				</ion-item>

				<ion-item>
					<ion-label>Description:</ion-label>
					<ion-textarea [(ngModel)]="task.description" (ionChange)="onChange()" auto-grow="true" rows="1"></ion-textarea>
				</ion-item>

				<ion-item>
					<ion-label>Assigned To:</ion-label>
					<ion-chip>
						<ion-img>

						</ion-img>
						<ion-input>

						</ion-input>
						<ion-icon name="close-circle"></ion-icon>
					</ion-chip>
				</ion-item>
					
			</ion-card-content>

			<div style="position:absolute;bottom:0px">
				<ion-buttons>
					<ion-button fill="clear" (click)="onDelete()">
						<ion-icon name="trash"></ion-icon>
					</ion-button>
				</ion-buttons>
			</div>

		</ion-card>	
	`,
	styles: [`
		ion-card {
			margin: 0;
			width: 100%;
			height: 100%;
		}
	`]
})
export class TaskDetailComponent implements OnInit
{
	task: Task;
	init: boolean;
	@Input()
	activatedRoute: ActivatedRoute;

 	constructor(
		protected taskService: TaskService
	) {}

	// component is ready!
	ngOnInit()
	{
		// get the task's id from the current url
		var taskId= TaskService.getFromRoute(this.activatedRoute, 'taskId'),
			groupId= TaskService.getFromRoute(this.activatedRoute, 'groupId');

		// create a new task if one has not been given
		if ( ! taskId )
			this.task= new Task(null, groupId),
			this.init= true;
		else {
			this.task= new Task(taskId, groupId);
			this.taskService.get(taskId, groupId)
							.subscribe(
								task => {
									this.task= task;
									setTimeout(()=>{this.init= true;},100);
								}
							);
		}
	}

	// handles user input
	onChange() {
		if ( ! this.init )
			return false;
		this.task.onChange(this.taskService);
	}

	// handles changes to the checkbox
	onCheck() {
		this.task.onCheck(this.taskService);
	}

	onDelete() {
		if ( window.confirm("Are you sure you want to delete this task?") )
			this.taskService.remove(this.task).subscribe(),
			window.history.back();
	}
}
