package edu.gsu.bbb.willdo.Controllers;

import edu.gsu.bbb.willdo.models.Group;
import edu.gsu.bbb.willdo.Repositories.GroupRepository;
import edu.gsu.bbb.willdo.models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class GroupController {
    @Autowired
    GroupRepository groupRepository;

    @GetMapping("/Groups")
    public List<Group> getGroups(){
        return groupRepository.findAll();
    }

    @GetMapping("/Groups/{groupId}")
    public Optional<Group> findGroup(@PathVariable String groupId){
        Optional <Group> find = groupRepository.findById(groupId);
        Optional <Group> empty = Optional.empty();
        if(!find.isPresent()){
            return empty;
        }else{
            return find;
        }
    }
    @GetMapping("/Groups/users")
    public List<Group> userGroups(@RequestBody User userGroups){
        List<Group> temp;
        List<Group> tmp = (List<Group>) groupRepository.findAllById(userGroups.getGroups());

        return tmp;
    }

    @PostMapping("/Groups")
    public Object addGroup(@RequestBody Group group) {
        if (group.getName() == null) {
            group.setName("Untitled Group");
        }
        return groupRepository.save(group);
    }

    @PutMapping("/Groups/{groupId}")
    public Group updateGroup(@RequestBody Group newGroup, @PathVariable String groupId){
        Optional<Group> temp = groupRepository.findById(groupId);
        if(groupRepository.findById(groupId).isPresent()){
            temp.map(group ->{
                        if(newGroup.getName() != null){
                            group.setName(newGroup.getName());
                        }
						if (newGroup.getUsers() != null) {
            				group.setUsers(newGroup.getUsers());
    					}
                        return groupRepository.save(group);
                    });
        }
        return newGroup;
    }
}

