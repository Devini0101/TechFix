package com.techfix.service;

import com.techfix.config.TokenConfig;
import com.techfix.dto.request.LoginRequestDTO;
import com.techfix.dto.request.RegisterUserRequestDTO;
import com.techfix.dto.request.UpdateEmployeeRequestDTO;
import com.techfix.dto.response.EmployeeDetailsResponseDTO;
import com.techfix.dto.response.EmployeeResponseDTO;
import com.techfix.dto.response.EmployeesResponseDTO;
import com.techfix.dto.response.LoginResponseDTO;
import com.techfix.dto.response.RegisterUserResponseDTO;
import com.techfix.exception.UserAlreadyExistsException;
import com.techfix.model.Address;
import com.techfix.model.User;
import com.techfix.model.enums.Status;
import com.techfix.model.enums.UserRole;
import com.techfix.exception.EmployeeDeletionNotAllowedException;
import com.techfix.repository.MaintenanceRequestRepository;
import com.techfix.repository.RequestHistoryRepository;
import com.techfix.repository.UserRepository;
import jakarta.mail.MessagingException;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.util.EnumSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final TokenConfig tokenConfig;
    private final EmailService emailService;
    private final MaintenanceRequestRepository maintenanceRequestRepository;
    private final RequestHistoryRepository requestHistoryRepository;

    private static final Set<Status> ACTIVE_MAINTENANCE_STATUSES = EnumSet.complementOf(EnumSet.of(Status.FINISHED, Status.REJECTED));

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager, TokenConfig tokenConfig, EmailService emailService, MaintenanceRequestRepository maintenanceRequestRepository, RequestHistoryRepository requestHistoryRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.tokenConfig = tokenConfig;
        this.emailService = emailService;
        this.maintenanceRequestRepository = maintenanceRequestRepository;
        this.requestHistoryRepository = requestHistoryRepository;
    }

    // rollback também quando o e-mail falha, senão o usuário fica salvo com uma senha que ninguém recebeu
    @Transactional(rollbackFor = MessagingException.class)
    public RegisterUserResponseDTO registerUser(RegisterUserRequestDTO request, UserRole role) throws UserAlreadyExistsException, MessagingException {

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

    public List<EmployeesResponseDTO> getAvailableEmployees(User user) {

        return userRepository.findByRoleAndIdNot(UserRole.employee, user.getId()).stream().map(emp -> new EmployeesResponseDTO(emp.getName(), emp.getEmail())).toList();
    }

    public EmployeeDetailsResponseDTO getEmployee(Long id) {
        return EmployeeDetailsResponseDTO.from(findEmployeeById(id));
    }

    @Transactional
    public EmployeeDetailsResponseDTO updateEmployee(Long id, UpdateEmployeeRequestDTO request) {
        User employee = findEmployeeById(id);

        boolean emailInUseByOther = userRepository.findByEmail(request.email())
                .map(existing -> !((User) existing).getId().equals(id))
                .orElse(false);
        if (emailInUseByOther) {
            throw new UserAlreadyExistsException("Já existe um usuário cadastrado com este e-mail.");
        }

        employee.setName(request.name());
        employee.setEmail(request.email());
        employee.setPhone(request.phone());

        Address address = employee.getAddress() != null ? employee.getAddress() : new Address();
        address.setCep(request.cep());
        address.setStreet(request.street());
        address.setNeighborhood(request.neighborhood());
        address.setCity(request.city());
        address.setUf(request.uf());
        address.setComplement(request.complement());
        employee.setAddress(address);

        return EmployeeDetailsResponseDTO.from(userRepository.save(employee));
    }

    @Transactional
    public void deleteEmployee(Long id, User loggedUser) {
        User employee = findEmployeeById(id);

        if (employee.getId().equals(loggedUser.getId())) {
            throw new EmployeeDeletionNotAllowedException("Você não pode excluir o seu próprio usuário.");
        }

        // FKs de manutenção e histórico impedem a exclusão; bloqueia para não perder o histórico
        boolean hasLinks = maintenanceRequestRepository.existsByResponsibleEmployeeId(id)
                || maintenanceRequestRepository.existsByClientId(id)
                || requestHistoryRepository.existsByResponsibleId(id);
        if (hasLinks) {
            throw new EmployeeDeletionNotAllowedException(
                    "Não é possível excluir: o funcionário tem manutenções ou histórico vinculados a ele.");
        }

        // o endereço vai junto (cascade ALL no User.address)
        userRepository.delete(employee);
    }

    private User findEmployeeById(Long id) {
        return userRepository.findById(id)
                .filter(user -> user.getRole() == UserRole.employee)
                .orElseThrow(() -> new EntityNotFoundException("Funcionário não encontrado."));
    }

    public List<EmployeeResponseDTO> listEmployees() {
        Map<Long, Long> activeOrdersByEmployee = maintenanceRequestRepository
                .countByResponsibleEmployeeAndStatusIn(ACTIVE_MAINTENANCE_STATUSES).stream()
                .collect(Collectors.toMap(row -> (Long) row[0], row -> (Long) row[1]));

        return userRepository.findByRoleOrderByNameAsc(UserRole.employee).stream()
                .map(emp -> new EmployeeResponseDTO(
                        emp.getId(),
                        emp.getName(),
                        emp.getEmail(),
                        emp.getPhone(),
                        activeOrdersByEmployee.getOrDefault(emp.getId(), 0L)))
                .toList();
    }
}
