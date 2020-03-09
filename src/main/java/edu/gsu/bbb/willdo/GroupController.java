package edu.gsu.bbb.willdo;

import org.graalvm.compiler.nodes.calc.IntegerDivRemNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
public class GroupController extends TaskController{
    @Autowired
    GroupRepository repository;


    @GetMapping("/Groups")
    public List<Group> getAll(){
        return repository.findAll();
    }
    @GetMapping("/Groups/{id}")
    public Optional<Group> findGroup(@PathVariable String id){
        Optional <Group> find = repository.findById(id);
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
            return repository.save(group);
        }
        return empty;
    }
    @PostMapping("/Groups/{id}")
    public Object addTask(@RequestBody Task task,@PathVariable String id){
        Optional<Group> group = repository.findById(id);
        Optional<Group> empty = Optional.empty();

        if(!group.isPresent()){
            //Some Error message
        }else{
            group.get().getTaskId().add(task.getId());
        }
        newTask(task);
        return empty;
    }

}

