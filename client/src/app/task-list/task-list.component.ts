import { Component, OnInit } from '@angular/core';
import { interval } from 'rxjs';

import { TaskService } from '../core/tasks.service'; // this service handles all the task-related server communications for us
import { Task } from '../core/task';

@Component({
	selector: 'task-list',
	templateUrl: './task-list.component.html',
	styleUrls: ['./task-list.component.scss']
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

	update()
	{
		// ask the TaskService to update the list of tasks
		this.taskService.getAll()
						.subscribe( tasks => this.tasks= tasks );
						// replace the old task list with the new the new task list from the server (after we receive it)
	}

	trackById(index: number, item: Task): string
	{
		return item.id;
	}

	// handles changes to the checkbox
	onCheck(task: Task) {
		task.onCheck(this.taskService);
	}

}
