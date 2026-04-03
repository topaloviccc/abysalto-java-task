package hr.abysalto.hiring.api.junior.manager;

import hr.abysalto.hiring.api.junior.dto.BuyerDTO;
import hr.abysalto.hiring.api.junior.model.Buyer;
import hr.abysalto.hiring.api.junior.repository.BuyerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class BuyerManagerImpl implements BuyerManager {
	@Autowired
	private BuyerRepository buyerRepository;

	private BuyerDTO toDTO(Buyer buyer) {
		BuyerDTO dto = new BuyerDTO();

		dto.setBuyerId(buyer.getBuyerId());
		dto.setFirstName(buyer.getFirstName());
		dto.setLastName(buyer.getLastName());
		dto.setTitle(buyer.getTitle());

		return dto;
	}

	private Buyer toModel(BuyerDTO dto) {
		Buyer buyer = new Buyer();
		buyer.setBuyerId(dto.getBuyerId());
		buyer.setFirstName(dto.getFirstName());
		buyer.setLastName(dto.getLastName());
		buyer.setTitle(dto.getTitle());

		return buyer;
	}

	@Override
	public List<BuyerDTO> getAllBuyers() {
		List<BuyerDTO> buyerDTOS = new ArrayList<>();
		for (Buyer buyer : buyerRepository.findAll()) {
			buyerDTOS.add(toDTO(buyer));
		}
		return buyerDTOS;
	}

	@Override
	public void save(BuyerDTO buyerDTO) {
		Buyer buyer = this.toModel(buyerDTO);
		this.buyerRepository.save(buyer);
	}

	@Override
	public BuyerDTO getById(Long id) {
		return this.buyerRepository.findById(id).map(this::toDTO).orElse(null);
	}

	@Override
	public void deleteById(Long id) {
		this.buyerRepository.deleteById(id);
	}
}
