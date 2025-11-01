package com.stonks.service.impl;

import com.stonks.dto.LoginDTO;
import com.stonks.dto.UserDTO;
import com.stonks.model.User;
import com.stonks.repository.UserRepository;
import com.stonks.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    public List<User> getAllUsers() {
        try {
            log.info("Getting all users");
            List<User> users = userRepository.findAll();
            log.info("Found {} users", users.size());
            return users;
        } catch (Exception e) {
            log.error("Error getting all users", e);
            throw new RuntimeException("Error retrieving users: " + e.getMessage());
        }
    }

    @Override
    public Optional<User> getUserById(String id) {
        try {
            log.info("Getting user by ID: {}", id);
            Optional<User> user = userRepository.findById(id);
            if (user.isPresent()) {
                log.info("Found user with ID: {}", id);
            } else {
                log.warn("User not found with ID: {}", id);
            }
            return user;
        } catch (Exception e) {
            log.error("Error getting user with ID: {}", id, e);
            throw new RuntimeException("Error retrieving user: " + e.getMessage());
        }
    }

    @Override
    public Optional<User> getUserByLoginId(String loginId) {
        try {
            log.info("Getting user by login ID: {}", loginId);
            Optional<User> user = userRepository.findByLoginId(loginId);
            if (user.isPresent()) {
                log.info("Found user with login ID: {}", loginId);
            } else {
                log.warn("User not found with login ID: {}", loginId);
            }
            return user;
        } catch (Exception e) {
            log.error("Error getting user with login ID: {}", loginId, e);
            throw new RuntimeException("Error retrieving user: " + e.getMessage());
        }
    }

    @Override
    public String createUser(UserDTO userDTO) {
        try {
            log.info("Creating new user with login ID: {}", userDTO.getLoginId());
            
            // Check if user with same login ID already exists
            if (existsByLoginId(userDTO.getLoginId())) {
                log.warn("User already exists with login ID: {}", userDTO.getLoginId());
                return "Error: User already exists with login ID: " + userDTO.getLoginId();
            }

            User user = convertToEntity(userDTO);
            User savedUser = userRepository.save(user);
            log.info("User created successfully with ID: {}", savedUser.getId());
            return "Success: User created successfully with ID: " + savedUser.getId();
        } catch (Exception e) {
            log.error("Error creating user with login ID: {}", userDTO.getLoginId(), e);
            return "Error: " + e.getMessage();
        }
    }

    @Override
    public String updateUser(String id, UserDTO userDTO) {
        try {
            log.info("Updating user with ID: {}", id);
            
            Optional<User> existingUser = userRepository.findById(id);
            if (existingUser.isEmpty()) {
                log.warn("User not found with ID: {}", id);
                return "Error: User not found with ID: " + id;
            }

            // Check if another user with same login ID exists (excluding current user)
            Optional<User> userWithSameLoginId = userRepository.findByLoginId(userDTO.getLoginId());
            if (userWithSameLoginId.isPresent() && !userWithSameLoginId.get().getId().equals(id)) {
                log.warn("Another user already exists with login ID: {}", userDTO.getLoginId());
                return "Error: Another user already exists with login ID: " + userDTO.getLoginId();
            }

            User user = convertToEntity(userDTO);
            user.setId(id); // Ensure the ID is preserved
            User updatedUser = userRepository.save(user);
            log.info("User updated successfully with ID: {}", updatedUser.getId());
            return "Success: User updated successfully";
        } catch (Exception e) {
            log.error("Error updating user with ID: {}", id, e);
            return "Error: " + e.getMessage();
        }
    }

    @Override
    public String deleteUser(String id) {
        try {
            log.info("Deleting user with ID: {}", id);
            
            Optional<User> user = userRepository.findById(id);
            if (user.isEmpty()) {
                log.warn("User not found with ID: {}", id);
                return "Error: User not found with ID: " + id;
            }

            userRepository.deleteById(id);
            log.info("User deleted successfully with ID: {}", id);
            return "Success: User deleted successfully";
        } catch (Exception e) {
            log.error("Error deleting user with ID: {}", id, e);
            return "Error: " + e.getMessage();
        }
    }

    @Override
    public boolean existsByLoginId(String loginId) {
        try {
            log.debug("Checking if user exists with login ID: {}", loginId);
            boolean exists = userRepository.findByLoginId(loginId).isPresent();
            log.debug("User exists with login ID {}: {}", loginId, exists);
            return exists;
        } catch (Exception e) {
            log.error("Error checking if user exists with login ID: {}", loginId, e);
            return false;
        }
    }

    @Override
    public Optional<User> login(LoginDTO loginDTO) {
        try {
            log.info("Attempting login for user: {}", loginDTO.getLoginId());
            
            Optional<User> user = userRepository.findByLoginId(loginDTO.getLoginId());
            if (user.isPresent()) {
                // Check if password matches
                if (user.get().getPassword().equals(loginDTO.getPassword())) {
                    log.info("Login successful for user: {}", loginDTO.getLoginId());
                    return user;
                } else {
                    log.warn("Invalid password for user: {}", loginDTO.getLoginId());
                    return Optional.empty();
                }
            } else {
                log.warn("User not found with login ID: {}", loginDTO.getLoginId());
                return Optional.empty();
            }
        } catch (Exception e) {
            log.error("Error during login for user: {}", loginDTO.getLoginId(), e);
            return Optional.empty();
        }
    }

    private User convertToEntity(UserDTO userDTO) {
        User user = new User();
        user.setId(userDTO.getId());
        user.setName(userDTO.getName());
        user.setLoginId(userDTO.getLoginId());
        user.setPassword(userDTO.getPassword());
        return user;
    }
}
