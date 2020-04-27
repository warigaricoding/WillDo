package edu.gsu.bbb.willdo.Repositories;

import edu.gsu.bbb.willdo.models.Group;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.repository.CrudRepository;

import java.util.List;
import java.util.Optional;

public interface GroupRepository extends MongoRepository<Group,String> {
    List<Group> findAllBy(List<String> id);
}

