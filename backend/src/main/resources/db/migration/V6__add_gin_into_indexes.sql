CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- criacao de idx otimizado LIKE e ILIKE
CREATE INDEX idx_maint_req_item_trgm
    ON maintenance_request
    USING gin (LOWER(item) gin_trgm_ops);