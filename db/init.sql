CREATE TABLE IF NOT EXISTS productColor (
	id SERIAL PRIMARY KEY,
	color TEXT
);

CREATE TABLE IF NOT EXISTS productSize (
	id SERIAL PRIMARY KEY,
	size varchar
);

CREATE TABLE IF NOT EXISTS productCategories (
	id SERIAL PRIMARY KEY,
	categoryName TEXT NOT NULL,
	description TEXT
);

CREATE TABLE IF NOT EXISTS product (
	id SERIAL PRIMARY KEY,
	productName TEXT NOT NULL,
	description TEXT,
	weight float DEFAULT 0.00,
	thumbnail varchar,
	category_id INT NOT NULL,
	CONSTRAINT fk_category FOREIGN KEY(category_id) REFERENCES productCategories(id)
);

CREATE TABLE IF NOT EXISTS product_options (
	product_id INT NOT NULL REFERENCES product(id),
	size_id INT NOT NULL REFERENCES productsize(id),
	color_id INT NOT NULL REFERENCES productcolor(id),
	quantity INT DEFAULT 0,
	price float DEFAULT 0.00,
	image varchar,
	CONSTRAINT fk_product_option_key PRIMARY KEY(product_id, size_id, color_id)
);