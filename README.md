# 🚆 Train Ticket System

A full-stack web application for managing and purchasing train tickets, featuring multi-role access: **Admin**, **Staff**, and **Customer**.

## 📌 Project Status

🛠️ Currently in development.  
✅ Features completed:
- Admin login
- Add stations
- Register staff

Planned:
- Add trains and trip schedules
- Staff dashboard to sell tickets
- Customer interface to buy tickets online

## 👥 Roles & Permissions

### 🔒 Admin Dashboard
- Login and authentication
- Add and manage train stations
- Register both **Train Staff** and **Ticket Staff**
- Manage train schedules (coming soon)

### 👨‍💼 Staff Dashboard
- Restricted access
- Sell tickets directly to customers
- View assigned station and schedule (planned)

### 👤 Customer Interface
- Browse available trains and destinations
- Buy tickets independently
- View and manage their purchases (planned)

## 🧱 Technologies Used

- **Frontend**: HTML, CSS, JavaScript (possibly framework later)
- **Backend**: [Supabase](https://supabase.io/) (Auth, DB, API)
- **Auth**: Supabase Auth for role-based login
- **Database**: Supabase PostgreSQL

## 📁 Folder Structure (Planned)

train-ticket-system/
├── index.html               # Landing/Login page
├── /admin
│   └── dashboard.html       # Admin dashboard
├── /staff
│   └── dashboard.html       # Staff dashboard
├── /customer
│   └── buy-ticket.html      # Customer interface
├── style.css
├── script.js
└── supabase.js              # Supabase configuration


## 🚀 Setup Instructions

# 1. Clone the repo
git clone https://github.com/MiMirsad/train-ticket-system.git
cd train-ticket-system

# 2. Configure Supabase:
# - Create a project on https://app.supabase.com/
# - Set up Auth and Tables (stations, users, roles, etc.)
# - Replace your keys in supabase.js

# 3. Open index.html in your browser to start development

✅ TODO
- [x] Login system (Admin/Staff)
- [x] Admin: Add stations
- [x] Admin: Register staff
- [ ] Admin: Add trains and schedules
- [ ] Staff: Sell ticket interface
- [ ] Customer: Buy ticket UI
- [ ] Role-based access control

⚡ Powered By
Built with 💻 and powered by Supabase (https://supabase.io/)
