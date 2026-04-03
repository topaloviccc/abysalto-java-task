package hr.abysalto.hiring.api.junior.repository;

import hr.abysalto.hiring.api.junior.model.Buyer;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BuyerRepository extends CrudRepository<Buyer, Long> { //PagingAndSortingRepository
}
