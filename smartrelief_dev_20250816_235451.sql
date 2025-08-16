--
-- PostgreSQL database dump
--

-- Dumped from database version 15.4 (Debian 15.4-1.pgdg110+1)
-- Dumped by pg_dump version 15.4 (Debian 15.4-1.pgdg110+1)

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
-- Name: AidCategory; Type: TYPE; Schema: public; Owner: smartrelief
--

CREATE TYPE public."AidCategory" AS ENUM (
    'MEDICAL',
    'FOOD',
    'WATER',
    'SHELTER',
    'CLOTHING',
    'TRANSPORTATION',
    'COMMUNICATION',
    'RESCUE',
    'EVACUATION',
    'OTHER'
);


ALTER TYPE public."AidCategory" OWNER TO smartrelief;

--
-- Name: AppointmentPriority; Type: TYPE; Schema: public; Owner: smartrelief
--

CREATE TYPE public."AppointmentPriority" AS ENUM (
    'LOW',
    'NORMAL',
    'HIGH',
    'URGENT',
    'EMERGENCY'
);


ALTER TYPE public."AppointmentPriority" OWNER TO smartrelief;

--
-- Name: AppointmentStatus; Type: TYPE; Schema: public; Owner: smartrelief
--

CREATE TYPE public."AppointmentStatus" AS ENUM (
    'SCHEDULED',
    'CONFIRMED',
    'CHECKED_IN',
    'IN_PROGRESS',
    'COMPLETED',
    'CANCELLED',
    'NO_SHOW',
    'RESCHEDULED'
);


ALTER TYPE public."AppointmentStatus" OWNER TO smartrelief;

--
-- Name: DocumentVerificationStatus; Type: TYPE; Schema: public; Owner: smartrelief
--

CREATE TYPE public."DocumentVerificationStatus" AS ENUM (
    'PENDING',
    'VERIFIED',
    'REJECTED',
    'INCOMPLETE'
);


ALTER TYPE public."DocumentVerificationStatus" OWNER TO smartrelief;

--
-- Name: EmergencyRequestStatus; Type: TYPE; Schema: public; Owner: smartrelief
--

CREATE TYPE public."EmergencyRequestStatus" AS ENUM (
    'SUBMITTED',
    'ACKNOWLEDGED',
    'ASSIGNED',
    'IN_PROGRESS',
    'RESPONDED',
    'RESOLVED',
    'CLOSED',
    'ESCALATED'
);


ALTER TYPE public."EmergencyRequestStatus" OWNER TO smartrelief;

--
-- Name: EmergencyServiceType; Type: TYPE; Schema: public; Owner: smartrelief
--

CREATE TYPE public."EmergencyServiceType" AS ENUM (
    'MEDICAL_EMERGENCY',
    'FIRE',
    'POLICE',
    'DISASTER_RELIEF',
    'SEARCH_RESCUE',
    'EVACUATION',
    'SHELTER',
    'FOOD_DISTRIBUTION',
    'WATER_SUPPLY',
    'POWER_RESTORATION',
    'COMMUNICATION',
    'TRANSPORTATION',
    'OTHER'
);


ALTER TYPE public."EmergencyServiceType" OWNER TO smartrelief;

--
-- Name: GovernmentServiceCategory; Type: TYPE; Schema: public; Owner: smartrelief
--

CREATE TYPE public."GovernmentServiceCategory" AS ENUM (
    'HEALTHCARE',
    'EDUCATION',
    'SOCIAL_WELFARE',
    'HOUSING',
    'EMPLOYMENT',
    'DOCUMENTATION',
    'LICENSING',
    'PERMITS',
    'EMERGENCY_SERVICES',
    'UTILITIES',
    'TRANSPORTATION',
    'LEGAL_AID',
    'INSURANCE',
    'DISABILITY_SERVICES',
    'ELDERLY_CARE',
    'OTHER'
);


ALTER TYPE public."GovernmentServiceCategory" OWNER TO smartrelief;

--
-- Name: NotificationType; Type: TYPE; Schema: public; Owner: smartrelief
--

CREATE TYPE public."NotificationType" AS ENUM (
    'INFO',
    'WARNING',
    'EMERGENCY',
    'SUCCESS'
);


ALTER TYPE public."NotificationType" OWNER TO smartrelief;

--
-- Name: QueuePriority; Type: TYPE; Schema: public; Owner: smartrelief
--

CREATE TYPE public."QueuePriority" AS ENUM (
    'LOW',
    'NORMAL',
    'HIGH',
    'URGENT',
    'EMERGENCY',
    'DISABLED',
    'ELDERLY',
    'PREGNANT'
);


ALTER TYPE public."QueuePriority" OWNER TO smartrelief;

--
-- Name: QueueStatus; Type: TYPE; Schema: public; Owner: smartrelief
--

CREATE TYPE public."QueueStatus" AS ENUM (
    'WAITING',
    'CALLED',
    'BEING_SERVED',
    'COMPLETED',
    'LEFT_QUEUE',
    'NO_SHOW'
);


ALTER TYPE public."QueueStatus" OWNER TO smartrelief;

--
-- Name: RequestStatus; Type: TYPE; Schema: public; Owner: smartrelief
--

CREATE TYPE public."RequestStatus" AS ENUM (
    'PENDING',
    'IN_PROGRESS',
    'FULFILLED',
    'CANCELLED',
    'EXPIRED'
);


ALTER TYPE public."RequestStatus" OWNER TO smartrelief;

--
-- Name: ResourceStatus; Type: TYPE; Schema: public; Owner: smartrelief
--

CREATE TYPE public."ResourceStatus" AS ENUM (
    'AVAILABLE',
    'ALLOCATED',
    'IN_TRANSIT',
    'DELIVERED',
    'EXPIRED'
);


ALTER TYPE public."ResourceStatus" OWNER TO smartrelief;

--
-- Name: TaskStatus; Type: TYPE; Schema: public; Owner: smartrelief
--

CREATE TYPE public."TaskStatus" AS ENUM (
    'OPEN',
    'ASSIGNED',
    'IN_PROGRESS',
    'COMPLETED',
    'CANCELLED'
);


ALTER TYPE public."TaskStatus" OWNER TO smartrelief;

--
-- Name: UrgencyLevel; Type: TYPE; Schema: public; Owner: smartrelief
--

CREATE TYPE public."UrgencyLevel" AS ENUM (
    'LOW',
    'MEDIUM',
    'HIGH',
    'CRITICAL',
    'LIFE_THREATENING'
);


ALTER TYPE public."UrgencyLevel" OWNER TO smartrelief;

--
-- Name: UserRole; Type: TYPE; Schema: public; Owner: smartrelief
--

CREATE TYPE public."UserRole" AS ENUM (
    'VICTIM',
    'DONOR',
    'VOLUNTEER',
    'ORGANIZATION',
    'ADMIN'
);


ALTER TYPE public."UserRole" OWNER TO smartrelief;

--
-- Name: VolunteerStatus; Type: TYPE; Schema: public; Owner: smartrelief
--

CREATE TYPE public."VolunteerStatus" AS ENUM (
    'AVAILABLE',
    'BUSY',
    'OFFLINE'
);


ALTER TYPE public."VolunteerStatus" OWNER TO smartrelief;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: aid_requests; Type: TABLE; Schema: public; Owner: smartrelief
--

CREATE TABLE public.aid_requests (
    id text NOT NULL,
    "userId" text NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    category public."AidCategory" NOT NULL,
    priority integer DEFAULT 5 NOT NULL,
    status public."RequestStatus" DEFAULT 'PENDING'::public."RequestStatus" NOT NULL,
    latitude double precision NOT NULL,
    longitude double precision NOT NULL,
    address text,
    images text[],
    "damageAssessment" jsonb,
    "estimatedCost" double precision,
    "urgencyScore" integer,
    "estimatedFulfillmentTime" timestamp(3) without time zone,
    "actualFulfillmentTime" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "expiresAt" timestamp(3) without time zone
);


ALTER TABLE public.aid_requests OWNER TO smartrelief;

--
-- Name: analytics_events; Type: TABLE; Schema: public; Owner: smartrelief
--

