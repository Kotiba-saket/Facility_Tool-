package com.Faciltiy_Tool.facilitytoos.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * This is the model class of ArchiveOrders collection
 * All properties of an order are defined here.
 * It also contains all getters and setters
 */
@Document(collection = "ArchiveOrders")
public class ArchiveOrders {

    @Id
    private String id;
    private String requesterId;
    private String requesterName;

    private String title;
    private String campus;
    private String location;
    private boolean closeTo;
    private String description;
    private String date;
    private String time;
    private String categoryDepartment;
    private String category;

    private String status;
    private List<String> statusHistory;
    private User assignTo;
    private LocalDate createdOn;

    public ArchiveOrders() {}



    public ArchiveOrders(String requesterId, String requesterName, String title, String campus, String location, boolean closeTo, String description, String date, String time, String categoryDepartment, String category, String status, User assignTo){
        this.requesterId = requesterId  ;
        this.requesterName = requesterName;
        this.title = title;
        this.campus = campus;
        this.location = location;
        this.closeTo = closeTo;
        this.description = description;
        this.date = date;
        this.time = time;
        this.categoryDepartment = categoryDepartment;
        this.category = category;
        this.status = status;
        this.assignTo = assignTo;
        this.createdOn = LocalDate.now();
        this.statusHistory = new ArrayList<String>();
        statusHistory.add(status);
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getCampus() {
        return campus;
    }

    public void setCampus(String campus) {
        this.campus = campus;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public boolean isCloseTo() { return closeTo; }

    public void setCloseTo(boolean closeTo) { this.closeTo = closeTo; }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public List<String> getStatusHistory() {
        return statusHistory;
    }

    public String getRequesterId() {
        return requesterId;
    }

    public void setRequesterId(String requesterId) {
        this.requesterId = requesterId;
    }

    public String getRequesterName() {
        return requesterName;
    }

    public void setRequesterName(String requesterName) {
        this.requesterName = requesterName;
    }

    public User getAssignTo() {
        return assignTo;
    }

    public void setAssignTo(User assignTo) {
        this.assignTo = assignTo;
    }

    public LocalDate getCreatedOn() {
        return createdOn;
    }

    public void setCreatedOn(LocalDate createdOn) {
        this.createdOn = createdOn;
    }

    public String getCategoryDepartment() {
        return categoryDepartment;
    }

    public void setCategoryDepartment(String categoryDepartment) {
        this.categoryDepartment = categoryDepartment;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }
}
