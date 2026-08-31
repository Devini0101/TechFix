package com.techfix.controller;

import com.techfix.dto.request.LoginRequestDTO;
import com.techfix.dto.request.RegisterUserRequestDTO;
import com.techfix.dto.response.AuthUserInfoResponseDTO;
import com.techfix.dto.response.LoginResponseDTO;
import com.techfix.dto.response.RegisterUserResponseDTO;
import com.techfix.model.enums.UserRole;
import com.techfix.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/auth")
public class AuthController {

    private final UserService userService;

    public AuthController (UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthUserInfoResponseDTO> login (@Valid @RequestBody LoginRequestDTO request){
        LoginResponseDTO response = userService.loginUser(request);

        ResponseCookie jwtCookie = ResponseCookie.from("jwtToken", response.token())
                .httpOnly(true)
                .path("/")
                // .secure(true) // somente para HTTPS, para local, nao
                .maxAge(86400) //1 dia de vencimento do token
                .sameSite("Strict") //CSRF
                .build();

        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, jwtCookie.toString()).body(new AuthUserInfoResponseDTO(response.role()));
    }

    @PostMapping("/register")
    public ResponseEntity<RegisterUserResponseDTO> register (@Valid @RequestBody RegisterUserRequestDTO request){

        RegisterUserResponseDTO response = userService.registerUser(request);
        return ResponseEntity.ok().body(response);
    }

    @GetMapping("/check")
    public ResponseEntity<AuthUserInfoResponseDTO> check (Authentication authentication) {
        String role = authentication.getAuthorities().stream().findFirst().map(GrantedAuthority::getAuthority)
                .orElse("client");

        return ResponseEntity.ok(new AuthUserInfoResponseDTO(UserRole.valueOf(role)));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout () {
        ResponseCookie cookie = ResponseCookie.from("jwtToken", "")
                .httpOnly(true)
                .path("/")
                .maxAge(0)
                .sameSite("Strict")
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .build();
    }
}
