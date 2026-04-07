package hr.abysalto.hiring.api.junior.controller;

import hr.abysalto.hiring.api.junior.model.Item;
import hr.abysalto.hiring.api.junior.repository.ItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/item")
@CrossOrigin(origins = "*")
public class ItemController {
    @Autowired
    private ItemRepository itemRepository;

    @GetMapping("/")
    public ResponseEntity<Iterable<Item>> getAllItems() {
        return ResponseEntity.ok(itemRepository.findAll());
    }
}
