package hr.abysalto.hiring.api.junior.manager;

import hr.abysalto.hiring.api.junior.dto.BuyerAddressDTO;
import hr.abysalto.hiring.api.junior.dto.BuyerDTO;
import hr.abysalto.hiring.api.junior.dto.OrderDTO;
import hr.abysalto.hiring.api.junior.dto.OrderItemDTO;
import hr.abysalto.hiring.api.junior.model.Order;
import hr.abysalto.hiring.api.junior.model.OrderItem;
import hr.abysalto.hiring.api.junior.repository.BuyerAddressRepository;
import hr.abysalto.hiring.api.junior.repository.BuyerRepository;
import hr.abysalto.hiring.api.junior.repository.OrderItemRepository;
import hr.abysalto.hiring.api.junior.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Component
public class OrderManagerImpl implements OrderManager {

    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private OrderItemRepository orderItemRepository;
    @Autowired
    private BuyerRepository buyerRepository;
    @Autowired
    private BuyerAddressRepository buyerAddressRepository;


    private OrderDTO toDTO(Order order) {
        OrderDTO dto = new OrderDTO();
        dto.setOrderNr(order.getOrderNr());

        BuyerDTO buyerDTO = new BuyerDTO();
        buyerRepository.findById(order.getBuyerId()).ifPresent(buyer -> {
            buyerDTO.setBuyerId(buyer.getBuyerId());
            buyerDTO.setFirstName(buyer.getFirstName());
            buyerDTO.setLastName(buyer.getLastName());
        });

        dto.setBuyer(buyerDTO);

        dto.setOrderStatus(order.getOrderStatus());
        dto.setOrderTime(order.getOrderTime());
        dto.setPaymentOption(order.getPaymentOption());

        BuyerAddressDTO buyerAddressDTO = new BuyerAddressDTO();
        buyerAddressRepository.findById(order.getDeliveryAddressId()).ifPresent(buyerAddress -> {
            buyerAddressDTO.setBuyerAddressId(buyerAddress.getBuyerAddressId());
            buyerAddressDTO.setCity(buyerAddress.getCity());
            buyerAddressDTO.setStreet(buyerAddress.getStreet());
            buyerAddressDTO.setHomeNumber(buyerAddress.getHomeNumber());
        });

        dto.setContactNumber(order.getContactNumber());
        dto.setCurrency(order.getCurrency());
        dto.setTotalPrice(order.getTotalPrice());

        List<OrderItem> orderItems = orderItemRepository.findByOrderNr(order.getOrderNr());

        List<OrderItemDTO> orderItemDTOS = orderItems.stream().map(item -> {
            OrderItemDTO dtoItem = new OrderItemDTO();
            dtoItem.setOrderItemId(item.getOrderItemId());
            dtoItem.setOrderId(item.getOrderId());
            dtoItem.setItemNr(item.getItemNr());
            dtoItem.setName(item.getName());
            dtoItem.setQuantity(item.getQuantity());
            dtoItem.setPrice(item.getPrice());
            return dtoItem;
        }).toList();

        dto.setOrderItems(orderItemDTOS);
        return dto;
    }

    private Order toObj(OrderDTO dto) {
        Order order = new Order();
        order.setOrderNr(dto.getOrderNr());

        if(dto.getBuyer() != null){
            order.setBuyerId(dto.getBuyer().getBuyerId());
        }
        order.setOrderStatus(dto.getOrderStatus());
        order.setOrderTime(dto.getOrderTime());
        order.setPaymentOption(dto.getPaymentOption());

        if(dto.getDeliveryAddress() != null){
            order.setDeliveryAddressId(dto.getDeliveryAddress().getBuyerAddressId());
        }

        order.setContactNumber(dto.getContactNumber());
        order.setCurrency(dto.getCurrency());
        order.setTotalPrice(dto.getTotalPrice());
        return order;
    }

    @Override
    public List<OrderDTO> getAllOrders() {
        List<OrderDTO> orderDTOS = new ArrayList<>();
        for (Order order : orderRepository.findAll()) {
            orderDTOS.add(toDTO(order));
        }
        return orderDTOS;
    }

    @Override
    @Transactional
    public void save(OrderDTO orderDTO) {

        Order order = toObj(orderDTO);
        this.orderRepository.save(order);

        if(orderDTO.getOrderItems() != null){
            List<OrderItem> items = orderDTO.getOrderItems().stream().map(itemDTO -> {
                OrderItem i = new OrderItem();
                i.setOrderItemId(itemDTO.getOrderItemId());
                i.setOrderId(itemDTO.getOrderId());
                i.setQuantity(itemDTO.getQuantity());
                i.setPrice(itemDTO.getPrice());
                return i;
            }).toList();

        this.orderItemRepository.saveAll(items);
        }
    }

    @Override
    public OrderDTO getById(Long id) {
        return this.orderRepository.findById(id).map(this::toDTO).orElse(null);
    }
}
