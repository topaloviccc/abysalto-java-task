package hr.abysalto.hiring.api.junior.controller;

import hr.abysalto.hiring.api.junior.manager.BuyerManager;
import hr.abysalto.hiring.api.junior.dto.BuyerDTO;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Buyers", description = "for handling buyers")
@RequestMapping("api/buyer")
@RestController
@CrossOrigin(origins = "*")
public class BuyerController {

	@Autowired
	private BuyerManager buyerManager;

	@GetMapping("/")
	public ResponseEntity<Iterable<BuyerDTO>> getAllBuyers() {
		try {
			Iterable<BuyerDTO> buyers = this.buyerManager.getAllBuyers();
			return ResponseEntity.ok(buyers);
		} catch (Exception ex) {
			return ResponseEntity.internalServerError().build();
		}
	}

	@PutMapping("/")
	public ResponseEntity<Void> saveBuyer( @RequestBody BuyerDTO buyerDTO) {
//		buyerDTO.setBuyerId(id);
		try{
			this.buyerManager.save(buyerDTO);
			return ResponseEntity.status(HttpStatus.OK).build();
		} catch (Exception ex) {
			return ResponseEntity.internalServerError().build();
		}
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteBuyer(@PathVariable(value = "id") long id) {
		this.buyerManager.deleteById(id);
		return ResponseEntity.noContent().build();
	}
}
