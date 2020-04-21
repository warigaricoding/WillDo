package edu.gsu.bbb.willdo;

import java.util.*;	
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.*;

@RestController
@RequestMapping("/api")
public class CommentController {
    @Autowired
    CommentRepository repository;

    @GetMapping("/comments/task/{taskId}") // all of a task's comments
    public List<Comment> commentFromTasks(@PathVariable String taskId) {
        return repository.findAllByTaskId(taskId); //Uses List from CommentRepository to generate queries by TaskId
    }

    @GetMapping("/comments/{commentId}")
    public Optional<Comment> findComment(@PathVariable String commentId){
        Optional<Comment> findComment = repository.findById(commentId);
        Optional<Comment> empty = Optional.empty();
        if(!findComment.isPresent()){
            return empty;
        }else{
            return findComment;
        }
    }

    @PostMapping("/comments") //saves new comment as new doc in DB
    public Object newComment(@RequestBody Comment newComment) {
        if(newComment.getTaskId() == null){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Provide Task Id");
        }
        if(newComment.getBody() == null){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Provide Comment");
        }
        if(newComment.getUser() == null){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Provide User Id");
        }
		// newComment.setUser( currentUser.getId() ); // when user class implements spring's AuthenticationPrincipal feature
        return repository.save(newComment);
    }


    @PutMapping("/comments/{commentId}") //updates comment already in DB
    public Comment updateComment(@RequestBody Comment newComment, @PathVariable String commentId) {
        if (repository.findById(commentId).isPresent()) {
            Optional<Comment> oldCommentInfo = repository.findById(commentId)
                    .map(comment -> { //Gets the data from the Optional and maps them to a new Comment
                        if (newComment.getBody() != null) {
                            comment.setBody(newComment.getBody());
                        }
                        if (newComment.getDate() != null) {
                            comment.setDate(newComment.getDate());
                        }
                        return repository.save(comment);
                    });
        }
        return newComment; //sends original request body so we can see what broke it
    }

	@DeleteMapping({ "/comments/{commentId}", "/comments/{commentId}/task/{taskId}" }) //delete comment
    public void delete(@PathVariable String commentId, @PathVariable(required=false) String taskId) {
		if ( taskId != null )
			repository.deleteByIdAndTaskId(commentId, taskId);
		else repository.deleteById(commentId); 
    }
}
