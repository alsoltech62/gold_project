# GoldVault Website (React + Vite)

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env` file:
   ```
   VITE_API_URL=http://localhost/api
   ```
   (Replace `localhost` with your PHP server URL)

3. Start development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```
   Copy the `dist/` folder to your web server.

## Pages

| Path | Description |
|------|-------------|
| `/login` | OTP Login |
| `/dashboard` | User home |
| `/buy` | Buy gold |
| `/sell` | Sell gold request |
| `/transactions` | History |
| `/delivery` | Physical delivery |
| `/profile` | KYC & settings |
| `/admin/dashboard` | Admin stats |
| `/admin/customers` | Manage users |
| `/admin/transactions` | Approve/reject |
| `/admin/gold-rate` | Update rates |
