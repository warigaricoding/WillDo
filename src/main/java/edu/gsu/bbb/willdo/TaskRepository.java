package edu.gsu.bbb.willdo;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface TaskRepository extends MongoRepository <Task, String> {
}