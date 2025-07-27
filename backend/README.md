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

### Render (Recommended)

This backend is configured for deployment on Render. Render is perfect for this application because it supports:
- Background processes (cron jobs)
- Free tier available
- Easy environment variable management
- Automatic deployments from GitHub

#### Option 1: Deploy via GitHub Actions (Recommended)

1. **Set up GitHub Secrets**:
   - Go to your GitHub repository → Settings → Secrets and variables → Actions
   - Add these secrets:
     - `RENDER_TOKEN`: Your Render API token
     - `RENDER_SERVICE_ID`: Your Render service ID

2. **Get your Render API token**:
   - Go to your Render dashboard → Account → API Keys
   - Create a new API key

3. **Get your Service ID**:
   - After creating your service on Render, the ID will be in the URL
   - Or find it in the service settings

4. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Configure Render deployment"
   git push origin main
   ```

#### Option 2: Manual Render Setup

1. **Create a new Web Service** on Render
2. **Connect your GitHub repository**
3. **Configure the service**:
   - **Name**: `pasttime-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

4. **Set Environment Variables**:
   - `NODE_ENV`: `production`
   - `PORT`: `10000` (Render's default)
   - `SUPABASE_URL`: Your Supabase project URL
   - `SUPABASE_ANON_KEY`: Your Supabase anonymous key
   - `RESEND_API_KEY`: Your Resend API key

### Other Deployment Options

- **Railway**: Great for cron jobs and background processes
- **Heroku**: Classic choice (requires credit card)
- **DigitalOcean App Platform**: Good performance
- **Vercel**: Good for serverless functions

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