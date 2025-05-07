package com.SpringBoot.Projects.SpringBootAuthApp.Controller;


import com.SpringBoot.Projects.SpringBootAuthApp.DTO.*;
import com.SpringBoot.Projects.SpringBootAuthApp.Entity.User;
import com.SpringBoot.Projects.SpringBootAuthApp.Entity.UserVerify;
import com.SpringBoot.Projects.SpringBootAuthApp.Repository.UserRepository;
import com.SpringBoot.Projects.SpringBootAuthApp.Repository.UserVerifyRepository;
import com.SpringBoot.Projects.SpringBootAuthApp.Service.EmailService;
import com.SpringBoot.Projects.SpringBootAuthApp.Util.JwtUtil;
import com.SpringBoot.Projects.SpringBootAuthApp.Util.PasswordUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.client.endpoint.RestClientJwtBearerTokenResponseClient;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(originPatterns = "*")
public class UserController {


    @Autowired
    UserRepository userRepository;


    @Autowired
    UserVerifyRepository userVerifyRepository;



    @Autowired
    JwtUtil jwtUtil;



    @Autowired
    EmailService emailService;





    @PostMapping("/register")
    public ResponseEntity<?> resgisterUser(@RequestBody RegisterRequest registerRequest){
        if(userRepository.findByEmail(registerRequest.getEmail()).isPresent()){
            Map<String,String> message=new HashMap<>();
            message.put("message","User Alraedy Exist");
            return ResponseEntity.badRequest().body(message);
        }
        User user=new User();
        user.setEmail(registerRequest.getEmail());
        user.setUsername(registerRequest.getUsername());
        user.setPassword(PasswordUtil.encodePassword(registerRequest.getPassword()));
        userRepository.save(user);

        Map<String, Object> res=new HashMap<>();
        res.put("message","User Register successfully");
        res.put("data",user);
        return ResponseEntity.ok(res);
    }


    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest){
        Optional<User> user = userRepository.findByEmail(loginRequest.getEmail());

        Map<String,String> message=new HashMap<>();
        if(user.isPresent() && PasswordUtil.matches(loginRequest.getPassword(),user.get().getPassword())){
            Map<String,Object> res=new HashMap<>();
            String token=jwtUtil.generateToken(loginRequest.getEmail());
            res.put("message","User Login Successfully");
            res.put("token",token);
            LoginResponse userData=new LoginResponse();
            userData.setEmail(user.get().getEmail());
            userData.setUsername((user.get().getUsername()));
            userData.setId(user.get().getId());
            res.put("data",userData);
            return ResponseEntity.ok(res);
        }

        message.put("message","Invalid Credentials");
        return ResponseEntity.badRequest().body(message);
    }

    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequest changePasswordRequest){
        Optional<User> user=userRepository.findByEmail(changePasswordRequest.getEmail());

        if(!user.isPresent()){
            Map<String,String> message=new HashMap<>();
            message.put("message","Email Not Exist");
            return ResponseEntity.badRequest().body(message);
        }

        if(!PasswordUtil.matches(changePasswordRequest.getOldPassword(), user.get().getPassword())){
            Map<String,String> message=new HashMap<>();
            message.put("message","Old Password is Incorrect");
            return ResponseEntity.badRequest().body(message);
        }

        user.get().setPassword(PasswordUtil.encodePassword(changePasswordRequest.getNewPassword()));
        userRepository.save(user.get());
        Map<String,String> message=new HashMap<>();
        message.put("message","Password Upadte successfully");
        return  ResponseEntity.ok(message);
    }


    @PostMapping("/send-otp")
    public ResponseEntity<?> verifyEmail(@RequestBody ForgotPasswordRequest forgotPasswordRequest) {
        String email = forgotPasswordRequest.getEmail();
        String otp = String.format("%06d", new Random().nextInt(999999));
        LocalDateTime expiry = LocalDateTime.now().plusMinutes(10);

        // Check if the record exists
        Optional<UserVerify> existing = userVerifyRepository.findByEmail(email);

        UserVerify userVerify = existing.orElse(new UserVerify());
        userVerify.setEmail(email);
        userVerify.setOtp(otp);
        userVerify.setOtpExpiry(expiry);

        // Save or update
        userVerifyRepository.save(userVerify);

        // Send OTP (mock or real)
        emailService.sendEmailOtpForVerifyUser(email, otp);

        Map<String, Object> res = new HashMap<>();
        res.put("message", "OTP sent successfully");
        return ResponseEntity.ok(res);
    }



    @PostMapping("/verify-email")
    public ResponseEntity<?> verifyEmail(@RequestBody VerifyOtpRequest verifyOtpRequest){
        Optional<UserVerify> user=userVerifyRepository.findByEmail(verifyOtpRequest.getEmail());
        if(!verifyOtpRequest.getOtp().equals(user.get().getOtp()) || user.get().getOtpExpiry().isBefore(LocalDateTime.now())){

            Map<String,Object> res=new HashMap<>();
            res.put("message","Otp is Expair or Invalid OTP");
            return ResponseEntity.badRequest().body(res);
        }
        Map<String,Object> res=new HashMap<>();
        res.put("message","Otp Verified");
        return ResponseEntity.ok(res);
    }






    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgetPassword(@RequestBody ForgotPasswordRequest forgotPasswordRequest){
        Optional<User> user=userRepository.findByEmail(forgotPasswordRequest.getEmail());

        if(!user.isPresent()){
            Map<String,String> message=new HashMap<>();
            message.put("message","Email Not Exist");
            return ResponseEntity.badRequest().body(message);
        }
        String otp = String.format("%06d", new Random().nextInt(999999));
        user.get().setOtp(otp);
        user.get().setOtpExpiry(LocalDateTime.now().plusMinutes(10));
        emailService.sendEmailOtp(forgotPasswordRequest.getEmail(),otp);
        userRepository.save(user.get());

        Map<String,Object> res=new HashMap<>();
        res.put("message","Otp sent Successfully");
        return ResponseEntity.ok(res);
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody VerifyOtpRequest verifyOtpRequest){
        Optional<User> user=userRepository.findByEmail(verifyOtpRequest.getEmail());
        if(!verifyOtpRequest.getOtp().equals(user.get().getOtp()) || user.get().getOtpExpiry().isBefore(LocalDateTime.now())){

            Map<String,Object> res=new HashMap<>();
            res.put("message","Otp is Expair or Invalid OTP");
            return ResponseEntity.badRequest().body(res);
        }


        user.get().setIsVerified(true);
        userRepository.save(user.get());
        Map<String,Object> res=new HashMap<>();
        res.put("message","Otp Verified");
        return ResponseEntity.ok(res);


    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request){
        Optional<User> user=userRepository.findByEmail(request.getEmail());

        if(user.isPresent() && user.get().getIsVerified()){
            if(request.getNewPassword().equals(request.getConfirmPassword())){
                user.get().setPassword(PasswordUtil.encodePassword(request.getNewPassword()));
                user.get().setIsVerified(false);
                userRepository.save(user.get());
                Map<String,Object> res=new HashMap<>();
                res.put("message","Password Reset Successfully");
                return ResponseEntity.ok(res);
            }
            else{
                Map<String,Object> res=new HashMap<>();
                res.put("message","Password And Confirm Password are not same");
                return ResponseEntity.badRequest().body(res);
            }
        }

        Map<String,Object> res=new HashMap<>();
        res.put("message","Your Otp is Not Verified");
        return ResponseEntity.badRequest().body(res);
    }
}
