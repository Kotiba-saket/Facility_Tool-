package com.Faciltiy_Tool.facilitytoos.Controller;

import com.Faciltiy_Tool.facilitytoos.Repository.UserRepository;
import com.Faciltiy_Tool.facilitytoos.exception.ResourceNotFoundException;
import com.Faciltiy_Tool.facilitytoos.model.User;
import com.Faciltiy_Tool.facilitytoos.security.CurrentUser;
import com.Faciltiy_Tool.facilitytoos.security.UserPrincipal;
import com.Faciltiy_Tool.facilitytoos.security.oauth2.CustomOAuth2UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import java.util.List;
import java.util.Optional;
/**
 * This class contains all API calls to the authentication controller
 */
@RestController
@RequestMapping(path = "/api")
public class AuthController {

    @Autowired
    private ObjectMapper objectMapper;
    private final RestTemplate restTemplate;

    private UserRepository userRepository;
    @Autowired
    private CustomOAuth2UserService customOAuth2UserService;

    @Autowired
    public AuthController(RestTemplateBuilder restTemplateBuilder, UserRepository userRepository) {
    this.restTemplate = restTemplateBuilder.build();
    this.userRepository = userRepository;
}

    /**
     * This method communicates directly with the mongodb database to fetch information about the logged in user
     * @param userPrincipal this the currently logged in user
     * @return the principal user
     */
    @GetMapping("/user/me")
    public User getCurrentUser(@CurrentUser UserPrincipal userPrincipal) {
        return userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userPrincipal.getId()));
    }

    /**
     * This method communicates directly with the mongodb database to fetch all users that have ever logged in
     * @return a list of all users
     */
    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    /**
     * This method communicates directly with the mongodb database to update the role of a user
     * @param id the id of the role
     * @param updateForm the user object body
     * @return user with the updated role
     */
    @PreAuthorize("hasAuthority('Role_Admin')")
    @PutMapping("/role/{id}")
    public User updateRole(@PathVariable String id, @RequestBody User updateForm) {
        Optional<User> optionalUser = userRepository.findById(id);
        User user;


        if (optionalUser.isPresent()) {
            user = optionalUser.get();
        } else {
            userRepository.save(updateForm);
            return updateForm;
        }
        try {
            String role = updateForm.getRole();
            // Indien een attribuut verschilt met het origineel object, update de attribuut
            if (!role.equals(user.getRole())) {
                user.setRole(role);
            }
            // Push de wijzigingen naar de database
            userRepository.save(user);
            return user;
        } catch (Exception ex) {
            return user;
        }
    }


    /**
     * This method deletes an existing role of a user and sets a default role of 'Medewerker'
     * @param id the user id
     * @return user object with the updated role
     */
    @PreAuthorize("hasAuthority('Role_Admin')")
    @PutMapping("/role-delete/{id}")
    public User removeRole(@PathVariable String id ) {
        Optional<User> optionalUser = userRepository.findById(id);
        User user;

        if (optionalUser.isPresent()) {
            user = optionalUser.get();
        } else {
            return null;
        }
        try {

                user.setRole("Medewerker");

            // Push de wijzigingen naar de database
            userRepository.save(user);
            return user;
        } catch (Exception ex) {
            return null;
        }
    }

    /**
     * This method communicates directly with the mongodb database to
     * @param id this is the id of the notification to be updated
     * @param body this is the notification body
     * @return http status OK
     */
    @PutMapping("/userNotification/{id}")
    public ResponseEntity<String> updateNotification(@PathVariable String id,@RequestBody String body) {
        Optional<User> optionalUser = userRepository.findById(id);
        User user;


        if (optionalUser.isPresent()) {
            user = optionalUser.get();
        } else {
            return null;
        }
        try {
            User notification = objectMapper.readValue(body, User.class);
            // Indien een attribuut verschilt met het origineel object, update de attribuut
            if (!notification.getNotification().equals(user.getNotification())) {
                user.setNotification(notification.getNotification());
            }
            // Push de wijzigingen naar de database
            userRepository.save(user);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception ex) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
}
