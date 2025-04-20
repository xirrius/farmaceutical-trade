--
-- PostgreSQL database dump
--

-- Dumped from database version 16.3
-- Dumped by pg_dump version 16.3

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

--
-- Name: set_rentals_overdue(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.set_rentals_overdue() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF NEW.status = 'active' AND NEW.rental_end_date < CURRENT_DATE THEN
    NEW.status := 'overdue';
  END IF;
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.set_rentals_overdue() OWNER TO postgres;

--
-- Name: update_product_updated_at(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_product_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_product_updated_at() OWNER TO postgres;

--
-- Name: update_rental_updated_at(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_rental_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_rental_updated_at() OWNER TO postgres;

--
-- Name: update_transaction_updated_at(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_transaction_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_transaction_updated_at() OWNER TO postgres;

--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_updated_at_column() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories (
    category_id integer NOT NULL,
    category_name character varying(100) NOT NULL,
    description text
);


ALTER TABLE public.categories OWNER TO postgres;

--
-- Name: categories_category_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.categories_category_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categories_category_id_seq OWNER TO postgres;

--
-- Name: categories_category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categories_category_id_seq OWNED BY public.categories.category_id;


--
-- Name: media; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.media (
    media_id integer NOT NULL,
    product_id integer,
    media_type character varying(10),
    url character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT media_media_type_check CHECK (((media_type)::text = ANY ((ARRAY['image'::character varying, 'video'::character varying])::text[])))
);


ALTER TABLE public.media OWNER TO postgres;

--
-- Name: media_media_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.media_media_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.media_media_id_seq OWNER TO postgres;

--
-- Name: media_media_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.media_media_id_seq OWNED BY public.media.media_id;


--
-- Name: messages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.messages (
    message_id integer NOT NULL,
    sender_id integer,
    receiver_id integer,
    content text NOT NULL,
    "timestamp" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    is_read boolean DEFAULT false
);


ALTER TABLE public.messages OWNER TO postgres;

--
-- Name: messages_message_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.messages_message_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.messages_message_id_seq OWNER TO postgres;

--
-- Name: messages_message_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.messages_message_id_seq OWNED BY public.messages.message_id;


--
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    product_id integer NOT NULL,
    user_id integer,
    category_id integer,
    subcategory_id integer,
    product_name character varying(100) NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    quantity numeric(10,2) NOT NULL,
    unit character varying(20),
    condition character varying(20),
    status character varying(20) DEFAULT 'available'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT products_condition_check CHECK (((condition)::text = ANY ((ARRAY['new'::character varying, 'used'::character varying])::text[]))),
    CONSTRAINT products_status_check CHECK (((status)::text = ANY ((ARRAY['available'::character varying, 'sold'::character varying, 'rented'::character varying])::text[])))
);


ALTER TABLE public.products OWNER TO postgres;

--
-- Name: products_product_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.products_product_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.products_product_id_seq OWNER TO postgres;

--
-- Name: products_product_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.products_product_id_seq OWNED BY public.products.product_id;


--
-- Name: rentals; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rentals (
    rental_id integer NOT NULL,
    product_id integer,
    renter_id integer,
    rental_start_date date NOT NULL,
    rental_end_date date NOT NULL,
    rental_price numeric(10,2) NOT NULL,
    status character varying(20) DEFAULT 'active'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    transaction_id integer,
    owner_id integer,
    CONSTRAINT rentals_status_check CHECK (((status)::text = ANY ((ARRAY['active'::character varying, 'returned'::character varying, 'overdue'::character varying])::text[])))
);


ALTER TABLE public.rentals OWNER TO postgres;

--
-- Name: rentals_rental_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.rentals_rental_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.rentals_rental_id_seq OWNER TO postgres;

--
-- Name: rentals_rental_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.rentals_rental_id_seq OWNED BY public.rentals.rental_id;


--
-- Name: reviews; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reviews (
    review_id integer NOT NULL,
    product_id integer,
    user_id integer,
    rating integer,
    review_text text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT reviews_rating_check CHECK (((rating >= 1) AND (rating <= 5)))
);


ALTER TABLE public.reviews OWNER TO postgres;

--
-- Name: reviews_review_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.reviews_review_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.reviews_review_id_seq OWNER TO postgres;

--
-- Name: reviews_review_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.reviews_review_id_seq OWNED BY public.reviews.review_id;


--
-- Name: subcategories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.subcategories (
    subcategory_id integer NOT NULL,
    category_id integer,
    subcategory_name character varying(100) NOT NULL,
    description text
);


ALTER TABLE public.subcategories OWNER TO postgres;

--
-- Name: subcategories_subcategory_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.subcategories_subcategory_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.subcategories_subcategory_id_seq OWNER TO postgres;

--
-- Name: subcategories_subcategory_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.subcategories_subcategory_id_seq OWNED BY public.subcategories.subcategory_id;


--
-- Name: transactions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transactions (
    transaction_id integer NOT NULL,
    product_id integer,
    buyer_id integer,
    seller_id integer,
    transaction_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    transaction_type character varying(20),
    price numeric(10,2) NOT NULL,
    status character varying(20) DEFAULT 'pending'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    quantity numeric(10,2) NOT NULL,
    duration integer DEFAULT 0,
    CONSTRAINT transactions_status_check CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'completed'::character varying, 'cancelled'::character varying])::text[]))),
    CONSTRAINT transactions_transaction_type_check CHECK (((transaction_type)::text = ANY ((ARRAY['buy'::character varying, 'rent'::character varying])::text[])))
);


