# fieldloop

## Project Structure

```text
fieldloop/
├── apps/
│   ├── api/              → Express backend
│   └── web/               → React frontend
├── packages/
│   └── shared/             → shared TypeScript types (Job, User, Customer etc.)
├── .github/
│   └── workflows/          → CI/CD pipelines
├── docker-compose.yml
├── .gitignore
├── package.json            → root workspace file
└── README.md
```
##DATABSE SCHEMA
 ┌────────────────────────────────────────────────────────────────────────┐
 │                         ORGANIZATION (Tenant)                          │
 │                   (e.g., "Apex Plumbing Solutions")                    │
 └──────┬────────────────────────────┬─────────────────────────────┬──────┘
        │ (1 to many)                │ (1 to many)                 │ (1 to many)
        ▼                            ▼                             ▼
   USER (Staff)                  CUSTOMER                     AUDIT LOG
  ┌─────────────────────────┐   ┌────────────────────────┐   ┌──────────────────────────┐
  │ - Owner                 │   │ - Homeowner / Client   │   │ - Tracks who did what    │
  │ - Dispatcher            │   │ - Address & Phone      │   │ - Security & audit trail │
  │ - Technician            │   └───────────┬────────────┘   └──────────────────────────┘
  └────────────┬────────────┘               │ (1 to many)
               │ (Assigned to)              │
               └──────────────┬─────────────┘
                              ▼
                       JOB (Work Order)
                      ┌─────────────────────────────────────────┐
                      │ - Service Type (e.g. HVAC Repair)       │
                      │ - Status: REQUESTED ➔ SCHEDULED ➔       │
                      │   EN_ROUTE ➔ IN_PROGRESS ➔ COMPLETED    │
                      └──────────────────┬──────────────────────┘
                                         │ (1 to 1)
                                         ▼
                                      INVOICE
                                     ┌──────────────────────────┐
                                     │ - Subtotal, Tax, Total   │
                                     │ - Stripe Payment Intent  │
                                     │ - Status: DRAFT/SENT/PAID│
                                     └──────────────────────────┘
