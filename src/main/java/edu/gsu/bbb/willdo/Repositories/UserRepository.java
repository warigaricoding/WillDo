package edu.gsu.bbb.willdo.Repositories;

import edu.gsu.bbb.willdo.models.User;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserRepository extends MongoRepository<User, String> {
}
