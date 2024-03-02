create function order_ns_url(rec orders)
returns text
language sql
as $$
select 'https://4766534.app.netsuite.com/app/accounting/transactions/salesord.nl?id=' || $1.order_id;
$$;