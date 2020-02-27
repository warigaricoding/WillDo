package edu.gsu.bbb.willdo;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(collectionResourceRel = "task", path = "task")
public interface TaskRepository extends MongoRepository <Task, String> {
    List<Task> findById(@Param("id") int id);
}