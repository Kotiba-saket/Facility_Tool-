package com.Faciltiy_Tool.facilitytoos.Controller;
import com.Faciltiy_Tool.facilitytoos.Repository.OrderCommentRepository;
import com.Faciltiy_Tool.facilitytoos.model.OrderComment;
import com.Faciltiy_Tool.facilitytoos.model.OrderCommentData;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * This controller class is responsible for adding, updating and deleting comments on orders
 *
 * @author Team8-tryCatchUS
 */
@RestController
@RequestMapping(path = "/api")
public class OrderCommentController {

    private OrderCommentRepository repository;

    public OrderCommentController(OrderCommentRepository repository) {
        this.repository = repository;
    }

    /**
     * This method communicates directly with the mongodb database to add comment to an order
     * @param orderId this is the id of the order being commented on
     * @param comment this is the comment body from the client side
     * @return comment
     */
    @PostMapping("/orderComment/{orderId}")
    public OrderComment addComment(@PathVariable String orderId, @RequestBody OrderComment comment){
        OrderComment comment1 = repository.findOrderCommentByOrderId(orderId);
        if(comment1 == null){

            return repository.save(comment);
        } else {
            List<OrderCommentData> orderCommentData = comment1.getOrderCommentData();
            List<OrderCommentData> orderCommentFromclient = comment.getOrderCommentData();
            orderCommentData.add(orderCommentFromclient.get(orderCommentFromclient.size() - 1));
            return repository.save(comment1);
        }

    }


    /**
     * This method communicates directly with the mongodb database to fetch all comments on an order
     * @param orderId this is the id of the order
     * @return comments
     */
    @GetMapping("/orderComment/{orderId}")
    public OrderComment comment(@PathVariable("orderId") String orderId){
        return repository.findOrderCommentByOrderId(orderId);

    }


    /**
     * This method communicates directly with the mongodb database to update an existing comment
     * @param orderId this is the id of the order whose comment is being updated
     * @param index this is the position of the comment since the comments are saved in an array
     * @param text this is the updated comment body from the client side
     * @return updated comment
     */
    @PatchMapping("/orderComment/{orderId}/{index}")
    public OrderComment updateComment(@PathVariable String orderId, @PathVariable  int index , String text){
        OrderComment comment1 = repository.findOrderCommentByOrderId(orderId);

        List<OrderCommentData> orderCommentData = comment1.getOrderCommentData();

        OrderCommentData data = orderCommentData.get(index);
        data.setText(text);
        repository.save(comment1);
        return comment1;

    }

    /**
     * This method communicates directly with the mongodb database to delete an existing comment
     * @param orderId this is the id of the order to be deleted
     * @param index this is the position of the comment to be deleted inside the comments array
     * @return comments left in the array
     */
    @DeleteMapping("/orderComment/{orderId}/{index}")
    public OrderComment deleteComment(@PathVariable String orderId, @PathVariable  int index ){
        OrderComment comment1 = repository.findOrderCommentByOrderId(orderId);

        List<OrderCommentData> orderCommentData = comment1.getOrderCommentData();
        orderCommentData.remove(index);

        return repository.save(comment1);


    }
}
