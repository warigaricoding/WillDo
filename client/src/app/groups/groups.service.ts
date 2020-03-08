import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Group } from './group-class';
import { ApiService } from '../core/api.service';
import { AuthService } from '../core/auth.service';
import { ApiHelper } from  '../core/api.helper';

@Injectable({
	providedIn: 'root'
})
export class GroupService extends ApiService<Group>
{

	constructor(
		http: HttpClient,
		auth: AuthService
	) {
		super(http, auth, new ApiHelper( Group ));
		this.baseURL+= "Groups";
	}
}
