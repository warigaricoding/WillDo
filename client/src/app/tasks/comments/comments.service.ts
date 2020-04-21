import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Comment } from './comment-class';
import { ApiService } from '../../core/api.service';
import { ApiHelper } from  '../../core/api.helper';


/** Communicates with the server's task controller. */
@Injectable({
	providedIn: 'root'
})
export class CommentService extends ApiService<Comment>
{

	constructor(http: HttpClient)
	{
		super(http, new ApiHelper( Comment ));
		this.baseURL+= "comments";
		this.entityName= "task"; // tells the base class what prefix to use when to get a task's comments
	}

}