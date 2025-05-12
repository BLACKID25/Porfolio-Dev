// app/pago-resultado/page.js (si estás en la estructura `app`)
"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import Swal from 'sweetalert2';

const PagoResultado = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token_ws = searchParams.get('token_ws');
  const [transactionResult, setTransactionResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (token_ws) {
      const fetchTransactionResult = async () => {
        try {
          const response = await axios.get(`/api/webpayplus/result?token_ws=${token_ws}`);
          setTransactionResult(response.data);
          setLoading(false);
          if (response.data?.status === 'AUTHORIZED') {
            Swal.fire({
              icon: 'success',
              title: 'Pago Exitoso',
              text: 'Tu perfil ha sido activado.',
              confirmButtonText: 'Ir a mi perfil',
            }).then(() => {
              router.push('/mi-perfil');// que me regrese a la pagina de mi perfil ya creado una vez validado el pago 
            });
          } else {
            Swal.fire({
              icon: 'warning',
              title: 'Pago No Autorizado',
              text: 'Tu pago no ha sido aprobado. Por favor, inténtalo de nuevo o utiliza otro método de pago.',
            });
          }
        } catch (err) {
          console.error('Error al obtener el resultado:', err);
          setError('Error al verificar el resultado del pago.');
          setLoading(false);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al verificar el estado del pago.',
          });
        }
      };

      fetchTransactionResult();
    } else {
      setError('Token de transacción no encontrado.');
      setLoading(false);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se encontró la información del pago.',
      });
    }
  }, [token_ws, router]);

  if (loading) {
    return <div>Cargando resultado del pago...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Resultado del Pago</h2>
      {transactionResult && (
        <pre>{JSON.stringify(transactionResult, null, 2)}</pre>
      )}
      {!transactionResult && <p>No se encontró información del pago.</p>}
      <button onClick={() => router.push('/')}>Volver al Inicio</button>
    </div>
  );
};

export default PagoResultado;