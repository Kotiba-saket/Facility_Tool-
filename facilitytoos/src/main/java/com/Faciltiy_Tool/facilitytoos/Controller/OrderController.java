package com.Faciltiy_Tool.facilitytoos.Controller;


import com.Faciltiy_Tool.facilitytoos.Repository.OrderRepository;
import com.Faciltiy_Tool.facilitytoos.model.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;


import java.util.List;
import java.util.Optional;

/**
 * This controller class is responsible for adding, updating and deleting orders
 *
 * @author team8-tryCatchUs
 */
@RestController
@RequestMapping(path = "/api")
public class OrderController {

    private final OrderRepository repository;
    @Autowired
    public OrderController(OrderRepository repository) {
        this.repository = repository;
    }

    @Autowired
    private ObjectMapper objectMapper;

    /**
     * This method communicates directly with the mongodb database to fetch all orders
     * @return list of orders
     */
    @GetMapping("/orders")
    public List<Order> getOrders() {
        return repository.findAll();
    }

    /**
     * This method communicates directly with the mongodb database to assign an order to an employee
     * @param body this is the order body with the updated assignTo property
     * @return assigned order
     */
    @PostMapping("order/assignEmployee")
    public Order assignOrderToEmployee(@RequestBody AssignOrder body) {
        try {
            Order order = repository.findOneById(body.getRequestId());
            order.setRequesterId(body.getRequesterId());
            User user = new User(body.getAssignTo().getId(), body.getAssignTo().getName());
            order.setAssignTo(user);
            repository.save(order);
            return order;

        } catch (Exception e) {
            return null;
        }


    }

    /**
     * This method communicates directly with the mongodb database to create a new order
     * @param orderForm this is the order body from the client side
     * @return new order
     */
    @PostMapping("/order")
    public Order saveOrder(@RequestParam(value = "order") String orderForm) {
        try {
            User user = new User(null,null);
            ExternalFirms firm = new ExternalFirms(null, null, null, null);
            Order dto = objectMapper.readValue(orderForm, Order.class);
            dto.setAssignTo(user);
            dto.setAssignToFirm(firm);

            Order orderAd = new Order(dto.getRequesterId(), dto.getRequesterName(),dto.getTitle(),dto.getCampus(),dto.getFloor(),dto.getLocation(),
                    dto.isCloseTo(), dto.getDescription(),dto.getDate(),dto.getTime(), dto.getCategoryDepartment(), dto.getCategory(),dto.getStatus(),dto.getAssignTo(), dto.getAssignToFirm());
            repository.save(orderAd);
            return orderAd;

        } catch (Exception e) {
            return null;

        }

    }

    /**
     * This method communicates directly with the mongodb database to fetch an order based on id
     * @param id this is the id of the requested order
     * @return requested order
     */
    @GetMapping("/order/{id}")
    public Optional<Order> getOrdersById(@PathVariable String id) {
        return repository.findById(id);
    }

    /**
     * This method communicates directly with the mongodb database to delete an existing order
     * A deleted order is moved to archives
     * @param id the id of the order to be deleted
     * @return true if successful
     */
    @DeleteMapping("order/delete/{id}")
    public Boolean deleteOrder(@PathVariable String id) {
        if(id == null){
            return false;
        } else {
            repository.deleteById(id);
            return true;
        }
    }


    /**
     * This method communicates directly with the mongodb database to fetch an order based on location
     * @param location this is the location of the requested order
     * @return requested order
     */
    @GetMapping("orders/findByLocation/{location}")
    public List<Order> getOrdersByLocation(@PathVariable String location) {
        return repository.findByLocation(location);
    }


    /**
     * This method communicates directly with the mongodb database to fetch orders made by a particular user
     * @param requesterId this is the id of user who made the order
     * @return list of orders
     */
    @GetMapping("/byRequesterId/{requesterId}")
    public List<Order> getByRequesterId(@PathVariable String requesterId) {
        return repository.findByRequesterId(requesterId);
    }


    /**
     * This method communicates directly with the mongodb database to fetch orders assigned to the logged in user
     * @param userId this is the id of the logged in user
     * @return list of assigned orders
     */
    @GetMapping("orders/assignToId/{userId}")
    public List<Order> getMyOrders(@PathVariable String userId) {
        return repository.getByAssignToId(userId);
    }


    /**
     * This method communicates directly with the mongodb database to update an existing order
     * @param id this is the id of the order to be updated
     * @param updateForm this is updated order body from the client side
     * @return updated order
     */
    @PutMapping("/order/{id}")
    public Order updateOrder(@PathVariable String id, @RequestParam(value = "order") String updateForm) {
        Optional<Order> optionalOrder = repository.findById(id);
        Order order;


        if (optionalOrder.isPresent()) {
            order = optionalOrder.get();
        } else {
            return null;
        }

        try {
            Order dto = objectMapper.readValue(updateForm, Order.class);

            // Indien een attribuut verschilt met het origineel object, update de attribuut
            if (!dto.getTitle().equals(order.getTitle())) {
                order.setTitle(dto.getTitle());
            }
            if (!dto.getDescription().equals(order.getDescription())) {
                order.setDescription(dto.getDescription());
            }
            if (!dto.getLocation().equals(order.getLocation())) {
                order.setLocation(dto.getLocation());
            }
            if (dto.isCloseTo() != order.isCloseTo()) {
                order.setCloseTo(!order.isCloseTo());
            }
            if (!dto.getFloor().equals(order.getFloor())) {
                order.setFloor(dto.getFloor());
            }
            if (!dto.getCampus().equals(order.getCampus())) {
                order.setCampus(dto.getCampus());
            }
            if (!dto.getStatus().equals(order.getStatus())) {
                order.setStatus(dto.getStatus());
                order.getStatusHistory().add(dto.getStatus());
            }
            if (!dto.getDate().equals(order.getDate())) {
                order.setDate(dto.getDate());
            }
            if (!dto.getTime().equals(order.getTime())) {
                order.setTime(dto.getTime());
            }
            if (!dto.getCategory().equals(order.getCategory())) {
                order.setCategory(dto.getCategory());
            }
            if (!dto.getCategoryDepartment().equals(order.getCategoryDepartment())) {
                order.setCategoryDepartment(dto.getCategoryDepartment());
            }

            // Push de wijzigingen naar de database
            repository.save(order);

            return order;
        } catch (Exception ex) {
            return null;
        }
    }


    /**
     * This method communicates directly with the mongodb database to fetch an order based on category
     * @param category this is the category of the requested order
     * @return requested order
     */
    @GetMapping("orders/byCategory/{category}")
    public List<Order> getOrdersByCategory(@PathVariable String category) {
        return repository.findByCategory(category);
    }


    /**
     * This method communicates directly with the mongodb database to assign an order to an external firm
     * @param body this is the order body with the updated assignToFirm property
     * @return assigned order
     */
    @PostMapping("order/assignFirm")
    public Order assignOrderToFirm(@RequestBody AssignOrder body) {
        try {
            Order order = repository.findOneById(body.getRequestId());
            order.setRequesterId(body.getRequesterId());
            ExternalFirms firm = new ExternalFirms(body.getAssignToFirm().getEmail(), body.getAssignToFirm().getDisplayName(), body.getAssignToFirm().getTelefonNr(),body.getAssignToFirm().getRole());
            order.setAssignToFirm(firm);
            repository.save(order);
            return order;
        } catch (Exception e) {
            return null;
        }

    }


}
