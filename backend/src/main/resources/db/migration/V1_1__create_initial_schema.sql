CREATE TABLE address (
    id SERIAL PRIMARY KEY,
    cep VARCHAR(8) NOT NULL,
    street TEXT NOT NULL,
    complement TEXT,
    neighborhood TEXT NOT NULL,
    uf VARCHAR(2) NOT NULL,
    city TEXT NOT NULL
);

CREATE TABLE category (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE status (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(100) NOT NULL UNIQUE,
    color VARCHAR(255) NOT NULL
);

CREATE TYPE payment_method AS ENUM ('pix', 'debit', 'credit');
CREATE TYPE user_role AS ENUM ('client', 'employee');

CREATE TABLE payment (
    id SERIAL PRIMARY KEY,
    method payment_method NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- aspas por ser uma palavra reservada
CREATE TABLE "user" (
    id SERIAL PRIMARY KEY,
    cpf VARCHAR(11) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role user_role NOT NULL,
    telephone VARCHAR(15) NOT NULL,
    birth_date DATE DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
address_id INT REFERENCES address(id)
);

CREATE TABLE maintenance_request (
    id SERIAL PRIMARY KEY,
    item VARCHAR(255) NOT NULL,
    item_description TEXT NOT NULL,
    item_defect TEXT NOT NULL,
    estimated_price DECIMAL(10, 2) DEFAULT NULL,
    price DECIMAL(10, 2) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP DEFAULT NULL,
    reject_reason TEXT DEFAULT NULL,
    fix_description TEXT DEFAULT NULL,
    orientation TEXT DEFAULT NULL,
    status_id INT NOT NULL REFERENCES status(id),
    client_id INT NOT NULL REFERENCES "user"(id),
    responsible_employee_id INT DEFAULT NULL REFERENCES "user"(id),
    category_id INT NOT NULL REFERENCES category(id),
    payment_id INT DEFAULT NULL REFERENCES payment(id)
);

CREATE TABLE request_history (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    action VARCHAR(255) NOT NULL,
    description TEXT DEFAULT NULL,
    maintenance_request_id INT NOT NULL REFERENCES maintenance_request(id),
    employee_id INT NOT NULL REFERENCES "user"(id),
    destination_employee_id INT REFERENCES "user"(id)
);