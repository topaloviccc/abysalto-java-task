package hr.abysalto.hiring.api.junior.dto;

import hr.abysalto.hiring.api.junior.model.OrderStatus;
import hr.abysalto.hiring.api.junior.model.PaymentOption;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class OrderDTO {
    private Long orderNr;
    private BuyerDTO buyer;
    private OrderStatus orderStatus;
    private LocalDateTime orderTime;
    private PaymentOption paymentOption;
    @NotNull(message = "You need to input a valid address")
    private BuyerAddressDTO deliveryAddress;
    private String contactNumber;
    private String currency;
    private BigDecimal totalPrice;

    @NotEmpty(message = "You slut")
    private List<OrderItemDTO> orderItems;
}
