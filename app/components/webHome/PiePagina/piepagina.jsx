'use client';

import React from "react";
import Link from "next/link";
import { Box, Container, Heading, Button, Text } from "@chakra-ui/react";
import { FaArrowRight } from 'react-icons/fa';

export function PiePagina() {
  return (
    // Box principal con degradado de fondo (de abajo hacia arriba)
    <Box
      w="100%"
      bgGradient="linear(to-t, #d5ebf7, #FFFFFF)" // degradado de abajo hacia arriba
      pt={16}
      pb={0}
    >
      {/* Sección principal */}
      <Container maxW="container.lg" textAlign="center" py={16}>
        <Heading 
          as="h2" 
          size="xl" 
          mb={6} 
          lineHeight="tall" 
          color="gray.700"
          fontWeight="medium"
        >
          <Text as="span" fontStyle="italic" color="blue.600">
            "Destaca tu talento con una imagen profesional."
          </Text>
          <br />
          Únete a nuestra comunidad y potencia tu portafolio con una{" "}
          <Text as="span" fontWeight="bold">URL personalizada</Text> y asesoría especializada
          en Reclutamiento y RRHH.
          <br />
          ¡Todo a un precio <Text as="span" color="blue.500">accesible</Text>!"
        </Heading>

        <Box mt={8}>
          <Link href="/Planes" passHref>
            <Button
              colorScheme="blue"
              size="lg"
              variant="solid"
              rounded="full"
              rightIcon={<FaArrowRight />}
              boxShadow="lg"
              _hover={{ 
                transform: 'translateY(-3px)', 
                boxShadow: '2xl',
                bg: 'blue.600'
              }}
              transition="all 0.3s ease-in-out"
            >
              ACCEDE A TU PLAN AQUÍ
            </Button>
          </Link>
        </Box>
      </Container>

      {/* Footer */}
      <Box as="footer" py={6} bg="gray.900" color="white" textAlign="center">
        <Container maxW="container.lg">
          <Text fontSize="sm" mb={2}>
            © {new Date().getFullYear()} TODOS LOS DERECHOS RESERVADOS
          </Text>
          <Text fontSize="sm" color="gray.400">
            Hecho con ❤️ por tu equipo
          </Text>
        </Container>
      </Box>
    </Box>
  );
}
