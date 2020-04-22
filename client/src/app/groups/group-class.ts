import { ApiIgnore, ApiProperty } from '../core/api.helper';
import { GroupService } from './groups.service';

export class Group
{

	/** the id returned by the server */
	id: string;
	
	@ApiProperty("name")
	displayName: string;

	@ApiIgnore
	avatar: string;

	@ApiProperty("users")
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
	pushChanges(
		groupService: GroupService,
		callback?: (group) => void, // what do when the change is pushed
		onError?: (e) => void
	) {
		if ( this.id ) // if the group already has an id, all we need to do is update it
			groupService.update(this).subscribe({ next: callback, error: onError });
		else groupService.add(this).subscribe({ next: callback, error: onError }); // creates a new group
	}

	/** determines if the group is allowed to be sent to the server */
	isValid() {
		return  !! this.displayName;
	}

}