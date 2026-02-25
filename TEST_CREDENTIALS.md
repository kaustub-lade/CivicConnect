# Test Users - CivicConnect

## 🔐 Pre-created Login Credentials

These test accounts are already created in the database:

---

### 👤 **CITIZEN ACCOUNT**
```
Email:    citizen@test.com
Password: Pass123!
Role:     citizen
Points:   50
```
**Access:** Report issues, view dashboard, track complaints

---

### 🏛️ **AUTHORITY ACCOUNT**
```
Email:    authority@test.com
Password: Pass123!
Role:     authority
Points:   100
```
**Access:** Manage complaints, update status, add updates

---

### ⚙️ **ADMIN ACCOUNT**
```
Email:    admin@test.com
Password: Pass123!
Role:     admin
Points:   200
```
**Access:** Full admin panel, analytics dashboard, all features

---

### 🤝 **VOLUNTEER ACCOUNT**
```
Email:    volunteer@test.com
Password: Pass123!
Role:     volunteer
Points:   150
```
**Access:** Join volunteer opportunities, track activities

---

## 🔄 How to Recreate These Users

If you need to reset or recreate the test users:

```bash
cd server
node seed-users.js
```

This will:
1. Delete any existing test users
2. Create fresh accounts with hashed passwords
3. Assign correct roles and initial points
4. Display all credentials

---

## 🚀 Quick Start

1. Open your deployed app
2. Click **"Login"**
3. Use any of the credentials above
4. Test different features based on role

---

## 📊 User Roles & Permissions

| Role | Report Issues | View Dashboard | Update Complaints | Admin Panel | Volunteer Hub |
|------|--------------|----------------|-------------------|-------------|---------------|
| Citizen | ✅ | ✅ | ❌ | ❌ | ✅ |
| Volunteer | ✅ | ✅ | ❌ | ❌ | ✅ |
| Authority | ✅ | ✅ | ✅ | ❌ | ✅ |
| Admin | ✅ | ✅ | ✅ | ✅ | ✅ |

---

**Note:** All passwords are `Pass123!` for easy testing. Use stronger passwords in production!
