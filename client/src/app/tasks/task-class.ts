import { ApiIgnore, ApiProperty } from '../core/api.helper';
import { TaskService } from './tasks.service';

enum TaskState {
	UpToDate= 0, // a new task is also considered up-to-date until it's submitted to the server
	StillBeingAdded= 1,
	ChangedDuringCreation= 2 // we're not likely to ever encounter this state
}

export class Task
{

	/** the id returned by the server */
	id: string;
	
	/** the group or entity this task was created for (id) */
	@ApiProperty("group")
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
		this.owner= String( owner || "" );
		this.status= +status || 0;
		this.header= String( header || "" );
		this.dueDate= new Date ( dueDate || Date.now() + 24*3600*1000 ).toISOString();
		this.description= String( description || "" );
		
		this.version= TaskState.UpToDate;
	}

	isCompleted(): boolean {
		return this.status >= 1;
	}

	isInProgress(): boolean {
		return this.status > 0 && this.status < 1;
	}

	getStatusString() {
		if ( this.status >= 1 )
			return "Completed";
		else if ( this.status > 0 )
			return "In Progress";
		else return "Not Started";
	}
	

	revert() {
		this.status= 0;
	}

	start() {
		this.status= 0.5; // probably won't need this status in the end
	}

	complete() {
		this.status= 1;
	}


	/** indicates the unique runtime state of the task (especially when waiting for a server response) */
	@ApiIgnore
	private version: number;


	/** handles user input */
	onChange(taskService: TaskService, submit?: boolean)
	{
		// the taskService is used to communicate w/ the server
		// the submit boolean tells us if the user is adding a task to the server

		if ( this.id ) // if the task has an id, it must already exist on the server so we send an update request
		{
			console.log(this); // for debugging
			
			const version= ++this.version; // here we let any `onUpdate` callbacks know that the task has changed
			taskService.update(this/*, this.owner*/)
			           .subscribe( task => this.onUpdate(task, version) );
		}
		else if ( this.version )
			this.version= TaskState.ChangedDuringCreation; // this tells us the task has changed while being added to the server
		else if ( submit )
			this.version= TaskState.StillBeingAdded, // this tells us the task is being added to the server
			taskService.add(this/*, this.owner*/) // send the new task to the server
			           .subscribe( task => this.onAdd(task, taskService) );

	}


	/** makes sure pending changes for new tasks are sent after the server finishes creating the task */
	onAdd(task: Task, service: TaskService)
	{
		if ( this.version >= TaskState.ChangedDuringCreation ) // reward the new task for patiently waiting!
			this.version= TaskState.UpToDate,
			this.id= task.id, // the new id returned by the server
			this.onChange(service, true); // send unsent task changes to the server through our `onChange` method above
		else this.version= TaskState.UpToDate,
			 task.status= this.status, // temporary workaround to demonstrate a tri-state checkbox
			 Object.assign(this, task); // update the current task w/ properties from the server
	}


	/** when the server responds to an update request, this method is called */
	onUpdate(

		/** the server gives us an updated task back */
		task : Task, 

		/** the version number indicates the runtime state of the task when we requested the update in the `onChange` method */
		version: number

	)
	{
		if ( this.version === version || this.version === TaskState.UpToDate ) // don't let the server update a task that's still being changed
			this.version= TaskState.UpToDate,
			task.status= this.status, // temporary workaround to demonstrate a tri-state checkbox
			Object.assign(this, task); // update the current task w/ properties from the server
	}


	/** handles changes to the checkbox */
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

	/** sorts tasks based on their due-date & whether or not they've been completed */
	public static compare(a: Task, b: Task) {
		let x= a.status - b.status;
		if ( x != 0 )
			return x;
		else return Date.parse(a.dueDate) - Date.parse(b.dueDate);
	}

}