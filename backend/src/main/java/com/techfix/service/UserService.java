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
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder; // Injete se estiver criptografando senhas
    private final AuthenticationManager authenticationManager;
    private final TokenConfig tokenConfig;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager, TokenConfig tokenConfig) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.tokenConfig = tokenConfig;
    }

    @Transactional
    public RegisterUserResponseDTO registerUser(RegisterUserRequestDTO request) throws UserAlreadyExistsException{

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
        newUser.setPassword(passwordEncoder.encode(request.password()));
        newUser.setAddress(newAddress);

        UserRole role = (request.role() != null) ? request.role() : UserRole.client;
        newUser.setRole(role);

        User savedUser = userRepository.save(newUser);
        return new RegisterUserResponseDTO(savedUser.getName(), savedUser.getEmail());
    }

    public LoginResponseDTO loginUser(LoginRequestDTO request) {
        UsernamePasswordAuthenticationToken userAndPass = new UsernamePasswordAuthenticationToken(request.email(), request.password());
        Authentication authentication =  authenticationManager.authenticate(userAndPass);

        User user = (User) authentication.getPrincipal();
        String token = tokenConfig.generateToken(user);
        return new LoginResponseDTO(token, user.getRole());
    }
}
