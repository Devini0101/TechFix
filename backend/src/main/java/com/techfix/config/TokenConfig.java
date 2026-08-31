package com.techfix.config;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.techfix.model.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.time.Instant;

@Component
public class TokenConfig {
    @Value("${api.security.token.secret}")
    private String secret;

    public String generateToken(User user){
        Algorithm algorithm = Algorithm.HMAC256(secret);
        return JWT.create().withClaim("userId",user.getId())
                .withSubject(user.getEmail())
                .withExpiresAt(Instant.now().plusSeconds(86400))
                .withIssuedAt(Instant.now()).sign(algorithm);
    }

    public String validateToken (String token) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);
            return JWT.require(algorithm)
                    .build()
                    .verify(token)
                    .getSubject(); // Pega o email que guardamos no withSubject()
        } catch (Exception exception){
            return ""; // vazio se o token for expirado ou inválido
        }
    }
}
