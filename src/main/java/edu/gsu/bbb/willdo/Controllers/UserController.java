package edu.gsu.bbb.willdo.Controllers;


import edu.gsu.bbb.willdo.Repositories.UserRepository;
import edu.gsu.bbb.willdo.models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.List;

@RestController("/api")
public class UserController {
    @Autowired
    UserRepository repository;

    @GetMapping("/Users")
    public List<User> getUsers(){
        return repository.findAll();
    }
    @GetMapping("/Users/{Userid}")
    public Optional<User> getUser(@PathVariable String id){
        Optional<User> find = repository.findById(id);
        Optional<User> empty = Optional.empty();
        if(!find.isPresent()){
            return empty;
        }else {
            return find;
        }
    }
    @PostMapping("/Users")
    public Object newUser(@RequestBody User newUser){
        if(newUser.getEmail()==null){
            //throws frontside error
        }
        if(newUser.getFname()==null){
            //throws frontside error
        }
        if(newUser.getLname()==null){
            //throws frontside error
        }
        if(newUser.getPassword()==null){
            //throws frontside error
        }
        if(newUser.getUserID()==null){
            newUser.setUserID(newUser.getFname()+" "+newUser.getLname());
        }
        return repository.save(newUser);
    }

}
