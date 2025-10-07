"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  Box,
  VStack,
  Heading,
  Text,
  Spinner,
  Button,
  Flex,
  Divider,
  Stack,
} from "@chakra-ui/react";
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import Swal from "sweetalert2";
import axios from "axios";

const PaymentResponsePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [transactionResult, setTransactionResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handlePaymentResponse = async () => {
      try {
        let result;
        if (searchParams.get("preapproval_id")) {
          result = await fetchMercadoPagoResponse(searchParams.get("preapproval_id"));
        } else if (searchParams.get("token_ws")) {
          result = await fetchTransbankResponse(searchParams.get("token_ws"));
        } else if (searchParams.get("paymentId")) {
          result = await fetchPaypalResponse(searchParams.get("paymentId"));
        } else {
          setError("No se detectó información de pago.");
          setLoading(false);
          return;
        }

        setTransactionResult(result);
        setLoading(false);

        if (
          result?.status === "AUTHORIZED" ||
          result?.status === "authorized" ||
          result?.status === "approved"
        ) {
          Swal.fire({
            icon: "success",
            title: "¡Pago Aprobado!",
            text: "Tu transacción ha sido completada con éxito.",
            confirmButtonText: "OK",
          });

          // 🔹 Enviar correo de bienvenida (sin bloquear la UI)
          if (result.username && result.payer_email) {
            const profileURL =
              process.env.NEXT_PUBLIC_BASE_URL ||
              `http://localhost:3000/${result.username}`;
            axios
              .post("/api/sendwelcomemail", {
                email: result.payer_email,
                username: result.username,
                profileURL,
              })
              .then(() => console.log("Correo de bienvenida enviado correctamente a ", result.payer_email))
              .catch((err) =>
                console.error("Error enviando correo de bienvenida:", err)
              );
          }
        } else {
          Swal.fire({
            icon: "error",
            title: "Transacción Rechazada",
            text: "Tu pago no pudo ser procesado. Por favor, inténtalo de nuevo.",
          });
        }
      } catch (err) {
        setError(err.message || "Error al procesar la respuesta.");
        setLoading(false);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: err.message || "Hubo un problema al verificar el estado del pago.",
        });
      }
    };

    handlePaymentResponse();
  }, [searchParams]);

  // Fetchers
  const fetchMercadoPagoResponse = async (preapprovalId) => {
    const { data } = await axios.get(
      `/api/mercadopago/confirm-subscription?preapproval_id=${preapprovalId}`
    );
    data.paymentMethod = "Mercado Pago";
    return data;
  };

  const fetchTransbankResponse = async (token_ws) => {
    const { data } = await axios.get(`/api/webpayplus/result?token_ws=${token_ws}`);
    data.paymentMethod = "Transbank";
    return data;
  };

  const fetchPaypalResponse = async (paymentId) => {
    const { data } = await axios.get(`/api/paypal/response?paymentId=${paymentId}`);
    data.paymentMethod = "PayPal";
    return data;
  };

  // Icono principal
  let icon, mainMessage, color;
  if (loading) {
    icon = <Spinner size="xl" color="blue.500" />;
    mainMessage = "Verificando transacción...";
    color = "gray.700";
  } else if (error) {
    icon = <AlertTriangle size={60} color="red" />;
    mainMessage = error;
    color = "red.500";
  } else if (
    transactionResult?.status === "AUTHORIZED" ||
    transactionResult?.status === "authorized" ||
    transactionResult?.status === "approved"
  ) {
    icon = <CheckCircle size={60} color="green" />;
    mainMessage = "Transacción Aprobada";
    color = "green.500";
  } else {
    icon = <XCircle size={60} color="red" />;
    mainMessage = "Transacción Rechazada";
    color = "red.500";
  }

  // Redirección
  const handleButtonClick = () => {
    if (
      transactionResult?.status === "AUTHORIZED" ||
      transactionResult?.status === "authorized" ||
      transactionResult?.status === "approved"
    ) {
      if (transactionResult.username) {
        router.push(`/${transactionResult.username}`);
      } else {
        router.push("/");
      }
    } else {
      router.push("/");
    }
  };

  return (
    <Flex minH="100vh" align="center" justify="center" bg="gray.50" p={6}>
      <Box
        w="full"
        maxW="lg"
        bg="white"
        shadow="xl"
        rounded="2xl"
        p={8}
        textAlign="center"
      >
        <VStack spacing={4}>
          {icon}
          <Heading size="md" color={color}>
            {mainMessage}
          </Heading>

          {transactionResult?.paymentMethod && (
            <Flex align="center" justify="center" gap={2}>
              {transactionResult.paymentMethod === "Mercado Pago" && (
                <Image
                  src="/mercado-pago.svg"
                  alt="Mercado Pago"
                  width={100}
                  height={100}
                  style={{ height: "auto" }}
                />
              )}
              {transactionResult.paymentMethod === "Transbank" && (
                <Image
                  src="/webpayplus.png"
                  alt="Transbank"
                  width={100}
                  height={100}
                  style={{ height: "auto" }}
                />
              )}
              {transactionResult.paymentMethod === "PayPal" && (
                <Image
                  src="/paypal.svg"
                  alt="PayPal"
                  width={100}
                  height={100}
                  style={{ height: "auto" }}
                />
              )}
            </Flex>
          )}

          {transactionResult && (
            <Box w="full" textAlign="left" mt={4}>
              <Heading size="sm" mb={2}>
                Detalles de la Transacción
              </Heading>
              <Divider mb={2} />

              {transactionResult.paymentMethod === "Mercado Pago" && (
                <Stack spacing={1} fontSize="sm">
                  <Text>Número de Orden: {transactionResult.preapprovalId}</Text>
                  <Text>Email: {transactionResult.payer_email}</Text>
                  <Text>Monto: ${transactionResult.transaction_amount}</Text>
                  <Text>Plan: {transactionResult.namePlan}</Text>
                </Stack>
              )}

              {transactionResult.paymentMethod === "Transbank" && (
                <Stack spacing={1} fontSize="sm">
                  <Text>Número de Orden: {transactionResult.buy_order}</Text>
                  <Text>Código de Autorización: {transactionResult.authorization_code}</Text>
                  <Text>Monto: ${transactionResult.amount}</Text>
                  <Text>Plan: {transactionResult.namePlan}</Text>
                </Stack>
              )}

              {transactionResult.paymentMethod === "PayPal" && (
                <Stack spacing={1} fontSize="sm">
                  <Text>Email: {transactionResult.payer_email}</Text>
                </Stack>
              )}
            </Box>
          )}

          <Button mt={6} colorScheme="blue" w="full" onClick={handleButtonClick}>
            {transactionResult?.status === "AUTHORIZED" ||
            transactionResult?.status === "authorized" ||
            transactionResult?.status === "approved"
              ? "Ver Mi Portafolio"
              : "Volver al Inicio"}
          </Button>
        </VStack>
      </Box>
    </Flex>
  );
};

export default PaymentResponsePage;
