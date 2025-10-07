'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Box, Heading, Text, Grid, GridItem } from '@chakra-ui/react';

const estadisticas = [
  { valor: '+15', label: 'Años de Experiencia' },
  { valor: '+7', label: 'Especialistas en RRHH' },
  { valor: '3000', label: 'Clientes Felices', animar: true },
  { valor: '100%', label: 'Satisfacción de Clientes' },
];

export default function Nclientes() {
  const [clientesFelices, setClientesFelices] = useState(0);
  const [animating, setAnimating] = useState(false);
  const ref = useRef();
  const hasCountedRef = useRef(false);
  const animationFrame = useRef();

  // Conteo inicial con requestAnimationFrame
  const countTo = (end, duration = 2000) => {
    const start = performance.now();
    const step = (timestamp) => {
      const progress = Math.min((timestamp - start) / duration, 1);
      setClientesFelices(Math.ceil(progress * end));
      if (progress < 1) {
        animationFrame.current = requestAnimationFrame(step);
      } else {
        // Inicia el incremento continuo después del conteo inicial
        startContinuousIncrement();
      }
    };
    animationFrame.current = requestAnimationFrame(step);
  };

  // Incremento continuo simulando nuevos clientes
  const startContinuousIncrement = () => {
    setInterval(() => {
      const randomIncrement = Math.floor(Math.random() * 5) + 1; // +1 a +5
      setAnimating(false); // fade-out
      setTimeout(() => {
        setClientesFelices((prev) => prev + randomIncrement);
        setAnimating(true); // fade-in
      }, 500);
    }, 3000); // cada 3 segundos
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasCountedRef.current) {
          hasCountedRef.current = true;
          countTo(3000, 2000);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);

    return () => {
      if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  return (
    <Box as="section" py={{ base: 12, md: 10 }} bg="white" textAlign="center">
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
        .fade-in { animation: fadeIn 0.5s ease-in-out; }
        .fade-out { animation: fadeOut 0.5s ease-in-out; }
        .shake-animation { animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both; }
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
              <Heading
                as="h2"
                size="2xl"
                color="orange.600"
                mb={2}
                className={stat.animar ? (animating ? 'fade-in shake-animation' : 'fade-out') : ''}
              >
                {stat.animar ? clientesFelices.toLocaleString() : stat.valor}
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
