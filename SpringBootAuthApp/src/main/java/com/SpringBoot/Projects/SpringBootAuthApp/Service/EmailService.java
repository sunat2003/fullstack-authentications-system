package com.SpringBoot.Projects.SpringBootAuthApp.Service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {


    @Autowired
    JavaMailSender javaMailSender;


    public void sendEmailOtp(String email,String otp){
        SimpleMailMessage message=new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Your OTP for Password Reset");
        message.setText(
                "Hi,\n\n" +
                        "Here is your One-Time Password (OTP): " + otp + "\n" +
                        "It is valid for 10 minutes.\n\n" +
                        "If you did not request this, you can ignore this email.\n\n" +
                        "Regards,\n" +
                        "YourApp Team"
        );
        javaMailSender.send(message);
    }


    public void sendEmailOtpForVerifyUser(String email,String otp){
        SimpleMailMessage message=new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Your OTP for Verify User");
        message.setText(
                "Hi,\n\n" +
                        "Here is your One-Time Password (OTP): " + otp + "\n" +
                        "It is valid for 10 minutes.\n\n" +
                        "If you did not request this, you can ignore this email.\n\n" +
                        "Regards,\n" +
                        "YourApp Team"
        );
        javaMailSender.send(message);
    }
}
