import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, of } from 'rxjs'; // asynchronous event-based library
import { catchError, map, tap } from 'rxjs/operators';

import { Task } from './task-class';
import { ApiService } from '../core/api.service';
import { ApiHelper } from  '../core/api.helper';

/** Communicates with the server's task controller. */
@Injectable({
	providedIn: 'root'
})
export class TaskService extends ApiService<Task>
{

	constructor(http: HttpClient)
	{
		super(http, new ApiHelper( Task ));
		this.baseURL+= "tasks";
		this.entityName= "group"; // tells the base class what prefix to use when group-specific is needed
	}

	getAll(entityId?: string): Observable<Task[]>
	{

		return super.getAll(entityId).pipe(	catchError( e => of<Task[]>( [ new Task(0, 0, 0, e.message) ] ) ) );
														// returns the error message as a fake task 
	}

	remove(task: Task | string): Observable<Task>
	{
		// simply call the "protected" delete method
		return super.delete(task);
	}

}
