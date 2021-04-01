--
-- PostgreSQL database dump
--

-- Dumped from database version 13.2
-- Dumped by pg_dump version 13.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: authors; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.authors (
    id integer NOT NULL,
    active boolean DEFAULT true NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    library_id integer NOT NULL,
    notes text
);


--
-- Name: authors_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.authors_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: authors_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.authors_id_seq OWNED BY public.authors.id;


--
-- Name: authors_library_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.authors_library_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: authors_library_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.authors_library_id_seq OWNED BY public.authors.library_id;


--
-- Name: authors_series; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.authors_series (
    id integer NOT NULL,
    author_id integer NOT NULL,
    series_id integer NOT NULL
);


--
-- Name: authors_series_author_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.authors_series_author_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: authors_series_author_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.authors_series_author_id_seq OWNED BY public.authors_series.author_id;


--
-- Name: authors_series_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.authors_series_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: authors_series_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.authors_series_id_seq OWNED BY public.authors_series.id;


--
-- Name: authors_series_series_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.authors_series_series_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: authors_series_series_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.authors_series_series_id_seq OWNED BY public.authors_series.series_id;


--
-- Name: authors_volumes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.authors_volumes (
    id integer NOT NULL,
    author_id integer NOT NULL,
    volume_id integer NOT NULL
);


--
-- Name: authors_volumes_author_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.authors_volumes_author_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: authors_volumes_author_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.authors_volumes_author_id_seq OWNED BY public.authors_volumes.author_id;


--
-- Name: authors_volumes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.authors_volumes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: authors_volumes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.authors_volumes_id_seq OWNED BY public.authors_volumes.id;


--
-- Name: authors_volumes_volume_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.authors_volumes_volume_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: authors_volumes_volume_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.authors_volumes_volume_id_seq OWNED BY public.authors_volumes.volume_id;


--
-- Name: libraries; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.libraries (
    id integer NOT NULL,
    active boolean DEFAULT true NOT NULL,
    name text NOT NULL,
    notes text,
    scope text NOT NULL
);


--
-- Name: libraries_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.libraries_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: libraries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.libraries_id_seq OWNED BY public.libraries.id;


--
-- Name: series; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.series (
    id integer NOT NULL,
    active boolean DEFAULT true NOT NULL,
    copyright smallint,
    library_id integer NOT NULL,
    name text NOT NULL,
    notes text
);


--
-- Name: series_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.series_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: series_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.series_id_seq OWNED BY public.series.id;


--
-- Name: series_library_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.series_library_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: series_library_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.series_library_id_seq OWNED BY public.series.library_id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    active boolean DEFAULT true NOT NULL,
    level text DEFAULT 'info'::text NOT NULL,
    library_id integer NOT NULL,
    notes text,
    password text NOT NULL,
    username text NOT NULL
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: users_library_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_library_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_library_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_library_id_seq OWNED BY public.users.library_id;


--
-- Name: volumes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.volumes (
    id integer NOT NULL,
    active boolean DEFAULT true NOT NULL,
    copyright smallint,
    isbn text,
    library_id integer NOT NULL,
    location text,
    media text,
    name text NOT NULL,
    notes text,
    read boolean DEFAULT false NOT NULL
);


--
-- Name: volumes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.volumes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: volumes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.volumes_id_seq OWNED BY public.volumes.id;


--
-- Name: volumes_library_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.volumes_library_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: volumes_library_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.volumes_library_id_seq OWNED BY public.volumes.library_id;


--
-- Name: authors id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.authors ALTER COLUMN id SET DEFAULT nextval('public.authors_id_seq'::regclass);


--
-- Name: authors library_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.authors ALTER COLUMN library_id SET DEFAULT nextval('public.authors_library_id_seq'::regclass);


--
-- Name: authors_series id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.authors_series ALTER COLUMN id SET DEFAULT nextval('public.authors_series_id_seq'::regclass);


--
-- Name: authors_series author_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.authors_series ALTER COLUMN author_id SET DEFAULT nextval('public.authors_series_author_id_seq'::regclass);


--
-- Name: authors_series series_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.authors_series ALTER COLUMN series_id SET DEFAULT nextval('public.authors_series_series_id_seq'::regclass);


--
-- Name: authors_volumes id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.authors_volumes ALTER COLUMN id SET DEFAULT nextval('public.authors_volumes_id_seq'::regclass);


--
-- Name: authors_volumes author_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.authors_volumes ALTER COLUMN author_id SET DEFAULT nextval('public.authors_volumes_author_id_seq'::regclass);


