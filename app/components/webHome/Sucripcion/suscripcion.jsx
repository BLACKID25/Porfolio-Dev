'use client';

import { Box, Container, Heading, Text, Button } from '@chakra-ui/react';
import Link from 'next/link';

export function Suscripcion() {
  return (
    <Box
      py={12}
      minH="5vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgGradient="linear(to-r, blue.50, blue.100)"
      shadow="xl"
      rounded="2xl"
    >
      <Container maxW="container.lg" textAlign="center" py={2}>
        <Heading as="h2" size="xl" mb={6}>
          "Potencia tu carrera y destaca tu talento. <br /> Únete a nuestra
          comunidad y eleva tu portafolio con una imagen profesional que mereces.{" "}
          <br /> Todo a un bajo Costo $"
        </Heading>
        <Box mt={5}>
          <Link href="/Planes" passHref>
            <Button
              colorScheme="blue"
              size="lg"
              variant="solid"
              rounded="full"
            >
              ACCEDE A TU PLAN AQUÍ 👈
            </Button>
          </Link>
        </Box>
      </Container>
    </Box>
  );
}

 