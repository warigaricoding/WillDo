package edu.gsu.bbb.willdo;

import org.springframework.data.annotation.Id;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class Group {
    @Id
    private String id;
    //private User admin;  Will be implemented with the addition of users
    private String name;
    private List<String> taskId;
    private List<String> archiveId;
    //private List<Users> groupList; Needs user implementation

    public Group() {}

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

    public void taskIdInit(){
        this.taskId = new ArrayList<String>();
    }
    public void addTask(String id){
        this.taskId.add(id);
    }
}
