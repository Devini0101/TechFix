package com.techfix.service;

import com.techfix.dto.request.CategoryRequestDTO;
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
        return repository.findAllByActiveTrueOrderByNameAsc();
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
        category.setActive(true);
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
    public void deactivate(Long id) {
        Category category = repository.findByIdAndActiveTrue(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Categoria não encontrada"));
        category.setActive(false);
        repository.save(category);
    }
}