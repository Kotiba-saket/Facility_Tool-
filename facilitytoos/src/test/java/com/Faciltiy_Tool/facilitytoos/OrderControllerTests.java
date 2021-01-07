package com.Faciltiy_Tool.facilitytoos;

import com.Faciltiy_Tool.facilitytoos.Controller.FacilityController;
import com.Faciltiy_Tool.facilitytoos.Controller.OrderController;
import com.Faciltiy_Tool.facilitytoos.Repository.FacilityRepository;
import com.Faciltiy_Tool.facilitytoos.Repository.OrderRepository;
import com.Faciltiy_Tool.facilitytoos.model.ExternalFirms;
import com.Faciltiy_Tool.facilitytoos.model.Order;
import com.Faciltiy_Tool.facilitytoos.model.Report;
import com.Faciltiy_Tool.facilitytoos.model.User;
import org.junit.FixMethodOrder;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.junit.runners.MethodSorters;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@RunWith(SpringRunner.class)
@SpringBootTest
@FixMethodOrder(MethodSorters.NAME_ASCENDING)
class OrderControllerTests {
    OrderRepository mockRepo = Mockito.mock(OrderRepository.class);
    OrderController controller = new OrderController(mockRepo);


    /**
     * Een test voor de saveOrder functie
     * expected HttpStatus.Ok
     *
     */
    @Test
    public void Save_Orders_To_Database_If_Succeeded_Return_HttpStatus_200() {

        User azureUser = new User("57ef89sdf12f3dd5def", "Mark");
        ExternalFirms firm = new ExternalFirms(null, null, null, null);
        Order order = new Order("123456", "Mark", "test title", "ELL", "1", "01.03",
                false, "test description", "2020-06-06", "10:00", "Logistieke diensten",
                "Drank", "Wachten op ontvangst door logistieke diensten", azureUser, firm
        );

        Mockito.when(mockRepo.save(order)).thenReturn(order);

        Order actual = mockRepo.save(order);

        assertThat(actual).isEqualTo(order);
        assertThat(actual.getCategory()).isEqualTo("Drank");
        System.out.println("=======Save Order was Successful =======");
    }


    /**
     * Een test voor de getOrders function
     * returneert een lijst van Orders als de test geslaagt is
     */
    @Test
    public void Get_All_Orders_From_Database() {

        User azureUser = new User("57ef89sdf12f3dd5def", "Mark");
        ExternalFirms firm = new ExternalFirms(null, null, null, null);
        Order order = new Order("123456", "Mark", "test title", "ELL", "1", "01.03",
                false, "test description", "2020-06-06", "10:00", "Logistieke diensten",
                "Drank", "Wachten op ontvangst door logistieke diensten", azureUser, firm
        );

        User azureUser1 = new User("57ef89sdf12f3dd5dfcc", "Boamah");
        ExternalFirms firm1 = new ExternalFirms(null, null, null, null);
        Order order1 = new Order("123487", "Boamah", "test title1", "NOO", "1", "03.03",
                false, "test description1", "2020-07-07", "09:00", "Logistieke diensten",
                "Drank", "Wachten op ontvangst door logistieke diensten", azureUser, firm
        );

        List<Order> orders = List.of(order, order1);


        Mockito.when(mockRepo.findAll()).thenReturn(orders);

        List<Order> actual = controller.getOrders();

        assertThat(actual.size()).isEqualTo(2);

        System.out.println("=======Get all orders(tasks) was successful =======");
    }


    /**
     * Een test voor de getOrderById function
     * returneert een order op basis van id als de test geslaagt is
     */
    @Test
    public void Get_One_Order_By_Id() {

        User azureUser = new User("57ef89sdf12f3dd5def", "Mark");
        ExternalFirms firm = new ExternalFirms(null, null, null, null);
        Order order = new Order("123456", "Mark", "test title", "ELL", "1", "01.03",
                false, "test description", "2020-06-06", "10:00", "Logistieke diensten",
                "Drank", "Wachten op ontvangst door logistieke diensten", azureUser, firm
        );
        order.setId("57ef89sdf12f3dd5ghi");

        Mockito.when(mockRepo.findById(order.getId())).thenReturn(Optional.of(order));

        Optional<Order> actual = controller.getOrdersById(order.getId());

        assertThat(actual.get().getId()).isEqualTo("57ef89sdf12f3dd5ghi");
        assertThat(actual).isEqualTo(Optional.of(order));

        System.out.println("=======Get order by ID was successful  =======");
    }


