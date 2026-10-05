package com.techfix.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;
    private final String email = System.getenv("spring.mail.username");


    public EmailService(JavaMailSender mailSender){
        this.mailSender = mailSender;
    }

    @Async
    public void sendWelcomeMail(String toMail, String generatedPassword) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(email);
        message.setTo(toMail);
        message.setSubject("Bem vindo ao Techfix! Segue no corpo do e-mail seu código de acesso");
        message.setText("""
                Olá! Seu cadastro foi realizado com sucesso.
                
                Para acessar o sistema, utilize o seu e-mail e a senha abaixo:
                Senha de acesso: %s
                
                Recomendamos que você não compartilhe essa senha.
                """.formatted(generatedPassword));
        mailSender.send(message);
    }
}
