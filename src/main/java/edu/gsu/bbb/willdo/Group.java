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
}
