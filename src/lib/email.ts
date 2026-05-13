import { Resend } from "resend";

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

export async function sendReviewEmail(
  to: string,
  customerName: string,
  businessName: string,
  reviewLink: string
) {
  const resend = getResend();
  if (!resend) {
    console.error("Resend API key not configured");
    return { success: false, error: "Email not configured" };
  }

  const fromEmail = process.env.RESEND_FROM_EMAIL || "reviews@reviewflow.app";

  try {
    const { error } = await resend.emails.send({
      from: `${businessName} <${fromEmail}>`,
      to,
      subject: `How was your experience with ${businessName}?`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; padding: 30px 0;">
            <h1 style="color: #1e293b; font-size: 24px;">Hi ${customerName},</h1>
            <p style="color: #64748b; font-size: 16px; line-height: 1.5;">
              Thanks for choosing <strong>${businessName}</strong>! We'd love to hear about your experience.
            </p>
            <p style="color: #64748b; font-size: 16px; line-height: 1.5;">
              Your feedback helps us improve and helps other customers make informed decisions.
            </p>
            <div style="margin: 30px 0;">
              <a href="${reviewLink}" 
                 style="background: #6366f1; color: white; padding: 14px 32px; border-radius: 8px; 
                        text-decoration: none; font-size: 16px; font-weight: 600; display: inline-block;">
                Leave a Review
              </a>
            </div>
            <p style="color: #94a3b8; font-size: 14px;">It only takes 10 seconds!</p>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
            <p style="color: #94a3b8; font-size: 12px;">
              You received this email because ${businessName} requested your feedback.
            </p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Email error:", error);
      return { success: false, error };
    }

    return { success: true };
  } catch (err) {
    console.error("Email error:", err);
    return { success: false, error: err };
  }
}