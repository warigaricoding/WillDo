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

	/** updates or creates a group depending on whether it already exists on the server */
	push(groupService: GroupService ): Observable<Group>
	{
		if ( this.id ) // if the group already has an id, all we need to do is update it
			return groupService.update(this);
		else return groupService.add(this); // creates a new group
	}

	/** determines if the group is allowed to be sent to the server */
	isValid() {
		return  !! this.displayName;
	}

}