ALTER TABLE public.transactions OWNER TO postgres;

--
-- Name: transactions_transaction_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.transactions_transaction_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.transactions_transaction_id_seq OWNER TO postgres;

--
-- Name: transactions_transaction_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.transactions_transaction_id_seq OWNED BY public.transactions.transaction_id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    user_id integer NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    password character varying(255) NOT NULL,
    state character varying(100),
    city character varying(100),
    address text,
    profile_pic character varying(255),
    contact_info character varying(50),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_user_id_seq OWNER TO postgres;

--
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;


--
-- Name: categories category_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories ALTER COLUMN category_id SET DEFAULT nextval('public.categories_category_id_seq'::regclass);


--
-- Name: media media_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.media ALTER COLUMN media_id SET DEFAULT nextval('public.media_media_id_seq'::regclass);


--
-- Name: messages message_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages ALTER COLUMN message_id SET DEFAULT nextval('public.messages_message_id_seq'::regclass);


--
-- Name: products product_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products ALTER COLUMN product_id SET DEFAULT nextval('public.products_product_id_seq'::regclass);


--
-- Name: rentals rental_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rentals ALTER COLUMN rental_id SET DEFAULT nextval('public.rentals_rental_id_seq'::regclass);


--
-- Name: reviews review_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews ALTER COLUMN review_id SET DEFAULT nextval('public.reviews_review_id_seq'::regclass);


--
-- Name: subcategories subcategory_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subcategories ALTER COLUMN subcategory_id SET DEFAULT nextval('public.subcategories_subcategory_id_seq'::regclass);


--
-- Name: transactions transaction_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions ALTER COLUMN transaction_id SET DEFAULT nextval('public.transactions_transaction_id_seq'::regclass);


--
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categories (category_id, category_name, description) FROM stdin;
1	Crops	Cultivated plants for food, fiber, or fuel.
2	Grains	Harvested seeds of cereal plants like wheat and rice.
3	Animals	Livestock or animals used in agriculture.
4	Animal Fodder	Feed for livestock, such as hay or grain.
5	Medicines	Pharmaceuticals used in animal or crop health.
6	Field Equipment	Machinery and tools for agricultural use.
\.


