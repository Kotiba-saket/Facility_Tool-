package com.Faciltiy_Tool.facilitytoos.Controller;
import com.Faciltiy_Tool.facilitytoos.Repository.ArchiveOrdersRepository;
import com.Faciltiy_Tool.facilitytoos.model.ArchiveOrders;
import org.springframework.web.bind.annotation.*;


import java.util.List;

/**
 * This class contains all API calls to the order archive
 */
@RestController
@RequestMapping(path = "/api")
public class ArchiveOrderController {
    private final ArchiveOrdersRepository archiveOrdersRepository;

    public ArchiveOrderController(ArchiveOrdersRepository archiveOrdersRepository) {
        this.archiveOrdersRepository = archiveOrdersRepository;
    }

    /**
     * This method communicates directly with the mongodb database to move an order to the archive collection
     * @param orderToArchive object body of the order being moved to archive collection
     * @return  null
     */
    @PostMapping("/orderToArchive")
    public ArchiveOrders addOrderToArchive(@RequestBody ArchiveOrders orderToArchive){
        try {
            archiveOrdersRepository.save(orderToArchive);
            return orderToArchive;
        } catch (Exception ex){
            return null;
        }

    }

    /**
     * This method communicates directly with the mongodb database to fetch all orders that have been moved to archive
     * @return list of orders from the archiveorders collection
     */
    @GetMapping("/ordersFromArchive")
    public List<ArchiveOrders> getAllOrdersFromArchive(){
        return archiveOrdersRepository.findAll();
    }


}
