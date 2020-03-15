package edu.gsu.bbb.willdo;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface TaskRepository extends MongoRepository <Task, String> {
    List<Task> findAllByGroupId(String groupId); //Allows for group query of tasks by groupId
    void deleteByGroupId(String groupId); //Allows for group deletion of tasks by groupId
}