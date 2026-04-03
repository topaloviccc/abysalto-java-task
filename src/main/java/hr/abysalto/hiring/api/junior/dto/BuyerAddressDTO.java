package hr.abysalto.hiring.api.junior.dto;

import lombok.Data;

@Data
public class BuyerAddressDTO {
    private Long buyerAddressId;
    private String city;
    private String street;
    private String homeNumber;
}
