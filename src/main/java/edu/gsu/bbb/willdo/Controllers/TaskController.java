package edu.gsu.bbb.willdo.Controllers;

import java.util.*;

import edu.gsu.bbb.willdo.models.Task;
import edu.gsu.bbb.willdo.Repositories.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.*;

@RestController
@RequestMapping("/api")
public class TaskController {
    @Autowired
    TaskRepository repository;

/*	
	@GetMapping("/tasks") // get all of a user's tasks
	public List<Task> all(@org.springframework.security.core.annotation.AuthenticationPrincipal User user) {
		ArrayList<Task> allTasks= new ArrayList<Task>();
		for ( String groupId : user.getGroups() )
			allTasks.addAll( repository.findAllByGroupId( groupId ) );
		return allTasks;
	}
*/

    @GetMapping("/tasks/group/{groupId}") //get one specific task
    public List<Task> taskFromGroup(@PathVariable String groupId) {
        return repository.findAllByGroupId(groupId); //Uses List from TaskRepository to generate queries by GroupId
    }

    @GetMapping("/tasks/{taskId}")
    public Optional<Task> findTask(@PathVariable String taskId){
        Optional<Task> findTask = repository.findById(taskId);
        Optional<Task> empty = Optional.empty();
        if(!findTask.isPresent()){
            return empty;
        }else{
            return findTask;
        }
    }

    @PostMapping("/tasks") //saves new task as new doc in DB
    public Object newTask(@RequestBody Task newTask) {
        if(newTask.getGroupId() == null){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Provide Group Id");
        }
        if(newTask.getSummary() == null){
            newTask.setSummary("New Task");
        }
        return repository.save(newTask);
    }

    @PutMapping("/tasks/{taskId}") //updates task already in DB
    public Task updateTask(@RequestBody Task newTask, @PathVariable String taskId) {
        if (repository.findById(taskId).isPresent()) {
            Optional<Task> oldTaskInfo = repository.findById(taskId)
                    .map(task -> { //Gets the data from the Optional and maps them to a new Task
                        if (newTask.getSummary() != null) {
                            task.setSummary(newTask.getSummary());
                        }
                        if (newTask.getDescription() != null) {
                            task.setDescription(newTask.getDescription());
                        }
                        if (newTask.getDate() != null) {
                            task.setDate(newTask.getDate());
                        }
                        if (newTask.isState() != task.isState()) {
                            task.setState(newTask.isState());
                        }
                        if (newTask.getGroupId() != null) {
                            task.setGroupId(newTask.getGroupId());
                        }
                        if (newTask.getAssignedUsers() != null) {
                            task.setAssignedUsers(newTask.getAssignedUsers());
                        }
                        return repository.save(task);
                    });
        }
        return newTask; //sends original request body so we can see what broke it
    }

	@DeleteMapping({ "/tasks/{taskId}", "/tasks/{taskId}/group/{groupId}" }) //delete task
    public void delete(@PathVariable String taskId, @PathVariable(required=false) String groupId) {
		if ( groupId != null )
			repository.deleteByIdAndGroupId(taskId, groupId);
		else repository.deleteById(taskId); 
    }
}