--
-- Data for Name: media; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.media (media_id, product_id, media_type, url, created_at) FROM stdin;
10	5	image	http://res.cloudinary.com/domyilmbz/image/upload/v1731838304/cpfvcdno9xtbfzrpjq5b.jpg	2024-11-17 15:41:45.665445
11	5	image	http://res.cloudinary.com/domyilmbz/image/upload/v1731838360/ybzatlmpvkmwrhbeqov3.jpg	2024-11-17 15:42:42.127876
12	6	image	http://res.cloudinary.com/domyilmbz/image/upload/v1731838436/qo0afjpksub20qzxdufm.jpg	2024-11-17 15:43:57.726595
13	6	image	http://res.cloudinary.com/domyilmbz/image/upload/v1731838462/t8jms2ywwyhrsqtl9cpu.jpg	2024-11-17 15:44:23.112894
14	7	image	http://res.cloudinary.com/domyilmbz/image/upload/v1731838532/pahlp50jqqgqmc7exxcd.jpg	2024-11-17 15:45:33.742417
15	8	image	http://res.cloudinary.com/domyilmbz/image/upload/v1731838579/c3t41jalk8fsqoc5gyx0.jpg	2024-11-17 15:46:20.400847
16	8	image	http://res.cloudinary.com/domyilmbz/image/upload/v1731838606/zyml601jtdbjnrspdttu.jpg	2024-11-17 15:46:46.884477
17	9	image	http://res.cloudinary.com/domyilmbz/image/upload/v1731838669/lud2mcdoboilqallb9if.jpg	2024-11-17 15:47:50.62693
18	11	image	http://res.cloudinary.com/domyilmbz/image/upload/v1731839293/ic65npkrjwnvkwd4zhcg.jpg	2024-11-17 15:58:15.096437
19	12	image	http://res.cloudinary.com/domyilmbz/image/upload/v1731839496/ghqp8bhyesx0ho0alls2.jpg	2024-11-17 16:01:37.434799
20	13	image	http://res.cloudinary.com/domyilmbz/image/upload/v1731840021/gf9sy7at9amaimgh9nk6.jpg	2024-11-17 16:10:24.102407
21	14	image	http://res.cloudinary.com/domyilmbz/image/upload/v1731840245/zngohsj3lqzpl5z7y9hu.jpg	2024-11-17 16:14:16.681442
\.


--
-- Data for Name: messages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.messages (message_id, sender_id, receiver_id, content, "timestamp", is_read) FROM stdin;
1	2	3	Heyy, Test2 !!! This is my first message everrr.	2024-11-13 17:34:19.694418	t
8	3	2	Yes! Sure!	2024-11-17 03:36:42.830231	t
7	2	3	should we negotiate?	2024-11-17 03:30:17.280976	t
2	3	2	Hi Test! I saw it!	2024-11-13 20:13:12.259635	t
4	3	2	hi	2024-11-17 02:46:38.278411	t
5	3	2	I would like the buy the item you just listed.	2024-11-17 02:53:41.392134	t
6	2	3	hi. that's great!	2024-11-17 02:54:29.513392	t
3	3	2	Umm are you busy??	2024-11-13 21:30:22.155468	t
9	2	3	alright	2024-11-17 03:52:50.151987	t
10	2	3	so...	2024-11-17 03:56:26.493131	t
11	3	2	okay then..	2024-11-17 04:03:10.173404	f
12	2	7	hi	2024-11-17 17:27:03.03273	f
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (product_id, user_id, category_id, subcategory_id, product_name, description, price, quantity, unit, condition, status, created_at, updated_at) FROM stdin;
5	2	1	1	Carrot	Freshly harvested carrots, rich in vitamins.	100.00	2.50	kg	new	available	2024-11-17 15:28:29.048198	2024-11-17 15:28:29.048198
6	2	1	2	Apple	Crisp and juicy apples, perfect for snacking.	500.00	3.00	kg	new	available	2024-11-17 15:33:52.721427	2024-11-17 15:33:52.721427
7	2	2	4	Wheat Grain	High-quality wheat grain for flour production.	500.00	1.20	kg	new	available	2024-11-17 15:34:47.226315	2024-11-17 15:34:47.226315
8	2	3	7	Cow	Healthy and well-maintained cow for sale.	500.00	5.00	head	used	available	2024-11-17 15:37:05.110176	2024-11-17 15:37:05.110176
9	2	4	10	Dried Hay	High-quality dried hay for livestock feed.	200.00	40.00	kg	new	available	2024-11-17 15:38:03.96226	2024-11-17 15:38:03.96226
10	3	5	13	Vaccine for Livestock	Vaccine to prevent common diseases in cattle.	500.00	50.00	vial	new	available	2024-11-17 15:53:23.79461	2024-11-17 15:53:23.79461
12	3	6	17	Plow	Durable plow for soil preparation.	300.00	5.00	unit	new	available	2024-11-17 15:55:32.859892	2024-11-17 15:55:32.859892
13	6	2	5	Rice	High-quality rice grain, perfect for cooking.	300.00	1.50	kg	new	available	2024-11-17 16:09:16.121018	2024-11-17 16:09:16.121018
14	7	3	9	Sheep	Well-bred sheep for wool and meat production.	500.00	10.00	head	used	available	2024-11-17 16:12:37.321824	2024-11-17 16:12:37.321824
11	3	6	16	Tractor	Powerful tractor for large farming operations.	10000.00	1.00	unit	used	rented	2024-11-17 15:54:26.74394	2024-11-17 17:57:29.29334
\.


