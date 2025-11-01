const Content = require('../models/Content');

const defaultContent = {
  privacy_policy: {
    title: 'Privacy Policy',
    body: `Last updated: ${new Date().toISOString().split('T')[0]}

Quick Basket grocery ("we", "our", "us") values your privacy. This policy explains what data we collect, why we collect it, and how you can manage your information when using our grocery marketplace and related services.

1. Information We Collect
- Account details such as name, email address, mobile number, and delivery addresses.
- Order, cart, and wishlist history including items purchased, saved, or returned.
- Payment identifiers from trusted partners (we never store full card data).
- Device and usage data like app interactions, crash reports, IP address, and location approximations to improve fulfillment.

2. How We Use Your Information
- Process and deliver orders, handle refunds, and support customer inquiries.
- Personalize product recommendations, promotions, and app experience.
- Improve logistics, detect fraud, and ensure service reliability.
- Comply with legal obligations, such as tax and accounting requirements.

3. Sharing Your Information
- Delivery partners, payment gateways, analytics providers, and customer support tools under strict confidentiality agreements.
- Law enforcement or regulators when required by applicable law.
- Never sold to third parties for their independent marketing.

4. Data Retention
- We keep account and transaction data for as long as you maintain an account and for the period required by law (typically 7 years for financial records).
- You may request deletion or anonymization of data not subject to legal retention.

5. Your Controls
- Update profile details in the app or request changes via support.
- Opt out of marketing messages through in-app settings or unsubscribe links.
- Request access to, portability of, or deletion of your data by contacting privacy@quickbasket.com.

6. Security
- Industry-standard encryption in transit and at rest.
- Continuous monitoring, access controls, and periodic security audits.

7. Children
- Services are not directed to individuals under 18. We remove data for minors upon verified request.

8. Changes
- We will notify you of significant updates via email or in-app notification. Continued use constitutes acceptance of the revised policy.

9. Contact
- privacy@quickbasket.com
- Quick Basket Data Protection, 42 Market Street, Bengaluru, India`
  },
  terms_and_conditions: {
    title: 'Terms & Conditions',
    body: `Last updated: ${new Date().toISOString().split('T')[0]}

Welcome to Quick Basket. By creating an account, placing orders, or otherwise using our grocery marketplace ("Services"), you agree to these Terms & Conditions. Please read them carefully.

1. Eligibility
- You must be at least 18 years old and capable of entering a binding contract.
- You are responsible for keeping your login credentials secure and for all activity on your account.

2. Service Availability
- Product assortment, pricing, and delivery slots vary by location and may change without notice.
- We may suspend or limit Services for maintenance, upgrades, or force majeure events.

3. Orders & Pricing
- Placing an order is an offer to purchase. We accept it when we confirm the order.
- Prices, promotions, and taxes are displayed during checkout and may differ from in-store pricing.
- If an item is unavailable, we may offer a substitute with your consent or issue a refund.

4. Payments & Refunds
- Payments are processed through secure third-party gateways. By submitting payment details, you authorize the transaction amount.
- Refunds for cancellations, returns, or failed deliveries are processed to the original payment method within applicable timelines.

5. Delivery & Returns
- Provide accurate delivery instructions. Missed deliveries due to incorrect information may incur fees.
- Perishable items must be inspected upon delivery. Report issues within 24 hours to request replacement or refund.

6. Acceptable Use
- Do not misuse the Services, interfere with operations, or attempt unauthorized access.
- Automated scraping, data harvesting, or resale of products without consent is prohibited.

7. Intellectual Property
- All content, trademarks, and software used in the Services belong to Quick Basket or its licensors.
- You may not copy, modify, or distribute our content without prior written permission.

8. Account Suspension or Termination
- We may suspend or terminate accounts for suspected fraud, policy violations, or illegal activity.
- You may close your account at any time. Outstanding obligations (payments, disputes) survive termination.

9. Limitation of Liability
- To the maximum extent permitted by law, Quick Basket is not liable for indirect, incidental, or consequential damages arising from your use of the Services.
- Our aggregate liability is limited to the amount you paid for the relevant order.

10. Governing Law & Dispute Resolution
- These terms are governed by the laws of India. Disputes will be subject to the exclusive jurisdiction of courts in Bengaluru, India.

11. Changes to Terms
- We may update these terms periodically. Continued use after notice of changes indicates acceptance.

12. Contact
- support@quickbasket.com
- Quick Basket Customer Care, 42 Market Street, Bengaluru, India`
  }
};

const ensureContent = async (key, fallbackTitle) => {
  let record = await Content.findOne({ key });

  if (!record) {
    const defaults = defaultContent[key] || { title: fallbackTitle, body: `${fallbackTitle} content will be published soon.` };
    record = await Content.create({
      key,
      title: defaults.title,
      body: defaults.body
    });
  }

  return record;
};

const updateContent = async (key, fallbackTitle, payload) => {
  const { title, body } = payload;

  if (!body || typeof body !== 'string' || !body.trim()) {
    return { error: { status: 400, message: 'Body is required to update content' } };
  }

  const update = {
    body: body.trim(),
    title: title?.trim() || defaultContent[key]?.title || fallbackTitle,
    updatedAt: new Date()
  };

  const record = await Content.findOneAndUpdate(
    { key },
    { $set: update },
    { new: true, upsert: true }
  );

  return { record };
};

exports.getPrivacyPolicy = async (req, res) => {
  try {
    const record = await ensureContent('privacy_policy', 'Privacy Policy');
    res.json(record);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch privacy policy' });
  }
};

exports.updatePrivacyPolicy = async (req, res) => {
  try {
    const { record, error } = await updateContent('privacy_policy', 'Privacy Policy', req.body || {});

    if (error) {
      return res.status(error.status).json({ message: error.message });
    }

    res.json({
      message: 'Privacy policy updated successfully',
      content: record
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update privacy policy' });
  }
};

exports.getTermsAndConditions = async (req, res) => {
  try {
    const record = await ensureContent('terms_and_conditions', 'Terms & Conditions');
    res.json(record);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch terms & conditions' });
  }
};

exports.updateTermsAndConditions = async (req, res) => {
  try {
    const { record, error } = await updateContent('terms_and_conditions', 'Terms & Conditions', req.body || {});

    if (error) {
      return res.status(error.status).json({ message: error.message });
    }

    res.json({
      message: 'Terms & conditions updated successfully',
      content: record
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update terms & conditions' });
  }
};
