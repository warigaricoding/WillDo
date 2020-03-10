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
    @Autowired
    TaskRepository taskRepository;

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
    public Group addTask(@RequestBody Task newTask,@PathVariable String id){
        newTask.setId(ObjectId.get().toString());
        Optional<Group> temp = groupRepository.findById(id);
        if(taskRepository.findById(id).isPresent()){
            Optional<Group> findGroup = groupRepository.findById(id);
            Group updated = findGroup.get();
            findGroup
                    .map(group ->{
                        if(updated.getTaskId() == null){
                            updated.taskIdInit();
                            updated.addTask(newTask.getId());
                            group.setTaskId(updated.getTaskId());
                        }else{
                            updated.addTask(newTask.getId());
                            group.setTaskId(updated.getTaskId());
                        }
                        return groupRepository.save(group);
                    });
        }
        return temp.get();
    }



}

