package ru.kata.spring.boot_security.demo.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.repository.RoleRepository;
import ru.kata.spring.boot_security.demo.repository.UserRepository;

import javax.annotation.PostConstruct;
import java.util.List;

@Component
public class Initialize {

    private final UserRepository userRepo;
    private final RoleRepository roleRepository;

    public Initialize(UserRepository userRepo, RoleRepository roleRepository) {
        this.userRepo = userRepo;
        this.roleRepository = roleRepository;
    }


    @PostConstruct
    public void initialize() {
        Role role1 = new Role();
        Role role2 = new Role();
        role1.setRole("ROLE_ADMIN");
        role2.setRole("ROLE_USER");

        User user = new User();
        user.setLastName("MyLastname");
        user.setUsername("admin");
        user.setPassword(new BCryptPasswordEncoder().encode("admin"));
        user.setName("MyName");

        roleRepository.save(role1);
        roleRepository.save(role2);
        user.setRoles(List.of(role1, role2));
        userRepo.save(user);
    }


}