package com.techfix.repository;

import com.techfix.dto.response.CategorySummaryResponseDTO;
import com.techfix.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    List<Category> findAllByActiveTrueOrderByNameAsc();

    Optional<Category> findByIdAndActiveTrue(Long id);

    boolean existsByCodeIgnoreCase(String code);

    boolean existsByCodeIgnoreCaseAndIdNot(String code, Long id);

    Optional<Category> findByCodeAndActiveTrue(String id);

    List<Category> findByActiveTrue();

    @Query("""
        SELECT new com.techfix.dto.response.CategorySummaryResponseDTO(
            COUNT(c),
            COALESCE(SUM(CASE WHEN c.active = true THEN 1L ELSE 0L END), 0L),
            COALESCE(SUM(CASE WHEN c.active = false THEN 1L ELSE 0L END), 0L)
        )
        FROM Category c
        """)
    CategorySummaryResponseDTO getSummary();

    List<Category> findAllByOrderByActiveDescNameAsc();
}