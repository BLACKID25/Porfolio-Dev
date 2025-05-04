//CREARE EL HANDLE DE PAYU
import axios from "axios";

export const handlePayu = async (email, plan) => {
    try {

        const response = await axios.post("/api/payu", {email, plan})
        const {init_point} = response.data

        if (data.redirectUrl) {
            window.location.href = data.redirectUrl; // Redirige al checkout de MercadoPago
          } else {
            console.error('Error al iniciar el pago');
          }
        
    } catch (error) {
        console.error("Error en el manejo de PayU:", error);
        throw new Error("Error en el manejo de PayU");
    }

}