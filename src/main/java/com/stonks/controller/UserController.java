package com.stonks.controller;

import java.util.List;
import java.util.Optional;

import com.stonks.dto.BaseResponse;
import com.stonks.dto.LoginDTO;
import com.stonks.dto.UserDTO;
import com.stonks.model.User;
import com.stonks.service.UserFundService;
import com.stonks.service.UserService;
import com.stonks.util.Response;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Slf4j
public class UserController {

    private final UserService userService;
    private final UserFundService userFundService;

    @GetMapping
    public ResponseEntity<BaseResponse<?>> getAllUsers() {
        try {
            List<User> users = userService.getAllUsers();
            return Response.success(users);
        } catch (Exception e) {
            log.error("Error getting all users", e);
            return Response.failure("Error retrieving users: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<BaseResponse<?>> getUserById(@PathVariable String id) {
        try {
            Optional<User> user = userService.getUserById(id);
            if (user.isPresent()) {
                return Response.success(user.get());
            } else {
                return Response.failure("User not found with ID: " + id);
            }
        } catch (Exception e) {
            log.error("Error getting user with ID: {}", id, e);
            return Response.failure("Error retrieving user: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<BaseResponse<?>> login(@Valid @RequestBody LoginDTO loginDTO) {
        try {
            Optional<User> user = userService.login(loginDTO);
            if (user.isPresent()) {
                return Response.success(user.get());
            } else {
                return Response.failure("Invalid login credentials");
            }
        } catch (Exception e) {
            log.error("Error during login for user: {}", loginDTO.getLoginId(), e);
            return Response.failure("Error during login: " + e.getMessage());
        }
    }

    @GetMapping("/login/{loginId}")
    public ResponseEntity<BaseResponse<?>> getUserByLoginId(@PathVariable String loginId) {
        try {
            Optional<User> user = userService.getUserByLoginId(loginId);
            if (user.isPresent()) {
                return Response.success(user.get());
            } else {
                return Response.failure("User not found with login ID: " + loginId);
            }
        } catch (Exception e) {
            log.error("Error getting user with login ID: {}", loginId, e);
            return Response.failure("Error retrieving user: " + e.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<BaseResponse<?>> createUser(@Valid @RequestBody UserDTO userDTO) {
        try {
            String result = userService.createUser(userDTO);
            if (result.startsWith("Success:")) {
                return Response.success(result);
            } else {
                return Response.failure(result);
            }
        } catch (Exception e) {
            log.error("Error creating user with login ID: {}", userDTO.getLoginId(), e);
            return Response.failure("Error creating user: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<BaseResponse<?>> updateUser(@PathVariable String id, @Valid @RequestBody UserDTO userDTO) {
        try {
            String result = userService.updateUser(id, userDTO);
            if (result.startsWith("Success:")) {
                return Response.success(result);
            } else {
                return Response.failure(result);
            }
        } catch (Exception e) {
            log.error("Error updating user with ID: {}", id, e);
            return Response.failure("Error updating user: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<BaseResponse<?>> deleteUser(@PathVariable String id) {
        try {
            String result = userFundService.deleteAllUserFundsByUserId(id);
            if (result.startsWith("Error:")) {
                return Response.failure(result);
            }
            result = userService.deleteUser(id);
            if (result.startsWith("Success:")) {
                return Response.success(result);
            } else {
                return Response.failure(result);
            }
        } catch (Exception e) {
            log.error("Error deleting user with ID: {}", id, e);
            return Response.failure("Error deleting user: " + e.getMessage());
        }
    }
}
