select 
    jobs.job_id,
    printers.nickname,
    users.name
from (
    ( jobs
        inner join users ON users.user_id = jobs.print_user
    )
    inner join printers on jobs.print_device = printers.equip_id
);