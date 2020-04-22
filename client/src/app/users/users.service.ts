import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, of, throwError, PartialObserver } from 'rxjs';
import { delay } from 'rxjs/operators';

import { User } from './user-class';
import { ApiService } from '../core/api.service';
import { ApiHelper } from  '../core/api.helper';

/** Communicates with the server's user controller. */
@Injectable({
	providedIn: 'root'
})
export class UserService extends ApiService<User>
{
	private urlForCurrentUser;
	private urlForGetByName;

	/** long-term observable of the current user; reflects changes across the entire app */
	private dynamicUser: Subject<User>;

	/** allows dynamicUser to outlive short-term events */
	private dynamicBridge: PartialObserver<User>;

	constructor(http: HttpClient)
	{
		super(http, new ApiHelper( User ));
		this.baseURL+= "user";
		this.urlForCurrentUser= this.baseURL;
		this.baseURL+= "s";
		this.urlForGetByName= this.baseURL + "/name/";
		this.dynamicUser= new Subject<User>();
		this.dynamicBridge= {
			next: user => this.dynamicUser.next(user),
			error: e => this.dynamicUser.error(e)
		}
		// while authentication is unimplemented
			// the logic for creating/editing a group can be used for a user
			// switching between users using the temporary setCurrentUser method
		this.userCache= this.fromApiArray( JSON.parse(localStorage.getItem("__users")) || [] );
	}

	/** gets a long-term subscription to the current user if no user id is provided */
	/* START real code
	get(userId?: string, authHeaders?: {}): Observable<User> // when the server supports some form of authentication
	{
		if ( userId )
			return super.get(userId, null, authHeaders);
		else {
			let staticUser= super.getCustom(this.urlForCurrentUser, authHeaders)
			staticUser.subscribe(this.dynamicBridge); // dynamicUser now sees responses from this newly created observable
			if ( authHeaders )
				return staticUser; // authenticating is a short-term subscription
			else return this.dynamicUser; // retrieving the current user is a long-term subscription
		}
	}
	getByName(username: string): Observable<User>
	{
		return super.getCustom( this.urlForGetByName + username );
	}
	add(user: User): Observable<User>
	{
		let staticUser= super.add(user); // short-term observable of the newly created user
		staticUser.subscribe(this.dynamicBridge); // dynamicUser now sees responses from the staticUser observable
		return staticUser; // creating an account is a short-term subscription
	}
	update(user: User): Observable<User>
	{
		let staticUser= super.update(user); // short-term observable of the newly created user
		staticUser.subscribe(this.dynamicBridge); // dynamicUser now sees responses from the staticUser observable
		return staticUser; // updating the current account is a short-term subscription
	}
	// END real Code
	/*/// START TEMPORARY code
	get(id?: string, authHeaders?: {}): Observable<User> {
		if ( id )
			return this.tmpGet(id, authHeaders);
		else {
			let staticUser= this.tmpGet(id, authHeaders);
			staticUser.subscribe(this.dynamicBridge);
			if ( authHeaders )
				return staticUser; // authenticating is a short-term subscription
			else return this.dynamicUser; // reflects changes to the current user, long-term
		}
	}
	add(user: User): Observable<User> {
		let staticUser= this.tmpAdd(user); // short-term observable of the newly created user
		staticUser.subscribe(this.dynamicBridge); // dynamicUser now sees responses from the staticUser observable
		return staticUser; // creating an account is a short-term subscription
	}
	update(user: User): Observable<User> {
		let staticUser= this.tmpUpdate(user); // short-term observable of the user update response
		staticUser.subscribe(this.dynamicBridge); // dynamicUser now sees responses from the staticUser observable
		return staticUser; // updating the current account is a short-term subscription
	}
	
	private _tmpGet(userId?: string, headers?: {}): Observable<User> // when the server supports users
	{
		return super.get( userId || this.__currentUserId, null, headers);
		// assumes the user controller allows creating & editing any user in simplified way for now
	}

	/** use this method to emulate signing in as a pre-existing user */
	setCurrentUser(id: string) {
		this.__currentUserId= id;
	}

	private __currentUserId: string;

	// stores users in the browser's local storage for now
	private userCache: User[];
	private tmpGet(id?: string, temporaryHeaders?: {}): Observable<User> {
		if ( ! id )
			if ( temporaryHeaders && temporaryHeaders['_username'] )
			{
				let currentUser= this.userCache.find( user => user.username == temporaryHeaders['_username'] );
				this.__currentUserId= currentUser ?  currentUser.id : null;
				return of(currentUser).pipe(delay(1));
			}
			else return of(this.userCache.find( user => user.id === this.__currentUserId )).pipe(delay(1));
		else return of(this.userCache.find( user => user.id === id )).pipe(delay(1));
	}
	private tmpAdd(user: User, entityId?: string): Observable<User> {
		user.id= ( Math.random() * 0xFFFFFFFF >>> 0).toString(16);
		this.__currentUserId= user.id;
		this.userCache.push(user);
		localStorage.setItem("__users", JSON.stringify(this.userCache));
		return of(user).pipe(delay(1));
	}
	private tmpUpdate(user: User, entityId?: string): Observable<User> {
		if ( user.id !== this.__currentUserId )
			return throwError("can't update another account");
		let oldUserIndex= this.userCache.findIndex( user => user.id == this.__currentUserId );
		this.userCache[oldUserIndex]= user;
		localStorage.setItem("__users", JSON.stringify(this.userCache));
		return of(user).pipe(delay(1));
	}
	getByName(username: string): Observable<User>
	{
		return of(this.userCache.find( user => user.username == username )).pipe(delay(1));
	}
	/* END TEMPORARY code */
}