CREATE TABLE public.analytics_events (
    id text NOT NULL,
    "eventType" text NOT NULL,
    "userId" text,
    data jsonb NOT NULL,
    "timestamp" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.analytics_events OWNER TO smartrelief;

--
-- Name: audit_logs; Type: TABLE; Schema: public; Owner: smartrelief
--

CREATE TABLE public.audit_logs (
    id text NOT NULL,
    "userId" text,
    action text NOT NULL,
    resource text NOT NULL,
    "resourceId" text,
    "oldValues" jsonb,
    "newValues" jsonb,
    "timestamp" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "ipAddress" text,
    "userAgent" text
);


ALTER TABLE public.audit_logs OWNER TO smartrelief;

--
-- Name: damage_assessments; Type: TABLE; Schema: public; Owner: smartrelief
--

CREATE TABLE public.damage_assessments (
    id integer NOT NULL,
    image_path character varying NOT NULL,
    image_filename character varying NOT NULL,
    damage_level character varying NOT NULL,
    severity_score double precision NOT NULL,
    confidence_score double precision NOT NULL,
    priority_score double precision,
    urgency_level character varying,
    disaster_type character varying,
    analysis_data json,
    processing_time double precision,
    location_data json,
    weather_data json,
    notes text,
    status character varying,
    created_by character varying,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


ALTER TABLE public.damage_assessments OWNER TO smartrelief;

--
-- Name: damage_assessments_id_seq; Type: SEQUENCE; Schema: public; Owner: smartrelief
--

CREATE SEQUENCE public.damage_assessments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.damage_assessments_id_seq OWNER TO smartrelief;

--
-- Name: damage_assessments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: smartrelief
--

ALTER SEQUENCE public.damage_assessments_id_seq OWNED BY public.damage_assessments.id;


--
-- Name: donations; Type: TABLE; Schema: public; Owner: smartrelief
--

CREATE TABLE public.donations (
    id text NOT NULL,
    "donorId" text NOT NULL,
    amount double precision NOT NULL,
    currency text DEFAULT 'USD'::text NOT NULL,
    allocation jsonb,
    "impactMetrics" jsonb,
    "paymentMethod" text,
    "transactionId" text,
    "receiptUrl" text,
    "isRecurring" boolean DEFAULT false NOT NULL,
    "recurringPeriod" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.donations OWNER TO smartrelief;

--
-- Name: emergency_contacts; Type: TABLE; Schema: public; Owner: smartrelief
--

CREATE TABLE public.emergency_contacts (
    id text NOT NULL,
    "userId" text NOT NULL,
    name text NOT NULL,
    relationship text NOT NULL,
    "phoneNumber" text NOT NULL,
    email text
);


ALTER TABLE public.emergency_contacts OWNER TO smartrelief;

--
-- Name: emergency_service_requests; Type: TABLE; Schema: public; Owner: smartrelief
--

CREATE TABLE public.emergency_service_requests (
    id text NOT NULL,
    "userId" text NOT NULL,
    "serviceType" public."EmergencyServiceType" NOT NULL,
    "urgencyLevel" public."UrgencyLevel" DEFAULT 'HIGH'::public."UrgencyLevel" NOT NULL,
    description text NOT NULL,
    "peopleAffected" integer,
    latitude double precision NOT NULL,
    longitude double precision NOT NULL,
    address text NOT NULL,
    status public."EmergencyRequestStatus" DEFAULT 'SUBMITTED'::public."EmergencyRequestStatus" NOT NULL,
    "assignedOfficer" text,
    "responseTime" integer,
    photos text[],
    documents text[],
    "submittedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "acknowledgedAt" timestamp(3) without time zone,
    "respondedAt" timestamp(3) without time zone,
    "resolvedAt" timestamp(3) without time zone,
    "followUpRequired" boolean DEFAULT false NOT NULL,
    "followUpNotes" text
);


ALTER TABLE public.emergency_service_requests OWNER TO smartrelief;

--
-- Name: government_offices; Type: TABLE; Schema: public; Owner: smartrelief
--

CREATE TABLE public.government_offices (
    id text NOT NULL,
    name text NOT NULL,
    code text NOT NULL,
    address text NOT NULL,
    latitude double precision NOT NULL,
    longitude double precision NOT NULL,
    phone text,
    email text,
    website text,
    "operatingHours" jsonb NOT NULL,
    holidays jsonb NOT NULL,
    "dailyCapacity" integer DEFAULT 100 NOT NULL,
    "staffCount" integer DEFAULT 5 NOT NULL,
    "servicesOffered" text[],
    "isActive" boolean DEFAULT true NOT NULL,
    "temporarilyClosed" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.government_offices OWNER TO smartrelief;

--
-- Name: government_service_appointments; Type: TABLE; Schema: public; Owner: smartrelief
--

CREATE TABLE public.government_service_appointments (
    id text NOT NULL,
    "serviceId" text NOT NULL,
    "userId" text NOT NULL,
    "appointmentDate" timestamp(3) without time zone NOT NULL,
    "timeSlot" text NOT NULL,
    duration integer DEFAULT 30 NOT NULL,
    status public."AppointmentStatus" DEFAULT 'SCHEDULED'::public."AppointmentStatus" NOT NULL,
    priority public."AppointmentPriority" DEFAULT 'NORMAL'::public."AppointmentPriority" NOT NULL,
    "bookedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "bookingReference" text NOT NULL,
    "queuePosition" integer,
    "estimatedWaitTime" integer,
    "documentsSubmitted" jsonb,
    "verificationStatus" public."DocumentVerificationStatus" DEFAULT 'PENDING'::public."DocumentVerificationStatus" NOT NULL,
    "remindersSent" integer DEFAULT 0 NOT NULL,
    "lastReminderAt" timestamp(3) without time zone,
    "serviceCompletedAt" timestamp(3) without time zone,
    feedback jsonb,
    rating integer,
    notes text,
    "adminNotes" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.government_service_appointments OWNER TO smartrelief;

--
-- Name: government_service_queue; Type: TABLE; Schema: public; Owner: smartrelief
--

CREATE TABLE public.government_service_queue (
    id text NOT NULL,
    "serviceId" text NOT NULL,
    "userId" text NOT NULL,
    "position" integer NOT NULL,
    "estimatedWaitTime" integer NOT NULL,
    status public."QueueStatus" DEFAULT 'WAITING'::public."QueueStatus" NOT NULL,
    priority public."QueuePriority" DEFAULT 'NORMAL'::public."QueuePriority" NOT NULL,
    "joinedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "notifiedAt" timestamp(3) without time zone,
    "servedAt" timestamp(3) without time zone,
    "leftQueueAt" timestamp(3) without time zone,
    reason text,
    notes text
);


ALTER TABLE public.government_service_queue OWNER TO smartrelief;

--
-- Name: government_service_time_slots; Type: TABLE; Schema: public; Owner: smartrelief
--

CREATE TABLE public.government_service_time_slots (
    id text NOT NULL,
    "serviceId" text NOT NULL,
    "dayOfWeek" integer NOT NULL,
    "startTime" text NOT NULL,
    "endTime" text NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "maxAppointments" integer DEFAULT 10 NOT NULL,
    "specialDates" jsonb
);


ALTER TABLE public.government_service_time_slots OWNER TO smartrelief;

--
-- Name: government_services; Type: TABLE; Schema: public; Owner: smartrelief
--

CREATE TABLE public.government_services (
    id text NOT NULL,
    name text NOT NULL,
    description text NOT NULL,
    category public."GovernmentServiceCategory" NOT NULL,
    department text NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "requiresDocuments" boolean DEFAULT true NOT NULL,
    "avgProcessingTime" integer NOT NULL,
    cost double precision DEFAULT 0,
    "allowsOnlineBooking" boolean DEFAULT true NOT NULL,
    "maxAdvanceBookingDays" integer DEFAULT 30 NOT NULL,
    "slotDuration" integer DEFAULT 30 NOT NULL,
    "bufferTime" integer DEFAULT 5 NOT NULL,
    "maxDailySlots" integer DEFAULT 50 NOT NULL,
    "requiredDocuments" text[],
    "eligibilityCriteria" text,
    "officeLocation" text NOT NULL,
    "contactInfo" jsonb NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.government_services OWNER TO smartrelief;

--
-- Name: notifications; Type: TABLE; Schema: public; Owner: smartrelief
--

CREATE TABLE public.notifications (
    id text NOT NULL,
    "userId" text NOT NULL,
    title text NOT NULL,
    message text NOT NULL,
    type public."NotificationType" DEFAULT 'INFO'::public."NotificationType" NOT NULL,
    "isRead" boolean DEFAULT false NOT NULL,
    data jsonb,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "readAt" timestamp(3) without time zone
);


ALTER TABLE public.notifications OWNER TO smartrelief;

--
-- Name: priority_scores; Type: TABLE; Schema: public; Owner: smartrelief
--

CREATE TABLE public.priority_scores (
    damage_assessment_id integer NOT NULL,
    priority_level character varying NOT NULL,
    priority_score double precision NOT NULL,
    urgency_factors json,
    resource_requirements json,
    estimated_response_time double precision,
    affected_population integer,
    id integer NOT NULL,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    created_by character varying
);


ALTER TABLE public.priority_scores OWNER TO smartrelief;

--
-- Name: priority_scores_id_seq; Type: SEQUENCE; Schema: public; Owner: smartrelief
--

CREATE SEQUENCE public.priority_scores_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.priority_scores_id_seq OWNER TO smartrelief;

--
-- Name: priority_scores_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: smartrelief
--

ALTER SEQUENCE public.priority_scores_id_seq OWNED BY public.priority_scores.id;


--
-- Name: resource_allocations; Type: TABLE; Schema: public; Owner: smartrelief
--

CREATE TABLE public.resource_allocations (
    id text NOT NULL,
    "resourceId" text NOT NULL,
    "aidRequestId" text NOT NULL,
    "quantityAllocated" integer NOT NULL,
    status public."ResourceStatus" DEFAULT 'ALLOCATED'::public."ResourceStatus" NOT NULL,
    "allocatedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "deliveredAt" timestamp(3) without time zone
);


ALTER TABLE public.resource_allocations OWNER TO smartrelief;

--
-- Name: resource_predictions; Type: TABLE; Schema: public; Owner: smartrelief
--

CREATE TABLE public.resource_predictions (
    damage_assessment_id integer NOT NULL,
    priority_score_id integer NOT NULL,
    medical_personnel integer,
    rescue_teams integer,
    emergency_vehicles integer,
    relief_supplies json,
    equipment_needed json,
    deployment_timeline double precision,
    cost_estimate double precision,
    confidence_score double precision NOT NULL,
    id integer NOT NULL,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    created_by character varying
);


ALTER TABLE public.resource_predictions OWNER TO smartrelief;

--
-- Name: resource_predictions_id_seq; Type: SEQUENCE; Schema: public; Owner: smartrelief
--

CREATE SEQUENCE public.resource_predictions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.resource_predictions_id_seq OWNER TO smartrelief;

--
-- Name: resource_predictions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: smartrelief
--

ALTER SEQUENCE public.resource_predictions_id_seq OWNED BY public.resource_predictions.id;


--
-- Name: resources; Type: TABLE; Schema: public; Owner: smartrelief
--

CREATE TABLE public.resources (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    category public."AidCategory" NOT NULL,
    quantity integer DEFAULT 0 NOT NULL,
    unit text NOT NULL,
    status public."ResourceStatus" DEFAULT 'AVAILABLE'::public."ResourceStatus" NOT NULL,
    latitude double precision,
    longitude double precision,
    address text,
    "expiryDate" timestamp(3) without time zone,
    "estimatedValue" double precision,
    "donorId" text,
    "organizationId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.resources OWNER TO smartrelief;

--
-- Name: user_profiles; Type: TABLE; Schema: public; Owner: smartrelief
--

CREATE TABLE public.user_profiles (
    id text NOT NULL,
    "userId" text NOT NULL,
    "firstName" text NOT NULL,
    "lastName" text NOT NULL,
    avatar text,
    "dateOfBirth" timestamp(3) without time zone,
    gender text,
    address text,
    city text,
    state text,
    country text,
    "zipCode" text,
    latitude double precision,
    longitude double precision,
    "bloodType" text,
    allergies text,
    "medicalInfo" text,
    skills text[],
    availability text,
    "organizationName" text,
    "organizationType" text,
    "taxId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.user_profiles OWNER TO smartrelief;

--
-- Name: users; Type: TABLE; Schema: public; Owner: smartrelief
--

CREATE TABLE public.users (
    id text NOT NULL,
    email text NOT NULL,
    "phoneNumber" text,
    password text NOT NULL,
    role public."UserRole" NOT NULL,
    "isVerified" boolean DEFAULT false NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.users OWNER TO smartrelief;

--
-- Name: volunteer_tasks; Type: TABLE; Schema: public; Owner: smartrelief
--

CREATE TABLE public.volunteer_tasks (
    id text NOT NULL,
    "aidRequestId" text NOT NULL,
    "volunteerId" text NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    status public."TaskStatus" DEFAULT 'ASSIGNED'::public."TaskStatus" NOT NULL,
    latitude double precision,
    longitude double precision,
    "estimatedDuration" integer,
    "actualDuration" integer,
    "assignedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "startedAt" timestamp(3) without time zone,
    "completedAt" timestamp(3) without time zone,
    "completionPhotos" text[],
    "completionNotes" text
);


ALTER TABLE public.volunteer_tasks OWNER TO smartrelief;

--
-- Name: damage_assessments id; Type: DEFAULT; Schema: public; Owner: smartrelief
--

ALTER TABLE ONLY public.damage_assessments ALTER COLUMN id SET DEFAULT nextval('public.damage_assessments_id_seq'::regclass);


--
-- Name: priority_scores id; Type: DEFAULT; Schema: public; Owner: smartrelief
--

ALTER TABLE ONLY public.priority_scores ALTER COLUMN id SET DEFAULT nextval('public.priority_scores_id_seq'::regclass);


--
-- Name: resource_predictions id; Type: DEFAULT; Schema: public; Owner: smartrelief
--

ALTER TABLE ONLY public.resource_predictions ALTER COLUMN id SET DEFAULT nextval('public.resource_predictions_id_seq'::regclass);


--
-- Data for Name: aid_requests; Type: TABLE DATA; Schema: public; Owner: smartrelief
--

COPY public.aid_requests (id, "userId", title, description, category, priority, status, latitude, longitude, address, images, "damageAssessment", "estimatedCost", "urgencyScore", "estimatedFulfillmentTime", "actualFulfillmentTime", "createdAt", "updatedAt", "expiresAt") FROM stdin;
\.


--
-- Data for Name: analytics_events; Type: TABLE DATA; Schema: public; Owner: smartrelief
--

COPY public.analytics_events (id, "eventType", "userId", data, "timestamp") FROM stdin;
\.


--
-- Data for Name: audit_logs; Type: TABLE DATA; Schema: public; Owner: smartrelief
--

COPY public.audit_logs (id, "userId", action, resource, "resourceId", "oldValues", "newValues", "timestamp", "ipAddress", "userAgent") FROM stdin;
\.


--
-- Data for Name: damage_assessments; Type: TABLE DATA; Schema: public; Owner: smartrelief
--

COPY public.damage_assessments (id, image_path, image_filename, damage_level, severity_score, confidence_score, priority_score, urgency_level, disaster_type, analysis_data, processing_time, location_data, weather_data, notes, status, created_by, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: donations; Type: TABLE DATA; Schema: public; Owner: smartrelief
--

COPY public.donations (id, "donorId", amount, currency, allocation, "impactMetrics", "paymentMethod", "transactionId", "receiptUrl", "isRecurring", "recurringPeriod", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: emergency_contacts; Type: TABLE DATA; Schema: public; Owner: smartrelief
--

COPY public.emergency_contacts (id, "userId", name, relationship, "phoneNumber", email) FROM stdin;
\.


--
-- Data for Name: emergency_service_requests; Type: TABLE DATA; Schema: public; Owner: smartrelief
--

COPY public.emergency_service_requests (id, "userId", "serviceType", "urgencyLevel", description, "peopleAffected", latitude, longitude, address, status, "assignedOfficer", "responseTime", photos, documents, "submittedAt", "acknowledgedAt", "respondedAt", "resolvedAt", "followUpRequired", "followUpNotes") FROM stdin;
\.


--
-- Data for Name: government_offices; Type: TABLE DATA; Schema: public; Owner: smartrelief
--

COPY public.government_offices (id, name, code, address, latitude, longitude, phone, email, website, "operatingHours", holidays, "dailyCapacity", "staffCount", "servicesOffered", "isActive", "temporarilyClosed", "createdAt", "updatedAt") FROM stdin;
89f8d0f5-0560-42e0-bf77-e9f1d5903fd9	Makati City Hall	MCH-001	J.P. Rizal Street, Poblacion, Makati City, Metro Manila 1200, Philippines	14.5547	121.0244	+63-2-8870-2444	info@makati.gov.ph	https://makati.gov.ph	{"friday": {"open": "08:00", "close": "17:00"}, "monday": {"open": "08:00", "close": "17:00"}, "sunday": {"open": null, "close": null}, "tuesday": {"open": "08:00", "close": "17:00"}, "saturday": {"open": "08:00", "close": "12:00"}, "thursday": {"open": "08:00", "close": "17:00"}, "wednesday": {"open": "08:00", "close": "17:00"}}	["2024-01-01", "2024-12-25", "2024-12-30"]	150	12	{HEALTH,DOCUMENTATION,HOUSING}	t	f	2025-08-16 17:42:39.76	2025-08-16 17:42:39.76
993c24ee-02d3-4926-ae95-3f475a2bd46f	Quezon City Hall	QCH-001	Elliptical Road, Diliman, Quezon City, Metro Manila 1100, Philippines	14.6507	121.03	+63-2-8988-4242	info@quezoncity.gov.ph	https://quezoncity.gov.ph	{"friday": {"open": "08:00", "close": "17:00"}, "monday": {"open": "08:00", "close": "17:00"}, "sunday": {"open": null, "close": null}, "tuesday": {"open": "08:00", "close": "17:00"}, "saturday": {"open": "08:00", "close": "12:00"}, "thursday": {"open": "08:00", "close": "17:00"}, "wednesday": {"open": "08:00", "close": "17:00"}}	["2024-01-01", "2024-12-25", "2024-12-30"]	120	10	{SOCIAL_WELFARE,LICENSING}	t	f	2025-08-16 17:42:39.763	2025-08-16 17:42:39.763
\.


--
-- Data for Name: government_service_appointments; Type: TABLE DATA; Schema: public; Owner: smartrelief
--

COPY public.government_service_appointments (id, "serviceId", "userId", "appointmentDate", "timeSlot", duration, status, priority, "bookedAt", "bookingReference", "queuePosition", "estimatedWaitTime", "documentsSubmitted", "verificationStatus", "remindersSent", "lastReminderAt", "serviceCompletedAt", feedback, rating, notes, "adminNotes", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: government_service_queue; Type: TABLE DATA; Schema: public; Owner: smartrelief
--

COPY public.government_service_queue (id, "serviceId", "userId", "position", "estimatedWaitTime", status, priority, "joinedAt", "notifiedAt", "servedAt", "leftQueueAt", reason, notes) FROM stdin;
\.


--
-- Data for Name: government_service_time_slots; Type: TABLE DATA; Schema: public; Owner: smartrelief
--

COPY public.government_service_time_slots (id, "serviceId", "dayOfWeek", "startTime", "endTime", "isActive", "maxAppointments", "specialDates") FROM stdin;
5e158512-cd4f-4d06-af01-91413544b403	c8de64b9-fded-4da6-b92c-4a2d3a22fe4b	1	08:00	09:00	t	6	null
d01c0dc7-b8f8-4181-99eb-4bc98c9e6fae	c8de64b9-fded-4da6-b92c-4a2d3a22fe4b	1	09:00	10:00	t	6	null
aebaf905-1eed-4d2c-8cd5-e18bfa6cf03d	c8de64b9-fded-4da6-b92c-4a2d3a22fe4b	1	10:00	11:00	t	6	null
535c1319-d63b-4896-90f4-9f380e8dc3a0	c8de64b9-fded-4da6-b92c-4a2d3a22fe4b	1	11:00	12:00	t	6	null
65ae65e9-8006-4e3a-b577-1e4c3f133200	c8de64b9-fded-4da6-b92c-4a2d3a22fe4b	1	13:00	14:00	t	6	null
af1bac3b-dd6c-4615-a759-0c3afe61edce	c8de64b9-fded-4da6-b92c-4a2d3a22fe4b	1	14:00	15:00	t	6	null
b1d40dc4-87d2-4ed0-8365-bb1639d85372	c8de64b9-fded-4da6-b92c-4a2d3a22fe4b	1	15:00	16:00	t	6	null
518a8652-4c36-45fc-8277-1738e199ec24	c8de64b9-fded-4da6-b92c-4a2d3a22fe4b	1	16:00	17:00	t	6	null
25e3aac9-9a4b-47fc-93d4-ce245cc7f43b	c8de64b9-fded-4da6-b92c-4a2d3a22fe4b	2	08:00	09:00	t	6	null
ff2d31d1-1841-4bba-9911-580320f13ab2	c8de64b9-fded-4da6-b92c-4a2d3a22fe4b	2	09:00	10:00	t	6	null
1b509068-1578-4ac4-a08a-2ea6b6879439	c8de64b9-fded-4da6-b92c-4a2d3a22fe4b	2	10:00	11:00	t	6	null
563a1bf2-cacb-4b95-9849-a26ea1b3d4b6	c8de64b9-fded-4da6-b92c-4a2d3a22fe4b	2	11:00	12:00	t	6	null
0040f720-6081-4ba6-ba5d-0a1cecd7bf9f	c8de64b9-fded-4da6-b92c-4a2d3a22fe4b	2	13:00	14:00	t	6	null
38a389d3-f295-4233-b71c-498448c00d8e	c8de64b9-fded-4da6-b92c-4a2d3a22fe4b	2	14:00	15:00	t	6	null
4b94360a-496a-4066-afd4-91bd09eb36f3	c8de64b9-fded-4da6-b92c-4a2d3a22fe4b	2	15:00	16:00	t	6	null
95f21f10-35aa-445f-a666-82acbec34282	c8de64b9-fded-4da6-b92c-4a2d3a22fe4b	2	16:00	17:00	t	6	null
c86ed8f5-0a9f-4fff-96d7-f546b898391b	c8de64b9-fded-4da6-b92c-4a2d3a22fe4b	3	08:00	09:00	t	6	null
3f80f897-8288-47bf-b7c0-e7dce99bae8d	c8de64b9-fded-4da6-b92c-4a2d3a22fe4b	3	09:00	10:00	t	6	null
ecd45d12-c10c-462e-b97e-a274b2739d6a	c8de64b9-fded-4da6-b92c-4a2d3a22fe4b	3	10:00	11:00	t	6	null
3d8a3a84-e6d5-4271-b9a8-be4658449c0d	c8de64b9-fded-4da6-b92c-4a2d3a22fe4b	3	11:00	12:00	t	6	null
31df0436-7e1b-4d00-be87-a18930ab785a	c8de64b9-fded-4da6-b92c-4a2d3a22fe4b	3	13:00	14:00	t	6	null
47b6ace2-bbc2-491b-a553-04b0f9a5c528	c8de64b9-fded-4da6-b92c-4a2d3a22fe4b	3	14:00	15:00	t	6	null
2ff89b9c-6071-4bf8-85f4-0e96a8076942	c8de64b9-fded-4da6-b92c-4a2d3a22fe4b	3	15:00	16:00	t	6	null
4b517dd9-c639-43d7-a0e2-952c4df68a1e	c8de64b9-fded-4da6-b92c-4a2d3a22fe4b	3	16:00	17:00	t	6	null
93726fd3-14c8-4587-bc97-72d9a2546f36	c8de64b9-fded-4da6-b92c-4a2d3a22fe4b	4	08:00	09:00	t	6	null
b13f6016-0fdc-485b-b373-7a9ab5e3e014	c8de64b9-fded-4da6-b92c-4a2d3a22fe4b	4	09:00	10:00	t	6	null
ec96ac1b-99b4-45b2-b570-bef5a03e8486	c8de64b9-fded-4da6-b92c-4a2d3a22fe4b	4	10:00	11:00	t	6	null
e57ca1e2-34c4-4571-ae0e-f79a6aea88f4	c8de64b9-fded-4da6-b92c-4a2d3a22fe4b	4	11:00	12:00	t	6	null
19a79fb8-fe5b-45f6-87c7-eac24e81bbed	c8de64b9-fded-4da6-b92c-4a2d3a22fe4b	4	13:00	14:00	t	6	null
66fbc25c-5051-44ac-a215-ba725f2b4eba	c8de64b9-fded-4da6-b92c-4a2d3a22fe4b	4	14:00	15:00	t	6	null
ba1de8c7-2ffc-4121-8cfb-82b847e34a83	c8de64b9-fded-4da6-b92c-4a2d3a22fe4b	4	15:00	16:00	t	6	null
fe049e52-2e6b-414b-85d7-f0f48b779fd5	c8de64b9-fded-4da6-b92c-4a2d3a22fe4b	4	16:00	17:00	t	6	null
707ce974-3629-4f2b-a543-61c776849e9e	c8de64b9-fded-4da6-b92c-4a2d3a22fe4b	5	08:00	09:00	t	6	null
346cd2ec-451e-4a93-b1d7-08ba63ff057c	c8de64b9-fded-4da6-b92c-4a2d3a22fe4b	5	09:00	10:00	t	6	null
b9c6bf21-7123-400c-8fd8-bbd0788edf72	c8de64b9-fded-4da6-b92c-4a2d3a22fe4b	5	10:00	11:00	t	6	null
bac28b57-9066-49ae-8a83-c3c05a801c72	c8de64b9-fded-4da6-b92c-4a2d3a22fe4b	5	11:00	12:00	t	6	null
123255bc-7229-46ba-a4eb-433ba0ca7256	c8de64b9-fded-4da6-b92c-4a2d3a22fe4b	5	13:00	14:00	t	6	null
f28c8970-c153-478e-82a5-8488be0a6fe8	c8de64b9-fded-4da6-b92c-4a2d3a22fe4b	5	14:00	15:00	t	6	null
746574c6-f5bb-489f-a974-24bcfb246b99	c8de64b9-fded-4da6-b92c-4a2d3a22fe4b	5	15:00	16:00	t	6	null
90846baa-02b7-4e21-bcf6-7bdb4d50e811	c8de64b9-fded-4da6-b92c-4a2d3a22fe4b	5	16:00	17:00	t	6	null
39423f84-c0ad-4967-86cf-11b1860a2192	53765a51-585f-4131-a7f0-c76f311ef0a0	1	08:00	09:00	t	3	null
e8f07cd2-b9f5-4234-b73d-c75c16bf9ad2	53765a51-585f-4131-a7f0-c76f311ef0a0	1	09:00	10:00	t	3	null
2798cf40-9797-4516-a0a2-517e13fad9fa	53765a51-585f-4131-a7f0-c76f311ef0a0	1	10:00	11:00	t	3	null
e0e87905-b8ea-455a-90f2-dc9bcfd3892a	53765a51-585f-4131-a7f0-c76f311ef0a0	1	11:00	12:00	t	3	null
b24ec3ce-1300-419e-9e99-18503c7e1f64	53765a51-585f-4131-a7f0-c76f311ef0a0	1	13:00	14:00	t	3	null
730cb300-8fd5-4590-a5bd-6d3cca6f7501	53765a51-585f-4131-a7f0-c76f311ef0a0	1	14:00	15:00	t	3	null
01bdd0c7-929a-4716-840e-4fbd4c57dffe	53765a51-585f-4131-a7f0-c76f311ef0a0	1	15:00	16:00	t	3	null
6f9acbbf-1fa7-46f1-88b9-dd34b916f663	53765a51-585f-4131-a7f0-c76f311ef0a0	1	16:00	17:00	t	3	null
70caf81e-a5f0-4b9c-bffb-d105f8954af6	53765a51-585f-4131-a7f0-c76f311ef0a0	2	08:00	09:00	t	3	null
ac455517-471b-40b2-b105-0df5f55e3b0b	53765a51-585f-4131-a7f0-c76f311ef0a0	2	09:00	10:00	t	3	null
ace13d26-cd91-4a0b-a2c0-000a6950f67e	53765a51-585f-4131-a7f0-c76f311ef0a0	2	10:00	11:00	t	3	null
020734e3-9a90-4905-af87-7417886aa932	53765a51-585f-4131-a7f0-c76f311ef0a0	2	11:00	12:00	t	3	null
84745c50-2892-4e6d-834b-0776fa198fb0	53765a51-585f-4131-a7f0-c76f311ef0a0	2	13:00	14:00	t	3	null
1ef2895a-aa48-4256-8e9b-967c4eb1df1a	53765a51-585f-4131-a7f0-c76f311ef0a0	2	14:00	15:00	t	3	null
9063da24-74e8-4ae7-80d8-4948027df3ca	53765a51-585f-4131-a7f0-c76f311ef0a0	2	15:00	16:00	t	3	null
519a1492-3b12-4b2f-b7c7-1ea3de41c007	53765a51-585f-4131-a7f0-c76f311ef0a0	2	16:00	17:00	t	3	null
47d397c3-84b7-4447-8267-15a041912873	53765a51-585f-4131-a7f0-c76f311ef0a0	3	08:00	09:00	t	3	null
091c15fc-898c-4fd2-b7f5-d0bd127429c7	53765a51-585f-4131-a7f0-c76f311ef0a0	3	09:00	10:00	t	3	null
f31488dc-a309-4eab-bbb2-9b5b9c7c21ea	53765a51-585f-4131-a7f0-c76f311ef0a0	3	10:00	11:00	t	3	null
9b799a1f-0096-4b23-8b0a-9c732acfdee5	53765a51-585f-4131-a7f0-c76f311ef0a0	3	11:00	12:00	t	3	null
810f34d1-1093-49d5-9c41-d342e306ba9e	53765a51-585f-4131-a7f0-c76f311ef0a0	3	13:00	14:00	t	3	null
1dbd9b8e-6161-4ac6-9ae1-acc581431ab3	53765a51-585f-4131-a7f0-c76f311ef0a0	3	14:00	15:00	t	3	null
797ddadd-e76e-4732-a176-26dcd95b7d3e	53765a51-585f-4131-a7f0-c76f311ef0a0	3	15:00	16:00	t	3	null
6e5dc303-dcc2-4673-9d02-7320683db0bf	53765a51-585f-4131-a7f0-c76f311ef0a0	3	16:00	17:00	t	3	null
63897066-e544-42b2-bc0e-9d0f4a2fda26	53765a51-585f-4131-a7f0-c76f311ef0a0	4	08:00	09:00	t	3	null
87465e21-3f8d-415b-8dcd-5c35c9ab6514	53765a51-585f-4131-a7f0-c76f311ef0a0	4	09:00	10:00	t	3	null
160d6adc-56c3-489f-abc9-1ac56ead76ca	53765a51-585f-4131-a7f0-c76f311ef0a0	4	10:00	11:00	t	3	null
6f87bd6c-0877-4b68-a388-c8917c5893aa	53765a51-585f-4131-a7f0-c76f311ef0a0	4	11:00	12:00	t	3	null
ee5275e7-22c0-4ded-9ece-bd93f82341d9	53765a51-585f-4131-a7f0-c76f311ef0a0	4	13:00	14:00	t	3	null
f02fb2a6-de58-4329-8876-732583e5032a	53765a51-585f-4131-a7f0-c76f311ef0a0	4	14:00	15:00	t	3	null
2137675b-8777-4661-a750-3b714947183d	53765a51-585f-4131-a7f0-c76f311ef0a0	4	15:00	16:00	t	3	null
bf753328-9573-484b-bbf6-584ff7129407	53765a51-585f-4131-a7f0-c76f311ef0a0	4	16:00	17:00	t	3	null
6d04e5a7-630c-42c4-88c7-90b9d022f691	53765a51-585f-4131-a7f0-c76f311ef0a0	5	08:00	09:00	t	3	null
c9347c0b-e99e-4eb8-ad64-6070d0423edd	53765a51-585f-4131-a7f0-c76f311ef0a0	5	09:00	10:00	t	3	null
f32330ae-6a09-4ea5-8159-79e9f17155f6	53765a51-585f-4131-a7f0-c76f311ef0a0	5	10:00	11:00	t	3	null
38b042f9-f53f-4b41-8eb4-61df4bc02e99	53765a51-585f-4131-a7f0-c76f311ef0a0	5	11:00	12:00	t	3	null
03e395ea-1fad-4ade-a0fb-45e40613c5bd	53765a51-585f-4131-a7f0-c76f311ef0a0	5	13:00	14:00	t	3	null
eec13126-4bdb-4d89-b2d1-283bb6ba2024	53765a51-585f-4131-a7f0-c76f311ef0a0	5	14:00	15:00	t	3	null
45ea7c43-82f3-4f13-a109-f89eff6f05aa	53765a51-585f-4131-a7f0-c76f311ef0a0	5	15:00	16:00	t	3	null
84edb9ef-9a8e-4604-84ef-a135795bcede	53765a51-585f-4131-a7f0-c76f311ef0a0	5	16:00	17:00	t	3	null
cda43dd0-58e4-43ae-9fe0-617c74bb3c2c	ca8e9c49-29d0-493b-9b5c-3ec8bf6c0172	1	08:00	09:00	t	12	null
fa47df38-df0a-421e-83fa-9742586434e0	ca8e9c49-29d0-493b-9b5c-3ec8bf6c0172	1	09:00	10:00	t	12	null
97839e6f-56e1-467f-862a-069c1fc5bb47	ca8e9c49-29d0-493b-9b5c-3ec8bf6c0172	1	10:00	11:00	t	12	null
b9bd6aa4-a01d-4c1e-aac5-5f1ab3986648	ca8e9c49-29d0-493b-9b5c-3ec8bf6c0172	1	11:00	12:00	t	12	null
27be8e59-d2d5-46db-a5ed-e3b218fb96c0	ca8e9c49-29d0-493b-9b5c-3ec8bf6c0172	1	13:00	14:00	t	12	null
e50f9bbf-c86f-485c-aae3-71f8bd4d09c5	ca8e9c49-29d0-493b-9b5c-3ec8bf6c0172	1	14:00	15:00	t	12	null
22094ac0-42f2-481e-90e0-c72597ef658c	ca8e9c49-29d0-493b-9b5c-3ec8bf6c0172	1	15:00	16:00	t	12	null
cb558601-f3b8-4ee0-84f4-96d5facfc137	ca8e9c49-29d0-493b-9b5c-3ec8bf6c0172	1	16:00	17:00	t	12	null
8971fe57-706d-4684-a6dc-1567b8824de4	ca8e9c49-29d0-493b-9b5c-3ec8bf6c0172	2	08:00	09:00	t	12	null
a5e71ced-d62a-44e2-b742-50d772030a0b	ca8e9c49-29d0-493b-9b5c-3ec8bf6c0172	2	09:00	10:00	t	12	null
504e294e-c72d-482b-980d-0bc9e3efb442	ca8e9c49-29d0-493b-9b5c-3ec8bf6c0172	2	10:00	11:00	t	12	null
cc4240f2-49d5-43ee-984e-267e04ce2e60	ca8e9c49-29d0-493b-9b5c-3ec8bf6c0172	2	11:00	12:00	t	12	null
e29b5dc8-858d-4638-ba8d-dbc83b23b4a1	ca8e9c49-29d0-493b-9b5c-3ec8bf6c0172	2	13:00	14:00	t	12	null
3b791ea8-50a1-44ee-85ad-4256ff152cfe	ca8e9c49-29d0-493b-9b5c-3ec8bf6c0172	2	14:00	15:00	t	12	null
aea9b2f8-56aa-49a3-94b7-737a20bd4319	ca8e9c49-29d0-493b-9b5c-3ec8bf6c0172	2	15:00	16:00	t	12	null
022cb971-906c-4eb7-a134-51d5a98cef20	ca8e9c49-29d0-493b-9b5c-3ec8bf6c0172	2	16:00	17:00	t	12	null
78cd9beb-5108-4d79-b940-37098c1d37df	ca8e9c49-29d0-493b-9b5c-3ec8bf6c0172	3	08:00	09:00	t	12	null
4decbcbd-e9f9-403a-b1b8-8455e81cf2f4	ca8e9c49-29d0-493b-9b5c-3ec8bf6c0172	3	09:00	10:00	t	12	null
f4d09382-8c2c-4457-9838-3344a4a23681	ca8e9c49-29d0-493b-9b5c-3ec8bf6c0172	3	10:00	11:00	t	12	null
63ce3f40-7883-43a2-bbfc-a2afa73bfed1	ca8e9c49-29d0-493b-9b5c-3ec8bf6c0172	3	11:00	12:00	t	12	null
37a22ff8-e965-4d9f-bd7b-2ca41dac566a	ca8e9c49-29d0-493b-9b5c-3ec8bf6c0172	3	13:00	14:00	t	12	null
8d740ab6-805b-4682-85f1-d8878891abb1	ca8e9c49-29d0-493b-9b5c-3ec8bf6c0172	3	14:00	15:00	t	12	null
0ef615c1-0b13-407f-a96a-30c2a0b85561	ca8e9c49-29d0-493b-9b5c-3ec8bf6c0172	3	15:00	16:00	t	12	null
96862018-b4dd-43e1-9c64-87c8d36caddd	ca8e9c49-29d0-493b-9b5c-3ec8bf6c0172	3	16:00	17:00	t	12	null
333856ad-587b-4951-91a9-02f188aa1c2f	ca8e9c49-29d0-493b-9b5c-3ec8bf6c0172	4	08:00	09:00	t	12	null
f1149254-b069-4247-a998-c086629990c2	ca8e9c49-29d0-493b-9b5c-3ec8bf6c0172	4	09:00	10:00	t	12	null
61cb5063-693d-49a5-a868-f5c31c2c6246	ca8e9c49-29d0-493b-9b5c-3ec8bf6c0172	4	10:00	11:00	t	12	null
bbf3b7bd-f5ab-4c16-8883-3690569c6f95	ca8e9c49-29d0-493b-9b5c-3ec8bf6c0172	4	11:00	12:00	t	12	null
1b94484d-0403-4161-95c4-36a46889e38c	ca8e9c49-29d0-493b-9b5c-3ec8bf6c0172	4	13:00	14:00	t	12	null
500a4a79-5d60-4ee5-a072-27191b6a76f6	ca8e9c49-29d0-493b-9b5c-3ec8bf6c0172	4	14:00	15:00	t	12	null
b44541de-c018-4130-924d-8e1ad41c930b	ca8e9c49-29d0-493b-9b5c-3ec8bf6c0172	4	15:00	16:00	t	12	null
8249d68c-e63f-4125-8dbe-7ed41e6bc9a9	ca8e9c49-29d0-493b-9b5c-3ec8bf6c0172	4	16:00	17:00	t	12	null
2ffed6a3-eab0-4fdf-a05c-215da2b0ba3d	ca8e9c49-29d0-493b-9b5c-3ec8bf6c0172	5	08:00	09:00	t	12	null
38e80bef-be24-4a60-b386-0e8f678b3c54	ca8e9c49-29d0-493b-9b5c-3ec8bf6c0172	5	09:00	10:00	t	12	null
b920fda5-c66b-4a1a-9825-8ecc96b1338f	ca8e9c49-29d0-493b-9b5c-3ec8bf6c0172	5	10:00	11:00	t	12	null
eabb44ea-4808-40ea-8bbf-ac0ff49ac8c6	ca8e9c49-29d0-493b-9b5c-3ec8bf6c0172	5	11:00	12:00	t	12	null
6fab92d7-e923-4599-8ea2-ab719443366e	ca8e9c49-29d0-493b-9b5c-3ec8bf6c0172	5	13:00	14:00	t	12	null
01291c40-3615-449c-8ac4-7c64ae7312cf	ca8e9c49-29d0-493b-9b5c-3ec8bf6c0172	5	14:00	15:00	t	12	null
b65596fc-1483-4cfc-887a-0ad72409b6a3	ca8e9c49-29d0-493b-9b5c-3ec8bf6c0172	5	15:00	16:00	t	12	null
8f5aea89-1456-446f-8463-b00198409411	ca8e9c49-29d0-493b-9b5c-3ec8bf6c0172	5	16:00	17:00	t	12	null
5b042195-0b6e-4d8c-85bc-a50b64b26de9	ca8e9c49-29d0-493b-9b5c-3ec8bf6c0172	6	08:00	09:00	t	12	null
c1e2f1ff-954c-4a95-8103-206dbf720cfe	ca8e9c49-29d0-493b-9b5c-3ec8bf6c0172	6	09:00	10:00	t	12	null
fc40386b-8e5a-4d2d-88b0-28fd419bff18	ca8e9c49-29d0-493b-9b5c-3ec8bf6c0172	6	10:00	11:00	t	12	null
c90fd268-8691-4041-9f45-3fcace9cf024	ca8e9c49-29d0-493b-9b5c-3ec8bf6c0172	6	11:00	12:00	t	12	null
8aa2b267-7b9f-4aa9-9123-23cc45e48a2a	b78e3303-33a0-45c9-8601-50effd1d4152	1	08:00	09:00	t	10	null
c474f9fe-5f93-4363-83b3-c41aade38058	b78e3303-33a0-45c9-8601-50effd1d4152	1	09:00	10:00	t	10	null
62e82f69-e54f-4640-a0b9-9588522abefd	b78e3303-33a0-45c9-8601-50effd1d4152	1	10:00	11:00	t	10	null
fe03a8a9-03ae-4820-a66e-84f258d13b70	b78e3303-33a0-45c9-8601-50effd1d4152	1	11:00	12:00	t	10	null
ef9467c0-1653-4ede-9c7f-410b191a67ce	b78e3303-33a0-45c9-8601-50effd1d4152	1	13:00	14:00	t	10	null
2336d38f-28c4-4b41-9a52-aea5f5a4fb15	b78e3303-33a0-45c9-8601-50effd1d4152	1	14:00	15:00	t	10	null
79949252-47f3-4051-9790-5a13ebe662e1	b78e3303-33a0-45c9-8601-50effd1d4152	1	15:00	16:00	t	10	null
0123fe48-372e-4c20-ba33-22614fe46196	b78e3303-33a0-45c9-8601-50effd1d4152	1	16:00	17:00	t	10	null
05752bcb-e648-4339-a7a9-3359b1dbdea1	b78e3303-33a0-45c9-8601-50effd1d4152	2	08:00	09:00	t	10	null
de206af0-102e-4cd6-b506-6911535558fb	b78e3303-33a0-45c9-8601-50effd1d4152	2	09:00	10:00	t	10	null
92e3591f-4380-4160-939a-b7578de23b32	b78e3303-33a0-45c9-8601-50effd1d4152	2	10:00	11:00	t	10	null
638b524f-9984-49c7-97b1-602247d65770	b78e3303-33a0-45c9-8601-50effd1d4152	2	11:00	12:00	t	10	null
78ce04b9-00f0-4abe-8781-e843fba2f461	b78e3303-33a0-45c9-8601-50effd1d4152	2	13:00	14:00	t	10	null
f7fca9a7-4935-4b49-b302-389176d0cdc7	b78e3303-33a0-45c9-8601-50effd1d4152	2	14:00	15:00	t	10	null
083c807a-de9a-4373-9574-97ed74ede92b	b78e3303-33a0-45c9-8601-50effd1d4152	2	15:00	16:00	t	10	null
17c4599b-95fa-4e27-ab80-61894f97b8eb	b78e3303-33a0-45c9-8601-50effd1d4152	2	16:00	17:00	t	10	null
4fe694c1-0a90-46e7-ba61-0aadb9f12428	b78e3303-33a0-45c9-8601-50effd1d4152	3	08:00	09:00	t	10	null
55dc8250-4d4f-4e0a-aebd-c4f4d0f6f2fa	b78e3303-33a0-45c9-8601-50effd1d4152	3	09:00	10:00	t	10	null
a3c5adac-2c3c-4916-8e9a-80b8f9383646	b78e3303-33a0-45c9-8601-50effd1d4152	3	10:00	11:00	t	10	null
33009846-5759-4a92-8c8e-c0e8a761ad37	b78e3303-33a0-45c9-8601-50effd1d4152	3	11:00	12:00	t	10	null
8a237ee8-f076-42e0-b169-00b4dacf8b9d	b78e3303-33a0-45c9-8601-50effd1d4152	3	13:00	14:00	t	10	null
4640fd44-41cc-4408-8d41-c157b9982991	b78e3303-33a0-45c9-8601-50effd1d4152	3	14:00	15:00	t	10	null
fba708c1-0266-4b00-aa55-211b0c707b8d	b78e3303-33a0-45c9-8601-50effd1d4152	3	15:00	16:00	t	10	null
04c276a4-1edf-441e-aab1-bf65b5edfd3f	b78e3303-33a0-45c9-8601-50effd1d4152	3	16:00	17:00	t	10	null
2d5db9fa-ab6e-49cf-aa7b-c6804dfd1269	b78e3303-33a0-45c9-8601-50effd1d4152	4	08:00	09:00	t	10	null
feb9ca56-76ef-4bd8-aee9-6d92f8df1957	b78e3303-33a0-45c9-8601-50effd1d4152	4	09:00	10:00	t	10	null
a9a7b5ce-87e6-408a-b6df-b2da2be882d9	b78e3303-33a0-45c9-8601-50effd1d4152	4	10:00	11:00	t	10	null
6dbf8ab0-7235-46a9-8c5c-7a860a71994b	b78e3303-33a0-45c9-8601-50effd1d4152	4	11:00	12:00	t	10	null
d4d45f5b-cb98-4fa5-83b7-fc7bbe7592eb	b78e3303-33a0-45c9-8601-50effd1d4152	4	13:00	14:00	t	10	null
72eb7e6b-cbc1-4f5d-bde5-b62a90bb69f9	b78e3303-33a0-45c9-8601-50effd1d4152	4	14:00	15:00	t	10	null
4b498e3f-4e63-499f-9fcd-6764e7992e96	b78e3303-33a0-45c9-8601-50effd1d4152	4	15:00	16:00	t	10	null
fb355403-90c1-45e3-a440-a2abf0eff4ac	b78e3303-33a0-45c9-8601-50effd1d4152	4	16:00	17:00	t	10	null
712216e5-7958-4676-b7cd-4b4118ce0014	b78e3303-33a0-45c9-8601-50effd1d4152	5	08:00	09:00	t	10	null
9ae71a70-d56d-4227-b08b-fcc6df66b1fa	b78e3303-33a0-45c9-8601-50effd1d4152	5	09:00	10:00	t	10	null
e01c47aa-7672-476e-bc6e-ca6718483539	b78e3303-33a0-45c9-8601-50effd1d4152	5	10:00	11:00	t	10	null
9bab8537-ce4d-4b04-8841-bfa18d70a12c	b78e3303-33a0-45c9-8601-50effd1d4152	5	11:00	12:00	t	10	null
8ba16a08-e5eb-4221-824b-229972083f40	b78e3303-33a0-45c9-8601-50effd1d4152	5	13:00	14:00	t	10	null
9f23327e-ce84-41d5-b8d4-96675ba5a3c9	b78e3303-33a0-45c9-8601-50effd1d4152	5	14:00	15:00	t	10	null
39e5c517-0d18-49df-92fd-d5747c507d9e	b78e3303-33a0-45c9-8601-50effd1d4152	5	15:00	16:00	t	10	null
23f29c28-efe8-4c4a-a562-ffd51a21e308	b78e3303-33a0-45c9-8601-50effd1d4152	5	16:00	17:00	t	10	null
ad36ab86-efdf-4a78-9a40-3bcb2b6ef5ba	a5076df1-ca67-407c-8fdb-6a858ae389ff	1	08:00	09:00	t	3	null
5e4d47cb-851b-4cd7-9ac9-916e5a486e24	a5076df1-ca67-407c-8fdb-6a858ae389ff	1	09:00	10:00	t	3	null
c6868680-84e0-42b1-9873-e07889e82e68	a5076df1-ca67-407c-8fdb-6a858ae389ff	1	10:00	11:00	t	3	null
82f336e3-c17d-4a8e-a360-b5f27b5ed7a9	a5076df1-ca67-407c-8fdb-6a858ae389ff	1	11:00	12:00	t	3	null
0fd6d7f4-9ac4-4293-ba37-493d61056859	a5076df1-ca67-407c-8fdb-6a858ae389ff	1	13:00	14:00	t	3	null
0c1c9ef7-1047-45bb-bfc8-c666c4b85995	a5076df1-ca67-407c-8fdb-6a858ae389ff	1	14:00	15:00	t	3	null
a728e1b5-b9fa-447a-99a4-821f3272dd36	a5076df1-ca67-407c-8fdb-6a858ae389ff	1	15:00	16:00	t	3	null
a5c545d6-5e4c-47d5-aeda-5dc2f3a3cbdc	a5076df1-ca67-407c-8fdb-6a858ae389ff	1	16:00	17:00	t	3	null
553c6fcd-105c-455a-9130-be7ae6117b0c	a5076df1-ca67-407c-8fdb-6a858ae389ff	2	08:00	09:00	t	3	null
f3175bcf-bf13-4de7-a943-1534f2a30c27	a5076df1-ca67-407c-8fdb-6a858ae389ff	2	09:00	10:00	t	3	null
36311bc4-c739-4b68-9671-2952617e45b3	a5076df1-ca67-407c-8fdb-6a858ae389ff	2	10:00	11:00	t	3	null
d3c55204-5018-4837-bf0c-54c1f27f82db	a5076df1-ca67-407c-8fdb-6a858ae389ff	2	11:00	12:00	t	3	null
a3958fc5-0f1d-4973-aad6-7b6a589563f9	a5076df1-ca67-407c-8fdb-6a858ae389ff	2	13:00	14:00	t	3	null
44122683-4645-4199-a5c2-c4c154f4efa7	a5076df1-ca67-407c-8fdb-6a858ae389ff	2	14:00	15:00	t	3	null
86236497-c930-487d-9fdb-7694c912ca4e	a5076df1-ca67-407c-8fdb-6a858ae389ff	2	15:00	16:00	t	3	null
7b2104a4-7f97-4b9d-b5cb-aa22864a4029	a5076df1-ca67-407c-8fdb-6a858ae389ff	2	16:00	17:00	t	3	null
fbec8e98-46f6-4fab-b4c2-507b452c2b85	a5076df1-ca67-407c-8fdb-6a858ae389ff	3	08:00	09:00	t	3	null
2f16d49e-b6ff-4857-b0e6-680d574bb07f	a5076df1-ca67-407c-8fdb-6a858ae389ff	3	09:00	10:00	t	3	null
1384cf64-edc0-46cf-b48a-07af5f51469d	a5076df1-ca67-407c-8fdb-6a858ae389ff	3	10:00	11:00	t	3	null
eddbb717-5f87-41d5-a506-586407d77494	a5076df1-ca67-407c-8fdb-6a858ae389ff	3	11:00	12:00	t	3	null
4ac5ea28-ec58-4895-83a5-6a266ddc99ca	a5076df1-ca67-407c-8fdb-6a858ae389ff	3	13:00	14:00	t	3	null
d2231a5b-45ae-4e7a-a178-206d48f4fc68	a5076df1-ca67-407c-8fdb-6a858ae389ff	3	14:00	15:00	t	3	null
2d1a9052-186e-4ebe-9fe8-adaa8746d455	a5076df1-ca67-407c-8fdb-6a858ae389ff	3	15:00	16:00	t	3	null
acb6a575-7fd3-408c-b159-8ecc958d7c7f	a5076df1-ca67-407c-8fdb-6a858ae389ff	3	16:00	17:00	t	3	null
8b94be29-8e2b-4d7a-a312-5fe0c7b93914	a5076df1-ca67-407c-8fdb-6a858ae389ff	4	08:00	09:00	t	3	null
d1a0379c-1b20-4847-9b14-8506bf558ee5	a5076df1-ca67-407c-8fdb-6a858ae389ff	4	09:00	10:00	t	3	null
5f308aa9-800d-4578-88f6-7b50a4982498	a5076df1-ca67-407c-8fdb-6a858ae389ff	4	10:00	11:00	t	3	null
ea47b2f0-f808-4cae-8bd6-186fec5db5be	a5076df1-ca67-407c-8fdb-6a858ae389ff	4	11:00	12:00	t	3	null
16c0b5ed-26c0-4e23-8926-f3188ca46363	a5076df1-ca67-407c-8fdb-6a858ae389ff	4	13:00	14:00	t	3	null
b6932c51-ab05-4afb-a231-7bff65be5ae1	a5076df1-ca67-407c-8fdb-6a858ae389ff	4	14:00	15:00	t	3	null
930690ef-ad6d-448b-b284-80d2e63ceff2	a5076df1-ca67-407c-8fdb-6a858ae389ff	4	15:00	16:00	t	3	null
762b09ce-d1de-4fce-b071-24ff0b60faa8	a5076df1-ca67-407c-8fdb-6a858ae389ff	4	16:00	17:00	t	3	null
a0d76e7d-2c08-4917-8686-4cc5faaaf09b	a5076df1-ca67-407c-8fdb-6a858ae389ff	5	08:00	09:00	t	3	null
62a6de79-0e67-400b-ab41-db3a80a3b970	a5076df1-ca67-407c-8fdb-6a858ae389ff	5	09:00	10:00	t	3	null
ade5d475-45bb-42a0-8b14-51979d197ee3	a5076df1-ca67-407c-8fdb-6a858ae389ff	5	10:00	11:00	t	3	null
bce04aec-974c-42f4-a2f7-a471edfae148	a5076df1-ca67-407c-8fdb-6a858ae389ff	5	11:00	12:00	t	3	null
cf2db70c-f2ac-4d32-aac5-c046de347c15	a5076df1-ca67-407c-8fdb-6a858ae389ff	5	13:00	14:00	t	3	null
8d17ab72-10b8-4908-87e8-893374ac750f	a5076df1-ca67-407c-8fdb-6a858ae389ff	5	14:00	15:00	t	3	null
9a63c25d-6d23-408c-8320-21d299e45bc3	a5076df1-ca67-407c-8fdb-6a858ae389ff	5	15:00	16:00	t	3	null
79fa17c8-7517-4f13-a07c-da61cb1b8595	a5076df1-ca67-407c-8fdb-6a858ae389ff	5	16:00	17:00	t	3	null
\.


--
-- Data for Name: government_services; Type: TABLE DATA; Schema: public; Owner: smartrelief
--

COPY public.government_services (id, name, description, category, department, "isActive", "requiresDocuments", "avgProcessingTime", cost, "allowsOnlineBooking", "maxAdvanceBookingDays", "slotDuration", "bufferTime", "maxDailySlots", "requiredDocuments", "eligibilityCriteria", "officeLocation", "contactInfo", "createdAt", "updatedAt") FROM stdin;
c8de64b9-fded-4da6-b92c-4a2d3a22fe4b	Health Certificate Application	Apply for health certificates required for employment, travel, or other purposes	HEALTHCARE	Department of Health	t	t	60	200	t	14	30	15	50	{"Valid government-issued ID","Filled application form","2x2 ID photos (2 pieces)","Medical examination fee"}	Must be 18 years old or above	Makati City Hall Health Department	{"email": "health@makati.gov.ph", "phone": "+63-2-8870-2555", "website": "https://makati.gov.ph/health-services"}	2025-08-16 17:42:39.764	2025-08-16 17:42:39.764
53765a51-585f-4131-a7f0-c76f311ef0a0	SSS Benefits Application	Apply for various SSS benefits including retirement, disability, and death benefits	SOCIAL_WELFARE	Social Security System	t	t	90	0	t	21	45	15	30	{"SSS ID or Member's Record","Valid government-issued ID","Supporting documents (varies by benefit type)","Filled application form"}	Must be an active SSS member	Quezon City SSS Branch	{"email": "benefits@sss.gov.ph", "phone": "+63-2-8920-6401", "website": "https://www.sss.gov.ph"}	2025-08-16 17:42:39.767	2025-08-16 17:42:39.767
ca8e9c49-29d0-493b-9b5c-3ec8bf6c0172	Passport Application & Renewal	Apply for new passport or renew existing passport	DOCUMENTATION	Department of Foreign Affairs	t	t	120	950	t	30	60	15	100	{"Birth certificate (PSA issued)","Valid government-issued ID","Accomplished application form","Passport photos (4.5cm x 3.5cm)"}	Must be a Filipino citizen	Makati DFA Consular Office	{"email": "passport@dfa.gov.ph", "phone": "+63-2-8234-3000", "website": "https://www.passport.gov.ph"}	2025-08-16 17:42:39.821	2025-08-16 17:42:39.821
b78e3303-33a0-45c9-8601-50effd1d4152	Driver's License Application	Apply for new driver's license or license renewal	LICENSING	Land Transportation Office	t	t	180	585	t	7	90	30	80	{"Valid government-issued ID","Medical certificate","Drug test results","Accomplished application form","2x2 ID photos (4 pieces)"}	Must be at least 17 years old (18 for professional license)	Quezon City LTO Office	{"email": "license@lto.gov.ph", "phone": "+63-2-8426-3293", "website": "https://www.lto.gov.ph"}	2025-08-16 17:42:39.871	2025-08-16 17:42:39.871
a5076df1-ca67-407c-8fdb-6a858ae389ff	Pag-IBIG Housing Loan Application	Apply for affordable housing loans through Pag-IBIG Fund	HOUSING	Home Development Mutual Fund	t	t	60	0	t	30	45	15	25	{"Pag-IBIG Membership ID","Valid government-issued ID","Certificate of Employment and Compensation","Income Tax Return (ITR)","Bank statements (6 months)","Property documents"}	Must be an active Pag-IBIG member with at least 24 monthly contributions	Makati Pag-IBIG Fund Office	{"email": "housing@pagibigfund.gov.ph", "phone": "+63-2-8724-4244", "website": "https://www.pagibigfund.gov.ph"}	2025-08-16 17:42:39.92	2025-08-16 17:42:39.92
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: smartrelief
--

COPY public.notifications (id, "userId", title, message, type, "isRead", data, "createdAt", "readAt") FROM stdin;
\.


--
-- Data for Name: priority_scores; Type: TABLE DATA; Schema: public; Owner: smartrelief
--

COPY public.priority_scores (damage_assessment_id, priority_level, priority_score, urgency_factors, resource_requirements, estimated_response_time, affected_population, id, created_at, updated_at, created_by) FROM stdin;
\.


--
-- Data for Name: resource_allocations; Type: TABLE DATA; Schema: public; Owner: smartrelief
--

COPY public.resource_allocations (id, "resourceId", "aidRequestId", "quantityAllocated", status, "allocatedAt", "deliveredAt") FROM stdin;
\.


--
-- Data for Name: resource_predictions; Type: TABLE DATA; Schema: public; Owner: smartrelief
--

COPY public.resource_predictions (damage_assessment_id, priority_score_id, medical_personnel, rescue_teams, emergency_vehicles, relief_supplies, equipment_needed, deployment_timeline, cost_estimate, confidence_score, id, created_at, updated_at, created_by) FROM stdin;
\.


--
-- Data for Name: resources; Type: TABLE DATA; Schema: public; Owner: smartrelief
--

COPY public.resources (id, name, description, category, quantity, unit, status, latitude, longitude, address, "expiryDate", "estimatedValue", "donorId", "organizationId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: user_profiles; Type: TABLE DATA; Schema: public; Owner: smartrelief
--

COPY public.user_profiles (id, "userId", "firstName", "lastName", avatar, "dateOfBirth", gender, address, city, state, country, "zipCode", latitude, longitude, "bloodType", allergies, "medicalInfo", skills, availability, "organizationName", "organizationType", "taxId", "createdAt", "updatedAt") FROM stdin;
9b95ebcd-b91c-481e-8dce-1619972ebb04	d78624ff-3186-4592-ab65-974b4fadb9d2	Demo	User	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	{}	\N	\N	\N	\N	2025-08-12 06:11:47.987	2025-08-12 06:11:47.987
fd1b630c-1289-4480-9a1c-506aa35b0e45	2f83068c-c8b4-4eb5-b1b0-e0ca1e473ee3	Demo	User	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	{}	\N	\N	\N	\N	2025-08-12 06:12:40.694	2025-08-12 06:12:40.694
b7cf8e29-ee6f-407c-a0a2-6bc26a4a245b	e43ac93a-ba6f-4281-91c5-a6c409623fc9	Demo	User	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	{}	\N	\N	\N	\N	2025-08-12 06:12:43.964	2025-08-12 06:12:43.964
eae0e47a-f9aa-4e28-ada0-a04038c075aa	ae7281c1-6bba-46dc-bcd5-2f1f668b4aad	Demo	User	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	{}	\N	\N	\N	\N	2025-08-12 08:50:54.587	2025-08-12 08:50:54.587
16286969-29b6-442a-addc-c7c7f7d8723b	0e158860-e2f7-43ea-bb3d-096b51a4e477	Demo	User	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	{}	\N	\N	\N	\N	2025-08-15 06:41:49.453	2025-08-15 06:41:49.453
b436cbc0-ab01-403b-ac00-dd5ee2948c50	0a03ec15-ecb4-4b83-9363-79b40ffdf862	Demo	User	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	{}	\N	\N	\N	\N	2025-08-15 06:57:33.82	2025-08-15 06:57:33.82
880fd615-d024-4c06-902f-3e50ec6ecfb5	0029ece6-d1c9-4a20-829a-7ecf512228fb	Demo	User	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	{}	\N	\N	\N	\N	2025-08-15 08:44:11.59	2025-08-15 08:44:11.59
fc8867af-8b73-4031-8d75-bf09bbba01a1	afc7b002-931e-442f-b4b5-6f35c0b69dbb	Demo	User	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	{}	\N	\N	\N	\N	2025-08-15 15:19:55.326	2025-08-15 15:19:55.326
a0da7055-5a8f-4ede-9a41-713d72a43d9e	71c96474-1160-48f8-8645-ace378a32498	Demo	User	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	{}	\N	\N	\N	\N	2025-08-16 14:11:57.1	2025-08-16 14:11:57.1
c0c95733-39c9-456c-b06e-034380f24827	93fe39a5-2267-4eda-89ca-c1113b099832	Demo	User	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	{}	\N	\N	\N	\N	2025-08-16 16:01:40.535	2025-08-16 16:01:40.535
6b57e092-5799-4128-9d62-8403a17a6939	486346a3-790e-48cb-8e11-2ac2068c1643	Demo	User	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	{}	\N	\N	\N	\N	2025-08-16 17:24:21.828	2025-08-16 17:24:21.828
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: smartrelief
--

COPY public.users (id, email, "phoneNumber", password, role, "isVerified", "isActive", "createdAt", "updatedAt") FROM stdin;
d78624ff-3186-4592-ab65-974b4fadb9d2	user+1754979102275@example.com	\N	$2a$10$6Q1zwz3Kgn39Q17qld39fu7LIUH2Qg2.zGXy6oeezUhHNjKAXITJi	VICTIM	f	t	2025-08-12 06:11:47.987	2025-08-12 06:11:47.987
2f83068c-c8b4-4eb5-b1b0-e0ca1e473ee3	user+1754979161@example.com	\N	$2a$10$C8lgEFWG8yfGrWkZlZ0ReO3Z6E3GNBZPfhY4AoH./5Blpohf4bHAq	VICTIM	f	t	2025-08-12 06:12:40.694	2025-08-12 06:12:40.694
e43ac93a-ba6f-4281-91c5-a6c409623fc9	user+1754979164@example.com	\N	$2a$10$5PL6/zH40CYtlhA5aa2wW.WyE.dk33yDu4yMLSUkoe5E38T6PhjtO	VICTIM	f	t	2025-08-12 06:12:43.964	2025-08-12 06:12:43.964
f629ae65-f1b2-4a99-8f83-daa305f7fbe3	admin@smartrelief.test	\N	$2a$10$ga/JSLuX.9l3GWBSs44ssO/qOm/hm8T9/6oOvNndt3E7ECaAC1aOG	ADMIN	f	t	2025-08-12 06:45:16.942	2025-08-12 06:45:16.942
f81913c5-455f-4e70-a7f2-c0974f8c3ec4	user1@smartrelief.test	\N	$2a$10$1OOcxv18zLufGsGKkOvJpeY9V4gY7p./y9tgRjD4PS8zjpH0Sqi6m	VICTIM	f	t	2025-08-12 06:45:16.947	2025-08-12 06:45:16.947
ae7281c1-6bba-46dc-bcd5-2f1f668b4aad	user+1754988654@example.com	\N	$2a$10$eMzcqE6CPK0gRG668IkH2eT9n7FWO0KZo2RUNALfff25zikrWhZ/G	VICTIM	f	t	2025-08-12 08:50:54.587	2025-08-12 08:50:54.587
0e158860-e2f7-43ea-bb3d-096b51a4e477	user+1755240109@example.com	\N	$2a$10$Cd21cLDNM83J2rRY0pOou.jQd9/LbWm/HJiXc7DYHBGhv3kaYXNo6	VICTIM	f	t	2025-08-15 06:41:49.453	2025-08-15 06:41:49.453
0a03ec15-ecb4-4b83-9363-79b40ffdf862	user+1755241054@example.com	\N	$2a$10$hEoo644N3BWH0a32EEckoep8LXsmvQZglXWYKSsKK8FEtknGuZ6w2	VICTIM	f	t	2025-08-15 06:57:33.82	2025-08-15 06:57:33.82
0029ece6-d1c9-4a20-829a-7ecf512228fb	user+1755247451@example.com	\N	$2a$10$zCsGeRapuhYOUtkYMOYojOiWVdjpBrrKkk7Wec4tTALfKW/E1F.CS	VICTIM	f	t	2025-08-15 08:44:11.59	2025-08-15 08:44:11.59
afc7b002-931e-442f-b4b5-6f35c0b69dbb	user+1755271195@example.com	\N	$2a$10$tgpdg0Otwc6rEVpmVS7ydOZh7uNpvgbFry8bo3A78OoCK4Ekp3Kla	VICTIM	f	t	2025-08-15 15:19:55.326	2025-08-15 15:19:55.326
71c96474-1160-48f8-8645-ace378a32498	user+1755353517@example.com	\N	$2a$10$p3qUS9Ct1Gn.z3OTQN1GZuRsCwN3bQEOLlLhjLQqkOC/Y4lEdIOD2	VICTIM	f	t	2025-08-16 14:11:57.1	2025-08-16 14:11:57.1
93fe39a5-2267-4eda-89ca-c1113b099832	user+1755360100@example.com	\N	$2a$10$UnaUoyD2sNVzz/WW4nu/6Oh3PsFh1RwylxeAGX4sSkwoP/8NkOwk.	VICTIM	f	t	2025-08-16 16:01:40.535	2025-08-16 16:01:40.535
486346a3-790e-48cb-8e11-2ac2068c1643	user+1755365061@example.com	\N	$2a$10$q36PvEj2xodoE4FcI9LvJ.Lkr94Y3YKdAj9q3qDAhvpRHV2yufY4q	VICTIM	f	t	2025-08-16 17:24:21.828	2025-08-16 17:24:21.828
\.


--
-- Data for Name: volunteer_tasks; Type: TABLE DATA; Schema: public; Owner: smartrelief
--

COPY public.volunteer_tasks (id, "aidRequestId", "volunteerId", title, description, status, latitude, longitude, "estimatedDuration", "actualDuration", "assignedAt", "startedAt", "completedAt", "completionPhotos", "completionNotes") FROM stdin;
\.


--
-- Name: damage_assessments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: smartrelief
--

SELECT pg_catalog.setval('public.damage_assessments_id_seq', 1, false);


--
-- Name: priority_scores_id_seq; Type: SEQUENCE SET; Schema: public; Owner: smartrelief
--

SELECT pg_catalog.setval('public.priority_scores_id_seq', 1, false);


--
-- Name: resource_predictions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: smartrelief
--

SELECT pg_catalog.setval('public.resource_predictions_id_seq', 1, false);


--
-- Name: aid_requests aid_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: smartrelief
--

ALTER TABLE ONLY public.aid_requests
    ADD CONSTRAINT aid_requests_pkey PRIMARY KEY (id);


--
-- Name: analytics_events analytics_events_pkey; Type: CONSTRAINT; Schema: public; Owner: smartrelief
--

ALTER TABLE ONLY public.analytics_events
    ADD CONSTRAINT analytics_events_pkey PRIMARY KEY (id);


--
-- Name: audit_logs audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: smartrelief
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (id);


--
-- Name: damage_assessments damage_assessments_pkey; Type: CONSTRAINT; Schema: public; Owner: smartrelief
--

ALTER TABLE ONLY public.damage_assessments
    ADD CONSTRAINT damage_assessments_pkey PRIMARY KEY (id);


--
-- Name: donations donations_pkey; Type: CONSTRAINT; Schema: public; Owner: smartrelief
--

ALTER TABLE ONLY public.donations
    ADD CONSTRAINT donations_pkey PRIMARY KEY (id);


--
-- Name: emergency_contacts emergency_contacts_pkey; Type: CONSTRAINT; Schema: public; Owner: smartrelief
--

ALTER TABLE ONLY public.emergency_contacts
    ADD CONSTRAINT emergency_contacts_pkey PRIMARY KEY (id);


--
-- Name: emergency_service_requests emergency_service_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: smartrelief
--

ALTER TABLE ONLY public.emergency_service_requests
    ADD CONSTRAINT emergency_service_requests_pkey PRIMARY KEY (id);


--
-- Name: government_offices government_offices_pkey; Type: CONSTRAINT; Schema: public; Owner: smartrelief
--

ALTER TABLE ONLY public.government_offices
    ADD CONSTRAINT government_offices_pkey PRIMARY KEY (id);


--
-- Name: government_service_appointments government_service_appointments_pkey; Type: CONSTRAINT; Schema: public; Owner: smartrelief
--

ALTER TABLE ONLY public.government_service_appointments
    ADD CONSTRAINT government_service_appointments_pkey PRIMARY KEY (id);


--
-- Name: government_service_queue government_service_queue_pkey; Type: CONSTRAINT; Schema: public; Owner: smartrelief
--

ALTER TABLE ONLY public.government_service_queue
    ADD CONSTRAINT government_service_queue_pkey PRIMARY KEY (id);


--
-- Name: government_service_time_slots government_service_time_slots_pkey; Type: CONSTRAINT; Schema: public; Owner: smartrelief
--

ALTER TABLE ONLY public.government_service_time_slots
    ADD CONSTRAINT government_service_time_slots_pkey PRIMARY KEY (id);


--
-- Name: government_services government_services_pkey; Type: CONSTRAINT; Schema: public; Owner: smartrelief
--

ALTER TABLE ONLY public.government_services
    ADD CONSTRAINT government_services_pkey PRIMARY KEY (id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: smartrelief
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: priority_scores priority_scores_pkey; Type: CONSTRAINT; Schema: public; Owner: smartrelief
--

ALTER TABLE ONLY public.priority_scores
    ADD CONSTRAINT priority_scores_pkey PRIMARY KEY (id);


--
-- Name: resource_allocations resource_allocations_pkey; Type: CONSTRAINT; Schema: public; Owner: smartrelief
--

ALTER TABLE ONLY public.resource_allocations
    ADD CONSTRAINT resource_allocations_pkey PRIMARY KEY (id);


--
-- Name: resource_predictions resource_predictions_pkey; Type: CONSTRAINT; Schema: public; Owner: smartrelief
--

ALTER TABLE ONLY public.resource_predictions
    ADD CONSTRAINT resource_predictions_pkey PRIMARY KEY (id);


--
-- Name: resources resources_pkey; Type: CONSTRAINT; Schema: public; Owner: smartrelief
--

ALTER TABLE ONLY public.resources
    ADD CONSTRAINT resources_pkey PRIMARY KEY (id);


--
-- Name: user_profiles user_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: smartrelief
--

ALTER TABLE ONLY public.user_profiles
    ADD CONSTRAINT user_profiles_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: smartrelief
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: volunteer_tasks volunteer_tasks_pkey; Type: CONSTRAINT; Schema: public; Owner: smartrelief
--

ALTER TABLE ONLY public.volunteer_tasks
    ADD CONSTRAINT volunteer_tasks_pkey PRIMARY KEY (id);


--
-- Name: aid_requests_category_status_idx; Type: INDEX; Schema: public; Owner: smartrelief
--

CREATE INDEX aid_requests_category_status_idx ON public.aid_requests USING btree (category, status);


--
-- Name: aid_requests_latitude_longitude_idx; Type: INDEX; Schema: public; Owner: smartrelief
--

CREATE INDEX aid_requests_latitude_longitude_idx ON public.aid_requests USING btree (latitude, longitude);


--
-- Name: aid_requests_status_priority_idx; Type: INDEX; Schema: public; Owner: smartrelief
--

CREATE INDEX aid_requests_status_priority_idx ON public.aid_requests USING btree (status, priority);


--
-- Name: analytics_events_eventType_timestamp_idx; Type: INDEX; Schema: public; Owner: smartrelief
--

CREATE INDEX "analytics_events_eventType_timestamp_idx" ON public.analytics_events USING btree ("eventType", "timestamp");


--
-- Name: audit_logs_resource_resourceId_idx; Type: INDEX; Schema: public; Owner: smartrelief
--

CREATE INDEX "audit_logs_resource_resourceId_idx" ON public.audit_logs USING btree (resource, "resourceId");


--
-- Name: audit_logs_userId_timestamp_idx; Type: INDEX; Schema: public; Owner: smartrelief
--

CREATE INDEX "audit_logs_userId_timestamp_idx" ON public.audit_logs USING btree ("userId", "timestamp");


--
-- Name: emergency_service_requests_latitude_longitude_idx; Type: INDEX; Schema: public; Owner: smartrelief
--

CREATE INDEX emergency_service_requests_latitude_longitude_idx ON public.emergency_service_requests USING btree (latitude, longitude);


--
-- Name: emergency_service_requests_urgencyLevel_status_idx; Type: INDEX; Schema: public; Owner: smartrelief
--

CREATE INDEX "emergency_service_requests_urgencyLevel_status_idx" ON public.emergency_service_requests USING btree ("urgencyLevel", status);


--
-- Name: emergency_service_requests_userId_status_idx; Type: INDEX; Schema: public; Owner: smartrelief
--

CREATE INDEX "emergency_service_requests_userId_status_idx" ON public.emergency_service_requests USING btree ("userId", status);


--
-- Name: government_offices_code_key; Type: INDEX; Schema: public; Owner: smartrelief
--

CREATE UNIQUE INDEX government_offices_code_key ON public.government_offices USING btree (code);


--
-- Name: government_offices_latitude_longitude_idx; Type: INDEX; Schema: public; Owner: smartrelief
--

CREATE INDEX government_offices_latitude_longitude_idx ON public.government_offices USING btree (latitude, longitude);


--
-- Name: government_service_appointments_appointmentDate_status_idx; Type: INDEX; Schema: public; Owner: smartrelief
--

CREATE INDEX "government_service_appointments_appointmentDate_status_idx" ON public.government_service_appointments USING btree ("appointmentDate", status);


--
-- Name: government_service_appointments_bookingReference_idx; Type: INDEX; Schema: public; Owner: smartrelief
--

CREATE INDEX "government_service_appointments_bookingReference_idx" ON public.government_service_appointments USING btree ("bookingReference");


--
-- Name: government_service_appointments_bookingReference_key; Type: INDEX; Schema: public; Owner: smartrelief
--

CREATE UNIQUE INDEX "government_service_appointments_bookingReference_key" ON public.government_service_appointments USING btree ("bookingReference");


--
-- Name: government_service_appointments_serviceId_appointmentDate_idx; Type: INDEX; Schema: public; Owner: smartrelief
--

CREATE INDEX "government_service_appointments_serviceId_appointmentDate_idx" ON public.government_service_appointments USING btree ("serviceId", "appointmentDate");


--
-- Name: government_service_appointments_userId_status_idx; Type: INDEX; Schema: public; Owner: smartrelief
--

CREATE INDEX "government_service_appointments_userId_status_idx" ON public.government_service_appointments USING btree ("userId", status);


--
-- Name: government_service_queue_serviceId_position_idx; Type: INDEX; Schema: public; Owner: smartrelief
--

CREATE INDEX "government_service_queue_serviceId_position_idx" ON public.government_service_queue USING btree ("serviceId", "position");


--
-- Name: government_service_queue_userId_status_idx; Type: INDEX; Schema: public; Owner: smartrelief
--

CREATE INDEX "government_service_queue_userId_status_idx" ON public.government_service_queue USING btree ("userId", status);


--
-- Name: government_service_time_slots_serviceId_dayOfWeek_idx; Type: INDEX; Schema: public; Owner: smartrelief
--

CREATE INDEX "government_service_time_slots_serviceId_dayOfWeek_idx" ON public.government_service_time_slots USING btree ("serviceId", "dayOfWeek");


--
-- Name: government_services_category_isActive_idx; Type: INDEX; Schema: public; Owner: smartrelief
--

CREATE INDEX "government_services_category_isActive_idx" ON public.government_services USING btree (category, "isActive");


--
-- Name: government_services_department_idx; Type: INDEX; Schema: public; Owner: smartrelief
--

CREATE INDEX government_services_department_idx ON public.government_services USING btree (department);


--
-- Name: ix_damage_assessments_id; Type: INDEX; Schema: public; Owner: smartrelief
--

CREATE INDEX ix_damage_assessments_id ON public.damage_assessments USING btree (id);


--
-- Name: ix_priority_scores_id; Type: INDEX; Schema: public; Owner: smartrelief
--

CREATE INDEX ix_priority_scores_id ON public.priority_scores USING btree (id);


--
-- Name: ix_resource_predictions_id; Type: INDEX; Schema: public; Owner: smartrelief
--

CREATE INDEX ix_resource_predictions_id ON public.resource_predictions USING btree (id);


--
-- Name: notifications_userId_isRead_idx; Type: INDEX; Schema: public; Owner: smartrelief
--

CREATE INDEX "notifications_userId_isRead_idx" ON public.notifications USING btree ("userId", "isRead");


--
-- Name: resources_category_status_idx; Type: INDEX; Schema: public; Owner: smartrelief
--

CREATE INDEX resources_category_status_idx ON public.resources USING btree (category, status);


--
-- Name: resources_latitude_longitude_idx; Type: INDEX; Schema: public; Owner: smartrelief
--

CREATE INDEX resources_latitude_longitude_idx ON public.resources USING btree (latitude, longitude);


--
-- Name: user_profiles_userId_key; Type: INDEX; Schema: public; Owner: smartrelief
--

CREATE UNIQUE INDEX "user_profiles_userId_key" ON public.user_profiles USING btree ("userId");


--
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: smartrelief
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- Name: users_phoneNumber_key; Type: INDEX; Schema: public; Owner: smartrelief
--

CREATE UNIQUE INDEX "users_phoneNumber_key" ON public.users USING btree ("phoneNumber");


--
-- Name: volunteer_tasks_volunteerId_status_idx; Type: INDEX; Schema: public; Owner: smartrelief
--

CREATE INDEX "volunteer_tasks_volunteerId_status_idx" ON public.volunteer_tasks USING btree ("volunteerId", status);


--
-- Name: aid_requests aid_requests_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: smartrelief
--

ALTER TABLE ONLY public.aid_requests
    ADD CONSTRAINT "aid_requests_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: donations donations_donorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: smartrelief
--

ALTER TABLE ONLY public.donations
    ADD CONSTRAINT "donations_donorId_fkey" FOREIGN KEY ("donorId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: emergency_contacts emergency_contacts_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: smartrelief
--

ALTER TABLE ONLY public.emergency_contacts
    ADD CONSTRAINT "emergency_contacts_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: emergency_service_requests emergency_service_requests_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: smartrelief
--

ALTER TABLE ONLY public.emergency_service_requests
    ADD CONSTRAINT "emergency_service_requests_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: government_service_appointments government_service_appointments_serviceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: smartrelief
--

ALTER TABLE ONLY public.government_service_appointments
    ADD CONSTRAINT "government_service_appointments_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES public.government_services(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: government_service_appointments government_service_appointments_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: smartrelief
--

ALTER TABLE ONLY public.government_service_appointments
    ADD CONSTRAINT "government_service_appointments_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: government_service_time_slots government_service_time_slots_serviceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: smartrelief
--

ALTER TABLE ONLY public.government_service_time_slots
    ADD CONSTRAINT "government_service_time_slots_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES public.government_services(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: notifications notifications_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: smartrelief
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: priority_scores priority_scores_damage_assessment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: smartrelief
--

ALTER TABLE ONLY public.priority_scores
    ADD CONSTRAINT priority_scores_damage_assessment_id_fkey FOREIGN KEY (damage_assessment_id) REFERENCES public.damage_assessments(id);


--
-- Name: resource_allocations resource_allocations_aidRequestId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: smartrelief
--

ALTER TABLE ONLY public.resource_allocations
    ADD CONSTRAINT "resource_allocations_aidRequestId_fkey" FOREIGN KEY ("aidRequestId") REFERENCES public.aid_requests(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: resource_allocations resource_allocations_resourceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: smartrelief
--

ALTER TABLE ONLY public.resource_allocations
    ADD CONSTRAINT "resource_allocations_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES public.resources(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: resource_predictions resource_predictions_damage_assessment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: smartrelief
--

ALTER TABLE ONLY public.resource_predictions
    ADD CONSTRAINT resource_predictions_damage_assessment_id_fkey FOREIGN KEY (damage_assessment_id) REFERENCES public.damage_assessments(id);


--
-- Name: resource_predictions resource_predictions_priority_score_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: smartrelief
--

ALTER TABLE ONLY public.resource_predictions
    ADD CONSTRAINT resource_predictions_priority_score_id_fkey FOREIGN KEY (priority_score_id) REFERENCES public.priority_scores(id);


--
-- Name: user_profiles user_profiles_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: smartrelief
--

ALTER TABLE ONLY public.user_profiles
    ADD CONSTRAINT "user_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: volunteer_tasks volunteer_tasks_aidRequestId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: smartrelief
--

ALTER TABLE ONLY public.volunteer_tasks
    ADD CONSTRAINT "volunteer_tasks_aidRequestId_fkey" FOREIGN KEY ("aidRequestId") REFERENCES public.aid_requests(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: volunteer_tasks volunteer_tasks_volunteerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: smartrelief
--

ALTER TABLE ONLY public.volunteer_tasks
    ADD CONSTRAINT "volunteer_tasks_volunteerId_fkey" FOREIGN KEY ("volunteerId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

