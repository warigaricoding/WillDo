import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs'; // asynchronous event-based library
import { catchError, map, tap } from 'rxjs/operators';

import { Task } from './task-class';
import { ApiService } from '../core/api.service';
import { AuthService } from '../core/auth.service';
import { ApiHelper } from  '../core/api.helper';

@Injectable({
	providedIn: 'root'
})
export class TaskService extends ApiService<Task>
{

	constructor(
		http: HttpClient,
		auth: AuthService
	) {
		super(http, auth, new ApiHelper( Task ));
		this.baseURL+= "tasks";
	}

	getAll(entityId?: string): Observable<Task[]>
	{
		return super.getAll(entityId).pipe(	catchError( e => of<Task[]>( [ new Task(0, 0, 0, e.message) ] ) ) );
														// returns the error message as a fake task 
	}

	remove(task: Task | string): Observable<Task>
	{
		return super.delete(task);
	}

}
