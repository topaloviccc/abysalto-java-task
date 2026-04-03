package hr.abysalto.hiring.api.junior.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class OrderItemDTO {
    private Long orderItemId;
    private Long orderId;
    private Short itemNr;
    private String name;
    private Short quantity;
    private BigDecimal price;
}
