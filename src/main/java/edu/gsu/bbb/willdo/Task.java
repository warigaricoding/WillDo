package edu.gsu.bbb.willdo;

import org.springframework.data.annotation.Id;

public class Task {
    @Id
    private String id;

    private String summary;
    private String description;
    private String date;
    private String groupId;
    private boolean state;

    public Task() {}

    public void setId(String id){
        this.id = id;
    }

    public String getId() { return id; }

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
}