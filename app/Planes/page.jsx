'use client';

import React from "react";
import { useRouter } from 'next/navigation';
import { Box, Container, Heading, SimpleGrid, Card, CardHeader, CardBody, Text, Button, Badge, List, ListItem, ListIcon } from '@chakra-ui/react';
import { FaCheck } from "react-icons/fa6";
import Link from "next/link";
import { plans } from "../hooks/Plnaes.info";
import { asesoria } from "../hooks/Asesoria.info";

const PlansPage = () => {
  const router = useRouter();

  const handleSelectPlan = (planName) => {
    router.push(`/createPerfil?plan=${encodeURIComponent(planName)}`);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem("TipoPlan", planName);
    }
  };

  return (
    <Box 
      bgGradient="linear(to-b, #e0f7fa, #ffffff)" 
      minH="100vh"
    >
      <Box p={4} bg="white" shadow="sm">
        <Link href="/">
          <Button colorScheme="blue" variant="outline" rounded="full">
            🏠 Inicio
          </Button>
        </Link>
      </Box>

      <Container maxW="container.xl" py={12}>
        <Heading as="h1" size="2xl" textAlign="center" mb={10} color="gray.800" fontWeight="bold">
          Planes de Suscripción
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10}>
          {plans.map((plan, index) => (
            <Card
              key={index}
              shadow={plan.highlighted ? "xl" : "md"}
              border="2px solid"
              borderColor={plan.highlighted ? "blue.500" : "transparent"}
              textAlign="center"
              rounded="lg"
              _hover={{ transform: 'translateY(-5px)', shadow: '2xl' }}
              transition="transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out"
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
            >
              <Box>
                <CardHeader pb={0}>
                  {plan.highlighted && (
                    <Badge colorScheme="blue" rounded="full" px={3} py={1} mb={2}>
                      MÁS POPULAR
                    </Badge>
                  )}
                  <Heading as="h2" size="lg" mb={2} color="gray.700" fontWeight="semibold">{plan.name}</Heading>
                </CardHeader>
                <CardBody pt={0}>
                  <Text fontSize="5xl" fontWeight="bold" color="blue.600" mb={4}>{plan.price}</Text>
                  <List spacing={2} mb={6}>
                    {plan.features.map((feature, i) => (
                      <ListItem key={i}>
                        <ListIcon as={FaCheck} color="green.500" />
                        {feature}
                      </ListItem>
                    ))}
                  </List>
                </CardBody>
              </Box>
              <Box p={6}>
                <Button
                  colorScheme="blue"
                  size="lg"
                  rounded="full"
                  onClick={() => handleSelectPlan(plan.name)}
                  w="100%"
                >
                  Seleccionar Plan
                </Button>
              </Box>
            </Card>
          ))}
        </SimpleGrid>

        <Heading as="h1" size="2xl" textAlign="center" mt={20} mb={10} color="gray.800" fontWeight="bold">
          Planes de Asesorías
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10}>
          {asesoria.map((plan, index) => (
            <Card
              key={index}
              shadow={plan.highlighted ? "xl" : "md"}
              border="2px solid"
              borderColor={plan.highlighted ? "blue.500" : "transparent"}
              textAlign="center"
              rounded="lg"
              _hover={{ transform: 'translateY(-5px)', shadow: '2xl' }}
              transition="transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out"
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
            >
              <Box>
                <CardHeader pb={0}>
                  {plan.highlighted && (
                    <Badge colorScheme="blue" rounded="full" px={3} py={1} mb={2}>
                      MÁS POPULAR
                    </Badge>
                  )}
                  <Heading as="h2" size="lg" mb={2} color="gray.700" fontWeight="semibold">{plan.name}</Heading>
                </CardHeader>
                <CardBody pt={0}>
                  <Text fontSize="5xl" fontWeight="bold" color="blue.600" mb={4}>{plan.price}</Text>
                  <List spacing={2} mb={6}>
                    {plan.features.map((feature, i) => (
                      <ListItem key={i}>
                        <ListIcon as={FaCheck} color="green.500" />
                        {feature}
                      </ListItem>
                    ))}
                  </List>
                </CardBody>
              </Box>
              <Box p={6}>
                <Button
                  colorScheme="blue"
                  size="lg"
                  rounded="full"
                  onClick={() => handleSelectPlan(plan.name)}
                  w="100%"
                >
                  Seleccionar Plan
                </Button>
              </Box>
            </Card>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
};

export default PlansPage;
