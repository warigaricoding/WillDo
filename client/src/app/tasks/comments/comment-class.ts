import { ApiIgnore, ApiProperty } from '../../core/api.helper';
import { CommentService } from './comments.service';

export class Comment
{

	/** the content of the comment */
	body: string;

	/** the date the comment was created/modified */
	@ApiProperty("date", "datestring")
	date: string;
	
	/** the task this comment was created for (id) */
	@ApiProperty("taskId")
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

	isValid(): boolean
	{
		return  typeof this.body == "string"  &&  !! this.body
				 &&  typeof this.owner == "string"  &&  !! this.owner
				 &&  !! this.date
			;
	}

	/** sorts tasks based on their date */
	public static compare(a: Comment, b: Comment) {
		return Date.parse(a.date) - Date.parse(b.date);
	}

}