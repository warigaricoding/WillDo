import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from './tasks.service';
import { Task } from './task-class';
import { IonTextarea } from '@ionic/angular';

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
					<ion-datetime [(ngModel)]="task.dueDate" displayFormat="MMMM D, h a YYYY" min="2010" max="2030" (ionChange)="onChange()"></ion-datetime>
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

 	constructor(
		protected taskService: TaskService,
		private activatedRoute: ActivatedRoute
	) {}

	// component is ready!
	ngOnInit()
	{
		// get the task's id from the current url
		var taskId= this.activatedRoute.snapshot.paramMap.get('id') || this.activatedRoute.firstChild.snapshot.paramMap.get('id');

		// create a new task if one has not been given
		if ( ! taskId )
			this.task= new Task();
		else {
			this.task= new Task(taskId);
			this.taskService.get(taskId)
							.subscribe(
								task => {
									this.task= task;
								}
							);
		}
	}

	// handles user input
	onChange() {
		console.log(this.task); // for debugging
		this.task.onChange(this.taskService);
	}

	// handles changes to the checkbox
	onCheck() {
		this.task.onCheck(this.taskService);
	}

}
