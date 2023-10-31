package ru.kata.spring.boot_security.demo.service;

import ru.kata.spring.boot_security.demo.model.User;

import java.util.List;

public interface UserService {

    List<User> findAll();

    User findUserById(Long id);

    void update(User updateUser, Long id);

    void createUser(User user);

    void deleteUserById(long id);

    User findUserByUsername(String username);


}


