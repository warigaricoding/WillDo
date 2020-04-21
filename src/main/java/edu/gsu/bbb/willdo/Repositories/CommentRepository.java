package edu.gsu.bbb.willdo.Repositories;

import edu.gsu.bbb.willdo.models.Comment;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface CommentRepository extends MongoRepository <Comment, String> {

	List<Comment> findAllByTaskId(String taskId); //Allows for task query of comments by taskId
	void deleteByTaskId(String taskId); //Allows for task deletion of comments by taskId

	Optional<Comment> findByIdAndTaskId(String id, String taskId);
	void deleteByIdAndTaskId(String id, String taskId);
}