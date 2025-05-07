package com.SpringBoot.Projects.SpringBootAuthApp.Controller;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*") // Adjust your frontend URL
public class HomeController {


    @GetMapping("/home")
    public ResponseEntity<?> getHome(){
        Map<String,String> res=new HashMap<>();
        res.put("data","This is My home page");
        return ResponseEntity.ok(res);
    }
}
