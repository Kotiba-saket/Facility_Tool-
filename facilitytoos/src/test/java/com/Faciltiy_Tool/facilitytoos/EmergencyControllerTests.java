package com.Faciltiy_Tool.facilitytoos;


import com.Faciltiy_Tool.facilitytoos.Controller.EmergencyController;
import com.Faciltiy_Tool.facilitytoos.Repository.EmergencyRepository;
import com.Faciltiy_Tool.facilitytoos.model.Emergency;
import com.Faciltiy_Tool.facilitytoos.model.Order;
import org.junit.FixMethodOrder;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.junit.runners.MethodSorters;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@RunWith(SpringRunner.class)
@SpringBootTest
@FixMethodOrder(MethodSorters.NAME_ASCENDING)
class EmergencyControllerTests {

    EmergencyRepository mockRepo = Mockito.mock(EmergencyRepository.class);

    EmergencyController controller = new EmergencyController(mockRepo);

    @Test
    public void Get_All_Emergency_Contacts() {

        Emergency emergency = new Emergency("Facilitaire diensten", "Mark Boamah", "Admin Facilitaire diensten",
                "test@ap.be", "+32123456", "+46123456");

        Emergency emergency1 = new Emergency("ICT diensten", "Kotiba Saket", "Admin ICT diensten",
                "test1@ap.be", "+32123498", "+46123467");

        List<Emergency> contacts = List.of(emergency, emergency1);

        Mockito.when(mockRepo.findAll()).thenReturn(contacts);
        List<Emergency> actual = controller.getEmergencyContacts();

        assertThat(actual.size()).isEqualTo(2);

        System.out.println("=======Get all Emergency contacts was successful =======");
    }


    /**
     * Test voor het testen van de saveContact method
     */
    @Test
    public void Save_An_Emergency_Contact_To_Database() {

        Emergency emergency = new Emergency("Facilitaire diensten", "Mark Boamah", "Admin Facilitaire diensten",
                "test@ap.be", "+32123456", "+46123456");

        Mockito.when(mockRepo.save(emergency)).thenReturn(emergency);

        Emergency actual = mockRepo.save(emergency);

        assertThat(actual).isEqualTo(emergency);
        assertThat(actual.getEmail()).isEqualTo("test@ap.be");
        System.out.println("=======Save emergency contact was successful =======");
    }


    @Test
    public void Get_One_Contact_By_Id() {

        Emergency contact = new Emergency("Facilitaire diensten", "Mark Boamah", "Admin Facilitaire diensten",
                "test@ap.be", "+32123456", "+46123456");
        contact.setId("1");

        Mockito.when(mockRepo.findById(contact.getId())).thenReturn(Optional.of(contact));

        Optional<Emergency> actual = controller.getContactsById(contact.getId());

        assertThat(actual.get().getId()).isEqualTo("1");
        assertThat(actual).isEqualTo(Optional.of(contact));

        System.out.println("=======Get contact by ID was successful  =======");
    }


    @Test
    public void Delete_One_Emergency_Contact_By_Id() {

        Emergency emergency = new Emergency("Facilitaire diensten", "Mark Boamah", "Admin Facilitaire diensten",
                "test@ap.be", "+32123456", "+46123456");
        emergency.setId("1");

        List<Emergency> contacts = List.of(emergency);

        controller.deleteContact(emergency.getId());

        List<Emergency> actual = controller.getEmergencyContacts();

        assertThat(actual.size()).isEqualTo(0);

        System.out.println("=======Delete contact by ID was successful  =======");
    }
}
