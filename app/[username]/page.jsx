"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";

import {
  Box,
  Container,
  Flex,
  Stack,
  Heading,
  Text,
  Avatar,
  IconButton,
  Button,
  HStack,
  VStack,
  Tag,
  SimpleGrid,
  Badge,
  Skeleton,
  useColorModeValue,
  Tooltip,
  Divider,
} from "@chakra-ui/react";

import {
  FaLinkedin,
  FaGithub,
  FaInstagram,
  FaFacebook,
  FaGlobe,
  FaDownload,
  FaExternalLinkAlt,
  FaEnvelope,
} from "react-icons/fa";

export default function Portafolio() {
  const params = useParams();
  const username = params?.username;

  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const userResponse = await axios.get(`/api/perfil/${username}`);
        setUser(userResponse.data.data || null);

        const projectsResponse = await axios.get(`/api/proyect/${username}`);
        setProjects(projectsResponse.data.data || []);
      } catch (error) {
        console.error("Error al obtener datos del usuario o proyectos", error);
        setUser(null);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    if (username) fetchUserData();
  }, [username]);

  return (
    <Box position="relative" minH="100vh" overflow="hidden">
      {/* Fondo futurista */}
      <Box
        position="fixed"
        top="0"
        left="0"
        w="100%"
        h="100%"
        bg="linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)"
        _before={{
          content: '""',
          position: "absolute",
          top: "-20%",
          left: "-20%",
          w: "140%",
          h: "140%",
          bg: "radial-gradient(circle, rgba(0,200,255,0.15), transparent 40%)",
          animation: "pulse 10s infinite alternate",
        }}
        zIndex={-2}
      />

      <Container maxW="7xl" py={{ base: 6, md: 12 }}>
        {/* Breadcrumb / Volver */}
        <HStack spacing={4} mb={6} justify="space-between">
          <Link href="/">
            <Button
              bgGradient="linear(to-r, cyan.400, blue.500)"
              color="white"
              _hover={{ bgGradient: "linear(to-r, blue.600, cyan.500)" }}
              rounded="full"
            >
              🏠 Inicio
            </Button>
          </Link>
          <HStack spacing={2}>
           <Button
                size="sm"
                leftIcon={<FaDownload />}
                as="a"
                href={user?.curriCV ? `${user.curriCV}` : "#"} // Forzar extensión PDF
                download // Forzar descarga
                target="_blank"
                rel="noopener noreferrer"
                bgGradient="linear(to-r, purple.400, pink.500)"
                color="white"
                _hover={{ bgGradient: "linear(to-r, pink.500, purple.500)" }}
                rounded="full"
                isDisabled={!user?.curriCV}
              >
                Descargar CV
            </Button>


            <Button
              size="sm"
              variant="outline"
              leftIcon={<FaExternalLinkAlt />}
              onClick={() => window.print()}
              title="Imprimir portafolio"
              rounded="full"
              borderColor="cyan.400"
              color="cyan.300"
              _hover={{ bg: "cyan.900" }}
            >
              Imprimir
            </Button>
          </HStack>
        </HStack>

        {/* Header principal */}
        <Flex
          direction={{ base: "column", md: "row" }}
          gap={{ base: 6, md: 12 }}
          align="flex-start"
        >
          {/* Columna izquierda */}
          <Box flex="0 0 320px" w={{ base: "full", md: "320px" }}>
            <Box
              bg="rgba(255,255,255,0.08)"
              border="1px solid rgba(255,255,255,0.2)"
              borderRadius="2xl"
              boxShadow="lg"
              backdropFilter="blur(14px)"
              p={6}
            >
              {loading ? (
                <VStack spacing={4}>
                  <Skeleton borderRadius="full" height="120px" width="120px" />
                  <Skeleton height="24px" width="60%" />
                  <Skeleton height="18px" width="40%" />
                  <Skeleton height="14px" width="80%" />
                </VStack>
              ) : (
                <VStack spacing={4} align="center">
                  {/* Avatar con glow */}
                  <Avatar
                    size="2xl"
                    name={user?.name}
                    src={user?.photo || undefined}
                    mb={2}
                    border="4px solid"
                    borderColor="cyan.400"
                    boxShadow="0 0 25px rgba(0,200,255,0.6)"
                  />
                  <Heading as="h1" size="lg" textAlign="center" color="white">
                    {user?.name || "Usuario no encontrado"}
                  </Heading>

                  <Text color="cyan.200" fontWeight="semibold">
                    {user?.Profesion || "Profesión"}
                  </Text>
                   {user?.email && (
                    <HStack spacing={2}>
                      <FaEnvelope color="cyan" />
                      <Text fontSize="sm" color="gray.300">
                        {user.email}
                      </Text>
                    </HStack>
                  )}

                  <HStack spacing={3}>
                    <Badge colorScheme="purple">
                      {user?.country || "—"}
                    </Badge>
                    <Badge colorScheme="green">
                      {user?.ageExpe ? `${user.ageExpe} años` : "—"}
                    </Badge>
                    <Badge colorScheme="blue">
                      Telf: {user?.phone ? `${user.phone}` : "—"}
                    </Badge>
                    
                  </HStack>

                  {/* Skills */}
                  {user?.skills?.length > 0 && (
                    <Box pt={3} w="full">
                      <Text fontSize="sm" fontWeight="bold" mb={2} color="cyan.200">
                        Habilidades
                      </Text>
                      <HStack wrap="wrap" spacing={2}>
                        {user.skills.map((s, i) => (
                          <Tag
                            key={i}
                            size="sm"
                            bg="rgba(0,200,255,0.2)"
                            color="cyan.100"
                            borderRadius="full"
                          >
                            {s}
                          </Tag>
                        ))}
                      </HStack>
                    </Box>
                  )}

                  {/* Socials */}
                  <HStack spacing={3} pt={4}>
                    {user?.UrlLinkedin && (
                      <Tooltip label="LinkedIn">
                        <IconButton
                          as="a"
                          href={user.UrlLinkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="LinkedIn"
                          icon={<FaLinkedin />}
                          colorScheme="linkedin"
                          variant="ghost"
                          size="md"
                        />
                      </Tooltip>
                    )}
                    {user?.Urlgithub && (
                      <Tooltip label="GitHub">
                        <IconButton
                          as="a"
                          href={user.Urlgithub}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="GitHub"
                          icon={<FaGithub />}
                          variant="ghost"
                          size="md"
                          color="white"
                        />
                      </Tooltip>
                    )}
                    {user?.Urlinstagram && (
                      <Tooltip label="Instagram">
                        <IconButton
                          as="a"
                          href={user.Urlinstagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="Instagram"
                          icon={<FaInstagram />}
                          variant="ghost"
                          size="md"
                          color="pink.300"
                        />
                      </Tooltip>
                    )}
                    {user?.Urlfacebook && (
                      <Tooltip label="Facebook">
                        <IconButton
                          as="a"
                          href={user.Urlfacebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="Facebook"
                          icon={<FaFacebook />}
                          variant="ghost"
                          size="md"
                          color="blue.300"
                        />
                      </Tooltip>
                    )}
                  </HStack>
                </VStack>
              )}
            </Box>

            {/* CTA */}
            {!loading && user && (
              <Box mt={4} textAlign="center">
                <Button
                  as="a"
                  href={user?.UrlLinkedin || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  leftIcon={<FaLinkedin />}
                  bgGradient="linear(to-r, cyan.400, blue.500)"
                  color="white"
                  _hover={{ bgGradient: "linear(to-r, blue.600, cyan.500)" }}
                  rounded="full"
                  mb={3}
                  width="100%"
                >
                  Contactar por LinkedIn
                </Button>

                <Button
                  as="a"
                  href={`mailto:${user?.email || ""}`}
                  leftIcon={<FaGlobe />}
                  variant="outline"
                  width="100%"
                  borderColor="cyan.400"
                  color="cyan.300"
                  _hover={{ bg: "cyan.900" }}
                  rounded="full"
                >
                  Enviar email
                </Button>
              </Box>
            )}
          </Box>

          {/* Columna derecha */}
          <Box flex="1">
            <Box
              bg="rgba(255,255,255,0.08)"
              border="1px solid rgba(255,255,255,0.2)"
              borderRadius="2xl"
              boxShadow="lg"
              backdropFilter="blur(14px)"
              p={{ base: 4, md: 6 }}
              mb={6}
            >
              <Heading size="md" mb={2} color="white">
                Sobre mí
              </Heading>
              {loading ? (
                <Stack spacing={2}>
                  <Skeleton height="16px" />
                  <Skeleton height="12px" />
                  <Skeleton height="12px" />
                </Stack>
              ) : (
                <Text color="gray.200" whiteSpace="pre-wrap">
                  {user?.description ||
                    "El profesional no ha agregado una descripción."}
                </Text>
              )}

              <Divider my={4} borderColor="rgba(255,255,255,0.2)" />

              <HStack spacing={4} wrap="wrap">
                <Text fontWeight="bold" color="cyan.200">
                  Stack / Herramientas:
                </Text>
                {user?.skills?.length > 0 ? (
                  user.skills.map((t, i) => (
                    <Tag
                      key={i}
                      size="sm"
                      bg="rgba(128,0,255,0.3)"
                      color="purple.100"
                      borderRadius="full"
                    >
                      {t}
                    </Tag>
                  ))
                ) : (
                  <Text color="gray.500">No definido</Text>
                )}
              </HStack>
            </Box>

            {/* Proyectos */}
            <Heading size="md" mb={4} color="white">
              Últimos proyectos
            </Heading>

            {loading ? (
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <Skeleton height="180px" borderRadius="lg" />
                <Skeleton height="180px" borderRadius="lg" />
              </SimpleGrid>
            ) : projects?.length > 0 ? (
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                {projects.slice(0, 6).map((project, i) => (
                  <Box
                    key={i}
                    bg="rgba(255,255,255,0.08)"
                    border="1px solid rgba(255,255,255,0.2)"
                    borderRadius="lg"
                    overflow="hidden"
                    boxShadow="lg"
                    transition="transform 0.3s"
                    _hover={{
                      transform: "scale(1.04) translateY(-6px)",
                      boxShadow: "0 12px 35px rgba(0,0,0,0.5)",
                    }}
                  >
                    <Box position="relative" h={{ base: "180px", md: "220px" }}>
                      <Image
                        src={project.photoproyect || "/Icono Proyect.jpg"}
                        alt={project.nameproyect || "Proyecto"}
                        fill
                        style={{ objectFit: "cover" }}
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority={false}
                      />
                    </Box>

                    <Box p={4}>
                      <HStack justify="space-between" mb={2}>
                        <Heading size="sm" color="white">
                          {project.nameproyect || "Sin título"}
                        </Heading>
                        <Badge colorScheme="green" variant="subtle">
                          {project.tag || "Proyecto"}
                        </Badge>
                      </HStack>

                      <Text fontSize="sm" color="gray.300" noOfLines={3}>
                        {project.descproyect || "Sin descripción"}
                      </Text>

                      <HStack mt={4} spacing={3} justify="flex-end">
                        <Button
                          size="sm"
                          as="a"
                          href={project.demo || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          leftIcon={<FaExternalLinkAlt />}
                          variant="ghost"
                          color="cyan.300"
                          _hover={{ color: "cyan.100" }}
                        >
                          Ver
                        </Button>
                      </HStack>
                    </Box>
                  </Box>
                ))}
              </SimpleGrid>
            ) : (
              <Text color="gray.500">No hay proyectos disponibles.</Text>
            )}
          </Box>
        </Flex>
      </Container>
    </Box>
  );
}
