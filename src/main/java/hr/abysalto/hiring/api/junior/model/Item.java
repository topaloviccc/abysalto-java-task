package hr.abysalto.hiring.api.junior.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

import java.math.BigDecimal;

@Data
@Table("ITEMS")
public class Item {
    @Id
    private Long itemNr;
    private String name;
    private BigDecimal price;
}
