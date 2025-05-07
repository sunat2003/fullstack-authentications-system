package com.SpringBoot.Projects.SpringBootAuthApp.Repository;

import com.SpringBoot.Projects.SpringBootAuthApp.Entity.UserVerify;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserVerifyRepository extends JpaRepository<UserVerify, Long> {
     Optional<UserVerify> findByEmail(String email);
}
