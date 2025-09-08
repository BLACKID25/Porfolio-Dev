'use client';

import { Box, Container, Heading, Text, SimpleGrid, Icon } from '@chakra-ui/react';
import { itemsData } from "../../../hooks/Banner.info";

export function Info() {
  return (
    <Box 
      bgGradient="linear(to-b, #d5ebf7ff, #FFFFFF)" 
      w="100%"
    >
      {/* Estilos para la animación de borde RGB */}
      <style>{`
        @keyframes rotate {
          100% {
            transform: rotate(1turn);
          }
        }
        .animated-border {
          position: relative;
          z-index: 1;
          background: #fff;
          border-radius: 12px;
          overflow: hidden;
          padding: 3px;
        }
        .animated-border::before {
          content: '';
          position: absolute;
          inset: 0;
          background: conic-gradient(from 180deg at 50% 50%, #E22B2B 0deg, #F9F29A 100deg, #5187ED 200deg, #E22B2B 360deg);
          border-radius: 12px;
          z-index: -1;
          animation: rotate 3s linear infinite;
        }
        .animated-border:hover::before {
          animation-play-state: paused;
        }
        .animated-border .box-content {
          background: white;
          border-radius: 9px;
          height: 100%;
          width: 100%;
          padding: 2.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
      `}</style>
      <Container 
        centerContent 
        maxW="container.xl" 
        py={20} 
        px={4} 
        bg="transparent"
      >
        <Box textAlign="center" mb={10}>
          <Heading as="h2" size={{ base: "xl", md: "2xl" }} mb={4} color="gray.800">
            ¿CÓMO FUNCIONA NUESTRA PLATAFORMA?
          </Heading>
          <Text fontSize={{ base: "md", md: "lg" }} color="gray.600">
            Tú nos entregas una imagen o tu idea de Portafolio, la adaptamos y te
            otorgamos una URL Profesional por un Bajo Costo, activa las 24 horas del día
            y los 365 días del año y mucho más.
          </Text>
        </Box>

        <SimpleGrid 
          columns={{ base: 1, md: 2, lg: 3 }} 
          spacing={10}
          w="100%"
        >
          {itemsData.map((item, index) => (
            <Box
              key={index}
              textAlign="center"
              className="animated-border"
              p={8}
              _hover={{ transform: 'scale(1.05)' }}
              transition="transform 0.3s ease-in-out"
            >
              <Box className="box-content">
                <Box fontSize="3xl" color="blue.500" mb={4}>
                  <Icon as={item.icon} />
                </Box>
                <Heading as="h3" size="md" mb={2} color="gray.700">
                  {item.title}
                </Heading>
                <Text color="gray.600">{item.description}</Text>
              </Box>
            </Box>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
}
