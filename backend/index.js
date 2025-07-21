require('dotenv').config();
const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const cron = require('node-cron');
const { Resend } = require('resend');

const app = express();
const port = process.env.PORT || 3001;

// Check for required environment variables
const requiredEnv = ['SUPABASE_URL', 'SUPABASE_ANON_KEY', 'RESEND_API_KEY'];
for (const key of requiredEnv) {
  if (!process.env[key]) {
    console.error(`Error: Missing required environment variable ${key}.`);
    process.exit(1);
  }
}

// Initialize clients
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
const resend = new Resend(process.env.RESEND_API_KEY);

const checkAndSendCapsules = async () => {
  console.log('Running scheduled job: Checking for due time capsules...');
  
  const now = new Date();

  try {
    // Fetch capsules that are due and have not been sent yet
    const { data: capsules, error } = await supabase
      .from('capsules')
      .select('*')
      .lte('unlock_date', now.toISOString()) // Less than or equal to the current time
      .is('sent_at', null); // Check if sent_at is NULL

    if (error) {
      console.error('Error fetching capsules:', error.message);
      return;
    }

    if (!capsules || capsules.length === 0) {
      console.log('No due capsules found.');
      return;
    }

    console.log(`Found ${capsules.length} due capsule(s).`);

    for (const capsule of capsules) {
      console.log(`Processing capsule ID: ${capsule.id} for user ${capsule.user_id}`);

      try {
        // Send email using Resend
        const { data, error: emailError } = await resend.emails.send({
          from: 'PastTime <onboarding@resend.dev>', // IMPORTANT: Change to your verified domain on Resend
          to: [capsule.user_id],
          subject: `Your Time Capsule Has Unlocked: "${capsule.title}"`,
          html: `
            <h1>Your time capsule is here!</h1>
            <p>On ${new Date(capsule.created_at).toLocaleDateString()}, you sent yourself a message titled "<strong>${capsule.title}</strong>".</p>
            <p>Here it is:</p>
            <div style="padding: 20px; border: 1px solid #eee; border-radius: 5px; background: #f9f9f9;">
              <p>${capsule.body}</p>
            </div>
            <br/>
            <p>We hope you enjoyed this message from your past self!</p>
            <p>- The PastTime Team</p>
          `,
        });

        if (emailError) {
          throw emailError;
        }

        console.log(`Email sent successfully for capsule ID: ${capsule.id}.`);

        // Update the capsule to mark it as sent
        const { error: updateError } = await supabase
          .from('capsules')
          .update({ sent_at: new Date().toISOString() })
          .eq('id', capsule.id);

        if (updateError) {
          console.error(`Error updating capsule ID ${capsule.id}:`, updateError.message);
        } else {
          console.log(`Successfully marked capsule ID ${capsule.id} as sent.`);
        }

      } catch (err) {
        console.error(`Failed to process capsule ID ${capsule.id}:`, err);
      }
    }
  } catch (err) {
    console.error('An unexpected error occurred during the job:', err);
  }
};

// Schedule the job to run every minute
cron.schedule('* * * * *', checkAndSendCapsules);

app.get('/', (req, res) => {
  res.send('PastTime Backend is running. The cron job is active.');
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
  console.log('Cron job scheduled to check for capsules every minute.');
  // Run once on startup for immediate feedback if any capsules are due
  checkAndSendCapsules();
}); 