package com.Faciltiy_Tool.facilitytoos.Controller;


import com.Faciltiy_Tool.facilitytoos.Repository.ExternalFirmsRepository;
import com.Faciltiy_Tool.facilitytoos.config.AppProperties;
import com.Faciltiy_Tool.facilitytoos.model.ExternalFirms;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.Optional;
/**
 * This class contains all API calls to the external firms collection
 */
@RestController
@RequestMapping(path = "/api")
public class ExternalFirmsController {


    private ExternalFirmsRepository externalFirmsRepository;
    private AppProperties appProperties;
    @Autowired
    public  ExternalFirmsController(ExternalFirmsRepository externalFirmsRepository, AppProperties appProperties) {
        this.externalFirmsRepository = externalFirmsRepository;
        this.appProperties = appProperties;
    }


    /**
     * This method communicates directly with the mongodb database to add a new firm
     * @param externalFirms this is the firm object body from the client side
     * @return Http status OK
     */
    @PreAuthorize("hasAuthority('Role_Admin')")
    @PostMapping("/externalFirms")
    public ResponseEntity<ExternalFirms> addExternalFirm(@RequestBody ExternalFirms externalFirms) {
        externalFirmsRepository.save(externalFirms);
        return new ResponseEntity<>(HttpStatus.OK);

    }


    /**
     * This method communicates directly with the mongodb database to fetch all firms
     * @return list of external firms
     */
    @PreAuthorize("hasAnyAuthority('Role_Admin','Role_FacilitaireCoordinator','Role_LogistiekeCoordinator')")
    @GetMapping("/externalFirms")
    public List<ExternalFirms> getExternalFirms() {
        return externalFirmsRepository.findAll();
    }


    /**
     * This method communicates directly with the mongodb database to delete an existing firm
     * @param id the id of the firm to be deleted
     * @return success message
     */
    @PreAuthorize("hasAuthority('Role_Admin')")
    @DeleteMapping("externalFirms/{id}")
    public String deleteExternalFirm(@PathVariable String id) {
        externalFirmsRepository.deleteById(id);
        return "External firm removed With id :" + id;
    }

    /**
     * This method get an id token for the external firm to enable them access certain pages without authentication
     * @param id the id of the firm
     * @return id token
     */
    @PreAuthorize("hasAnyAuthority('Role_Admin','Role_FacilitaireCoordinator','Role_LogistiekeCoordinator')")
    @GetMapping("/externalFirmToken/{id}")
    public String getIdToken(@PathVariable String id) {
        Optional<ExternalFirms> optionalExternalFirm = externalFirmsRepository.findById(id);
        ExternalFirms externalFirms;
        if (optionalExternalFirm.isPresent()) {
            externalFirms = optionalExternalFirm.get();
        } else {
            return null;
        }
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + 7200000);
        return Jwts.builder()
                .setSubject(optionalExternalFirm.get().getId())
                .setIssuedAt(new Date())
                .claim("FirmId", optionalExternalFirm.get().getId())
                .claim("FirmName", optionalExternalFirm.get().getDisplayName())
                .claim("role", "externalFirm")
                .setExpiration(expiryDate)
                .signWith(SignatureAlgorithm.HS512, appProperties.getAuth().getTokenSecret())
                .compact();
    }

    /**
     * This method communicates directly with the mongodb database to fetch a firm based on an id
     * @param id the id of the requested firm
     * @return external firm
     */
    @PreAuthorize("hasAuthority('Role_Admin')")
    @GetMapping("/externalFirms/{id}")
    public Optional<ExternalFirms> getExternalFirmById(@PathVariable String id) {
        return externalFirmsRepository.findById(id);
    }

    /**
     * This method communicates directly with the mongodb database to update an existing firm
     * @param id the id of the firm to be updated
     * @param updateForm the update body from the client side
     * @return updated firm
     */
    @PreAuthorize("hasAuthority('Role_Admin')")
    @PutMapping("/externalFirms/{id}")
    public ResponseEntity<ExternalFirms> updateExternalFirm(@PathVariable String id,@RequestBody ExternalFirms updateForm) {
        Optional<ExternalFirms> optionalExternalFirm = externalFirmsRepository.findById(id);
        ExternalFirms externalFirms;


        if (optionalExternalFirm.isPresent()) {
            externalFirms = optionalExternalFirm.get();
        } else {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        try {

           String email = updateForm.getEmail();
            String displayName = updateForm.getDisplayName();
            String telefonNr = updateForm.getTelefonNr();

            externalFirms.checkExternalFirms(email, displayName , telefonNr , externalFirms);


            // Push de wijzigingen naar de database
            externalFirmsRepository.save(externalFirms);

            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception ex) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

}
