import { Component, OnInit, Input } from '@angular/core';
import { interval, Observable, combineLatest, Subscription, of } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';

import { CommentService } from './comments.service'; // this service handles all the task-related server communications for us
import { Comment } from './comment-class';

@Component({
	selector: 'comment-list',
	template: `
		<ion-item *ngFor="let comment of comments; trackBy: trackById">
			{{ comment.body }}
			<ion-label slot="end">
				{{ comment.date | date:'h a, MMMM d, y' }}
			</ion-label>
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
	subscription: Subscription;

	constructor(private commentService: CommentService) { }

	ngOnInit() {
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

	/** returns what makes each item unique to prevent UI repainting when new data is received */
	trackById(index: number, item: Comment): string
	{
		return item.body;
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}

}