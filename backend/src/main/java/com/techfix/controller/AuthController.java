package com.techfix.controller;

import com.techfix.dto.request.LoginRequestDTO;
import com.techfix.dto.request.RegisterUserRequestDTO;
import com.techfix.dto.response.LoginResponseDTO;
import com.techfix.dto.response.RegisterUserResponseDTO;
import com.techfix.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/auth")
public class AuthController {

    private final UserService userService;

    public AuthController (UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login (@Valid @RequestBody LoginRequestDTO request){
        LoginResponseDTO response = userService.loginUser(request);

        ResponseCookie jwtCookie = ResponseCookie.from("jwtToken", response.token())
                .httpOnly(true)
                .path("/")
                // .secure(true) // somente para HTTPS, para local, nao
                .maxAge(86400) //1 dia de vencimento do token
                .sameSite("Strict") //CSRF
                .build();

        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, jwtCookie.toString()).build();
    }

    @PostMapping("/register")
    public ResponseEntity<RegisterUserResponseDTO> register (@Valid @RequestBody RegisterUserRequestDTO request){

        RegisterUserResponseDTO response = userService.registerUser(request);
        return ResponseEntity.ok().body(response);
    }

}
