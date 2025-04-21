// app/mercadopago/response/page.jsx
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function ResponsePage() {
  const searchParams = useSearchParams();
  const preapprovalId = searchParams.get('preapproval_id');
  const [message, setMessage] = useState('Verificando suscripción...');

  useEffect(() => {
    const confirmSubscription = async () => {
      if (!preapprovalId) return;

      try {
        const res = await fetch(`/api/confirm-subscription?preapproval_id=${preapprovalId}`);
        const data = await res.json();

        if (res.ok) {
          setMessage(`✅ Suscripción confirmada: ${data.payer_email}`);
        } else {
          setMessage(`❌ Error: ${data.message}`);
        }
      } catch (err) {
        setMessage('❌ Error al confirmar la suscripción.');
        console.error(err);
      }
    };

    confirmSubscription();
  }, [preapprovalId]);

  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl font-bold">Suscripción</h1>
      <p className="mt-4">{message}</p>
    </div>
  );
}
