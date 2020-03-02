import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs'; // asynchronous event-based library
import { catchError, map, tap } from 'rxjs/operators';

import { AuthService } from './auth.service';
import { Base64 } from './base64'

export class Task {
	id: string;
	owner: number;
	status: number;
	header: string;
	dueDate: Date;
	description: string;
	assignedUsers: number[];
	priority: number;
	constructor(){}

	isCompleted(): boolean {
		return this.status >= 1;
	}

	isInProgress(): boolean {
		return this.status > 0 && this.status < 1;
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

	/// start json conversion helpers
		static fromJsonArray(arr: _ITask[]): Task[]
		{
			return arr.map(Task.fromJsonObject);
		}

		static fromJsonObject(obj: _ITask): Task
		{
			return {
				id: obj.id,
				header: obj.summary,
				dueDate: new Date(obj.date),
				description: obj.description,
				status: +obj.state
			} as Task;
		}

		toJsonObject(): _ITask
		{
			return {
						id: this.id,
						summary: this.header,
						date: String(this.dueDate),
						description: this.description,
						state: !!this.status
					} as _ITask;
		}
	/// end json conversion helpers
}

interface _ITask { // current server interface
	id: string;
	summary: string;
	description: string;
	date: string;
	state: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
	
	private baseURL= "http://localhost:8080/tasks"; //'api/tasks';

	protected httpOptions= {
		headers: new HttpHeaders({
			'Content-Type': 'application/json'
		})
	};

	constructor(
		private http: HttpClient,
		private auth: AuthService
	) { }


	getAll(entityId?: number): Observable<Task[]>
	{
		const requestURL=
			entityId == null ? this.baseURL
			                 : `${this.baseURL}/${Base64.fromInteger(entityId)}`;
		return this.http.get<_ITask[]>(requestURL, this.httpOptions)
						.pipe( map(Task.fromJsonArray) )
						.pipe(  catchError( e => of<Task[]>( [ { header: e.message } as Task ] ) )  ); // return the error message as a fake task 
	}

	get(taskId: string, entityId?: number): Observable<Task>
	{
		//return this.http.get<Task>(`${this.baseURL}/${Base64.fromInteger(entityId)}/${taskId}`, this.httpOptions);
		return this.http.get<_ITask>(`${this.baseURL}/${taskId}`, this.httpOptions).pipe( map(Task.fromJsonObject) );
	}

	add(task: Task, entityId?: number): Observable<Task>
	{
		// return this.http.post<Task>(`${this.baseURL}/${Base64.fromInteger(entityId)}`, task, this.httpOptions);
		return this.http.post<_ITask>(`${this.baseURL}`, task.toJsonObject(), this.httpOptions).pipe( map(Task.fromJsonObject) );
	}

	update(task: Task, entityId?: number): Observable<Task>
	{
		// return this.http.put<Task>(`${this.baseURL}/${Base64.fromInteger(entityId)}`, task, this.httpOptions);
		return this.http.put<_ITask>(`${this.baseURL}`, task.toJsonObject(), this.httpOptions).pipe( map(Task.fromJsonObject) );
	}

	remove(task: Task | string): Observable<Task>
	{
		const taskId=  typeof task === 'string' ?  task : task.id ;
		return this.http.delete<Task>(`${this.baseURL}/0/${taskId}`, this.httpOptions);
	}

}
