CREATE DATABASE farmaceutical_trade_db;

CREATE TABLE Users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    state VARCHAR(100),
    city VARCHAR(100),
    address TEXT,
    profile_pic VARCHAR(255),
    contact_info VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the trigger function to update the 'updated_at' column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger for the 'Users' table
CREATE TRIGGER update_updated_at
BEFORE UPDATE ON Users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE Products (
    product_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES Users(user_id) ON DELETE CASCADE,
    category_id INT REFERENCES Categories(category_id) ON DELETE SET NULL,
    subcategory_id INT REFERENCES Subcategories(subcategory_id) ON DELETE SET NULL,
    product_name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    quantity DECIMAL(10, 2) NOT NULL,
    unit VARCHAR(20), -- e.g., kg, ton, liter
    condition VARCHAR(20) CHECK (condition IN ('new', 'used')),
    status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'sold', 'rented')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trigger function for updating 'updated_at' column
CREATE OR REPLACE FUNCTION update_product_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update 'updated_at' before each update
CREATE TRIGGER update_product_updated_at
BEFORE UPDATE ON Products
FOR EACH ROW
EXECUTE FUNCTION update_product_updated_at();

CREATE TABLE Categories (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT
);

CREATE TABLE Subcategories (
    subcategory_id SERIAL PRIMARY KEY,
    category_id INT REFERENCES Categories(category_id) ON DELETE CASCADE,
    subcategory_name VARCHAR(100) NOT NULL,
    description TEXT,
    UNIQUE (category_id, subcategory_name) -- Ensures unique subcategories within each category
);

CREATE TABLE Transactions (
    transaction_id SERIAL PRIMARY KEY,
    product_id INT REFERENCES Products(product_id) ON DELETE SET NULL,
    buyer_id INT REFERENCES Users(user_id) ON DELETE SET NULL,
    seller_id INT REFERENCES Users(user_id) ON DELETE SET NULL,
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    transaction_type VARCHAR(20) CHECK (transaction_type IN ('buy', 'rent')),
    price DECIMAL(10, 2) NOT NULL,
    quantity DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
    duration INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE FUNCTION update_transaction_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update 'updated_at' before each update on 'Rentals'
CREATE TRIGGER update_transaction_updated_at
BEFORE UPDATE ON Transactions
FOR EACH ROW
EXECUTE FUNCTION update_transaction_updated_at();

CREATE TABLE Rentals (
    rental_id SERIAL PRIMARY KEY,
    transaction_id INT REFERENCES Transactions(transaction_id) ON DELETE SET NULL,
    product_id INT REFERENCES Products(product_id) ON DELETE SET NULL,
    owner_id INT REFERENCES Users(user_id) ON DELETE SET NULL,
    renter_id INT REFERENCES Users(user_id) ON DELETE SET NULL,
    rental_start_date DATE NOT NULL,
    rental_end_date DATE NOT NULL,
    rental_price DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'returned', 'overdue')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trigger function to update 'updated_at' column in 'Rentals' table
CREATE OR REPLACE FUNCTION update_rental_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update 'updated_at' before each update on 'Rentals'
CREATE TRIGGER update_rental_updated_at
BEFORE UPDATE ON Rentals
FOR EACH ROW
EXECUTE FUNCTION update_rental_updated_at();

CREATE OR REPLACE FUNCTION set_rentals_overdue() 
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'active' AND NEW.rental_end_date < CURRENT_DATE THEN
    NEW.status := 'overdue';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_overdue_rentals
BEFORE UPDATE ON rentals
FOR EACH ROW
EXECUTE FUNCTION set_rentals_overdue();

CREATE TABLE Reviews (
    review_id SERIAL PRIMARY KEY,
    product_id INT REFERENCES Products(product_id) ON DELETE CASCADE,
    user_id INT REFERENCES Users(user_id) ON DELETE CASCADE,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    review_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Messages (
    message_id SERIAL PRIMARY KEY,
    sender_id INT REFERENCES Users(user_id) ON DELETE CASCADE,
    receiver_id INT REFERENCES Users(user_id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_read BOOLEAN DEFAULT FALSE
);

CREATE TABLE Media (
    media_id SERIAL PRIMARY KEY,
    product_id INT REFERENCES Products(product_id) ON DELETE CASCADE,
    media_type VARCHAR(10) CHECK (media_type IN ('image', 'video')),
    url VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
