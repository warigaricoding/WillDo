import { ApiIgnore, ApiProperty } from '../../core/api.helper';
import { CommentService } from './comments.service';

export class Comment
{

	/** the content of the comment */
	body: string;

	/** the date the comment was created/modified */
	date: string;
	
	/** the task this comment was created for (id) */
	@ApiProperty("task")
	owner: string;
	
	/** the user that created this comment */
	@ApiProperty("user")
	creator: string;

	constructor(owner?, body?, date?, creator?) // '?' denotes an optional argument
	{
		// this.id= id;
		this.owner= String( owner || "" );
		this.body= String( body || "" );
		this.date= new Date ( date || Date.now() ).toISOString();
		this.creator= String( creator || "" );
	}


	/** sorts tasks based on their date */
	public static compare(a: Comment, b: Comment) {
		return Date.parse(a.date) - Date.parse(b.date);
	}

}