package com.edutrack.edutrack_backend.controller;


import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.edutrack.edutrack_backend.dto.RegisterRequest;
import com.edutrack.edutrack_backend.service.AuthService;

import com.edutrack.edutrack_backend.dto.LoginRequest;


@RestController
public class AuthController {


    private final AuthService authService;

    public AuthController(AuthService authService) {
    this.authService = authService;
}

@PostMapping("/register")
public String register(@RequestBody RegisterRequest request) {

    return authService.register(request);
}


@PostMapping("/login")
public String login(@RequestBody LoginRequest request) {

    return authService.login(request);

}


}
