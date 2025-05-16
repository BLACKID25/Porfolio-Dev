//CREARE EL HANDLE DE MERCADOPAGO
import axios from "axios";

export const handleMercadopago = async (email, plan) => {

    console.log(email, plan)
    if (!email || !plan) {
        console.error("Email o plan no proporcionados");
        throw new Error("Email o plan no proporcionados");
    }
    try {

        const response = await axios.post("/api/mercadopago", {email, plan})
        const {init_point} = response.data

        if (init_point) {
            window.location.href = init_point; // Redirige al checkout de MercadoPago
          } else {
            console.error('No se recibió un init_point válido');
          }
        
    } catch (error) {
        console.error("Error en el manejo de Mercadopago:", error);
      //  throw new Error("Error en el manejo de Mercadopago");
    }

}