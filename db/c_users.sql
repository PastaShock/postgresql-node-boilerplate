create table users (
    user_id UUID UNIQUE PRIMARY KEY,
    name varchar (50),
    email varchar (50),
    phone varchar (25),
    hired date
)