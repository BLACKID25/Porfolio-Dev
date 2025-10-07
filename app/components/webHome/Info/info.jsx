'use client';

import { Box, Container, Heading, Text, SimpleGrid, Icon } from '@chakra-ui/react';
import { itemsData } from "../../../hooks/Banner.info";

export function Info() {
  return (
    <Box 
      bgGradient="linear(to-b, #d5ebf7ff, #FFFFFF)" 
      w="100%"
    >
      <Container 
        centerContent 
        maxW="container.xl" 
        py={20} 
        px={4} 
        bg="transparent"
      >
       {/* Título y subtítulo */}
        <Box textAlign="center" mb={10} display="flex" flexDirection="column" alignItems="center">
          <Heading 
            as="h2" 
            size={{ base: "xl", md: "2xl" }} 
            mb={4} 
            color="gray.800"
            textAlign="center"
          >
            ¿CÓMO FUNCIONA NUESTRA PLATAFORMA?
          </Heading>
          
          <Text 
            fontSize={{ base: "md", md: "lg" }} 
            color="gray.600" 
            maxW={{ base: "90%", md: "3xl" }}  // más responsivo
            textAlign="center"
          >
            Tú nos entregas una imagen o tu idea de Portafolio, la adaptamos y te
            otorgamos una URL Profesional por un Bajo Costo, activa las 24 horas del día
            y los 365 días del año y mucho más.
          </Text>
        </Box>


        {/* Tarjetas */}
        <SimpleGrid 
          columns={{ base: 1, md: 2, lg: 3 }} 
          spacing={10}
          w="100%"
        >
          {itemsData.map((item, index) => (
            <Box
              key={index}
              bg="rgba(255, 255, 255, 0.7)" // efecto translúcido
              backdropFilter="blur(12px)" // desenfoque de fondo
              borderRadius="xl"
              boxShadow="lg"
              p={8}
              textAlign="center"
              transition="all 0.3s ease"
              _hover={{
                transform: "translateY(-8px)",
                boxShadow: "2xl",
              }}
            >
              <Box fontSize="3xl" color="blue.500" mb={4}>
                <Icon as={item.icon} />
              </Box>
              <Heading as="h3" size="md" mb={2} color="gray.700">
                {item.title}
              </Heading>
              <Text color="gray.600">{item.description}</Text>
            </Box>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
}
