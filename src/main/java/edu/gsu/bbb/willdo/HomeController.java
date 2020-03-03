package edu.gsu.bbb.willdo;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

//This should be a way to make our home page
@Controller
public class HomeController {

    @RequestMapping(value = "/")
    public String index(){
        return "index";
    }

}
