package edu.gsu.bbb.willdo;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface TaskRepository extends MongoRepository <Task, String> {

	java.util.List<Task> findAllByGroup(String group);

	java.util.Optional<Task> findByIdAndGroup(String id, String group);

	void deleteByIdAndGroup(String id, String group);

}