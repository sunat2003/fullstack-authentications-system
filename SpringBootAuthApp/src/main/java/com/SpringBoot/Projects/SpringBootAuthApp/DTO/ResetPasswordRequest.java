package com.SpringBoot.Projects.SpringBootAuthApp.DTO;


import lombok.Data;

@Data
public class ResetPasswordRequest {

    private  String email;
    private String newPassword;
    private String confirmPassword;
}
