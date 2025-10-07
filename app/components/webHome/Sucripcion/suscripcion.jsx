'use client';

import { Box, Container, Heading, Text, Button, VStack } from '@chakra-ui/react';
import Link from 'next/link';

export function Suscripcion() {
  return (
    <Box
      as="section"
      w="100%"
      py={20}
      bgGradient="linear(to-r, blue.400, blue.600)"
      color="white"
      textAlign="center"
      shadow="2xl"
    >
      <Container maxW="container.xl">
        <VStack spacing={8}>
          <Heading as="h2" size="2xl" fontWeight="extrabold" lineHeight="shorter">
            Potencia tu carrera y destaca tu talento
          </Heading>

          <Text fontSize="xl" maxW="3xl">
            Somos una comunidad inclusiva, abierta y con visión, con la cual podrás potenciarte como profesional, potenciar tu marca personal y hacer crecer tu negocio.  
           Únete a nuestra comunidad y potencia tu portafolio con una URL personalizada y asesoría especializada en Reclutamiento y RRHH. Todo a un <strong>bajo costo</strong>.
          </Text>

          <Link href="/Planes" passHref>
            <Button
              
              size="lg"
              px={10}
              py={6}
              colorScheme="yellow"
              rounded="full"
              fontSize="lg"
              shadow="lg"
              _hover={{ transform: 'scale(1.05)', shadow: 'xl' }}
              transition="all 0.3s ease-in-out"
            >
              🚀 ACCEDE A TU PLAN AQUÍ
            </Button>
          </Link>
        </VStack>
      </Container>
    </Box>
  );
}
