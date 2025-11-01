package com.stonks.service;

import com.stonks.dto.LoginDTO;
import com.stonks.dto.UserDTO;
import com.stonks.model.User;

import java.util.List;
import java.util.Optional;

public interface UserService {
    
    List<User> getAllUsers();
    
    Optional<User> getUserById(String id);
    
    Optional<User> getUserByLoginId(String loginId);
    
    String createUser(UserDTO userDTO);
    
    String updateUser(String id, UserDTO userDTO);
    
    String deleteUser(String id);
    
    boolean existsByLoginId(String loginId);
    
    Optional<User> login(LoginDTO loginDTO);
}
