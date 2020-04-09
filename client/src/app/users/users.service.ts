import { Injectable, SimpleChange } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from './user-class';
import { ApiService } from '../core/api.service';
import { ApiHelper } from  '../core/api.helper';
import { Observable } from 'rxjs';

/** Communicates with the server's user controller. */
@Injectable({
	providedIn: 'root'
})
export class UserService extends ApiService<User>
{
	private urlForCurrentUser;

	constructor(http: HttpClient)
	{
		super(http, new ApiHelper( User ));
		this.baseURL+= "user";
		this.urlForCurrentUser= this.baseURL;
		this.baseURL+= "s";
		// while authentication is unimplemented
			// the logic for creating/editing a group can be used for a user
			// switching between users using the temporary setCurrentUser method
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

	get(userId?: string, headers?: {}): Observable<User>
	{
		return super.get( userId || this.__currentUserId, null, headers);
		// assumes the user controller allows creating & editing any user in simplified way for now
	}

	/** use this method to emulate signing in as a pre-existing user */
	setCurrentUser(id: string) {
		this.__currentUserId= id;
	}

	private __currentUserId: string;
	/* END TEMPORARY code */
}