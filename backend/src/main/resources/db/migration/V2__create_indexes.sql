-- melhoria join de enderecos
CREATE INDEX idx_user_address_id ON "user"(address_id);

--melhoria joins de status,user,category e payment
CREATE INDEX idx_maintenance_request_status_id ON maintenance_request(status_id);
CREATE INDEX idx_maintenance_request_client_id ON maintenance_request(client_id);
CREATE INDEX idx_maintenance_request_responsible_employee ON maintenance_request(responsible_employee_id);
CREATE INDEX idx_maintenance_request_category_id ON maintenance_request(category_id);
CREATE INDEX idx_maintenance_request_payment_id ON maintenance_request(payment_id);

-- melhoria nos joins em user e maintence
CREATE INDEX idx_request_history_maintenance_request ON request_history(maintenance_request_id);
CREATE INDEX idx_request_history_employee ON request_history(employee_id);
CREATE INDEX idx_request_history_destination_employee ON request_history(destination_employee_id);

-- indices pra filtros e order

CREATE INDEX idx_maintenance_request_active
    ON maintenance_request(created_at DESC)
    WHERE deleted_at IS NULL;

-- order em data
CREATE INDEX idx_request_history_created_at ON request_history(created_at DESC);
CREATE INDEX idx_payment_created_at ON payment(created_at DESC);

-- busca de cep
CREATE INDEX idx_address_cep ON address(cep);


-- indices para pesquisa usando o fulltext

CREATE INDEX idx_maintenance_request_fts ON maintenance_request
    USING gin(
    to_tsvector('portuguese',
        coalesce(item, '') || ' ' ||
        coalesce(item_description, '') || ' ' ||
        coalesce(item_defect, '')
    ));

CREATE INDEX idx_user_name_fts ON "user" USING gin( to_tsvector('portuguese', name));