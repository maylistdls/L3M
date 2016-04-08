--
-- PostgreSQL database dump
--

SET statement_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = off;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET escape_string_warning = off;

--
-- Name: plpgsql; Type: PROCEDURAL LANGUAGE; Schema: -; Owner: postgres
--

CREATE OR REPLACE PROCEDURAL LANGUAGE plpgsql;


ALTER PROCEDURAL LANGUAGE plpgsql OWNER TO postgres;

SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: perso; Type: TABLE; Schema: public; Owner: maxoutigrou62; Tablespace: 
--

CREATE TABLE perso (
    id integer,
    loc point,
    capa real,
    etat character(12),
    equipe integer,
    regen integer,
    obs integer,
    protec integer,
    recup integer,
    tir integer,
    assaut integer,
    n_partie integer
);


ALTER TABLE public.perso OWNER TO maxoutigrou62;

--
-- Name: amis_id_seq; Type: SEQUENCE; Schema: public; Owner: maxoutigrou62
--

CREATE SEQUENCE amis_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.amis_id_seq OWNER TO maxoutigrou62;

--
-- Name: amis_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: maxoutigrou62
--

ALTER SEQUENCE amis_id_seq OWNED BY perso.id;


--
-- Name: qg; Type: TABLE; Schema: public; Owner: maxoutigrou62; Tablespace: 
--

CREATE TABLE qg (
    capa real,
    equipe integer,
    qg_bat boolean,
    loc point,
    id integer NOT NULL,
    tour integer,
    n_partie integer
);


ALTER TABLE public.qg OWNER TO maxoutigrou62;

--
-- Name: qg_id_seq; Type: SEQUENCE; Schema: public; Owner: maxoutigrou62
--

CREATE SEQUENCE qg_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.qg_id_seq OWNER TO maxoutigrou62;

--
-- Name: qg_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: maxoutigrou62
--

ALTER SEQUENCE qg_id_seq OWNED BY qg.id;


SET default_with_oids = true;

--
-- Name: sync; Type: TABLE; Schema: public; Owner: maxoutigrou62; Tablespace: 
--

CREATE TABLE sync (
    t_sync integer DEFAULT 0,
    c_sync boolean DEFAULT false,
    d_sync integer,
    r_sync integer DEFAULT 0,
    s_sync integer DEFAULT 0
);


ALTER TABLE public.sync OWNER TO maxoutigrou62;

--
-- Name: id; Type: DEFAULT; Schema: public; Owner: maxoutigrou62
--

ALTER TABLE ONLY qg ALTER COLUMN id SET DEFAULT nextval('qg_id_seq'::regclass);


--
-- Name: amis_id_seq; Type: SEQUENCE SET; Schema: public; Owner: maxoutigrou62
--

SELECT pg_catalog.setval('amis_id_seq', 6, true);


--
-- Data for Name: perso; Type: TABLE DATA; Schema: public; Owner: maxoutigrou62
--

INSERT INTO perso VALUES (2, '(48.2999999999999972,2.58000000000000007)', 100, 'obs         ', 2, 25, 50, 1, 0, 0, 0, 2);
INSERT INTO perso VALUES (3, '(48.2999999999999972,2.58999999999999986)', 100, 'obs         ', 1, 25, 50, 1, 0, 0, 0, 2);
INSERT INTO perso VALUES (4, '(48.3500000000000014,2.58000000000000007)', 100, 'obs         ', 2, 25, 50, 1, 0, 0, 0, 2);
INSERT INTO perso VALUES (5, '(48.3200000000000003,2.56999999999999984)', 100, 'obs         ', 1, 25, 50, 1, 0, 0, 0, 2);
INSERT INTO perso VALUES (6, '(48.3200000000000003,2.58999999999999986)', 100, 'obs         ', 2, 25, 50, 1, 0, 0, 0, 2);


--
-- Data for Name: qg; Type: TABLE DATA; Schema: public; Owner: maxoutigrou62
--



--
-- Name: qg_id_seq; Type: SEQUENCE SET; Schema: public; Owner: maxoutigrou62
--

SELECT pg_catalog.setval('qg_id_seq', 89, true);


--
-- Data for Name: sync; Type: TABLE DATA; Schema: public; Owner: maxoutigrou62
--

INSERT INTO sync VALUES (1459781699, false, 5, 1460019956, 5);


--
-- Name: public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO maxoutigrou62;


--
-- PostgreSQL database dump complete
--

