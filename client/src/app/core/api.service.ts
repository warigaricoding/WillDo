import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs'; // asynchronous event-based library
import { catchError, map, tap } from 'rxjs/operators';

import { AuthService } from './auth.service';
import { ApiHelper } from  './api.helper';

/** Serves as the base class for all web services.
		Auto-validates the objects and properties going to and from the server.
		Makes sure both communicate seamlessly.
*/
@Injectable({
	providedIn: 'root'
})
export class ApiService<T>
{

	protected baseURL= "/api/";

	protected httpOptions= {
		headers: new HttpHeaders({
			'Content-Type': 'application/json'
		})
	};

	protected constructor(
		private http: HttpClient,
		private auth: AuthService,
		private helper: ApiHelper<T>
	)
	{
		// bind to `this` once, bind twice even, or suffer the consequences
			this.toApiObject= this.helper.toApiObject.bind(this.helper);
			this.fromApiObject= this.helper.fromApiObject.bind(this.helper);
			this.fromApiArray= this._fromApiArray.bind(this);
	}

	public getAll(entityId?: string): Observable<T[]>
	{
		const requestURL=
				entityId ? `${this.baseURL}/${entityId}`
						 : this.baseURL;
		return this.http.get(requestURL, this.httpOptions).pipe( map( this.fromApiArray ) )
	}

	public get(itemId: string, entityId?: string): Observable<T>
	{
		const requestURL=
				entityId ? `${this.baseURL}/${itemId}/${entityId}`
						 : `${this.baseURL}/${itemId}`;
		return this.http.get(requestURL, this.httpOptions).pipe( map( this.fromApiObject ) );
	}

	public add(item: T, entityId?: string): Observable<T>
	{
		const requestURL=
				entityId ? `${this.baseURL}/${entityId}`
						 : this.baseURL;
		return this.http.post(requestURL, this.toApiObject(item), this.httpOptions).pipe( map( this.fromApiObject ) );
	}

	public update(item: T, entityId?: string): Observable<T>
	{
		const itemId= String( item["id"] || "0" ),
			requestURL=
				entityId ? `${this.baseURL}/${itemId}/${entityId}`
						 : `${this.baseURL}/${itemId}`;
		return this.http.put(requestURL, this.toApiObject(item), this.httpOptions).pipe( map( this.fromApiObject ) );
	}

	protected delete(item: T | string, entityId?: string): Observable<T>
	{
		if ( ! item )
			return null;
		const itemId=  String ( "id" in ( item as any ) ?  item["id"] : item ),
			requestURL=
				entityId ? `${this.baseURL}/${itemId}/${entityId}`
						 : `${this.baseURL}/${itemId}`;
		
		return this.http.delete(requestURL, this.httpOptions).pipe( map( this.fromApiObject ) );
	}

	/** makes sure the class object is in a compatible format with the api interface */
	private readonly toApiObject: (T) => any;

	/** creates a new class object from the api interface, so the object methods, etc. work properly */
	private readonly fromApiObject: (any) => T;

	/** creates a array of class objects, so data from the server can become object-oriented with working methods, etc. */
	private readonly fromApiArray: ([]) => T[];

	private _fromApiArray(arr: []): T[]
	{
		return arr.map(this.fromApiObject);
	}
}