-- removes info about destination employee and add status tracking
ALTER TABLE request_history DROP COLUMN destination_employee_id;
ALTER TABLE request_history ADD COLUMN previous_status VARCHAR(255);
ALTER TABLE request_history ADD COLUMN new_status VARCHAR(255);