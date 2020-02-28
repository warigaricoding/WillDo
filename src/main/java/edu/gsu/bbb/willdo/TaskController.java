package edu.gsu.bbb.willdo;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
public class TaskController {

    @Autowired
    TaskRepository repository;

    @GetMapping("/tasks")
    public List<Task> all() {
        return repository.findAll();
    }

    @GetMapping("/tasks/{id}")
    public Optional<Task> task(@PathVariable String id) {

        return repository.findById(id);
    }

    @PostMapping("/tasks")
    public Task newTask(@RequestBody Task newTask) {
        return repository.save(newTask);
    }
}
