import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

const client = accountSid && authToken ? twilio(accountSid, authToken) : null;

export async function sendSMS(to: string, message: string) {
  if (!client || !twilioPhone) {
    console.error("Twilio not configured");
    return { success: false, error: "Twilio not configured" };
  }

  try {
    const result = await client.messages.create({
      body: message,
      from: twilioPhone,
      to: to,
    });
    return { success: true, sid: result.sid };
  } catch (error) {
    console.error("SMS error:", error);
    return { success: false, error };
  }
}

export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 10) {
    return `+1${cleaned}`;
  }
  if (cleaned.length === 11 && cleaned.startsWith("1")) {
    return `+${cleaned}`;
  }
  if (!phone.startsWith("+")) {
    return `+${cleaned}`;
  }
  return phone;
}

export const defaultReviewRequestMessage = 
  "Hi {name}! Thanks for choosing us. We'd love a quick review: {link}. It only takes 30 seconds and helps us improve!";