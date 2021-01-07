package com.Faciltiy_Tool.facilitytoos.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
/**
 * This is the model class of users collection
 * All properties of a user are defined here.
 * It also contains all getters and setters
 */
@Document(collection = "Users")
public class User {
    @Id
    private String id;
    private String name;
    private String email;
    private String role;
    private String password;
    private Boolean notification;



    public User(String id, String name,String role,String email, String password, String accessToken) {

        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.password = password;
        this.notification = false;
    }

    public User() {

    }

    public User(String id) {
        this(id,null, null, null, null, null);
    }



    public User(String id, String name) {
        this.id = id;
        this.name = name;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }


    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }


    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
    public Boolean getNotification() {
        return notification;
    }

    public void setNotification(Boolean notification) {
        this.notification = notification;
    }

}
