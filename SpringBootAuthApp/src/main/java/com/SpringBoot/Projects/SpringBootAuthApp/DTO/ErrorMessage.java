package com.SpringBoot.Projects.SpringBootAuthApp.DTO;


import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;

import java.io.IOException;



@Component
public class ErrorMessage {

    public ErrorMessage(){}
    public ErrorMessage(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    private String message;


    public void sendErrorResponse(HttpServletResponse response, String message) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");

        ErrorMessage error = new ErrorMessage(message);
        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(error); // Convert to JSON string

        response.getWriter().write(json);
    }
}
