--
-- PostgreSQL database dump
--

-- Dumped from database version 13.4
-- Dumped by pg_dump version 13.4

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
-- Name: access_tokens; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.access_tokens (
    id integer NOT NULL,
    expires timestamp with time zone NOT NULL,
    scope text NOT NULL,
    token text NOT NULL,
    user_id integer NOT NULL
);


--
-- Name: access_tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.access_tokens_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: access_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.access_tokens_id_seq OWNED BY public.access_tokens.id;


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
    series_id integer NOT NULL,
    principal boolean DEFAULT false NOT NULL
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
-- Name: authors_stories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.authors_stories (
    id integer NOT NULL,
    author_id integer NOT NULL,
    story_id integer NOT NULL,
    principal boolean DEFAULT false NOT NULL
);


--
-- Name: authors_stories_author_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.authors_stories_author_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: authors_stories_author_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.authors_stories_author_id_seq OWNED BY public.authors_stories.author_id;


--
-- Name: authors_stories_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.authors_stories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: authors_stories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.authors_stories_id_seq OWNED BY public.authors_stories.id;


--
-- Name: authors_stories_story_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.authors_stories_story_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: authors_stories_story_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.authors_stories_story_id_seq OWNED BY public.authors_stories.story_id;


--
-- Name: authors_volumes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.authors_volumes (
    id integer NOT NULL,
    author_id integer NOT NULL,
    volume_id integer NOT NULL,
    principal boolean DEFAULT false NOT NULL
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
-- Name: refresh_tokens; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.refresh_tokens (
    id integer NOT NULL,
    access_token text NOT NULL,
    expires timestamp with time zone NOT NULL,
    token text NOT NULL,
    user_id integer NOT NULL
);


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.refresh_tokens_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.refresh_tokens_id_seq OWNED BY public.refresh_tokens.id;


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
-- Name: series_stories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.series_stories (
    id integer NOT NULL,
    series_id integer NOT NULL,
    story_id integer NOT NULL,
    ordinal smallint
);


--
-- Name: series_stories_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.series_stories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: series_stories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.series_stories_id_seq OWNED BY public.series_stories.id;


--
-- Name: series_stories_series_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.series_stories_series_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: series_stories_series_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.series_stories_series_id_seq OWNED BY public.series_stories.series_id;


--
-- Name: series_stories_story_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.series_stories_story_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: series_stories_story_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.series_stories_story_id_seq OWNED BY public.series_stories.story_id;


--
-- Name: stories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.stories (
    id integer NOT NULL,
    active boolean DEFAULT true NOT NULL,
    copyright smallint,
    library_id integer NOT NULL,
    name text NOT NULL,
    notes text
);


--
-- Name: stories_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.stories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: stories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.stories_id_seq OWNED BY public.stories.id;


--
-- Name: stories_library_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.stories_library_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: stories_library_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.stories_library_id_seq OWNED BY public.stories.library_id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    active boolean DEFAULT true NOT NULL,
    password text NOT NULL,
    scope text NOT NULL,
    username text NOT NULL,
    level text DEFAULT 'info'::text NOT NULL
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
-- Name: volumes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.volumes (
    id integer NOT NULL,
    active boolean DEFAULT true NOT NULL,
    copyright smallint,
    isbn text,
    library_id integer NOT NULL,
    location text,
    name text NOT NULL,
    notes text,
    read boolean DEFAULT false NOT NULL,
    google_id text,
    type text DEFAULT 'Single'::text NOT NULL
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
-- Name: volumes_stories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.volumes_stories (
    id integer NOT NULL,
    volume_id integer NOT NULL,
    story_id integer NOT NULL
);


--
-- Name: volumes_stories_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.volumes_stories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: volumes_stories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.volumes_stories_id_seq OWNED BY public.volumes_stories.id;


--
-- Name: volumes_stories_story_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.volumes_stories_story_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: volumes_stories_story_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.volumes_stories_story_id_seq OWNED BY public.volumes_stories.story_id;


--
-- Name: volumes_stories_volume_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.volumes_stories_volume_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: volumes_stories_volume_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.volumes_stories_volume_id_seq OWNED BY public.volumes_stories.volume_id;


--
-- Name: access_tokens id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.access_tokens ALTER COLUMN id SET DEFAULT nextval('public.access_tokens_id_seq'::regclass);


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
-- Name: authors_stories id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.authors_stories ALTER COLUMN id SET DEFAULT nextval('public.authors_stories_id_seq'::regclass);


--
-- Name: authors_stories author_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.authors_stories ALTER COLUMN author_id SET DEFAULT nextval('public.authors_stories_author_id_seq'::regclass);


--
-- Name: authors_stories story_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.authors_stories ALTER COLUMN story_id SET DEFAULT nextval('public.authors_stories_story_id_seq'::regclass);


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
-- Name: refresh_tokens id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.refresh_tokens ALTER COLUMN id SET DEFAULT nextval('public.refresh_tokens_id_seq'::regclass);


--
-- Name: series id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.series ALTER COLUMN id SET DEFAULT nextval('public.series_id_seq'::regclass);


--
-- Name: series library_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.series ALTER COLUMN library_id SET DEFAULT nextval('public.series_library_id_seq'::regclass);


--
-- Name: series_stories id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.series_stories ALTER COLUMN id SET DEFAULT nextval('public.series_stories_id_seq'::regclass);


--
-- Name: series_stories series_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.series_stories ALTER COLUMN series_id SET DEFAULT nextval('public.series_stories_series_id_seq'::regclass);


--
-- Name: series_stories story_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.series_stories ALTER COLUMN story_id SET DEFAULT nextval('public.series_stories_story_id_seq'::regclass);


--
-- Name: stories id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stories ALTER COLUMN id SET DEFAULT nextval('public.stories_id_seq'::regclass);


--
-- Name: stories library_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stories ALTER COLUMN library_id SET DEFAULT nextval('public.stories_library_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: volumes id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.volumes ALTER COLUMN id SET DEFAULT nextval('public.volumes_id_seq'::regclass);


--
-- Name: volumes library_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.volumes ALTER COLUMN library_id SET DEFAULT nextval('public.volumes_library_id_seq'::regclass);


--
-- Name: volumes_stories id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.volumes_stories ALTER COLUMN id SET DEFAULT nextval('public.volumes_stories_id_seq'::regclass);


--
-- Name: volumes_stories volume_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.volumes_stories ALTER COLUMN volume_id SET DEFAULT nextval('public.volumes_stories_volume_id_seq'::regclass);


--
-- Name: volumes_stories story_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.volumes_stories ALTER COLUMN story_id SET DEFAULT nextval('public.volumes_stories_story_id_seq'::regclass);


--
-- Name: access_tokens access_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.access_tokens
    ADD CONSTRAINT access_tokens_pkey PRIMARY KEY (id);


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
-- Name: authors_stories authors_stories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.authors_stories
    ADD CONSTRAINT authors_stories_pkey PRIMARY KEY (id);


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
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);


--
-- Name: series series_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.series
    ADD CONSTRAINT series_pkey PRIMARY KEY (id);


--
-- Name: series_stories series_stories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.series_stories
    ADD CONSTRAINT series_stories_pkey PRIMARY KEY (id);


--
-- Name: stories stories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stories
    ADD CONSTRAINT stories_pkey PRIMARY KEY (id);


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
-- Name: volumes_stories volumes_stories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.volumes_stories
    ADD CONSTRAINT volumes_stories_pkey PRIMARY KEY (id);


--
-- Name: access_tokens_token_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX access_tokens_token_key ON public.access_tokens USING btree (token);


--
-- Name: ix_series_library_id_name; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX ix_series_library_id_name ON public.series USING btree (library_id, name);


--
-- Name: ix_stories_library_id_name; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_stories_library_id_name ON public.stories USING btree (library_id, name);


--
-- Name: ix_volumes_library_id_name; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_volumes_library_id_name ON public.volumes USING btree (library_id, name);


--
-- Name: refresh_tokens_token_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX refresh_tokens_token_key ON public.refresh_tokens USING btree (token);


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
-- Name: uk_authors_stories_author_id_story_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX uk_authors_stories_author_id_story_id ON public.authors_stories USING btree (author_id, story_id);


--
-- Name: uk_authors_stories_story_id_author_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX uk_authors_stories_story_id_author_id ON public.authors_stories USING btree (story_id, author_id);


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
-- Name: uk_series_stories_series_id_story_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX uk_series_stories_series_id_story_id ON public.series_stories USING btree (series_id, story_id);


--
-- Name: uk_series_stories_story_id_series_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX uk_series_stories_story_id_series_id ON public.series_stories USING btree (story_id, series_id);


--
-- Name: uk_users_username; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX uk_users_username ON public.users USING btree (username);


--
-- Name: uk_volumes_stories_story_id_volume_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX uk_volumes_stories_story_id_volume_id ON public.volumes_stories USING btree (story_id, volume_id);


--
-- Name: uk_volumes_stories_volume_id_story_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX uk_volumes_stories_volume_id_story_id ON public.volumes_stories USING btree (volume_id, story_id);


--
-- Name: access_tokens access_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.access_tokens
    ADD CONSTRAINT access_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: authors fk_authors_library_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.authors
    ADD CONSTRAINT fk_authors_library_id FOREIGN KEY (library_id) REFERENCES public.libraries(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: authors_series fk_authors_series_author_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.authors_series
    ADD CONSTRAINT fk_authors_series_author_id FOREIGN KEY (author_id) REFERENCES public.authors(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: authors_series fk_authors_series_series_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.authors_series
    ADD CONSTRAINT fk_authors_series_series_id FOREIGN KEY (series_id) REFERENCES public.series(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: authors_stories fk_authors_stories_author_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.authors_stories
    ADD CONSTRAINT fk_authors_stories_author_id FOREIGN KEY (author_id) REFERENCES public.authors(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: authors_stories fk_authors_stories_story_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.authors_stories
    ADD CONSTRAINT fk_authors_stories_story_id FOREIGN KEY (story_id) REFERENCES public.stories(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: authors_volumes fk_authors_volumes_author_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.authors_volumes
    ADD CONSTRAINT fk_authors_volumes_author_id FOREIGN KEY (author_id) REFERENCES public.authors(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: authors_volumes fk_authors_volumes_volume_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.authors_volumes
    ADD CONSTRAINT fk_authors_volumes_volume_id FOREIGN KEY (volume_id) REFERENCES public.volumes(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: series fk_series_library_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.series
    ADD CONSTRAINT fk_series_library_id FOREIGN KEY (library_id) REFERENCES public.libraries(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: series_stories fk_series_stories_series_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.series_stories
    ADD CONSTRAINT fk_series_stories_series_id FOREIGN KEY (series_id) REFERENCES public.series(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: series_stories fk_series_stories_story_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.series_stories
    ADD CONSTRAINT fk_series_stories_story_id FOREIGN KEY (story_id) REFERENCES public.stories(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: stories fk_stories_library_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stories
    ADD CONSTRAINT fk_stories_library_id FOREIGN KEY (library_id) REFERENCES public.libraries(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: volumes fk_volumes_library_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.volumes
    ADD CONSTRAINT fk_volumes_library_id FOREIGN KEY (library_id) REFERENCES public.libraries(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: volumes_stories fk_volumes_stories_story_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.volumes_stories
    ADD CONSTRAINT fk_volumes_stories_story_id FOREIGN KEY (story_id) REFERENCES public.stories(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: volumes_stories fk_volumes_stories_volume_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.volumes_stories
    ADD CONSTRAINT fk_volumes_stories_volume_id FOREIGN KEY (volume_id) REFERENCES public.volumes(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: refresh_tokens refresh_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

