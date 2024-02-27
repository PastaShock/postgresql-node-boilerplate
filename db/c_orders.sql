create table orders (
    order_id integer PRIMARY KEY,
	sales_order_id varchar (25) NOT NULL,
	fund_id varchar (25) NOT NULL,
	fundraiser_name varchar (50) NOT NULL,
	placed_on_date date,
	date_downloaded date,
	date_printed date,
	order_type varchar (30) NOT NULL,
	logo_script varchar (30),
	primary_color varchar (25),
	secondary_colo varchar (25),
	logo_id varchar (25),
	logo_count_digital integer,
	logo_count_digital_small integer
);