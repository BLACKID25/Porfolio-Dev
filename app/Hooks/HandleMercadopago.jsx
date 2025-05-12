//CREARE EL HANDLE DE MERCADOPAGO
import axios from "axios";

export const handleMercadopago = async (email, plan) => {
    try {

      const body = req.json(); // Asegúrate de que el cuerpo de la solicitud contenga el email y el plan
      console.log("cuerpo que recibe el handleWebpayPlus", body)

        const response = await axios.post("/api/mercadopago", {email, plan})
        const {init_point} = response.data

        if (init_point) {
            window.location.href = init_point; // Redirige al checkout de MercadoPago
          } else {
            console.error('No se recibió un init_point válido');
          }
        
    } catch (error) {
        console.error("Error en el manejo de Mercadopago:", error);
        throw new Error("Error en el manejo de Mercadopago");
    }

}