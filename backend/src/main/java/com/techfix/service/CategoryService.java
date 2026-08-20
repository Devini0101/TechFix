package com.techfix.service;

import com.techfix.model.Category;
import com.techfix.repository.CategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {
    private final CategoryRepository repository;

    public CategoryService(CategoryRepository repository ) {
        this.repository = repository;
    }

    public List<Category> findAll() {
        return repository.findAll();
    }
}
