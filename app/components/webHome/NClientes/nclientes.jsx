'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Box, Heading, Text, Grid, GridItem } from '@chakra-ui/react';

// Array de datos para las estadísticas, lo hace más escalable
const estadisticas = [
  { valor: '+15', label: 'Años de Experiencia' },
  { valor: '+7', label: 'Especialistas en RRHH' },
  { valor: '3000', label: 'Clientes Felices', animar: true },
  { valor: '100%', label: 'Satisfacción de Clientes' },
];

export default function Nclientes() {
  const [clientesFelices, setClientesFelices] = useState(0);
  const [isCounting, setIsCounting] = useState(false);
  const ref = useRef();
  const hasCountedRef = useRef(false);

  useEffect(() => {
    let initialInterval;
    let continuousInterval;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasCountedRef.current) {
          hasCountedRef.current = true;
          let start = 0;
          const end = 3000;
          const duration = 2000;
          const increment = end / (duration / 10);

          initialInterval = setInterval(() => {
            start += increment;
            if (start >= end) {
              setClientesFelices(end);
              clearInterval(initialInterval);
              // Start the continuous increment after the initial count is done
              continuousInterval = setInterval(() => {
                setIsCounting(false); // Trigger fade-out
                setTimeout(() => {
                  setClientesFelices((prev) => prev + 1);
                  setIsCounting(true); // Trigger fade-in
                }, 500);
              }, 3000); // Increments every 3 seconds
            } else {
              setClientesFelices(Math.ceil(start));
            }
          }, 10);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
      clearInterval(initialInterval);
      clearInterval(continuousInterval);
    };
  }, []);

  return (
    <Box
      as="section"
      py={{ base: 12, md: 10 }}
      bg="white"
      textAlign="center"
    >
      {/* Estilos para la animación de cambio de número */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeOut {
          from { opacity: 1; transform: translateY(0); }
          to { opacity: 0; transform: translateY(-10px); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          50% { transform: translateX(5px); }
          75% { transform: translateX(-5px); }
        }
        .fade-in {
          animation: fadeIn 0.5s ease-in-out;
        }
        .fade-out {
          animation: fadeOut 0.5s ease-in-out;
        }
        .shake-animation {
          animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }
      `}</style>
      <Heading as="h2" size="xl" mb={{ base: 8, md: 12 }} color="gray.700">
        Logros Alcanzados hasta la fecha
      </Heading>
      <Grid
        templateColumns={{
          base: 'repeat(1, 1fr)',
          md: 'repeat(2, 1fr)',
          lg: 'repeat(4, 1fr)',
        }}
        gap={{ base: 6, md: 8, lg: 10 }}
        maxW="container.xl"
        mx="auto"
        px={{ base: 4, md: 8 }}
      >
        {estadisticas.map((stat, index) => (
          <GridItem key={index}>
            <Box
              bg="white"
              p={{ base: 6, md: 8 }}
              borderRadius="lg"
              boxShadow="xl"
              transition="transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out"
              _hover={{ transform: 'scale(1.05)', boxShadow: '2xl' }}
              ref={stat.animar ? ref : null}
            >
              <Heading as="h2" size="2xl" color="orange.600" mb={2}
                className={stat.animar ? `${isCounting ? 'fade-in' : 'fade-out'}` : ''}
              >
                {stat.animar ? `+${clientesFelices.toLocaleString()}` : stat.valor}
              </Heading>
              <Text fontSize="lg" color="gray.700">
                {stat.label}
              </Text>
            </Box>
          </GridItem>
        ))}
      </Grid>
    </Box>
  );
}
