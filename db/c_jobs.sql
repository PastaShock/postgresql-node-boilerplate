create table jobs (
    job_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    date_downloaded date NOT NULL,
    date_printed date NOT NULL,
    print_user UUID NOT NULL,
    print_device integer NOT NULL,
    print_queue varchar (1)
);