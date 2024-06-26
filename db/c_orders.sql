create table orders (
    order_id integer PRIMARY KEY,
	sales_order_id varchar (25) NOT NULL,
	magento_id varchar (42),
	fundraiser_id varchar (32) NOT NULL,
	fundraiser_name varchar (86) NOT NULL,
	placed_on_date date,
	date_downloaded date,
	date_printed date,
	order_notes varchar (255),
	order_type varchar (30) NOT NULL,
	logo_script varchar (51),
	primary_color varchar (25),
	secondary_color varchar (25),
	logo_id varchar (64),
	logo_count_digital integer,
	logo_count_digital_small integer,
	logo_count_sticker integer,
	logo_count_embroidery integer,
	print_user_name varchar (56),
	print_job_id varchar (36),
	print_device varchar (15),
	order_ns_url varchar (84) GENERATED ALWAYS AS ('https://4766534.app.netsuite.com/app/accounting/transactions/salesord.nl?id=' || order_id) STORED
);