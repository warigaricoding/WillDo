import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, combineLatest } from 'rxjs'; // asynchronous event-based library
import { catchError, startWith, switchMap, map } from 'rxjs/operators';

import { Task } from './task-class';
import { GroupService } from '../groups/groups.service';
import { ApiService } from '../core/api.service';
import { ApiHelper } from  '../core/api.helper';

/** Communicates with the server's task controller. */
@Injectable({
	providedIn: 'root'
})
export class TaskService extends ApiService<Task>
{

	constructor(private groupService: GroupService, http: HttpClient)
	{
		super(http, new ApiHelper( Task ));
		this.baseURL+= "tasks";
		this.entityName= "group"; // tells the base class what prefix to use when group-specific is needed
	}

	getAll(entityId?: string): Observable<Task[]>
	{
		return super.getAll(entityId)
					.pipe( catchError( entityId ?  TaskService.onError : this.getAllPerGroup ) );
	}

	remove(task: Task | string): Observable<Task>
	{
		// simply call the "protected" delete method
		return super.delete(task);
	}

	private getAllPerGroup(): Observable<Task[]>
	{
		return this.groupService.getAll()
								.pipe(
									switchMap( // requests tasks for each group, cancelling and removing previous requests from memory
										groups =>
										combineLatest( // combines each observable list of tasks into a single observable
											groups.map( // transforms each group into a list of tasks
												group =>
												group.id && this.getAll(group.id).pipe(startWith( [] as Task[] ))
													// checks if the group has an id before requesting its list of tasks
											)
										)
									),
									map( arrayOfArrays => [].concat(...arrayOfArrays) as Task[] ), // flattens the array of task arrays
									catchError( TaskService.onError )
								);
	}

	/** returns the error message as a fake task  */
	private static onError( e )
	{
		return of<Task[]>( [ new Task(0, 0, 0, e.message) ] );
	}
}
