CREATE TABLE printers (
    equip_id integer NOT NULL,
    type character varying(50) NOT NULL,
    color character varying(25) NOT NULL,
    location character varying(25),
    install_date date,
    last_maint_ext date,
    last_maint_int date,
    mfg_serial character varying(7),
    nickname character varying(25),
    CONSTRAINT printers_location_check CHECK (((location)::text = ANY ((ARRAY['north'::character varying, 'south'::character varying, 'west'::character varying, 'east'::character varying, 'northeast'::character varying, 'southeast'::character varying, 'southwest'::character varying, 'northwest'::character varying])::text[])))
);