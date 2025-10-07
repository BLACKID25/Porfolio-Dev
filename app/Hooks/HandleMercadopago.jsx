// app/Hooks/HandleMercadopago.jsx

import React, { useState, useEffect } from 'react'; // Importa useEffect
import { Button, Image } from "@chakra-ui/react";
import axios from 'axios';
import Swal from 'sweetalert2';

const HandleMercadopago = ({ initialEmail, plan, username }) => {

  
  // Estado para manejar el email, inicializado con la prop initialEmail
  const [paymentEmail, setPaymentEmail] = useState(initialEmail);
  // Estado para controlar si el pago ya se intentó para evitar bucles
  const [paymentAttempted, setPaymentAttempted] = useState(false);
  
  // useEffect para reaccionar cuando paymentEmail cambia (después de que el usuario lo introduce en Swal)
  useEffect(() => {
    // Solo si paymentEmail ha cambiado desde initialEmail y no es la primera carga
    // y si ya se intentó un pago (para evitar que se ejecute en la carga inicial)
    if (paymentEmail !== initialEmail && paymentAttempted) {
      console.log("DEBUG: paymentEmail changed, re-attempting payment...");
      // Llama a la función de pago. No necesitamos pasar los parámetros aquí,
      // ya que la función los tomará del estado `paymentEmail`.
      handleMercadopagoClick();
    }
  }, [paymentEmail, initialEmail, paymentAttempted]); // Dependencias del useEffect
  
  const handleMercadopagoClick = async () => {
    console.log("lo que llega del boton del body",initialEmail, plan, username)
    // Si ya se intentó el pago y estamos en un reintento, no lo marcamos de nuevo
    if (!paymentAttempted) {
        setPaymentAttempted(true); // Marca que se ha intentado un pago
    }

    console.log("DEBUG: handleMercadopagoClick function called.");
    console.log("DEBUG: Attempting payment with email:", paymentEmail);
    console.log("DEBUG: Props received:", { initialEmail, plan, username });

    if (!paymentEmail || !plan || !username) {
      console.error("DEBUG: Missing required props for Mercado Pago transaction:", { paymentEmail, plan, username });
      Swal.fire({
        icon: 'error',
        title: 'Error de Datos',
        text: 'Faltan datos esenciales (email, plan o usuario) para procesar el pago. Por favor, recarga la página o contacta a soporte.',
      });
      setPaymentAttempted(false); // Resetear si hay un error de datos
      return;
    }

    try {
      console.log("DEBUG: Posting to /api/mercadopago/createOrder with:", { email: paymentEmail, plan, username });
      const response = await axios.post('/api/mercadopago/createOrder', {
        email: paymentEmail, // Usamos paymentEmail aquí
        plan,
        username,
      });

      const { init_point } = response.data;
      if (init_point) {
        console.log("DEBUG: Received init_point:", init_point);
        window.location.href = init_point; // Redirige al checkout de MercadoPago
      } else {
        console.error("DEBUG: No init_point received from backend for successful response.");
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo obtener la URL de pago de Mercado Pago.',
        });
      }
    } catch (error) {
      console.error("DEBUG: Error caught in HandleMercadopago catch block:", error);

      let errorMessage = 'Ocurrió un error inesperado al procesar tu pago. Por favor, inténtalo de nuevo.';
      let errorTitle = 'Error de Pago';
      let errorIcon = 'error';
      let shouldPromptForNewEmail = false;

      if (axios.isAxiosError(error) && error.response) {
        console.error("DEBUG: Axios error response status:", error.response.status);
        console.error("DEBUG: Axios error response data:", error.response.data);

        if (error.response.status === 400) {
          errorMessage = error.response.data.error || errorMessage;
          errorTitle = 'Problema con la Suscripción';
          errorIcon = 'warning';

          if (error.response.data.code === 'INVALID_MP_USER') {
            shouldPromptForNewEmail = true;
          }
        } else if (error.response.status === 500) {
          errorMessage = error.response.data.error || 'Error interno del servidor. Por favor, inténtalo más tarde.';
          errorTitle = 'Error del Servidor';
          errorIcon = 'error';
        }
      } else {
        console.error("DEBUG: Error is not an AxiosError or has no response:", error);
        errorMessage = error.message || 'Error de red o desconocido. Por favor, verifica tu conexión.';
        errorTitle = 'Error de Conexión';
        errorIcon = 'error';
      }

      if (shouldPromptForNewEmail) {
        Swal.fire({
          icon: errorIcon,
          title: errorTitle,
          text: errorMessage + " Por favor, introduce el correo electrónico asociado a tu cuenta de Mercado Pago:",
          input: 'email',
          inputPlaceholder: 'tu_cuenta_mp@ejemplo.com',
          showCancelButton: true,
          confirmButtonText: 'Reintentar Pago',
          cancelButtonText: 'Cancelar',
          inputValidator: (value) => {
            if (!value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
              return 'Necesitas introducir un correo electrónico válido.';
            }
          }
        }).then((result) => {
          if (result.isConfirmed) {
            setPaymentEmail(result.value); // Actualiza el estado, lo que disparará el useEffect
            // No llamar handleMercadopagoClick() directamente aquí
          } else {
            setPaymentAttempted(false); // Si el usuario cancela, reseteamos el intento
          }
        });
      } else {
        Swal.fire({
          icon: errorIcon,
          title: errorTitle,
          text: errorMessage,
        });
        setPaymentAttempted(false); // Resetear si no se reintenta
      }
    }
  };

  return (
    <Button
      onClick={handleMercadopagoClick}
      leftIcon={
        <Image
          src="/mercado-pago.svg" // 👈 logo dentro de /public
          alt="MercadoPago"
          boxSize="100px" // Ajusta tamaño
          objectFit="contain"
        />
      }
      colorScheme="blue"
      variant="outline"
      w="full"
      size="lg"
      _hover={{ bg: "blue.50" }}
    >
      
    </Button>
  );
};

export default HandleMercadopago;