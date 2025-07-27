# PastTime Backend

A Node.js backend service for the PastTime time capsule application. This service handles scheduled email delivery of time capsules using cron jobs.

## Features

- **Scheduled Email Delivery**: Automatically sends time capsule emails when they're due
- **Supabase Integration**: Connects to Supabase for data storage
- **Resend Email Service**: Uses Resend for reliable email delivery
- **Cron Jobs**: Runs every minute to check for due capsules
- **Express Server**: Provides a simple health check endpoint

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Supabase account and project
- Resend account and API key

## Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
RESEND_API_KEY=your_resend_api_key
PORT=3001
```

## Installation

1. Clone the repository
2. Navigate to the backend directory:
   ```bash
   cd backend
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Set up your environment variables in a `.env` file

5. Start the server:
   ```bash
   npm start
   ```

## API Endpoints

- `GET /` - Health check endpoint

## Deployment

### GitHub Actions (Recommended)

This backend can be deployed using GitHub Actions. The workflow will:
1. Install dependencies
2. Run tests (if any)
3. Deploy to your chosen platform

### Manual Deployment

1. Ensure all environment variables are set on your deployment platform
2. Install dependencies: `npm install --production`
3. Start the server: `npm start`

## Database Schema

The backend expects a `capsules` table in Supabase with the following structure:

```sql
CREATE TABLE capsules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  unlock_date TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  sent_at TIMESTAMP WITH TIME ZONE
);
```

## Cron Job

The service runs a cron job every minute (`* * * * *`) to:
1. Check for capsules where `unlock_date` <= current time
2. Send emails for capsules that haven't been sent yet
3. Update the `sent_at` field after successful email delivery

## Monitoring

- Check the server logs for cron job execution
- Monitor email delivery through Resend dashboard
- Use the health check endpoint to verify service status

## Security Notes

- Never commit `.env` files to version control
- Use environment variables for all sensitive configuration
- Ensure your Supabase RLS policies are properly configured
- Verify your Resend domain settings for email delivery

## License

ISC 