--
-- Data for Name: rentals; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.rentals (rental_id, product_id, renter_id, rental_start_date, rental_end_date, rental_price, status, created_at, updated_at, transaction_id, owner_id) FROM stdin;
5	11	2	2024-11-17	2024-11-27	10000.00	active	2024-11-17 17:57:29.298606	2024-11-17 17:57:29.298606	12	3
\.


--
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reviews (review_id, product_id, user_id, rating, review_text, created_at) FROM stdin;
22	10	7	4	Very effective and easy to use.	2024-11-17 16:18:32.360674
23	11	7	5	Nice owner.	2024-11-17 16:20:35.48625
24	10	2	4	Helpful.	2024-11-17 16:25:42.646457
\.


--
-- Data for Name: subcategories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.subcategories (subcategory_id, category_id, subcategory_name, description) FROM stdin;
1	1	Vegetables	Edible plants such as carrots, potatoes, and leafy greens.
2	1	Fruits	Sweet and fleshy products like apples, berries, and bananas.
3	1	Herbs	Plants used for flavoring or medicinal purposes.
4	2	Wheat	A cereal grain used for flour and livestock feed.
5	2	Rice	A staple food grain grown in flooded fields.
6	2	Barley	A versatile grain for food, fodder, and brewing.
7	3	Cattle	Domesticated bovines like cows, bulls, and oxen.
8	3	Poultry	Birds like chickens, ducks, and turkeys raised for meat or eggs.
9	3	Sheep	Domesticated ruminants known for wool and meat.
10	4	Hay	Dried grass or legumes used as livestock feed.
11	4	Silage	Fermented high-moisture stored fodder for animals.
12	4	Grain Feed	Processed grains used to feed livestock.
13	5	Vaccines	Biological preparations providing immunity to diseases.
14	5	Antibiotics	Medicines that treat bacterial infections.
15	5	Supplements	Vitamins and minerals supporting animal health.
16	6	Tractors	Heavy-duty vehicles for agricultural tasks.
17	6	Plows	Tools used to till and prepare soil for planting.
18	6	Irrigation Systems	Equipment to supply water to crops.
\.


--
-- Data for Name: transactions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.transactions (transaction_id, product_id, buyer_id, seller_id, transaction_date, transaction_type, price, status, created_at, updated_at, quantity, duration) FROM stdin;
11	10	2	3	2024-11-17 16:26:04.699502	buy	2500.00	pending	2024-11-17 16:26:04.699502	2024-11-17 16:26:04.699502	5.00	0
12	11	2	3	2024-11-17 16:27:30.344856	rent	10000.00	completed	2024-11-17 16:27:30.344856	2024-11-17 17:57:29.27564	1.00	10
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (user_id, name, email, password, state, city, address, profile_pic, contact_info, created_at, updated_at) FROM stdin;
2	Test User	test@eg.com	$2b$10$b7zdmcyYCzCQQe1znYVLmuAz4GIzdcwIKEPHjc6ds3D7Eum98P64q	UP	Lucknow	45B/123, Colony Street	http://res.cloudinary.com/domyilmbz/image/upload/v1731837242/vdht9wdlhqrgwdx5jcbi.jpg	0123456789	2024-11-12 11:49:55.77442	2024-11-17 15:24:03.270794
3	Test User Second	test2@eg.com	$2b$10$KW/oa5VXOj/H87uHUaUsh.1EmeB1/Jea224Rp2Sp2yynSo8EkM4GG	UP	Lucknow	40A/124, Main Street	http://res.cloudinary.com/domyilmbz/image/upload/v1731838894/d52okfsjk5frltgs1spg.avif	0123456789	2024-11-13 12:31:23.02754	2024-11-17 15:51:36.179883
6	New User	new@user.com	$2b$10$Cn94PLE7wa1q/lC8MAba3uWRwNzWd.LtmmblZv0ZYQMH6mTu09H6G	UP	Lucknow	1B/415, New Colony, Main Street	http://res.cloudinary.com/domyilmbz/image/upload/v1731839829/xiosvfhoonggdr9mp4yt.jpg	0123456789	2024-11-17 16:05:43.506092	2024-11-17 16:07:12.064285
7	Sample User	sample@user.com	$2b$10$0UCFtvPOSOv6kWl0eap7ceKrZE14NCkQEJ9b87FsTVTqel6vXmU1G	UP	Lucknow	34F/345	\N	0123456789	2024-11-17 16:11:34.988583	2024-11-17 16:11:34.988583
\.


