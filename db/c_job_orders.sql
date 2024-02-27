-- this is a many-to-many relation intermediary
-- 
-- Linking of many orders that match up to (potentially) many jobs
-- products to bills
-- items to checkouts
-- etc...
    create table job_orders (
        job_id UUID REFERENCES jobs (job_id) ON UPDATE CASCADE ON DELETE CASCADE,
        order_id integer REFERENCES orders (order_id) ON UPDATE CASCADE,
        CONSTRAINT job_orders_pkey PRIMARY KEY (job_id, order_id)
        -- CONSTRAINT FK_user_id FOREIGN KEY (print_user) REFERENCES users (user_id)
    );