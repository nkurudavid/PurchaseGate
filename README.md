# Purchase Request & Approval System using Django (API) + ReactJS (frontend) 🏁

A Purchase Request & Approval System allows employees to request items/services and managers to approve or reject those requests.

<br />

### 📌Requirements:

- Staff: create requests, view/update pending requests, submit receipts.
- Approvers/Manager: view pending requests, approve/reject, visibility on reviewed requests.
- Finance team: access and interact with requests via web UI, upload files.


### 🔄 Workflow: 
- Requests start as PENDING.
- Requires approval from multiple levels.
- Any rejection → request becomes REJECTED.
- All required approvals → request becomes APPROVED.
- Approved/rejected status cannot change.
- Last approver generates a Purchase Order automatically.
- System must handle concurrent interactions safely.



## Repository Structure:

`PurchaseGate/`

`├── api/          # Django REST API`

`├── frontend/         # React/JS application`

`├── docker-compose.yml`

`├── nginx.conf`

`└── README.md         # Detailed documentation`



## Quick Commands:

## Stop containers
`docker-compose down`

## Rebuild with no cache
`docker-compose build --no-cache`
`docker-compose up -d`

## Check if all containers are running
`docker-compose ps`

## Run Django migrations:
`docker-compose exec backend python manage.py migrate`

## Create Django superuser:
`docker-compose exec backend python manage.py createsuperuser`

## URL to access

Frontend: `http://localhost`
Backend: `http://localhost/api/`


# Final Product

## Frontend

<img width="1916" height="981" alt="Image" src="https://github.com/user-attachments/assets/1f2c8f18-5c2c-4d2d-88d7-46c1c5e8f1bb" />
<img width="1919" height="1000" alt="Image" src="https://github.com/user-attachments/assets/e6c1b28b-8d8f-4d48-92ad-0c63dece52a5" />

## Backend Admin

<img width="1918" height="868" alt="Image" src="https://github.com/user-attachments/assets/3a6cdb62-60af-4607-ab9b-c81fe5a439e2" />

## Backend API swagger_ui

<img width="1905" height="983" alt="Image" src="https://github.com/user-attachments/assets/3ab7ca57-5219-4633-b737-fe88576e7ba7" />

## API Documentation Redoc

<img width="1918" height="959" alt="Image" src="https://github.com/user-attachments/assets/f2afa69a-8ac2-42cd-86b5-3852f4011b56" />

