import axios from 'axios';
import Swal from 'sweetalert2';


export const handleWebpayPlus = async (email, plan) => {

    try {
       
      if (!plan) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo determinar el plan seleccionado.',
        });
        return;
      }

      const response = await axios.post('/api/webpayplus/create', { plan: plan });
       
      const { token, url } = response.data;

      const form = document.createElement('form');
      form.method = 'POST';
      form.action = url;

      const tokenInput = document.createElement('input');
      tokenInput.type = 'hidden';
      tokenInput.name = 'token_ws';
      tokenInput.value = token;
      form.appendChild(tokenInput);

      document.body.appendChild(form);
      form.submit();
    } catch (error) {
      console.error('Error al iniciar el pago con Webpay Plus:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error al procesar el pago',
        text: 'Hubo un problema al conectar con Webpay Plus.',
      });
    }
  };