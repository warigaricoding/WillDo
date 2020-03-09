import { ApiIgnore, ApiProperty } from  './api.helper';
import { TaskService } from './tasks.service';

export class Task
{

	/** the id returned by the server */
	id: string;
	
	/** the group or entity this task was created for (id) */
	@ApiIgnore
	owner: string;

	@ApiProperty("state", "boolean")
	status: number;
	
	@ApiProperty("summary")
	header: string;

	@ApiProperty("date", "datestring")
	dueDate: string;

	description: string;

	/** a list of string user ids */
	@ApiIgnore
	assignedUsers: string[];

	@ApiIgnore
	priority: number;

	constructor(id?, owner?, status?, header?, dueDate?, description?) // '?' denotes an optional argument
	{
		this.id= id;
		this.owner= String( owner || "0" );
		this.status= +this.status || 0;
		this.header= String( header || "" );
		this.dueDate= new Date ( dueDate || 0 ).toISOString();
		this.description= String( description || "" );
		
		this.version= 0;
		this.ready= !! id;
	}

	isCompleted(): boolean {
		return this.status >= 1;
	}

	isInProgress(): boolean {
		return this.status > 0 && this.status < 1;
	}

	getStatusString()
	{
		if ( this.status >= 1 )
			return "Completed";
		else if ( this.status > 0 )
			return "In Progress";
		else return "Not Started";
	}

	revert()
	{
		this.status= 0;
	}

	start()
	{
		this.status= 0.5;
	}

	complete()
	{
		this.status= 1;
	}


	/** indicates whether or not the task has already been created and added onto the server */
	@ApiIgnore
	private version: number;

	/** indicates an identifier for the last change to the task */
	@ApiIgnore
	private ready: boolean;


	// handles user input
	onChange(taskService: TaskService)
	{
		console.log(this); // for debugging

		if ( this.ready ) // update the task
		{
			var version= ++this.version;
			taskService.update(this)
			           .subscribe( task => this.onUpdate(task, version) );
		}
		else if ( ! this.version ) // task is completely new b/c this.ready is also false
			this.version= 1, // task is being added to the server
			taskService.add(this) // send the new task to the server
			           .subscribe( task => this.onAdd(task, taskService) );
		else this.version= 2; // task has changed while being added to the server

	}


	// makes sure pending changes for new tasks are sent after the server finishes creating the taskk
	onAdd(task: Task, service: TaskService)
	{
		this.ready= true;
		if ( this.version > 1 ) // reward the new task for patiently waiting!
			this.version= 0,
			this.id= task.id, // the new id returned by the server
			this.onChange(service); // send changes to the task to the server
		else this.version= 0,
			 task.status= this.status, // temporary
			 Object.assign(this, task);
	}


	// makes sure the server doesn't overwrite changes currently being made
	onUpdate(task: Task, version: number)
	{
		if ( this.version === version || this.version === 0 ) // don't let the server update a task that's still being changed
			this.version= 0, // task is now up to date
			task.status= this.status, // temporary
			Object.assign(this, task);
	}


	// handles changes to the checkbox
	onCheck(service: TaskService)
	{
		// this timeout makes sure the checkbox sees the task's 3 statuses
		setTimeout(Task.onCheckAsync, 0, this, service);
	}


	private static onCheckAsync(task: Task, service: TaskService)
	{

		if ( task.isInProgress() ) // complete the task if it was previously in-progress
			task.complete();
		else if ( task.isCompleted() ) // reset the task's status if it was previously completed
			task.revert(); 
		else task.start(); // start the task if it has an unknown status

		task.onChange(service); // propogate the changes to the server
	}

}