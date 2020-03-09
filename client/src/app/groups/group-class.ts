import { ApiIgnore, ApiProperty } from '../core/api.helper';
import { GroupService } from './groups.service';
import { Observable } from 'rxjs';

export class Group
{

	/** the id returned by the server */
	id: string;
	
	@ApiProperty("name")
	displayName: string;

	@ApiIgnore
	avatar: string;

	@ApiIgnore
	members: string[];

	@ApiIgnore
	admins: string[];

	constructor(id?, displayName?, avatar?, members?, admins?) // '?' denotes an optional argument
	{
		this.id= id;
		this.displayName= String( displayName || "" );
		this.avatar= String( avatar || "" );
		this.members=  members ?  Array.from(members) : [];
		this.admins=  admins ?  Array.from(admins) : [];
	}

	push(groupService: GroupService ): Observable<Group>
	{
		if ( this.id ) 
			return groupService.update(this);
		else return groupService.add(this);
	}

	isValid() {
		return  !! this.displayName;
	}

}