package com.Faciltiy_Tool.facilitytoos;


import com.Faciltiy_Tool.facilitytoos.Controller.ExternalFirmsController;
import com.Faciltiy_Tool.facilitytoos.Repository.ExternalFirmsRepository;
import com.Faciltiy_Tool.facilitytoos.config.AppProperties;
import com.Faciltiy_Tool.facilitytoos.model.Emergency;
import com.Faciltiy_Tool.facilitytoos.model.ExternalFirms;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.junit.FixMethodOrder;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.junit.runners.MethodSorters;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@RunWith(SpringRunner.class)
@SpringBootTest
@FixMethodOrder(MethodSorters.NAME_ASCENDING)
class ExternalFirmsTests {

    @Autowired
    private AppProperties appProperties;
    @Autowired
    ExternalFirmsRepository repository;

    ExternalFirmsController controller = Mockito.mock(ExternalFirmsController.class);

    @Test
    public void Get_All_External_Firms() {
        List<ExternalFirms> externalFirms = new ArrayList<>();
        ExternalFirms Firm = new ExternalFirms();
        Firm.setDisplayName("External Firm Test");
        Firm.setEmail("ExternalFirm@test.be");
        Firm.setTelefonNr("01234567");


        externalFirms.add(Firm);

        Mockito.when(controller.getExternalFirms()).thenReturn(externalFirms);

        List<ExternalFirms> actual = controller.getExternalFirms();

        assertThat(actual.size()).isGreaterThan(0);

        System.out.println("=======Get all External Firms was successful =======");
    }


    @Test
    public void Get_One_External_Firm_By_Id() {

        ExternalFirms externalFirms = new ExternalFirms();
        externalFirms.setDisplayName("External Firm Test");
        externalFirms.setEmail("ExternalFirm@test.be");
        externalFirms.setTelefonNr("01234567");

        Mockito.when(controller.getExternalFirmById(externalFirms.getId())).thenReturn(Optional.of(externalFirms));
        assertThat(controller.getExternalFirmById(externalFirms.getId())).isEqualTo(Optional.of(externalFirms));

        System.out.println("=======Get External FIrm by ID was successful  =======");
    }

    @Test
    public void Delete_One_External_Firm_By_Id() {

        List<ExternalFirms> externalFirms = new ArrayList<>();
        ExternalFirms Firm = new ExternalFirms();
        Firm.setDisplayName("External Firm Test");
        Firm.setEmail("ExternalFirm@test.be");
        Firm.setTelefonNr("01234567");


        externalFirms.add(Firm);

        controller.deleteExternalFirm(Firm.getId());

        List<ExternalFirms> actual = controller.getExternalFirms();

        assertThat(actual.size()).isEqualTo(0);

        System.out.println("=======Delete External Firm by ID was successful  =======");
    }

    @Test
    public void Get_Id_Token() {

        ExternalFirms externalFirms = new ExternalFirms();
        externalFirms.setDisplayName("External test  firm");
        externalFirms.setTelefonNr("01234567890");
        externalFirms.setEmail("externalfirm@test.be");
        externalFirms.setId("012345678asda05484");
        externalFirms.setRole("externalFirm");

        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + 7200000);
        String testIdToken = Jwts.builder()
                .setSubject(externalFirms.getId())
                .setIssuedAt(new Date())
                .claim("FirmId", externalFirms.getId())
                .claim("FirmName", externalFirms.getDisplayName())
                .claim("role", "externalFirm")
                .setExpiration(expiryDate)
                .signWith(SignatureAlgorithm.HS512, appProperties.getAuth().getTokenSecret())
                .compact();
        Mockito.when(controller.getIdToken(externalFirms.getId())).thenReturn(testIdToken);
        assertThat(controller.getIdToken(externalFirms.getId())).isEqualTo(testIdToken);

        System.out.println("=======get External Firm Id Token was successful  =======");

    }

    @Test
    public void Update_One_External_Firm_By_Id() {

        ExternalFirms externalFirms = new ExternalFirms();
        externalFirms.setDisplayName("External Firm Test");
        externalFirms.setEmail("ExternalFirm@test.be");
        externalFirms.setTelefonNr("01234567");
        Mockito.when(controller.getExternalFirmById(externalFirms.getId())).thenReturn(Optional.of(externalFirms));
        externalFirms.setEmail("NewExternalFirm@test.be");
        assertThat(controller.getExternalFirmById(externalFirms.getId()).get().getEmail()).isEqualTo(externalFirms.getEmail());

        System.out.println("=======Update External FIrm was successful  =======");
    }
}
