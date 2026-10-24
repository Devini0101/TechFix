package com.techfix.service;

import com.techfix.dto.request.CategoryRequestDTO;
import com.techfix.dto.response.CategoryResponseDTO;
import com.techfix.dto.response.CategorySummaryResponseDTO;
import com.techfix.model.Category;
import com.techfix.repository.CategoryRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class CategoryService {

    private final CategoryRepository repository;

    public CategoryService(CategoryRepository repository ) {
        this.repository = repository;
    }

    public List<Category> findAll() {
        return repository.findAllByOrderByActiveDescNameAsc();
    }

    @Transactional
    public Category create(CategoryRequestDTO request) {
        String code = request.code().trim().toUpperCase();
        if (repository.existsByCodeIgnoreCase(code)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Código de categoria já cadastrado");
        }

        Category category = new Category();
        category.setName(request.name().trim());
        category.setCode(code);
        category.setActive(request.active());
        return repository.save(category);
    }

    @Transactional
    public Category update(Long id, CategoryRequestDTO request) {
        Category category = repository.findByIdAndActiveTrue(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Categoria não encontrada"));

        String code = request.code().trim().toUpperCase();
        if (repository.existsByCodeIgnoreCaseAndIdNot(code, id)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Código de categoria já cadastrado");
        }

        category.setName(request.name().trim());
        category.setCode(code);
        return repository.save(category);
    }

    @Transactional
    public void delete(Long id) {
        Category category = repository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Categoria não encontrada"));
        repository.delete(category);
    }

    public List<CategoryResponseDTO> getActive() {
        List<CategoryResponseDTO> categories = repository.findByActiveTrue().stream().map(
                c -> {
                    return new CategoryResponseDTO(c.getId(), c.getName(),c.getCode(), true);
                }
        ).toList();

        return categories;
    }

    public CategorySummaryResponseDTO getSummary() {
        return repository.getSummary();
    }

    @Transactional
    public CategoryResponseDTO updateStatus(Long id, Boolean val) {
        Category category = repository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Categoria não encontrada"));

        category.setActive(val);
        repository.save(category);

        return new CategoryResponseDTO(category.getId(), category.getName(), category.getCode(), category.isActive());
    }

    public CategoryResponseDTO findById(Long id) {
        Category category = repository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Categoria não encontrada"));
        return new CategoryResponseDTO(category.getId(), category.getName(), category.getCode(), category.isActive());
    }
}