'use client';

// 1 Componente de Banner

import { Box, Container, Heading, Text, Flex, IconButton, Menu, MenuButton, MenuList, MenuItem, Link, Button } from '@chakra-ui/react';
import imagen from '../../../assets/Jpg/Home-banner.jpg';
import { FaHome, FaAddressCard, FaPencilAlt, FaInfoCircle, FaEnvelope, FaBars } from 'react-icons/fa'; // Importa los íconos necesarios
//import NavBar from '../NavBar/NavBar'; // Asegúrate de que esta importación sea correcta
import { usePaymentModal } from "@/app/hooks/usePaymentModal"; // Asegúrate de que esta importación sea correcta
import { useDisclosure } from "@chakra-ui/react";

export function Banner() {

 const { onOpen, PaymentModal, isOpen, onClose } = usePaymentModal();

  return (
    <Box
      as="section"
      position="relative"
      textAlign="center"
      bgImage={imagen.src}
      bgSize="cover"
      bgPos="center"
      minHeight="55vh" // Asegura que el banner ocupe al menos la altura de la ventana
      display="flex"
      flexDirection="column"
    >
      <Flex
        as="nav"
        position="absolute"
        top="0"
        left="0"
        right="0"
        p={4}
        zIndex="2"
        justifyContent="space-between"
        alignItems="center"
      >
       
        {/* Menú para pantallas grandes */}
        <Flex
          as="nav"
          gap={8}
          align="center"
          display={{ base: "none", md: "flex" }} // Oculta en móvil
        >
          <Link href="/Profesional" color="white" _hover={{ textDecoration: 'none', color: 'blue.200' }}>
            <Button variant="link"  leftIcon={<FaAddressCard />} _hover={{ color: 'blue.200' }}>
              Profesionales
            </Button>
          </Link>
          <Link href="/Planes" color="white" _hover={{ textDecoration: 'none', color: 'blue.200' }}>
            <Button variant="link" leftIcon={<FaPencilAlt />} _hover={{ color: 'blue.200' }}>
              Planes
            </Button>
          </Link>
          <Link href="/QuienesSomos" color="white" _hover={{ textDecoration: 'none', color: 'blue.200' }}>
            <Button variant="link" leftIcon={<FaInfoCircle />} _hover={{ color: 'blue.200' }}>
              Quiénes Somos
            </Button>
          </Link>
          <Link href="/Contacto" color="white" _hover={{ textDecoration: 'none', color: 'blue.200' }}>
            <Button variant="link" leftIcon={<FaEnvelope />} _hover={{ color: 'blue.200' }}>
              Contacto
            </Button>
          </Link>
            <Button
              bg="yellow.400"
              color="black"
              _hover={{ bg: "yellow.500" }}
              fontWeight="bold"
              onClick={onOpen} // este onOpen sería del hook del modal de pagos
            >
              Finalizar Pago
            </Button>
            <PaymentModal isOpen={isOpen} onClose={onClose} />
          
        </Flex>

        {/* Menú para pantallas pequeñas */}
        <Box display={{ base: "block", md: "none" }}>
          <Menu>
            <MenuButton
              as={IconButton}
              aria-label="Options"
              icon={<FaBars />}
              variant="outline"
              color="white"
            />
            <MenuList>
              <MenuItem as={Link} href="/Profesional" icon={<FaHome />}>Profesionales</MenuItem>
              <MenuItem as={Link} href="/Planes" icon={<FaPencilAlt />}>Planes</MenuItem>
              <MenuItem as={Link} href="/QuienesSomos" icon={<FaInfoCircle />}>Quiénes Somos</MenuItem>
              <MenuItem as={Link} href="/Contacto" icon={<FaEnvelope />}>Contacto</MenuItem>
              
            </MenuList>
          </Menu>
        </Box>
      </Flex>
      {/* Capa de degradado oscuro */}
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        bg="rgba(0,0,0,0.5)"
        zIndex="1"
      />
      {/* Contenido del banner */}
      <Container
        position="relative"
        zIndex="100"
        color="white"
        maxW="container.lg"
        py={{ base: 20, md: 10 }} // Ajusta el padding para que no se superponga con la navbar
        mt={{ base: 20, md: 20 }}
      >
        <Heading
          textAlign="left" // Centra el texto en todas las pantallas
          as="h1"
          size={{ base: '2xl', md: '3xl' }} // Tamaño de fuente adaptable
          mb={4}
        >
          Lanza tu Portafolio Profesional <br /> con una URL Personalizada
        </Heading>
        <Text
          textAlign="center"
          fontSize={{ base: 'md', md: 'lg' }}
          mb={8}
        >
          Da el siguiente paso en tu carrera digital, alojamos tu portafolio de forma <br />
          exclusiva y sin complicaciones. ¡Haz que tu presencia online se vea increíble y 
          <br /> accesible con una URL profesional, fácil de recordar, sin guiones ni puntos!
        </Text>
      </Container>
    </Box>
  );
}
