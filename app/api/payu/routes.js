import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req) {
  // Verificar si el cuerpo contiene los datos esperados
  const { email, amount } = await req.json(); 

  if (!email || !amount) {
    return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
  }

  const form = new URLSearchParams();
  form.append("merchantId", process.env.PAYU_MERCHANT_ID);
  form.append("accountId", process.env.PAYU_ACCOUNT_ID);
  form.append("description", "Pago desde El Biguá");
  form.append("referenceCode", `ref-${Date.now()}`);
  form.append("amount", amount);
  form.append("tax", "0");
  form.append("taxReturnBase", "0");
  form.append("currency", "CLP");
  form.append("buyerEmail", email);
  form.append("signature", generateSignature({
    refCode: `ref-${Date.now()}`,
    amount,
    currency: "CLP"
  }));
  form.append("test", "1"); // 1 = Sandbox
  form.append("responseUrl", "http://localhost:3000/respuesta");
  form.append("confirmationUrl", "http://localhost:3000/api/payu/confirmacion");

  const redirectUrl = `https://sandbox.checkout.payulatam.com/ppp-web-gateway/?${form.toString()}`;
  
  return NextResponse.json({ redirectUrl });
}

function generateSignature({ refCode, amount, currency }) {
  const signatureString = `${process.env.PAYU_API_KEY}~${process.env.PAYU_MERCHANT_ID}~${refCode}~${amount}~${currency}`;
  return crypto.createHash("md5").update(signatureString).digest("hex");
}
