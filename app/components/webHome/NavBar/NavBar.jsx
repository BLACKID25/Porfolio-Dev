'use client';

import React from 'react';
import Link from 'next/link';
import {
  Flex,
  Box,
  Heading,
  Text,
  Stack,
  IconButton,
  Icon,
} from '@chakra-ui/react';
import {
  MdHome,
  MdWork,
  MdEditSquare,
  MdInfo,
  MdContactMail,
} from 'react-icons/md'; // Importa los iconos
// ¡Ya no necesitamos este archivo de CSS!
// import './NavBar.css';

export default function NavBar() {
  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      padding={4}
      bg="gray.50"
      color="black"
      boxShadow="sm"
      borderBottom="1px"
      borderColor="gray.200"
    >
      <Box className="nav-container">
        <Flex
          as="ul"
          align="center"
          listStyleType="none"
          m={0}
          p={0}
          gap={6}
        >
          <Stack direction="row" spacing={4} align="center">
            {/* Home */}
            <Box as="li">
              <Link href="/">
                <Flex align="center" gap={2}>
                  {/* <Icon as={MdHome} w={6} h={6} /> */}
                  <Text> 🏠 Home</Text>
                </Flex>
              </Link>
            </Box>
            {/* Profesionales */}
            <Box as="li">
              <Link href="/Profesional">
                <Flex align="center" gap={2}>
                  {/* <Icon as={MdWork} w={6} h={6} /> */}
                  <Text> 💼 Profesionales</Text>
                </Flex>
              </Link>
            </Box>
            {/* Planes */}
            <Box as="li">
              <Link href="/Planes">
                <Flex align="center" gap={2}>
                  {/* <Icon as={MdEditSquare} w={6} h={6} /> */}
                  <Text> 📋 Planes</Text>
                </Flex>
              </Link>
            </Box>
            {/* Quienes Somos */}
            <Box as="li">
              <Link href="/Planes">
                <Flex align="center" gap={2}>
                  {/* <Icon as={MdInfo} w={6} h={6} /> */}
                  <Text> 📜 Quiénes Somos</Text>
                </Flex>
              </Link>
            </Box>
            {/* Contacto */}
            <Box as="li">
              <Link href="#">
                <Flex align="center" gap={2}>
                  {/* <Icon as={MdContactMail} w={6} h={6} /> */}
                  <Text> 📬 Contacto</Text>
                </Flex>
              </Link>
            </Box>
          </Stack>
        </Flex>
      </Box>
      <IconButton
        aria-label="Toggle navigation"
        icon={<div>☰</div>}
        variant="ghost"
        display={{ base: 'block', md: 'none' }}
      />
    </Flex>
  );
}