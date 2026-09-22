INSERT INTO products (name, price, updated_at, version)
SELECT
    'Product ' || i,
    1000 + ((i % 500) * 100),
    NOW() - ((i % 60) || ' seconds')::INTERVAL,
    0
FROM generate_series(1, 10000) AS i;
