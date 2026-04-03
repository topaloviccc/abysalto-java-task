package hr.abysalto.hiring.api.junior.manager;

import hr.abysalto.hiring.api.junior.dto.OrderDTO;

public interface OrderManager {
    Iterable<OrderDTO> getAllOrders();
    void save(OrderDTO order);
    OrderDTO getById(Long id);
}
