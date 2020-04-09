import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpHeaderResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs'; // asynchronous event-based library
import { catchError, map, tap } from 'rxjs/operators';

import { ApiHelper } from  './api.helper';

/** Serves as the base class for all our web services.
 *      Auto-validates the objects and properties going to and from the server.
 *      Makes sure both communicate seamlessly.
 */
@Injectable({
	providedIn: 'root'
})
export class ApiService<T>
{
	/** the API's root directory */
	protected baseURL= "/api/";

	/** the url directory name for prefixing the second id of a multi-relational item */
	protected entityName= null;

	protected httpOptions= {
		headers: new HttpHeaders({
			'Content-Type': 'application/json'
		})
	};

	protected constructor(
		private http: HttpClient,
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
				entityId ? `${this.baseURL}/${this.entityName}/${entityId}`
						 : this.baseURL;
		return this.http.get(requestURL, this.httpOptions).pipe( map( this.fromApiArray ) );
	}

	public get(itemId: string, entityId?: string, temporaryHeaders?: {}): Observable<T>
	{
		const requestURL=
				entityId ? `${this.baseURL}/${itemId}/${this.entityName}/${entityId}`
						 : `${this.baseURL}/${itemId}`;
		return this.http.get( requestURL, this.getOptions(temporaryHeaders) ).pipe( map( this.fromApiObject ) );
	}

	public add(item: T, entityId?: string): Observable<T>
	{
		const requestURL=
				entityId ? `${this.baseURL}/${this.entityName}/${entityId}`
						 : this.baseURL;
		return this.http.post(requestURL, this.toApiObject(item), this.httpOptions).pipe( map( this.fromApiObject ) );
	}

	public update(item: T, entityId?: string): Observable<T>
	{
		const itemId= String( item["id"] || "0" ),
			requestURL=
				entityId ? `${this.baseURL}/${itemId}/${this.entityName}/${entityId}`
						 : `${this.baseURL}/${itemId}`;
		return this.http.put(requestURL, this.toApiObject(item), this.httpOptions).pipe( map( this.fromApiObject ) );
	}

	protected delete(item: T | string, entityId?: string, temporaryHeaders?: object): Observable<T>
	{
		if ( ! item )
			return null;
		const itemId=  String ( "id" in ( item as any ) ?  item["id"] : item ),
			requestURL=
				entityId ? `${this.baseURL}/${itemId}/${this.entityName}/${entityId}`
						 : `${this.baseURL}/${itemId}`;
		
		return this.http.delete( requestURL, this.getOptions(temporaryHeaders) ).pipe( map( this.fromApiObject ) );
	}

	protected getCustom(url: string, temporaryHeaders?: {}): Observable<T>
	{
		return this.http.get( url, this.getOptions(temporaryHeaders) ).pipe( map( this.fromApiObject ) );
	}

	/** makes sure the class object is in a compatible format with the api interface */
	private readonly toApiObject: ( obj: T ) => any;

	/** creates a new class object from the api interface, so the object methods, etc. work properly */
	private readonly fromApiObject: ( obj: any ) => T;

	/** creates a array of class objects, so data from the server can become object-oriented with working methods, etc. */
	private readonly fromApiArray: ([]) => T[];

	private _fromApiArray(arr: []): T[]
	{
		return arr.map(this.fromApiObject);
	}

	private getOptions(temporaryHeaders: {}): {}
	{
		if ( ! temporaryHeaders )
			return this.httpOptions;

		if ( ! this.httpOptions )
			return { headers: new HttpHeaders(temporaryHeaders) };
		
		let httpOptions= Object.assign({}, this.httpOptions); // make a copy of the options object
		if ( ! httpOptions.headers )
			httpOptions.headers= new HttpHeaders(temporaryHeaders);
		else for ( const name in temporaryHeaders )
				httpOptions.headers= httpOptions.headers.set(name, temporaryHeaders[name]);

		return httpOptions;
	}
}