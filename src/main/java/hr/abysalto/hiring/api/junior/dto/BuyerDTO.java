package hr.abysalto.hiring.api.junior.dto;

import lombok.Data;

@Data
public class BuyerDTO {
    private Long buyerId;
    private String firstName;
    private String lastName;
    private String title;
}
