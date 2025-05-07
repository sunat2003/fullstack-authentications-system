package com.SpringBoot.Projects.SpringBootAuthApp.DTO;


import lombok.Data;

@Data
public class VerifyOtpRequest {

    private String email;
    private String otp;

}
