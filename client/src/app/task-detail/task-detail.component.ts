import { Component, OnInit, Input } from '@angular/core';
import { IonCheckbox } from '@ionic/angular';
import { Task, TaskService } from '../core/tasks.service';

// this is the state of the taskDetail component
enum State {
	New,
	Pending,
	Changed,
	Ready		
}

@Component({
	selector: 'task-detail',
	templateUrl: './task-detail.component.html',
	styleUrls: ['./task-detail.component.scss']
})
export class TaskDetailComponent implements OnInit {

	private state: State;
	task: Task;

 	constructor(
		protected taskService: TaskService
	) { }

	ngOnInit() {
		if ( ! this.task )
			this.task= new Task(),
			this.state= State.New;
		else this.state= State.Ready;
	}

	onChange()
	{
		console.log(this.task);
		if ( this.state == State.New )
			this.taskService.add(this.task)
							.subscribe( task => this.onAdd(task) );
		else if ( this.state == State.Ready )
			this.taskService.update(this.task)
							.subscribe( task => { task.status= this.task.status; this.task= task; } );
		else this.state= State.Changed;
	}

	onAdd(task: Task)
	{
		if ( this.state == State.Changed )
			this.state= State.Ready,
			this.task.id= task.id,
			this.onChange();
		else this.state= State.Ready,
			 task.status= this.task.status, // temporary
			 this.task= task;
	}

	onCheck() {
		setTimeout(TaskDetailComponent.onCheckAsync, 0, this);
	}

	static onCheckAsync(_this: TaskDetailComponent) {
		if ( _this.task.isInProgress() )
			_this.task.complete();
		else if ( _this.task.isCompleted() )
			_this.task.revert(); 
		else _this.task.start();
		_this.onChange();
		_this.state= State.Changed; // make sure the server doesn't override temporary status
	}

}
