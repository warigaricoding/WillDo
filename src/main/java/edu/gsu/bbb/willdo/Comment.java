package edu.gsu.bbb.willdo;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;

public class Comment {
    @Id
    private String id; //Only used for PutMapping

	@Indexed
	private String taskId; //Key to linking a comment to a task, should be null until instantiated

	private String user;
	private String body;
	private String date;

    public Comment() {}

    public void setId(String id){
        this.id = id;
    }

    public String getId() {
        return id;
    }

    public String getUser() {
        return user;
    }

    public void setUser(String user) {
        this.user = user;
    }

    public String getBody() {
        return body;
    }

    public void setBody(String body) {
        this.body = body;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getTaskId(){
        return this.taskId;
    }

    public void setTaskId(String id){
        this.taskId = id;
    }
}