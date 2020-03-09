package edu.gsu.bbb.willdo;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class GroupController {
    @Autowired
    GroupRepository groupRepository;
    TaskController taskLinker;

    @GetMapping("/Groups")
    public List<Group> getGroups(){
        return groupRepository.findAll();
    }

    @GetMapping("/Groups/{id}")
    public Optional<Group> findGroup(@PathVariable String id){
        Optional <Group> find = groupRepository.findById(id);
        Optional <Group> empty = Optional.empty();

        if(!find.isPresent()){
            //some error
        }else{
            return find;
        }
        return empty;
    }
    @PostMapping("/Groups")
    public Object addGroup(@RequestBody Group group) {
        Optional<Group> empty = Optional.empty();
        if (group.getName() == null) {
            //some error message
        } else {
            return groupRepository.save(group);
        }
        return empty;
    }
    @PutMapping("/Groups/{id}")
    public Object addTask(@RequestBody Group group,@PathVariable String id){
        Optional<Group> oldGroup = groupRepository.findById(id);
        Optional<Group> empty = Optional.empty();

        if(!oldGroup.isPresent()){
            //Some Error message
        }else{
	        if (group.getName() == null) {
	            //some error message
	        } else {
				
	            return groupRepository.save(group);
	        }
        }

        return empty;
    }

}

