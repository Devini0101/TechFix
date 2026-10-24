package com.techfix.config;

import com.techfix.model.Address;
import com.techfix.model.Category;
import com.techfix.model.User;
import com.techfix.model.enums.UserRole;
import com.techfix.repository.CategoryRepository;
import com.techfix.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UserRepository userRepository, CategoryRepository categoryRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        seedCategories();
        seedUsers();
    }

    private void seedCategories() {
        if (categoryRepository.count() == 0) {
            System.out.println("realizando seeds de categorias...");

            categoryRepository.saveAll(List.of(
                    createCategory("Notebook", "NOTEBOOK"),
                    createCategory("Desktop", "DESKTOP"),
                    createCategory("Impressora", "IMPRESSORA"),
                    createCategory("Mouse", "MOUSE"),
                    createCategory("Teclado", "TECLADO")
            ));
        }
    }

    private void seedUsers() {
        if (userRepository.count() == 0) {
            System.out.println("realizando seed de funcionarios e clientes...");

            // funcionários
            createUser("Maria", "maria@gmail.com", "11111111111", UserRole.employee);
            createUser("Mário", "mario@gmail.com", "22222222222", UserRole.employee);

            // clientes
            createUser("João", "joao@gmail.com", "33333333333", UserRole.client);
            createUser("José", "jose@gmail.com", "44444444444", UserRole.client);
            createUser("Joana", "joana@gmail.com", "55555555555", UserRole.client);
            createUser("Joaquina", "joaquina@gmail.com", "66666666666", UserRole.client);
        }
    }

    private Category createCategory(String name, String code) {
        Category category = new Category();
        category.setName(name);
        category.setCode(code);
        category.setActive(true);
        return category;
    }

    private void createUser(String name, String email, String cpf, UserRole role) {
        Address address = new Address();
        address.setCep("80000000");
        address.setStreet("Rua Brasil");
        address.setNeighborhood("Centro");
        address.setCity("Curitiba");
        address.setUf("PR");
        address.setComplement("Casa");

        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setCpf(cpf);
        user.setPhone("41999999999");
        user.setRole(role);
        user.setAddress(address);
        user.setPassword(passwordEncoder.encode("1234"));

        userRepository.save(user);
    }
}
