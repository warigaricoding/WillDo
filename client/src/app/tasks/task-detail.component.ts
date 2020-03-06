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
				<ion-grid class="ion-align-items-center" fixed>

					<ion-row>
						<ion-col class="ion-text-right ion-align-self-center">
							<ion-label>Progress:</ion-label>
						</ion-col>
						<ion-col>
							<ion-item>
								<ion-checkbox [indeterminate]="task.isInProgress()" [checked]="task.isCompleted()" (click)="onCheck()"></ion-checkbox>
								<ion-label>{{task.getStatusString()}}</ion-label>
							</ion-item>
						</ion-col>
					</ion-row>

					<ion-row>
						<ion-col class="ion-text-right ion-align-self-center">
							<ion-label>Due-Date:</ion-label>
						</ion-col>
						<ion-col>
							<ion-datetime [(ngModel)]="task.dueDate" displayFormat="MMMM D, h a" min="2010" max="2030" (ionChange)="onChange()"></ion-datetime>
						</ion-col>
					</ion-row>

					<ion-row>
						<ion-col class="ion-text-right">
							<ion-label>Description:</ion-label>
						</ion-col>
						<ion-col>
							<ion-textarea [(ngModel)]="task.description" (ionChange)="onChange()"></ion-textarea>
						</ion-col>
					</ion-row>

					<ion-row>
						<ion-col class="ion-text-right ion-align-self-center">
							<ion-label>Assigned Users:</ion-label>
						</ion-col>
						<ion-col>
							<ion-item>
								<ion-chip>
									<ion-img>
		
									</ion-img>
									<ion-input>
		
									</ion-input>
									<ion-icon name="close-circle"></ion-icon>
								</ion-chip>
							</ion-item>
						</ion-col>
					</ion-row>
					
				</ion-grid>
			</ion-card-content>
		</ion-card>	
	`,
	styles: [ ]
})
export class TaskDetailComponent implements OnInit
{
	task: Task;

 	constructor(
		protected taskService: TaskService,
		private activatedRoute: ActivatedRoute
	) { }

	// component is ready!
	ngOnInit()
	{
		var taskId= this.activatedRoute.snapshot.paramMap.get('id');

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
	onChange()
	{
		console.log(this.task); // for debugging
		this.task.onChange(this.taskService);
	}

	// handles changes to the checkbox
	onCheck()
	{
		this.task.onCheck(this.taskService);
	}

}
