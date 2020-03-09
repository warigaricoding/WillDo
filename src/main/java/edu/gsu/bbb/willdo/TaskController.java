package edu.gsu.bbb.willdo;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
public class TaskController {

    @Autowired
    TaskRepository taskRepository;

    @GetMapping("/tasks") //get all tasks
    public List<Task> getTasks() {
        return taskRepository.findAll();
    }

    @GetMapping("/tasks/{id}") //get one specific task
    public Optional<Task> findTask(@PathVariable String id) {
        Optional<Task> findTask = taskRepository.findById(id);
        Optional<Task> empty = Optional.empty(); //to see if it leaves loop

        if(!findTask.isPresent()) {
            //some response annotation; invalid parameters?
        } else {
            return findTask;
        }
        return empty; //should not return this ever
    }

    @PostMapping("/tasks") //saves new task as new doc in DB
    public Object newTask(@RequestBody Task newTask) {
        Optional<Task> empty = Optional.empty(); //to see if it leaves loop

        if(newTask.getSummary() == null){
            //some response annotation; null values
        } else {
            return taskRepository.save(newTask);
        }
        return empty; //should not return this ever
    }

    @PutMapping("/tasks/{id}") //updates task already in DB
    public Task updateTask(@RequestBody Task newTask, @PathVariable String id) {
        if (taskRepository.findById(id).isPresent()) {
            Optional<Task> oldTaskInfo = taskRepository.findById(id)
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
                        return taskRepository.save(task);
                    });
        }
        return newTask; //sends original request body so we can see what broke it
    }
}
