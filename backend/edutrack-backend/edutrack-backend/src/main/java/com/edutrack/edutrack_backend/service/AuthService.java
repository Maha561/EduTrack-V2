package com.edutrack.edutrack_backend.service;

import com.edutrack.edutrack_backend.dto.RegisterRequest;
import com.edutrack.edutrack_backend.repository.UserRepository;
import org.springframework.stereotype.Service;



import com.edutrack.edutrack_backend.entity.User;

import java.util.Optional;
import com.edutrack.edutrack_backend.dto.LoginRequest;


@Service
public class AuthService {


   private final UserRepository userRepository;

   public AuthService(UserRepository userRepository) {
    this.userRepository = userRepository;
}

public String register(RegisterRequest request) {

    User user = new User();

user.setName(request.getUsername());
user.setEmail(request.getEmail());
user.setPassword(request.getPassword());
user.setRole("STUDENT");
   userRepository.save(user);

    return "User Registered";
}

// Login API
    public String login(LoginRequest request) {

        Optional<User> user = userRepository.findByEmail(request.getEmail());

        if(user.isEmpty()) {
            return "User not found";
        }

        if(!user.get().getPassword().equals(request.getPassword())) {
            return "Invalid password";
        }

        return "Login successful";
    }




}
