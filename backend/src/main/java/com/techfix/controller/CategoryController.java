package com.techfix.controller;

import com.techfix.dto.request.CategoryRequestDTO;
import com.techfix.dto.response.CategoryResponseDTO;
import com.techfix.dto.response.CategorySummaryResponseDTO;
import com.techfix.exception.ForbiddenAccessException;
import com.techfix.model.Category;
import com.techfix.model.User;
import com.techfix.model.enums.UserRole;
import com.techfix.service.CategoryService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/category" )
public class CategoryController {

    private final CategoryService service;

    public CategoryController(CategoryService service) {
        this.service = service;
    }

    @GetMapping("/")
    public ResponseEntity<List<Category>> findAll(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(service.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoryResponseDTO> findAll(@PathVariable Long id, @AuthenticationPrincipal User user) {
        if (user.getRole() != UserRole.employee) {
            throw new ForbiddenAccessException("Acesso negado.");
        }
        return ResponseEntity.ok(service.findById(id));
    }

    @PostMapping
    public ResponseEntity<Category> create(@Valid @RequestBody CategoryRequestDTO request, @AuthenticationPrincipal User user) {
        if (user.getRole() != UserRole.employee) {
            throw new ForbiddenAccessException("Acesso negado.");
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Category> update(@PathVariable Long id, @Valid @RequestBody CategoryRequestDTO request, @AuthenticationPrincipal User user) {
        if (user.getRole() != UserRole.employee) {
            throw new ForbiddenAccessException("Acesso negado.");
        }
        return ResponseEntity.ok(service.update(id, request));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<CategoryResponseDTO> updateStatus(@PathVariable Long id, @RequestBody Map<String, Boolean> payload, @AuthenticationPrincipal User user) {
        if (user.getRole() != UserRole.employee) {
            throw new ForbiddenAccessException("Acesso negado.");
        }
        Boolean val = payload.get("active");

        return ResponseEntity.ok(service.updateStatus(id, val));
    }

    @GetMapping("/summary")
    public ResponseEntity<CategorySummaryResponseDTO> getSummary() {
        return ResponseEntity.ok(service.getSummary());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deactivate(@PathVariable Long id, @AuthenticationPrincipal User user) {
        if (user.getRole() != UserRole.employee) {
            throw new ForbiddenAccessException("Acesso negado.");
        }
        service.delete(id);
        return ResponseEntity.noContent().build();
    }


    @GetMapping("/active")
    public ResponseEntity<List<CategoryResponseDTO>> getActive () {
        return ResponseEntity.ok(service.getActive());
    }

}
