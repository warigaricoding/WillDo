package edu.gsu.bbb.willdo.models;

import org.aspectj.lang.annotation.RequiredTypes;
import org.springframework.data.annotation.Id;

import javax.validation.constraints.Email;
import java.util.List;

public class User {
    @Id
    private String id;
    private String userID;
    private String fname;
    private String lname;
    private String email;
    private String password;
    private List<String> groups;

    public User() {

    }

    public String getId() {
        return id;
    }

    public String getUserID() {
        return userID;
    }

    public void setUserID(String userID) {
        this.userID = userID;
    }

    public String getFname() {
        return fname;
    }

    public void setFname(String fname) {
        this.fname = fname;
    }

    public String getLname() {
        return lname;
    }

    public void setLname(String lname) {
        this.lname = lname;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public List<String> getGroups() {
        return groups;
    }

    public void setGroups(List<String> groups) {
        this.groups = groups;
    }
}
