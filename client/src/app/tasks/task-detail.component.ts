import { Component, OnInit, Input } from '@angular/core';
import { ParamMap, Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

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


				<ion-item [hidden]="!task.id">
					<ion-label>Comments</ion-label>
				</ion-item>
				<comment-list [taskId]="task.id" [hidden]="!task.id">
				</comment-list>

				<ion-item>
					<ion-label>Assigned To:</ion-label>
					<user-list [(children)]="task.assignedUsers" (childrenChange)="onChange()">
					</user-list>
				</ion-item>
					
			</ion-card-content>

			<ion-buttons style="position:absolute;bottom:0px">
				<ion-button (click)="onDelete()" [hidden]="!task.id">
					<ion-icon name="trash"></ion-icon>
				</ion-button>
			</ion-buttons>
			<ion-toolbar style="position:absolute;bottom:0px">
				<ion-buttons slot="end">
					<ion-button (click)="close()" slot="end">
						<ion-label> {{ task.id ? 'Close' : 'Cancel' }} </ion-label>
					</ion-button>
					<ion-button [hidden]="!!task.id" (click)="onChange('submit');close()" [disabled]="!task.header" fill="outline">
						<ion-label>Create</ion-label>
					</ion-button>
				</ion-buttons>
			</ion-toolbar>

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

	/** indicates whether or not the component's data has been fully initialized */
	init: boolean;

	/** these parameters indirectly come from the current URL in the browser */
	@Input()
	paramMap: ParamMap;

	@Input()
	route: ActivatedRoute;

 	constructor(
		protected taskService: TaskService,
		protected location: Location
	) {}

	// component is ready!
	ngOnInit()
	{
		// get the task's id from the current url
		var taskId= this.paramMap.get('taskId'),
			groupId= this.paramMap.get('groupId');

		// create a new task if one has not been given
		if ( ! taskId )
			this.task= new Task(null, groupId),
			this.init= true; // our task is ready!
		else {
			this.task= new Task(taskId, groupId);
			this.taskService.get(taskId, /* groupId*/) // task controller should require groupId when getting for security!!!
							.subscribe(
								task => {
									this.task= task;
									// our task is almost ready...
									setTimeout( () => this.init= true , 100 );
								}
							);
		}
	}

	/** handles user input */
	onChange(submit?) { // submit is an optional parameter (truthy when the user wants to add a task to the server)
		if ( ! this.init ) // not yet ready
			return false;
		this.task.onChange(this.taskService, !!submit);
	}

	/** handles changes to the checkbox */
	onCheck() {
		this.task.onCheck(this.taskService); // give the task our service so it can update its status on our server
	}

	/** when the user clicks the trash icon */
	onDelete() {
		if ( window.confirm("Are you sure you want to delete this task?") )
			this.taskService.remove(this.task).subscribe(),
			this.close();
	}

	/** goes back to the previous view */
	close() {
		this.location.back();
	}
}
