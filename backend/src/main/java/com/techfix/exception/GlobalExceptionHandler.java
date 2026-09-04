package com.techfix.exception;

import com.techfix.dto.StandardError;
import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;

@RestControllerAdvice
public class GlobalExceptionHandler extends RuntimeException {

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<StandardError> handleIllegalArgumentException (IllegalArgumentException ex, HttpServletRequest request) {
        StandardError error = new StandardError(
                LocalDateTime.now(),
                HttpStatus.BAD_REQUEST.value(),
                "Bad Request",
                ex.getMessage()
        );

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    @ExceptionHandler(CepNotFoundException.class)
    public ResponseEntity<StandardError> HandleCepNotFoundException (CepNotFoundException ex, HttpServletRequest request) {
        StandardError error = new StandardError (
                LocalDateTime.now(),
                HttpStatus.NOT_FOUND.value(), // 404
                "Not Found",
                ex.getMessage()
        );
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    @ExceptionHandler(UsernameNotFoundException.class)
    public ResponseEntity<StandardError> handleUsernameNotFoundException (UsernameNotFoundException ex, HttpServletRequest request) {
        StandardError error = new StandardError(
                LocalDateTime.now(),
                HttpStatus.UNAUTHORIZED.value(), // 401
                "Unauthorized",
                ex.getMessage()
        );
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
    }

    @ExceptionHandler(UserAlreadyExistsException.class)
    public ResponseEntity<StandardError> handleUserAlreadyExistsException (UserAlreadyExistsException ex, HttpServletRequest req) {
        StandardError error =  new StandardError(
                LocalDateTime.now(),
                HttpStatus.CONFLICT.value(), //409,
                "Conflict",
                ex.getMessage()
        );
        return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
    }

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<StandardError> EntityNotFoundException (EntityNotFoundException ex, HttpServletRequest req) {
        StandardError error =  new StandardError(
                LocalDateTime.now(),
                HttpStatus.NOT_FOUND.value(), //404,
                "Not Found",
                ex.getMessage()
        );
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }
}
