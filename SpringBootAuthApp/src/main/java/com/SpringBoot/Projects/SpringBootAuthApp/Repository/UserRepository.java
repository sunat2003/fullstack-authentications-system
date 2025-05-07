package com.SpringBoot.Projects.SpringBootAuthApp.Repository;


import com.SpringBoot.Projects.SpringBootAuthApp.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User,Long> {

    Optional<User>  findByEmail(String email);
}



