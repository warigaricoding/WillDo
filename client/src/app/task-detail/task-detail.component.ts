import { Component, OnInit, Input } from '@angular/core';
import { IonCheckbox } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '../core/tasks.service';
import { Task } from '../core/task';

@Component({
	selector: 'task-detail',
	templateUrl: './task-detail.component.html',
	styleUrls: ['./task-detail.component.scss']
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
