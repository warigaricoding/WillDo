import { Component, OnInit, Input } from '@angular/core';
import { interval, Observable, combineLatest, Subscription, of } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';

import { CommentService } from './comments.service'; // this service handles all the task-related server communications for us
import { Comment } from './comment-class';
import { AuthService } from '../../core/auth.service';

@Component({
	selector: 'comment-list',
	template: `
		<ion-item *ngFor="let comment of comments; trackBy: trackById">
			{{ comment.body }}
			<ion-label slot="end">
				{{ comment.date | date:'h a, MMMM d, y' }}
			</ion-label>
			<user-compact slot="end" [id]="comment.creator"></user-compact>
		</ion-item>
		<ion-item>
			<ion-input [(ngModel)]="newComment.body" placeholder="[enter a comment]">
			</ion-input>
			<ion-buttons>
				<ion-button (click)="addComment()" [disabled]="!newComment.body" [hidden]="addingComment">
					<ion-icon name="send"></ion-icon>
				</ion-button>
				<ion-button (click)="cancelComment()" [hidden]="!addingComment" >
					<ion-icon name="pause"></ion-icon>
				</ion-button>
			</ion-buttons>
		</ion-item>
	`,
	styles: [ `

	` ]
})
export class CommentListComponent implements OnInit
{
	@Input()
	taskId: string;

	comments: Comment[];
	newComment: Comment;
	subscription: Subscription;
	addingComment: boolean
	adddingCommentSubscription: Subscription;

	constructor(private commentService: CommentService, private authService: AuthService) { }

	ngOnInit() {

		// in case the user wants to comment on the current task
		this.newComment= new Comment(this.taskId); 

		// check for updated comments whenever 500 ms has elapsed
		this.subscription=
		interval(500).pipe(startWith(0))
			.pipe( switchMap( x => this.commentService.getAll(this.taskId) ) ) // requests all of a task's comments from the server */
			.subscribe( tasks => this.onRequestReturn(tasks) );
			// interval is a temporary method for easily refreshing tasks
				// observables are just a way of listening to events
					// *.subscribe tells the observable to call the function when something happens
						// in this case when the server returns
					// here, switchMap requests data from the server, cancelling and removing previous requests from memory
					// a pipe, like startWith, simply transfrorms the current observable
						// in this case startWith causes the interval event to trigger in 0 seconds the first time
	}

	/** sorts the list of tasks from the server and updates the view */
	onRequestReturn(comments: Comment[]) {
		this.comments= comments.sort(Comment.compare);
	}

	addComment()
	{
		this.newComment.date= new Date().toISOString(); // set the comment's date to right now
		this.newComment.owner= this.taskId; // make sure that the comment is associated with the current task
		if ( ! this.addingComment )
			this.addingComment= true,
			this.authService.getId().then( userId => this.onUserReturn(userId) ); // gets the user's current id
	}

	onUserReturn(userId: string)
	{
		if ( this.addingComment )
		{
			this.newComment.creator= userId;
			if ( this.newComment.isValid() )
				this.adddingCommentSubscription=
					this.commentService.add( this.newComment )
						.subscribe( comment => this.onAddReturn(comment), () => this.onAddError(), () => this.onAddFinally() );
			else this.addingComment= false;
		}
	}

	cancelComment()
	{
		if ( this.adddingCommentSubscription )
			this.adddingCommentSubscription.unsubscribe();
		this.onAddFinally();
	}

	onAddReturn(comment: Comment) {
		this.comments.push( comment );
		this.newComment= new Comment(this.taskId);
	}

	onAddError() {
		this.onAddFinally();
	}

	onAddFinally() {
		this.addingComment= false;
		this.adddingCommentSubscription= null;
	}

	/** returns what makes each item unique to prevent UI repainting when new data is received */
	trackById(index: number, item: Comment): string
	{
		return item.body;
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}

}