package com.techfix.repository;

import com.techfix.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    @Query(value = """
        SELECT * FROM "user" u 
        WHERE to_tsvector('portuguese', u.name) @@ plainto_tsquery('portuguese', :searchTerm)
        """, nativeQuery = true)
    List<User> searchByNameFullText(@Param("searchTerm") String searchTerm);

    @Query(value = """
        SELECT * FROM "user" u 
        WHERE to_tsvector('portuguese', u.name) @@ plainto_tsquery('portuguese', :searchTerm)
        """,
            countQuery = """
        SELECT count(*) FROM "user" u 
        WHERE to_tsvector('portuguese', u.name) @@ plainto_tsquery('portuguese', :searchTerm)
        """,
            nativeQuery = true)
    Page<User> searchByNameFullTextPaged(@Param("searchTerm") String searchTerm, Pageable pageable);
}
