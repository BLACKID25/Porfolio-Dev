// /app/response/page.js

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { CheckCircle, XCircle, AlertTriangle, Loader2 } from 'lucide-react';
import './responseStyle.css';
import Swal from 'sweetalert2';
import axios from 'axios';

const PaymentResponsePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [transactionResult, setTransactionResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (typeof window === 'undefined') {
      setLoading(false);
      setError("Esta página requiere JavaScript y un navegador.");
      return;
    }
    const handlePaymentResponse = async () => {
      try {
        let result;
        if (searchParams.get('preapproval_id')) {
          result = await fetchMercadoPagoResponse(searchParams.get('preapproval_id'));
        } else if (searchParams.get('token_ws')) {
          result = await fetchTransbankResponse(searchParams.get('token_ws'));
        } else if (searchParams.get('paymentId')) {
          result = await fetchPaypalResponse(searchParams.get('paymentId'));
        } else {
          setError('No se detectó información de pago.');
          setLoading(false);
          return;
        }

        setTransactionResult(result);
        setLoading(false);

        // Mostrar SweetAlert solo si el pago fue aprobado, sin redirección automática
        if (result?.status === 'AUTHORIZED' || result?.status === 'authorized' || result?.status === 'approved') {
          Swal.fire({
            icon: 'success',
            title: '¡Pago Aprobado!',
            text: 'Tu transacción ha sido completada con éxito.',
            showConfirmButton: true, // Deja el botón de confirmación por defecto
          });
        } else {
          // Si el pago no fue aprobado, muestra un mensaje de error genérico
          Swal.fire({
            icon: 'error',
            title: 'Transacción Rechazada',
            text: 'Tu pago no pudo ser procesado. Por favor, inténtalo de nuevo.',
            showConfirmButton: true,
          });
        }

      } catch (err) {
        setError(err.message || 'Error desconocido al procesar la respuesta.');
        setLoading(false);
        Swal.fire({ // Asegura que el SweetAlert de error se muestre también aquí
          icon: 'error',
          title: 'Error',
          text: err.message || 'Hubo un problema al verificar el estado del pago.',
        });
      }
    };

    handlePaymentResponse();
  }, [router, searchParams]);

  // Funciones para obtener resultados desde tu backend (sin cambios relevantes)
  const fetchMercadoPagoResponse = async (preapprovalId) => {
    try {
      const response = await axios.get(`/api/mercadopago/confirm-subscription?preapproval_id=${preapprovalId}`);
      const data = response.data;
      data.paymentMethod = 'Mercado Pago';
      return data;
    } catch (err) {
      console.error('Error al obtener respuesta de Mercado Pago:', err);
      throw err;
    }
  };

  const fetchTransbankResponse = async (token_ws) => {
    try {
      const response = await axios.get(`/api/webpayplus/result?token_ws=${token_ws}`);
      const data = response.data;
      data.paymentMethod = 'Transbank';
      return data;
    } catch (err) {
      console.error('Error al obtener el resultado de Transbank:', err);
      throw err;
    }
  };

  const fetchPaypalResponse = async (paymentId) => {
    try {
      const response = await axios.get(`/api/paypal/response?paymentId=${paymentId}`);
      const data = response.data;
      data.paymentMethod = 'PayPal';
      return data;
    } catch (err) {
      console.error('Error al obtener respuesta de PayPal:', err);
      throw err;
    }
  };

  // Determinar ícono y mensaje principal según el resultado
  let icon, mainMessage, textColorClass;
  if (loading) {
    icon = <Loader2 className="animate-spin h-10 w-10 text-blue-500" />;
    mainMessage = 'Verificando transacción...';
    textColorClass = 'text-gray-900';
  } else if (error) {
    icon = <AlertTriangle className="h-10 w-10 text-red-500" />;
    mainMessage = error;
    textColorClass = 'text-red-500';
  } else if (transactionResult?.status === 'AUTHORIZED' || transactionResult?.status === 'authorized' || transactionResult?.status === 'approved') {
    icon = <CheckCircle className="h-10 w-10 text-green-500" />;
    mainMessage = 'Transacción Aprobada';
    textColorClass = 'text-green-600';
  } else {
    icon = <XCircle className="h-10 w-10 text-red-500" />;
    mainMessage = 'Transacción Rechazada';
    textColorClass = 'text-red-500';
  }

  // Determinar el ícono del método de pago
  let paymentMethodIcon = null;

  switch (transactionResult?.paymentMethod) {
    case 'Mercado Pago':
      paymentMethodIcon = (
        <Image src="/mercado-pago.svg" alt="mercado-pago" width={120} height={120} className="mr-2" />
      );
      break;
    case 'Transbank':
      paymentMethodIcon = (
        <Image src="/webpayplus.png" alt="WebpayPlus" width={120} height={120} className="mr-2" />
      );
      break;
    case 'PayPal':
      paymentMethodIcon = (
        <Image src="/paypal.svg" alt="PayPal" width={120} height={120} className="mr-2" />
      );
      break;
    default:
      paymentMethodIcon = null;
  }

  // Función para manejar el clic del botón
  const handleButtonClick = () => {
    if (transactionResult?.status === 'AUTHORIZED' || transactionResult?.status === 'authorized' || transactionResult?.status === 'approved') {
      // Si el pago fue aprobado y tenemos un username, redirigir al perfil
      if (transactionResult.username) {
        router.push(`/${transactionResult.username}`);
      } else {
        // Si no hay username (por ejemplo, en un escenario de invitado sin perfil), redirigir a inicio
        router.push('/');
        console.warn("Username no disponible para redirigir a perfil. Redirigiendo a la página de inicio.");
      }
    } else {
      // Si el pago fue rechazado o hubo un error, simplemente volver al inicio
      router.push('/');
    }
  };

  return (
    <div className="containerpayment">
      <div className="cardpayment">
        <div className="centerpayment">
          {icon}
          <h2 className={`mainMessage ${textColorClass}`}>
            {mainMessage}
          </h2>
          {transactionResult?.paymentMethod && (
            <div className="paymentMethodContainer">
              {paymentMethodIcon}
              <p className="paymentMethodText">
                {/* Método de Pago Seleccionado */}
              </p>
            </div>
          )}
        </div>

        {transactionResult && (
          <div className="detailsContainer">
            <h3 className="detailsTitle">Detalles de la Transacción</h3>

            {transactionResult.paymentMethod === 'Mercado Pago' && (
              <>
                <p className="detailItem">Número de Orden: {transactionResult.preapprovalId}</p>
                <p className="detailItem">Código de Autorización: {transactionResult.id_recurso}</p>
                <p className="detailItem">Email del Pagador: {transactionResult.payer_email}</p>
                <p className="detailItem">Monto Pagado: $ {transactionResult.transaction_amount}</p>
                <p className="detailItem">Plan Seleccionado: {transactionResult.namePlan}</p>
                <p className="detailItem">Método de Pago: {transactionResult.metodoseleccionado}</p>
                <p className="detailItem">Primeros 6 Dígitos de Tarjeta: {transactionResult.digitcardMP}**-****-****</p>
              </>
            )}

            {transactionResult.paymentMethod === 'Transbank' && (
              <>
                {transactionResult.buy_order && <p className="detailItem">Número de Orden: {transactionResult.buy_order}</p>}
                {transactionResult.authorization_code && <p className="detailItem">Código de Autorización: {transactionResult.authorization_code}</p>}
                {transactionResult.amount && <p className="detailItem">Monto Pagado: ${transactionResult.amount}</p>}
                {transactionResult.planName && <p className="detailItem">Plan: {transactionResult.planName}</p>}
                {transactionResult.card_detail?.card_number && (
                  <p className="detailItem">Tarjeta terminada en: ****-****-****-{transactionResult.card_detail.card_number}</p>
                )}
                {transactionResult.transaction_date && (
                  <p className="detailItem">Fecha de Transacción: {new Date(transactionResult.transaction_date).toLocaleDateString()}</p>
                )}
                {transactionResult.expiryDate && (
                  <p className="detailItem">
                    Fecha de Caducidad del Plan: {new Date(transactionResult.expiryDate).toLocaleString()}
                  </p>
                )}
                {transactionResult.installments_number > 0 && transactionResult.installments_amount > 0 ? (
                  <>
                    <p className="detailItem">Número de Cuotas: {transactionResult.installments_number}</p>
                    <p className="detailItem">Monto por Cuota: ${transactionResult.installments_amount}</p>
                  </>
                ) : (
                  transactionResult.installments_number === 0 && <p className="detailItem">Pago en una cuota $0</p>
                )}
                {transactionResult.installments && (
                  <div>
                    <p className="detailItem">Cuotas: {transactionResult.installments.length}</p>
                    {transactionResult.installments.map((installment, index) => (
                      <p key={index} className="detailItem">
                        Cuota {index + 1}: ${installment.amount}
                      </p>
                    ))}
                  </div>
                )}
              </>
            )}

            {transactionResult.paymentMethod === 'PayPal' && (
              <p className="detailItem">Email del Pagador: {transactionResult.payer_email}</p>
            )}

            {transactionResult.message && <p className="errorMessage">{transactionResult.message}</p>}
          </div>
        )}

        <div className="buttonContainerpayment">
          <button
            onClick={handleButtonClick} // Cambiamos el onClick para usar la nueva función
            className="buttonpayment"
          >
            {transactionResult?.status === 'AUTHORIZED' || transactionResult?.status === 'authorized' || transactionResult?.status === 'approved'
              ? 'Ver Mi Portafolio' // Texto del botón si la transacción es aprobada
              : 'Volver al Inicio'} {/* Texto del botón si la transacción es rechazada/error */}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentResponsePage;