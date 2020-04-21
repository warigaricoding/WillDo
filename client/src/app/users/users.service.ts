import { Injectable, SimpleChange } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from './user-class';
import { ApiService } from '../core/api.service';
import { ApiHelper } from  '../core/api.helper';
import { Observable, of } from 'rxjs';

/** Communicates with the server's user controller. */
@Injectable({
	providedIn: 'root'
})
export class UserService extends ApiService<User>
{
	private urlForCurrentUser;
	private urlForGetByName;

	constructor(http: HttpClient)
	{
		let tHelp= new ApiHelper( User );
		super(http, tHelp);
		this.baseURL+= "user";
		this.urlForCurrentUser= this.baseURL;
		this.baseURL+= "s";
		this.urlForGetByName= this.baseURL + "/name/";
		// while authentication is unimplemented
			// the logic for creating/editing a group can be used for a user
			// switching between users using the temporary setCurrentUser method
		this.userCache= JSON.parse(localStorage.getItem("__users")) || [];
		this.userCache= this.userCache.map( obj => tHelp.fromApiObject(obj) );
	}

	_getByName(username: string): Observable<User>
	{
		return super.getCustom( this.urlForGetByName + username );
	}


	/** Gets the current user if no user id is provided */
	/* START real code
	get(userId?: string, headers?: {}): Observable<User>
	{
		if ( userId )
			return super.get(userId, null, headers);
		else return super.getCustom(this.urlForCurrentUser, headers);
	}
	// END real Code
	/*/// START TEMPORARY code

	
	_get(userId?: string, headers?: {}): Observable<User>
	{
		return super.get( userId || this.__currentUserId, null, headers);
		// assumes the user controller allows creating & editing any user in simplified way for now
	}

	/** use this method to emulate signing in as a pre-existing user */
	setCurrentUser(id: string) {
		this.__currentUserId= id;
	}

	private __currentUserId: string;

	
	private userCache: User[];

	get(id?: string, temporaryHeaders?: {}): Observable<User>
	{
		if ( ! id )
			if ( temporaryHeaders && temporaryHeaders['_username'] )
			{
				this.userCache.find( user => user.username == temporaryHeaders['_username'] );
				let currentUser= this.userCache.find( user => user.username == temporaryHeaders['_username'] );
				console.log(this.userCache);
				this.__currentUserId= currentUser.id;
				return of(currentUser);
			}
			else return of(this.userCache.find( user => user.id === this.__currentUserId ));
		else return of(this.userCache.find( user => user.id === id ));
	}

	add(item: User, entityId?: string): Observable<User>
	{
		item.id= ( Math.random() * 0xFFFFFFFF >>> 0).toString(16);
		this.userCache.push(item);
		localStorage.setItem("__users", JSON.stringify(this.userCache));
		return of(item);
	}

	getByName(username: string): Observable<User>
	{
		return of(this.userCache.find( user => user.username == username ));
	}


	/* END TEMPORARY code */
}