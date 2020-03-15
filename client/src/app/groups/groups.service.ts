import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Group } from './group-class';
import { ApiService } from '../core/api.service';
import { ApiHelper } from  '../core/api.helper';

/** Communicates with the server's group controller. */
@Injectable({
	providedIn: 'root'
})
export class GroupService extends ApiService<Group>
{

	constructor(http: HttpClient)
	{
		super(http, new ApiHelper( Group ));
		this.baseURL+= "Groups";
	}

	// the base class already does everything we need right now!
}
