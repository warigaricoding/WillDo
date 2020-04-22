package edu.gsu.bbb.willdo.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import java.util.List;

public class Task {
    @Id
    private String id; //Only used for PutMapping

	@Indexed
	private String groupId; //Key to linking a task to a group, should be null until instantiated

    private String summary;
    private String description;
    private String date;    
    private boolean state;
	private List<String> assignedUsers;

    public Task() {}

    public void setId(String id){
        this.id = id;
    }

    public String getId() {
        return id;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public boolean isState() {
        return state;
    }

    public void setState(boolean state) {
        this.state = state;
    }

    public String getGroupId(){
        return this.groupId;
    }

    public void setGroupId(String id){
        this.groupId = id;
    }

	public List<String> getAssignedUsers(){
        return assignedUsers;
    }

	public void setAssignedUsers(List<String> assignedUsers){
        this.assignedUsers = assignedUsers;
    }
}