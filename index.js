// server/index.js
require('dotenv').config();
const express = require('express');
const path = require('path');
const Stripe = require('stripe');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// If you serve static front-end from this server, uncomment:
// app.use(express.static(path.join(__dirname, '../public')));

app.use(cors({
  origin: process.env.ALLOWED_ORIGIN || '*' // tighten in production
}));

// JSON body for our API endpoints (not for webhook)
app.use(express.json());

// Create Stripe Checkout Session
app.post('/create-checkout-session', async (req, res) => {
  try {
    const { amount, donor_name, donor_email } = req.body;
    if (!amount || amount <= 0) return res.status(400).json({ error: 'Invalid amount' });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: process.env.CURRENCY || 'zar',
          product_data: {
            name: 'Donation to Bright Future Youth Foundation',
            description: 'Support for tutoring, mentorship and workshops'
          },
          unit_amount: amount // amount in cents
        },
        quantity: 1
      }],
      mode: 'payment',
      customer_email: donor_email || undefined,
      metadata: {
        donor_name: donor_name || '',
      },
      success_url: (process.env.DOMAIN || 'https://yourdomain.example') + '/donate-success.html?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: (process.env.DOMAIN || 'https://yourdomain.example') + '/donate-cancel.html',
    });

    res.json({
      sessionId: session.id,
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY
    });
  } catch (err) {
    console.error('create-checkout-session error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Stripe webhook endpoint — use raw body parser for signature verification
app.post('/webhook', bodyParser.raw({ type: 'application/json' }), (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      // TODO: record donation in DB, send email receipt etc.
      console.log('Payment succeeded for session:', session.id, 'amount_total:', session.amount_total);
      // Example: store session.id, session.customer_email, session.amount_total in DB
      break;
    // handle other event types as needed
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

// Optional: serve static site if you want same server to host it
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, '../public/index.html'));
// });

const port = process.env.PORT || 4242;
app.listen(port, () => console.log(`Server running on port ${port}`));
