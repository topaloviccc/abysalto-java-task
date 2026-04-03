package hr.abysalto.hiring.api.junior.manager;


import hr.abysalto.hiring.api.junior.dto.BuyerDTO;

public interface BuyerManager {
	Iterable<BuyerDTO> getAllBuyers();
	void save(BuyerDTO buyer);
	BuyerDTO getById(Long id);
	void deleteById(Long id);
}