--
-- Name: authors_volumes volume_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.authors_volumes ALTER COLUMN volume_id SET DEFAULT nextval('public.authors_volumes_volume_id_seq'::regclass);


--
-- Name: libraries id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.libraries ALTER COLUMN id SET DEFAULT nextval('public.libraries_id_seq'::regclass);


--
-- Name: series id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.series ALTER COLUMN id SET DEFAULT nextval('public.series_id_seq'::regclass);


--
-- Name: series library_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.series ALTER COLUMN library_id SET DEFAULT nextval('public.series_library_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: users library_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN library_id SET DEFAULT nextval('public.users_library_id_seq'::regclass);


--
-- Name: volumes id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.volumes ALTER COLUMN id SET DEFAULT nextval('public.volumes_id_seq'::regclass);


--
-- Name: volumes library_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.volumes ALTER COLUMN library_id SET DEFAULT nextval('public.volumes_library_id_seq'::regclass);


--
-- Name: authors authors_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.authors
    ADD CONSTRAINT authors_pkey PRIMARY KEY (id);


--
-- Name: authors_series authors_series_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.authors_series
    ADD CONSTRAINT authors_series_pkey PRIMARY KEY (id);


--
-- Name: authors_volumes authors_volumes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.authors_volumes
    ADD CONSTRAINT authors_volumes_pkey PRIMARY KEY (id);


--
-- Name: libraries libraries_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.libraries
    ADD CONSTRAINT libraries_pkey PRIMARY KEY (id);


--
-- Name: series series_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.series
    ADD CONSTRAINT series_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: volumes volumes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.volumes
    ADD CONSTRAINT volumes_pkey PRIMARY KEY (id);


--
-- Name: ix_series_library_id_name; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX ix_series_library_id_name ON public.series USING btree (library_id, name);


--
-- Name: ix_volumes_library_id_name; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_volumes_library_id_name ON public.volumes USING btree (library_id, name);


--
-- Name: uk_authors_library_id_last_name_first_name; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX uk_authors_library_id_last_name_first_name ON public.authors USING btree (library_id, last_name, first_name);


--
-- Name: uk_authors_series_author_id_series_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX uk_authors_series_author_id_series_id ON public.authors_series USING btree (author_id, series_id);


--
-- Name: uk_authors_series_series_id_author_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX uk_authors_series_series_id_author_id ON public.authors_series USING btree (series_id, author_id);


--
-- Name: uk_authors_volumes_author_id_volume_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX uk_authors_volumes_author_id_volume_id ON public.authors_volumes USING btree (author_id, volume_id);


--
-- Name: uk_authors_volumes_volume_id_author_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX uk_authors_volumes_volume_id_author_id ON public.authors_volumes USING btree (volume_id, author_id);


--
-- Name: uk_libraries_name; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX uk_libraries_name ON public.libraries USING btree (name);


--
-- Name: uk_users_username; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX uk_users_username ON public.users USING btree (username);


--
-- Name: authors fk_authors_library_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.authors
    ADD CONSTRAINT fk_authors_library_id FOREIGN KEY (library_id) REFERENCES public.libraries(id);


--
-- Name: authors_series fk_authors_series_authors_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.authors_series
    ADD CONSTRAINT fk_authors_series_authors_id FOREIGN KEY (author_id) REFERENCES public.authors(id);


--
-- Name: authors_series fk_authors_series_series_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.authors_series
    ADD CONSTRAINT fk_authors_series_series_id FOREIGN KEY (series_id) REFERENCES public.series(id);


--
-- Name: authors_volumes fk_authors_volumes_authors_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.authors_volumes
    ADD CONSTRAINT fk_authors_volumes_authors_id FOREIGN KEY (author_id) REFERENCES public.authors(id);


--
-- Name: authors_volumes fk_authors_volumes_volumes_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.authors_volumes
    ADD CONSTRAINT fk_authors_volumes_volumes_id FOREIGN KEY (volume_id) REFERENCES public.volumes(id);


--
-- Name: series fk_series_library_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.series
    ADD CONSTRAINT fk_series_library_id FOREIGN KEY (library_id) REFERENCES public.libraries(id);


--
-- Name: users fk_users_library_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT fk_users_library_id FOREIGN KEY (library_id) REFERENCES public.libraries(id);


--
-- Name: volumes fk_volumes_library_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.volumes
    ADD CONSTRAINT fk_volumes_library_id FOREIGN KEY (library_id) REFERENCES public.libraries(id);


--
-- PostgreSQL database dump complete
--

