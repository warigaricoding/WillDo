package edu.gsu.bbb.willdo;

import org.springframework.data.annotation.Id;

import java.util.List;

public class Group {
    @Id
    private String id;
    //private User admin;
    private String name;
    private List<String> taskId;

    public Group(String id, String name, List<String> taskId) {
        this.id = id;
        this.name = name;
        this.taskId = taskId;
    }
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<String> getTaskId() {
        return taskId;
    }

    public void setTaskId(List<String> taskId) {
        this.taskId = taskId;
    }


}
