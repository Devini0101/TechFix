package com.techfix.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;
    @Value("${spring.mail.username}") // 2. Use o @Value para puxar do application.properties
    private String email;


    public EmailService(JavaMailSender mailSender){
        this.mailSender = mailSender;
    }

    @Async
    public void sendWelcomeMail(String toMail, String generatedPassword) throws MessagingException {
        MimeMessage msg = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(msg, true, "UTF-8");
        helper.setFrom(email);
        helper.setTo(toMail);
        helper.setSubject("Bem vindo ao Techfix! Segue no corpo do e-mail seu código de acesso");
        String htmlBody = """
        <div style="font-family: Arial, sans-serif; text-align: center; padding: 40px 20px; color: #333;">
            <h1 style="font-size: 24px; color: #111;">Techfix</h1>
            <h2 style="font-size: 22px; color: #111;">Olá! Seu cadastro foi realizado com sucesso.</h2>
            <div style="margin-top: 30px; background-color: #f9f9f9; padding: 20px; border-radius: 8px; display: inline-block;">
                <p style="margin: 0 0 10px 0; font-size: 14px;">Para acessar o sistema, utilize o seu e-mail e a senha abaixo:</p>
                <p style="font-size: 20px; font-weight: bold; color: #2563eb; margin: 0 0 15px 0;">Senha de acesso: %s</p>
                <p style="font-size: 12px; color: #dc2626; margin: 0;">Recomendamos que você não compartilhe essa senha.</p>
            </div>
        </div>""".formatted(generatedPassword);
        helper.setText(htmlBody, true);
        mailSender.send(msg);
    }
}