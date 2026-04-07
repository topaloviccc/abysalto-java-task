package hr.abysalto.hiring.api.junior.controller;

import hr.abysalto.hiring.api.junior.dto.OrderDTO;
import hr.abysalto.hiring.api.junior.manager.OrderManager;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Orders", description = "for handling orders")
@RequestMapping("api/order")
@RestController
public class OrderController {
    @Autowired
    private OrderManager orderManager;

    @GetMapping("/")
    public ResponseEntity<Iterable<OrderDTO>> getAllOrders() {
        try {
            Iterable<OrderDTO> orders = this.orderManager.getAllOrders();
            return ResponseEntity.ok(orders);
        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/")
    public ResponseEntity<Void> saveOrder(@RequestBody @Valid OrderDTO orderDTO) {
        try {
            this.orderManager.save(orderDTO);
            return ResponseEntity.status(HttpStatus.OK).build();
        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
}
