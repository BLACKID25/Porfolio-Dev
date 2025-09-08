'use client';

import React from "react";
import Link from "next/link";
import { Box, Container, Heading, Button, Text, Icon } from "@chakra-ui/react";
import { FaArrowRight } from 'react-icons/fa';

export function PiePagina() {
  return (
    <Box>
      <Container maxW="container.lg" textAlign="center" py={12}>
        <Heading 
          as="h2" 
          size="xl" 
          mb={6} 
          lineHeight="tall" 
          color="gray.700"
          fontWeight="medium"
        >
          <Text as="span" fontStyle="italic">
            "Destaca tu talento con una imagen profesional.
          </Text>{" "}
          <br />
          Únete a nuestra comunidad y potencia tu portafolio con una URL
          personalizada 
          y asesoría especializada en Reclutamiento y RRHH. <br />
          ¡Todo a un precio
          accesible!"
        </Heading>

        <Box mt={8}>
          <Link href="/Planes" passHref>
            <Button
              colorScheme="blue"
              size="lg"
              variant="solid"
              rounded="full"
              boxShadow="lg"
              _hover={{ 
                transform: 'translateY(-2px)', 
                boxShadow: 'xl',
                bg: 'blue.600'
              }}
              transition="all 0.3s ease-in-out"
            >
              ACCEDE A TU PLAN AQUÍ 👈
              
            </Button>
          </Link>
        </Box>
      </Container>

      {/* Pie de página estilizado con Chakra UI */}
      <Box as="footer" py={6} bg="gray.900" color="white" textAlign="center">
        <Container maxW="container.lg">
          <Text fontSize="sm">
            © {new Date().getFullYear()} TODOS LOS DERECHOS RESERVADOS
          </Text>
        </Container>
      </Box>
    </Box>
  );
}
