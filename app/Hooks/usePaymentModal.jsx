"use client";

import { useState } from "react";
import { 
  useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, 
  ModalBody, ModalFooter, ModalCloseButton, Button, VStack, Box, 
  Text, Divider, Alert, AlertIcon 
} from "@chakra-ui/react";
import HandleMercadopago from "./HandleMercadopago";
import { handleWebpayPlus } from "./HandreWebPayPlus";

export function usePaymentModal() {
  const { isOpen, onOpen, onClose: chakraOnClose } = useDisclosure();

  // ⬇️ Ahora el modal mismo maneja email, orden, mensaje y loading
  const PaymentModal = ({ initialEmail, plan, username, skipOrderCheck = false }) => {
    const [email, setEmail] = useState(initialEmail || "");
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleClose = () => {
      setEmail("");
      setOrder(null);
      setMessage("");
      chakraOnClose();
    };

    const handleSearchOrder = async () => {
      if (!email) return;
      setLoading(true);

      try {
        const res = await fetch(`/api/suscripciones/pendiente?email=${email}`);
        
        if (!res.ok) {
          setMessage("Error al consultar la suscripción.");
          setOrder(null);
          return;
        }

        const data = await res.json();

        if (!data.success) {
          setMessage(data.message || "No hay pagos pendientes con este correo.");
          setOrder(null);
          return;
        }

        setOrder(data.data);
        setMessage("");
      } catch (err) {
        console.error("Error en fetch:", err);
        setMessage("Error al buscar la orden.");
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };

    return (
      <Modal 
        isOpen={isOpen} 
        onClose={handleClose} 
        closeOnOverlayClick={false} 
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Selecciona tu método de pago</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              {/* Caso: buscar email, solo si no viene skipOrderCheck */}
              {!skipOrderCheck && !initialEmail && !order && (
                <>
                  <input
                    type="email"
                    placeholder="Ingresa tu correo"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      padding: "8px",
                      borderRadius: "6px",
                      border: "1px solid #ccc",
                      width: "100%"
                    }}
                  />
                  <Button
                    onClick={handleSearchOrder}
                    isLoading={loading}
                    colorScheme="blue"
                  >
                    Buscar Orden Pendiente
                  </Button>

                  {message && (
                    <Alert status="info" borderRadius="md">
                      <AlertIcon />
                      {message}
                    </Alert>
                  )}
                </>
              )}

              {/* Caso: mostrar datos de la orden pendiente */}
              {order && (
                <Box p={4} borderWidth="1px" borderRadius="lg" bg="gray.50">
                  <Text fontWeight="bold" mb={2}>
                    Orden pendiente encontrada:
                  </Text>
                  <Text><b>Correo:</b> {order.email}</Text>
                  <Text><b>Usuario:</b> {order.username}</Text>
                  <Text><b>Plan:</b> {order.namePlan}</Text>
                  <Text><b>Monto:</b> {order.amount} {order.currency}</Text>
                  <Text>
                    <b>Método seleccionado:</b> {order.metodoseleccionado || "No ha Inciado Pago"}
                  </Text>
                  {order.digitcardTransbank && (
                    <Text>
                      <b>Tarjeta:</b> terminada en {order.digitcardTransbank}
                    </Text>
                  )}
                  <Divider my={2} />
                  <Text fontSize="sm" color="gray.600">
                    Confirma que esta orden corresponde a tu suscripción antes de pagar.
                  </Text>
                </Box>
              )}

              {/* Caso: ya existe el email o se encontró orden pendiente */}
              {(skipOrderCheck || initialEmail || order) && (
                <>
                  <HandleMercadopago
                    initialEmail={initialEmail ?? order?.email}
                    plan={plan ?? order?.namePlan}
                    username={username ?? order?.username}
                  />

                  <Button
                    isDisabled
                    leftIcon={<img src="/paypal.svg" alt="PayPal" style={{ height: "24px" }} />}
                    colorScheme="blue"
                    variant="outline"
                    w="full"
                  />

                  <Button
                    onClick={() =>
                      handleWebpayPlus(
                        initialEmail ?? order?.email ?? "",
                        plan ?? order?.namePlan ?? "",
                        username ?? order?.username ?? ""
                      )
                    }
                    leftIcon={
                      <img src="/webpayplus.png" alt="Webpay Plus" style={{ height: "35px" }} />
                    }
                    colorScheme="purple"
                    variant="outline"
                    w="full"
                  />
                </>
              )}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" onClick={handleClose}>
              Cerrar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  };

  return { isOpen, onOpen, onClose: chakraOnClose, PaymentModal };
}
