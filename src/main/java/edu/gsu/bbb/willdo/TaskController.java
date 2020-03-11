package edu.gsu.bbb.willdo;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class TaskController {

    @Autowired
    TaskRepository repository;

    @GetMapping("/tasks") //get all tasks
    public List<Task> all() {
        return repository.findAll();
    }

    @GetMapping("/tasks/{groupId}") //get one specific task
    public List<Task> taskFromGroup(@PathVariable String groupId) {
        return repository.findAllByGroupId(groupId);
    }

    @PostMapping("/tasks/{groupId}") //saves new task as new doc in DB
    public Object newTaskToGroup(@RequestBody Task newTask, @PathVariable String groupId) {
        Optional<Task> empty = Optional.empty(); //to see if it leaves loop
        newTask.setGroupId(groupId);
        if(newTask.getSummary() == null){
            //some response annotation; null values
        } else {
            return repository.save(newTask);
        }
        return empty; //should not return this ever
    }

    @PutMapping("/tasks/{id}") //updates task already in DB
    public Task updateTask(@RequestBody Task newTask, @PathVariable String id) {
        if (repository.findById(id).isPresent()) {
            Optional<Task> oldTaskInfo = repository.findById(id)
                    .map(task -> {
                        if (newTask.getSummary() != null) {
                            task.setSummary(newTask.getSummary());
                        }
                        if (newTask.getDescription() != null) {
                            task.setDescription(newTask.getDescription());
                        }
                        if (newTask.getDate() != null) {
                            task.setDate(newTask.getDate());
                        }
                        if (newTask.isState() != task.isState()
                                && newTask.isState()) {
                            task.setState(newTask.isState());
                        }
                        if (newTask.getGroupId() != null) {
                            task.setGroupId(newTask.getGroupId());
                        }

                        return repository.save(task);
                    });
        }
        return newTask; //sends original request body so we can see what broke it
    }
    @DeleteMapping("/tasks/{id}")
    public Optional<Task> deleteTask(@PathVariable String id){
        Optional<Task> delTask = repository.findById(id);
        Optional<Task> empty = Optional.empty();
        if(!delTask.isPresent()){
            //some error message
        }else{
            repository.delete(delTask.get());
        }
        return empty;
    }
}
