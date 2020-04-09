import { UserService } from './users.service';

export class User
{
	/** the id returned by the server */
	id: string;

	displayName: string;

	groups: string[];

	private email: string;

	get username() {
		return this.email;
	}
	set username(value: string) {
		if (  value  &&  typeof value === "string"  )
			this.email= value;
	}

	set avatar(value: string) { }
	
	// when submitting this class to the server
		// manually adding the password (i.e. user['password']= value) may be necessary

	constructor(id?, displayName?, avatar?, groups?, username?) // '?' denotes an optional argument
	{
		this.id= id;
		this.displayName= String( displayName || "" );
		this.avatar= String( avatar || "" );
		this.groups=  groups ?  Array.from(groups) : [];
		this.username= username;
	}
}