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
