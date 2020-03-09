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

    @GetMapping({ "/tasks", "/tasks/group/{group}" }) //get all tasks
    public List<Task> all( @PathVariable(required= false) String group) {
		if ( group != null )
			return repository.findAllByGroup(group);
        else return repository.findAll();
    }

	@GetMapping({ "/tasks/{id}", "/tasks/{id}/group/{group}" }) //get one specific task
    public Optional<Task> task(@PathVariable String id, @PathVariable(required=false) String group) {
        Optional<Task> findTask =  group != null ?  repository.findByIdAndGroup(id, group) : repository.findById(id);
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
            return repository.save(newTask);
        }
        return empty; //should not return this ever
    }

    @PutMapping("/tasks/{id}") //updates task already in DB
    public Task updateTask(@RequestBody Task newTask, @PathVariable String id) {
		Optional<Task> oldTaskInfo;
		String group= newTask.getGroup();
		if ( group == null || group.isEmpty() )
			oldTaskInfo= repository.findById(id);
		else oldTaskInfo= repository.findByIdAndGroup(id, group);
        if (oldTaskInfo.isPresent()) {
            oldTaskInfo = oldTaskInfo
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
                                && ( newTask.isState() || true )) {
                            task.setState(newTask.isState());
                        }
                        return repository.save(task);
                    });
        }
        return newTask; //sends original request body so we can see what broke it
    }

	@DeleteMapping({ "/tasks/{id}", "/tasks/{id}/group/{group}" }) //delete task
    public void delete(@PathVariable String id, @PathVariable(required=false) String group) {
		if ( group != null )
			repository.deleteByIdAndGroup(id, group);
		else repository.deleteById(id); 
    }
}
