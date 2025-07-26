# Deployment Checklist for PastTime App

## Environment Variables
Make sure these are set in your deployment platform (Vercel, Netlify, etc.):

```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Database Setup
1. Run the latest migration in your Supabase project:
   ```sql
   -- Run the updated migration with proper RLS policies
   -- This allows anonymous access for your email-based auth system
   ```

2. Verify the `capsules` table has the correct schema:
   - `id` (UUID, primary key)
   - `user_id` (TEXT, not null)
   - `title` (TEXT, not null)
   - `body` (TEXT, not null)
   - `unlock_date` (TIMESTAMP WITH TIME ZONE, not null)
   - `created_at` (TIMESTAMP WITH TIME ZONE, default now())
   - `sent_at` (TIMESTAMP WITH TIME ZONE, nullable)
   - `media_url` (TEXT, nullable)
   - `timezone` (TEXT, nullable)

## Common Issues and Solutions

### 1. "Supabase not configured" Error
**Cause**: Missing environment variables
**Solution**: Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in your deployment platform

### 2. "Row Level Security policy violation" Error
**Cause**: RLS policies require authentication
**Solution**: The updated migration allows anonymous access

### 3. "Failed to create capsule" Error
**Cause**: Database connection or permission issues
**Solution**: 
- Check Supabase project is active
- Verify RLS policies are applied
- Check browser console for detailed error messages

### 4. CORS Issues
**Cause**: Supabase project not configured for your domain
**Solution**: Add your deployment domain to Supabase Auth settings

## Testing Steps
1. Open browser console and check for "Supabase Configuration" log
2. Try creating a capsule and check for any error messages
3. Verify the capsule appears in the dashboard
4. Check if the backend cron job is running (if deployed separately)

## Backend Deployment (Optional)
If you're deploying the backend separately:
1. Set environment variables:
   ```bash
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   RESEND_API_KEY=your_resend_api_key
   ```
2. Deploy to a platform that supports cron jobs (Railway, Render, etc.)

## Debugging
- Check browser console for error messages
- Verify environment variables are loaded correctly
- Test Supabase connection in browser console:
  ```javascript
  // In browser console
  console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL)
  console.log('Supabase Key:', import.meta.env.VITE_SUPABASE_ANON_KEY?.substring(0, 10) + '...')
  ``` 