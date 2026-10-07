package com.techfix.service;

import com.techfix.config.TokenConfig;
import com.techfix.dto.request.LoginRequestDTO;
import com.techfix.dto.request.RegisterUserRequestDTO;
import com.techfix.dto.response.LoginResponseDTO;
import com.techfix.dto.response.RegisterUserResponseDTO;
import com.techfix.exception.UserAlreadyExistsException;
import com.techfix.model.Address;
import com.techfix.model.User;
import com.techfix.model.enums.UserRole;
import com.techfix.repository.UserRepository;
import jakarta.mail.MessagingException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final TokenConfig tokenConfig;
    private final EmailService emailService;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager, TokenConfig tokenConfig, EmailService emailService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.tokenConfig = tokenConfig;
        this.emailService = emailService;
    }

    @Transactional
    public RegisterUserResponseDTO registerUser(RegisterUserRequestDTO request) throws UserAlreadyExistsException, MessagingException {

        if ( userRepository.findByEmail(request.email()).isPresent() || userRepository.findByCpf(request.cpf()).isPresent() ) {
            throw new UserAlreadyExistsException("Usuário já cadastrado.");
        }

        Address newAddress = new Address();
        newAddress.setCep(request.cep());
        newAddress.setStreet(request.street());
        newAddress.setNeighborhood(request.neighborhood());
        newAddress.setCity(request.city());
        newAddress.setUf(request.uf());
        newAddress.setComplement(request.complement());

        User newUser = new User();
        newUser.setName(request.name());
        newUser.setEmail(request.email());
        newUser.setCpf(request.cpf());
        newUser.setPhone(request.phone());

        //generates a random 4 digits password
        SecureRandom random = new SecureRandom();
        int num = random.nextInt(10000);
        String rawPassword = String.format("%04d", num);

        //encrypt and stores
        newUser.setPassword(passwordEncoder.encode(rawPassword));
        newUser.setAddress(newAddress);

        UserRole role = (request.role() != null) ? request.role() : UserRole.client;
        newUser.setRole(role);

        User savedUser = userRepository.save(newUser);
        emailService.sendWelcomeMail(newUser.getEmail(), rawPassword);
        return new RegisterUserResponseDTO(savedUser.getName(), savedUser.getEmail());
    }

    public LoginResponseDTO loginUser(LoginRequestDTO request) {
        UsernamePasswordAuthenticationToken userAndPass = new UsernamePasswordAuthenticationToken(request.email(), request.password());
        Authentication authentication =  authenticationManager.authenticate(userAndPass);

        User user = (User) authentication.getPrincipal();
        String token = tokenConfig.generateToken(user);
        return new LoginResponseDTO(token, user.getRole(), user.getName());
    }
}