--
-- Name: categories_category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categories_category_id_seq', 6, true);


--
-- Name: media_media_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.media_media_id_seq', 21, true);


--
-- Name: messages_message_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.messages_message_id_seq', 12, true);


--
-- Name: products_product_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.products_product_id_seq', 14, true);


--
-- Name: rentals_rental_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.rentals_rental_id_seq', 5, true);


--
-- Name: reviews_review_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.reviews_review_id_seq', 24, true);


--
-- Name: subcategories_subcategory_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.subcategories_subcategory_id_seq', 18, true);


--
-- Name: transactions_transaction_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.transactions_transaction_id_seq', 12, true);


--
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_user_id_seq', 7, true);


--
-- Name: categories categories_category_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_category_name_key UNIQUE (category_name);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (category_id);


--
-- Name: media media_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.media
    ADD CONSTRAINT media_pkey PRIMARY KEY (media_id);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (message_id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (product_id);


--
-- Name: rentals rentals_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rentals
    ADD CONSTRAINT rentals_pkey PRIMARY KEY (rental_id);


--
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (review_id);


--
-- Name: subcategories subcategories_category_id_subcategory_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subcategories
    ADD CONSTRAINT subcategories_category_id_subcategory_name_key UNIQUE (category_id, subcategory_name);


--
-- Name: subcategories subcategories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subcategories
    ADD CONSTRAINT subcategories_pkey PRIMARY KEY (subcategory_id);


--
-- Name: transactions transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_pkey PRIMARY KEY (transaction_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- Name: rentals check_overdue_rentals; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER check_overdue_rentals BEFORE UPDATE ON public.rentals FOR EACH ROW EXECUTE FUNCTION public.set_rentals_overdue();


--
-- Name: products update_product_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_product_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_product_updated_at();


--
-- Name: rentals update_rental_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_rental_updated_at BEFORE UPDATE ON public.rentals FOR EACH ROW EXECUTE FUNCTION public.update_rental_updated_at();


--
-- Name: transactions update_transaction_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_transaction_updated_at BEFORE UPDATE ON public.transactions FOR EACH ROW EXECUTE FUNCTION public.update_transaction_updated_at();


--
-- Name: users update_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: media media_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.media
    ADD CONSTRAINT media_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(product_id) ON DELETE CASCADE;


--
-- Name: messages messages_receiver_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_receiver_id_fkey FOREIGN KEY (receiver_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: messages messages_sender_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: products products_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(category_id) ON DELETE SET NULL;


--
-- Name: products products_subcategory_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_subcategory_id_fkey FOREIGN KEY (subcategory_id) REFERENCES public.subcategories(subcategory_id) ON DELETE SET NULL;


--
-- Name: products products_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: rentals rentals_owner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rentals
    ADD CONSTRAINT rentals_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.users(user_id) ON DELETE SET NULL;


--
-- Name: rentals rentals_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rentals
    ADD CONSTRAINT rentals_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(product_id) ON DELETE SET NULL;


--
-- Name: rentals rentals_renter_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rentals
    ADD CONSTRAINT rentals_renter_id_fkey FOREIGN KEY (renter_id) REFERENCES public.users(user_id) ON DELETE SET NULL;


--
-- Name: rentals rentals_transaction_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rentals
    ADD CONSTRAINT rentals_transaction_id_fkey FOREIGN KEY (transaction_id) REFERENCES public.transactions(transaction_id) ON DELETE SET NULL;


--
-- Name: reviews reviews_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(product_id) ON DELETE CASCADE;


--
-- Name: reviews reviews_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: subcategories subcategories_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subcategories
    ADD CONSTRAINT subcategories_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(category_id) ON DELETE CASCADE;


--
-- Name: transactions transactions_buyer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_buyer_id_fkey FOREIGN KEY (buyer_id) REFERENCES public.users(user_id) ON DELETE SET NULL;


--
-- Name: transactions transactions_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(product_id) ON DELETE SET NULL;


--
-- Name: transactions transactions_seller_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_seller_id_fkey FOREIGN KEY (seller_id) REFERENCES public.users(user_id) ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

