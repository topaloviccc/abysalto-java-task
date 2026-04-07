package hr.abysalto.hiring.api.junior.repository;

import hr.abysalto.hiring.api.junior.model.Item;
import org.springframework.data.repository.CrudRepository;

public interface ItemRepository extends CrudRepository<Item, Long> {
}
