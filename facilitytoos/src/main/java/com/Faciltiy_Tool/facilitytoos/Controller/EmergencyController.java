package com.Faciltiy_Tool.facilitytoos.Controller;
import com.Faciltiy_Tool.facilitytoos.Repository.EmergencyRepository;
import com.Faciltiy_Tool.facilitytoos.model.Emergency;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

/**
 * This class contains all API calls to the emergency contacts collection
 */
@RestController
@RequestMapping(path = "/api")
public class EmergencyController {

    private final EmergencyRepository repository;

    @Autowired
    public EmergencyController(EmergencyRepository repository) {
        this.repository = repository;
    }

    @Autowired
    private ObjectMapper objectMapper;

    /**
     * This method communicates directly with the mongodb database to fetch all emergency contacts
     * @return list of emergency contacts
     */
    @GetMapping("/contacts")
    public List<Emergency> getEmergencyContacts() {
        return repository.findAll();
    }


    /**
     * This method communicates directly with the mongodb database to add a new contact to emergency contacts
     * @param contactForm the is the contact body from the client side
     * @return contact
     */
    @PreAuthorize("hasAuthority('Role_Admin')")
    @PostMapping("/contacts")
    public Emergency saveContact(@RequestParam(value = "contact") String contactForm) {
        try {
            Emergency dto = objectMapper.readValue(contactForm, Emergency.class);

            Emergency contact = new Emergency(dto.getDepartment(), dto.getName(), dto.getDescription(), dto.getEmail(), dto.getTelephone(), dto.getMobile());
            repository.save(contact);
            return contact;
        } catch (Exception e) {
            return null;

        }
    }

    /**
     * This method communicates directly with the mongodb database to fetch a contact based on the given id
     * @param id the id of the requested contact
     * @return true if fetch is successful and false if not successful
     */
    @PreAuthorize("hasAuthority('Role_Admin')")
    @GetMapping("/contacts/{id}")
    public Optional<Emergency> getContactsById(@PathVariable String id) {
        return repository.findById(id);
    }

    /**
     * This method communicates directly with the mongodb database to delete a contact
     * @param id the id of the contact to be deleted
     * @return true if successful
     */
    @PreAuthorize("hasAuthority('Role_Admin')")
    @DeleteMapping("/contacts/{id}")
    public Boolean deleteContact(@PathVariable String id) {
        if(id == null){
            return false;
        } else {
            repository.deleteById(id);
            return true;
        }
    }

    /**
     * This method communicates directly with the mongodb database to update an existing contact
     * @param id the id of the contact to be updated
     * @param contact the updated body of the contact from the client side
     * @return updated contact
     */
    @PreAuthorize("hasAuthority('Role_Admin')")
    @PutMapping("/contacts/{id}")
    public Emergency updateContact(@PathVariable String id,@RequestBody Emergency contact) {
        Optional<Emergency> optionalEmergency = repository.findById(id);
        Emergency emergency;


        if (optionalEmergency.isPresent()) {
            emergency = optionalEmergency.get();
        } else {
            return null;
        }

        try {


            if (!contact.getDepartment().equals(emergency.getDepartment())) {
                emergency.setDepartment(contact.getDepartment());
            }
            if (!contact.getName().equals(emergency.getName())) {
                emergency.setName(contact.getName());
            }
            if (!contact.getDescription().equals(emergency.getDescription())) {
                emergency.setDescription(contact.getDescription());
            }
            if (!contact.getEmail().equals(emergency.getEmail())) {
                emergency.setEmail(contact.getEmail());
            }
            if (!contact.getTelephone().equals(emergency.getTelephone())) {
                emergency.setTelephone(contact.getTelephone());
            }
            if (!contact.getMobile().equals(emergency.getMobile())) {
                emergency.setMobile(contact.getMobile());
            }

            repository.save(emergency);

            return emergency;
        } catch (Exception ex) {
            return null;
        }
    }

    /**
     * This method communicates directly with the mongodb database to fetch contacts based on their department
     * @param department the department the fetched contact must be under
     * @return department contacts
     */
    @GetMapping("contacts/department/{department}")
    public List<Emergency> getContactsByDepartment(@PathVariable String department) {
        return repository.findByDepartment(department);
    }
}
