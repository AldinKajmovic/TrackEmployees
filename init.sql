--
-- PostgreSQL database dump
--

-- Dumped from database version 17.0
-- Dumped by pg_dump version 17.0

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: btree_gin; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS btree_gin WITH SCHEMA public;


--
-- Name: EXTENSION btree_gin; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION btree_gin IS 'support for indexing common datatypes in GIN';


--
-- Name: btree_gist; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS btree_gist WITH SCHEMA public;


--
-- Name: EXTENSION btree_gist; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION btree_gist IS 'support for indexing common datatypes in GiST';


--
-- Name: citext; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS citext WITH SCHEMA public;


--
-- Name: EXTENSION citext; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION citext IS 'data type for case-insensitive character strings';


--
-- Name: cube; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS cube WITH SCHEMA public;


--
-- Name: EXTENSION cube; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION cube IS 'data type for multidimensional cubes';


--
-- Name: dblink; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS dblink WITH SCHEMA public;


--
-- Name: EXTENSION dblink; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION dblink IS 'connect to other PostgreSQL databases from within a database';


--
-- Name: dict_int; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS dict_int WITH SCHEMA public;


--
-- Name: EXTENSION dict_int; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION dict_int IS 'text search dictionary template for integers';


--
-- Name: dict_xsyn; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS dict_xsyn WITH SCHEMA public;


--
-- Name: EXTENSION dict_xsyn; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION dict_xsyn IS 'text search dictionary template for extended synonym processing';


--
-- Name: earthdistance; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS earthdistance WITH SCHEMA public;


--
-- Name: EXTENSION earthdistance; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION earthdistance IS 'calculate great-circle distances on the surface of the Earth';


--
-- Name: fuzzystrmatch; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS fuzzystrmatch WITH SCHEMA public;


--
-- Name: EXTENSION fuzzystrmatch; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION fuzzystrmatch IS 'determine similarities and distance between strings';


--
-- Name: hstore; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS hstore WITH SCHEMA public;


--
-- Name: EXTENSION hstore; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION hstore IS 'data type for storing sets of (key, value) pairs';


--
-- Name: intarray; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS intarray WITH SCHEMA public;


--
-- Name: EXTENSION intarray; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION intarray IS 'functions, operators, and index support for 1-D arrays of integers';


--
-- Name: ltree; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS ltree WITH SCHEMA public;


--
-- Name: EXTENSION ltree; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION ltree IS 'data type for hierarchical tree-like structures';


--
-- Name: pg_stat_statements; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_stat_statements WITH SCHEMA public;


--
-- Name: EXTENSION pg_stat_statements; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_stat_statements IS 'track execution statistics of all SQL statements executed';


--
-- Name: pg_trgm; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA public;


--
-- Name: EXTENSION pg_trgm; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_trgm IS 'text similarity measurement and index searching based on trigrams';


--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: pgrowlocks; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgrowlocks WITH SCHEMA public;


--
-- Name: EXTENSION pgrowlocks; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgrowlocks IS 'show row-level locking information';


--
-- Name: pgstattuple; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgstattuple WITH SCHEMA public;


--
-- Name: EXTENSION pgstattuple; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgstattuple IS 'show tuple-level statistics';


--
-- Name: tablefunc; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS tablefunc WITH SCHEMA public;


--
-- Name: EXTENSION tablefunc; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION tablefunc IS 'functions that manipulate whole tables, including crosstab';


--
-- Name: unaccent; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS unaccent WITH SCHEMA public;


--
-- Name: EXTENSION unaccent; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION unaccent IS 'text search dictionary that removes accents';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: xml2; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS xml2 WITH SCHEMA public;


--
-- Name: EXTENSION xml2; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION xml2 IS 'XPath querying and XSLT';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: evidencija; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.evidencija (
    id integer NOT NULL,
    id_radnika integer,
    vrijeme_dolaska time without time zone,
    vrijeme_odlaska time without time zone,
    datum date
);


ALTER TABLE public.evidencija OWNER TO postgres;

--
-- Name: evidencija_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.evidencija_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.evidencija_id_seq OWNER TO postgres;

--
-- Name: evidencija_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.evidencija_id_seq OWNED BY public.evidencija.id;


--
-- Name: klijent; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.klijent (
    id_klijenta integer NOT NULL,
    ime character varying(50),
    prezime character varying(50),
    email character varying(50),
    broj_telefona character varying(50)
);


ALTER TABLE public.klijent OWNER TO postgres;

--
-- Name: klijent_id_klijenta_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.klijent_id_klijenta_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.klijent_id_klijenta_seq OWNER TO postgres;

--
-- Name: klijent_id_klijenta_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.klijent_id_klijenta_seq OWNED BY public.klijent.id_klijenta;