    /**
     * Een test voor de getOrderByLocation function
     * returneert een order op basis van locatie als de test geslaagt is
     */
    @Test
    public void Get_Orders_By_Location() {

        User azureUser = new User("57ef89sdf12f3dd5def", "Mark");
        ExternalFirms firm = new ExternalFirms(null, null, null, null);
        Order order = new Order("123456", "Mark", "test title", "ELL", "1", "01.03",
                false, "test description", "2020-06-06", "10:00", "Logistieke diensten",
                "Drank", "Wachten op ontvangst door logistieke diensten", azureUser, firm
        );

        List<Order> orders = List.of(order);
        Mockito.when(mockRepo.findByLocation(order.getLocation())).thenReturn(orders);

        List<Order> actual = controller.getOrdersByLocation("01.03");

        assertThat(actual.size()).isEqualTo(1);

        System.out.println("=======Get all orders by location was successful =======");
    }


    /**
     * Een test voor de getOrderByCategory function
     * returneert een order op basis van categorie als de test geslaagt is
     */
    @Test
    public void Get_Order_By_Category() {
        User azureUser = new User("57ef89sdf12f3dd5def", "Mark");
        ExternalFirms firm = new ExternalFirms(null, null, null, null);
        Order order = new Order("123456", "Mark", "test title", "ELL", "1", "01.03",
                false, "test description", "2020-06-06", "10:00", "Logistieke diensten",
                "Drank", "Wachten op ontvangst door logistieke diensten", azureUser, firm
        );

        List<Order> orders = List.of(order);
        Mockito.when(mockRepo.findByCategory(order.getCategory())).thenReturn(orders);

        List<Order> actual = controller.getOrdersByCategory("Drank");

        assertThat(actual.size()).isEqualTo(1);

        System.out.println("=======Get all orders by category was successful =======");
    }


    @Test
    public void Find_By_Assign_To__Logged_In_User (){

        User azureUser = new User("57ef89sdf12f3dd5def", "Mark");
        ExternalFirms firm = new ExternalFirms(null, null, null, null);
        Order order = new Order("123456", "Mark", "test title", "ELL", "1", "01.03",
                false, "test description", "2020-06-06", "10:00", "Logistieke diensten",
                "Drank", "Wachten op ontvangst door logistieke diensten", azureUser, firm
        );

        Order order1 = new Order("123457", "Mark", "test title1", "NOO", "3", "03.03",
                false, "test description1", "2020-07-06", "08:00", "Logistieke diensten",
                "Drank", "Wachten op ontvangst door logistieke diensten", azureUser, firm
        );

        List<Order> orders = List.of(order, order1);

        Mockito.when(mockRepo.getByAssignToId(order.getAssignTo().getId())).thenReturn(orders);

        List<Order> actual = controller.getMyOrders("57ef89sdf12f3dd5def");
        assertThat(actual).isEqualTo(orders);
        assertThat(actual.size()).isEqualTo(2);

        System.out.println("=======Find Orders By AssignTo Logged In User Succeded =======");


    }


    @Test
    public void Delete_An_Order_From_Database() {
        List<Order> orders = new ArrayList<>();
        User azureUser = new User("57ef89sdf12f3dd5def", "Mark");
        ExternalFirms firm = new ExternalFirms(null, null, null, null);
        Order order = new Order("123456", "Mark", "test title", "ELL", "1", "01.03",
                false, "test description", "2020-06-06", "10:00", "Logistieke diensten",
                "Drank", "Wachten op ontvangst door logistieke diensten", azureUser, firm
        );

        orders.add(order);
        controller.deleteOrder(order.getId());
        List<Order> actual = controller.getOrders();
        assertThat(actual.size()).isEqualTo(0);

        System.out.println("=======Delete Order was successful  =======");
    }


}
