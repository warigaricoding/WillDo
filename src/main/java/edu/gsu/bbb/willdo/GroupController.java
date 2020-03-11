package edu.gsu.bbb.willdo;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
public class GroupController {
    @Autowired
    GroupRepository groupRepository;



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
            group.setName("Untitled Group");
        } else {
            return groupRepository.save(group);
        }
        return empty;
    }
    @PutMapping("/Groups/{id}")
    public Group updateGroup(@RequestBody Group newGroup,@PathVariable String id){
        Optional<Group> temp = groupRepository.findById(id);
        if(groupRepository.findById(id).isPresent()){
            temp.map(group ->{
                        if(newGroup.getName()!=null){
                            group.setName(newGroup.getName());
                        }
                        return groupRepository.save(group);
                    });
        }
        return newGroup;
    }



}