--
-- Name: korisnik; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.korisnik (
    id integer NOT NULL,
    ime character varying(50),
    prezime character varying(50),
    username character varying(50),
    password character varying(500),
    tip_korisnika character varying(50),
    id_nadredjeni integer
);


ALTER TABLE public.korisnik OWNER TO postgres;

--
-- Name: korisnik_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.korisnik_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.korisnik_id_seq OWNER TO postgres;

--
-- Name: korisnik_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.korisnik_id_seq OWNED BY public.korisnik.id;


--
-- Name: projekti; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.projekti (
    id_projekta integer NOT NULL,
    naziv_projekta character varying(50),
    opis_projekta character varying(100),
    startni_datum date,
    zavrsni_datum date,
    id_klijenta integer,
    status_projekta character varying(30)
);


ALTER TABLE public.projekti OWNER TO postgres;

--
-- Name: projekti_idProjekta_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."projekti_idProjekta_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."projekti_idProjekta_seq" OWNER TO postgres;

--
-- Name: projekti_idProjekta_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."projekti_idProjekta_seq" OWNED BY public.projekti.id_projekta;


--
-- Name: qa; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.qa (
    id integer NOT NULL,
    pitanje character varying(200),
    odgovor character varying(200),
    id_primalac integer,
    id_posiljaoc integer
);


ALTER TABLE public.qa OWNER TO postgres;

--
-- Name: qa_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.qa_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.qa_id_seq OWNER TO postgres;

--
-- Name: qa_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.qa_id_seq OWNED BY public.qa.id;


--
-- Name: radni_sati; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.radni_sati (
    id integer NOT NULL,
    id_radnika integer,
    id_projekta integer,
    datum date,
    broj_sati integer,
    id_zadatka integer
);


ALTER TABLE public.radni_sati OWNER TO postgres;

--
-- Name: radniSati_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."radniSati_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."radniSati_id_seq" OWNER TO postgres;

--
-- Name: radniSati_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."radniSati_id_seq" OWNED BY public.radni_sati.id;


--
-- Name: taskovi; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.taskovi (
    id_taska integer NOT NULL,
    naziv character varying(30),
    opis character varying(100),
    id_projekta integer,
    status_taska character varying(30)
);


ALTER TABLE public.taskovi OWNER TO postgres;

--
-- Name: taskovi_id_taska_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.taskovi_id_taska_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.taskovi_id_taska_seq OWNER TO postgres;

--
-- Name: taskovi_id_taska_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.taskovi_id_taska_seq OWNED BY public.taskovi.id_taska;


--
-- Name: tim; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tim (
    id integer NOT NULL,
    id_projekta integer,
    id_korisnika integer,
    tip_korisnika character varying(30)
);


ALTER TABLE public.tim OWNER TO postgres;

--
-- Name: tim_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tim_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tim_id_seq OWNER TO postgres;

--
-- Name: tim_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tim_id_seq OWNED BY public.tim.id;


--
-- Name: evidencija id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.evidencija ALTER COLUMN id SET DEFAULT nextval('public.evidencija_id_seq'::regclass);


--
-- Name: klijent id_klijenta; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.klijent ALTER COLUMN id_klijenta SET DEFAULT nextval('public.klijent_id_klijenta_seq'::regclass);


--
-- Name: korisnik id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.korisnik ALTER COLUMN id SET DEFAULT nextval('public.korisnik_id_seq'::regclass);


--
-- Name: projekti id_projekta; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projekti ALTER COLUMN id_projekta SET DEFAULT nextval('public."projekti_idProjekta_seq"'::regclass);


--
-- Name: qa id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.qa ALTER COLUMN id SET DEFAULT nextval('public.qa_id_seq'::regclass);


--
-- Name: radni_sati id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.radni_sati ALTER COLUMN id SET DEFAULT nextval('public."radniSati_id_seq"'::regclass);


--
-- Name: taskovi id_taska; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.taskovi ALTER COLUMN id_taska SET DEFAULT nextval('public.taskovi_id_taska_seq'::regclass);


--
-- Name: tim id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tim ALTER COLUMN id SET DEFAULT nextval('public.tim_id_seq'::regclass);


--
-- Data for Name: evidencija; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: klijent; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: korisnik; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: projekti; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: qa; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: radni_sati; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: taskovi; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: tim; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Name: evidencija_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.evidencija_id_seq', 1, false);


--
-- Name: klijent_id_klijenta_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.klijent_id_klijenta_seq', 1, false);


--
-- Name: korisnik_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.korisnik_id_seq', 1, false);


--
-- Name: projekti_idProjekta_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."projekti_idProjekta_seq"', 1, false);


--
-- Name: qa_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.qa_id_seq', 1, false);


--
-- Name: radniSati_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."radniSati_id_seq"', 1, false);


--
-- Name: taskovi_id_taska_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.taskovi_id_taska_seq', 1, false);


--
-- Name: tim_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tim_id_seq', 1, false);


--
-- PostgreSQL database dump complete
--

