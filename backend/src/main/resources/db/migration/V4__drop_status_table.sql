-- col will store now the status code
ALTER TABLE maintenance_request ADD COLUMN status VARCHAR(255);

-- update that sets the code to the already existing maintenances before removing the status column
UPDATE maintenance_request mr
SET status = s.code
FROM status s
WHERE mr.status_id = s.id;

-- drops the column alongside with its constraint
ALTER TABLE maintenance_request DROP COLUMN status_id;

-- exclusão da tabela
DROP TABLE status;