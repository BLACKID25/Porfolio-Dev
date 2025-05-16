'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { CheckCircle, XCircle, AlertTriangle, Loader2, CreditCard, Banknote } from 'lucide-react';
import  './responseStyle.css';
import Swal from 'sweetalert2';
import axios from 'axios';


const PaymentResponsePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [transactionResult, setTransactionResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  //const [searchParams, setSearchParams] = useState(new URLSearchParams(typeof window !== 'undefined' ? window.location.search : ''));

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
        console.log("metodo de pago seleccionado",result);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Error desconocido al procesar la respuesta.');
        setLoading(false);
      }
    };

    handlePaymentResponse();
  }, [router, searchParams]);

  // Funciones para obtener resultados desde tu backend (sin cambios)
  const fetchMercadoPagoResponse = async (preapprovalId) => { 
     try {
      const response = await axios.get(`/api/confirm-subscription?preapproval_id=${preapprovalId}`);
      const data = response.data;
      data.paymentMethod = 'Mercado Pago';
      return data;
    } catch (err) {
      console.error('Error al obtener respuesta de Mercado Pago:', err);
      setError('Error al verificar el resultado del pago de Mercado Pago.');
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al verificar el estado del pago de Mercado Pago.',
      });
      throw err;
    }
  };

 const fetchTransbankResponse = async (token_ws) => {
    console.log("token_ws", token_ws)
    try {
      const response = await axios.get(`/api/webpayplus/result?token_ws=${token_ws}`);
      const data = response.data;
      data.paymentMethod = 'Transbank';
      return data;
    } catch (err) {
      console.error('Error al obtener el resultado de Transbank:', err);
      setError('Error al verificar el resultado del pago de Transbank.');
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al verificar el estado del pago de Transbank.',
      });
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
      setError('Error al verificar el resultado del pago de PayPal.');
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al verificar el estado del pago de PayPal.',
      });
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
  } else if (transactionResult?.status === 'AUTHORIZED') {
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
      paymentMethodIcon = <CreditCard className="w-6 h-6 mr-2 text-yellow-400" />;
      break;
    case 'Transbank':
      paymentMethodIcon = <Banknote className="w-6 h-6 mr-2 text-blue-600" />;
      break;
    case 'PayPal':
      paymentMethodIcon = (
        <Image
          src="/paypal.svg"
          alt="PayPal"
          width={24}
          height={24}
          className="mr-2"
        />
      );
      break;
    default:
      paymentMethodIcon = null;
  }

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
            Método de Pago: {transactionResult.paymentMethod}
          </p>
        </div>
      )}
    </div>

    {transactionResult && (
    <div className="detailsContainer">
        <h3 className="detailsTitle">Detalles de la Transacción</h3>

        {transactionResult.paymentMethod === 'Mercado Pago' && (
        <>
            <p className="detailItem">Preapproval ID: {transactionResult.preapprovalId}</p>
            <p className="detailItem">Email del Pagador: {transactionResult.payer_email}</p>
        </>
        )}

        {transactionResult.paymentMethod === 'Transbank' && (
        <>
            {transactionResult.buy_order && <p className="detailItem">Número de Orden: {transactionResult.buy_order}</p>}
            {transactionResult.authorization_code && <p className="detailItem">Código de Autorización: {transactionResult.authorization_code}</p>}
            {transactionResult.amount && <p className="detailItem">Monto: ${transactionResult.amount}</p>}
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
      <button onClick={() => router.push('/')} className="buttonpayment">
        Volver al Inicio
      </button>
    </div>
  </div>
</div>
  );
};


// tengo que redirigir a los datos del cliente con el username guardado en el localstorage
export default PaymentResponsePage;