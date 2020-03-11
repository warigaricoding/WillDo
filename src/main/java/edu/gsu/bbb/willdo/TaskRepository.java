package edu.gsu.bbb.willdo;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface TaskRepository extends MongoRepository <Task, String> {
    List<Task> findAllByGroupId(String groupId);
    void deleteByGroupId(String groupId);
}