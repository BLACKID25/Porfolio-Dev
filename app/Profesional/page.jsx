"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  Box,
  Heading,
  Text,
  Input,
  InputGroup,
  InputLeftElement,
  Grid,
  Avatar,
  Card,
  CardBody,
  Wrap,
  Tag,
  HStack,
  Icon,
  SimpleGrid,
  Button,
  VStack,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { FaLinkedin, FaGithub, FaInstagram, FaGlobe } from "react-icons/fa";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({ name: "", country: "", Profesion: "" });
  const [page, setPage] = useState(1); // 📌 página actual
  const [totalPages, setTotalPages] = useState(1); // 📌 total de páginas
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  // 📌 Función para cargar usuarios desde el backend
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/perfil", {
        params: {
          page,
          limit: 9, // 🔹 9 cards por página (3 columnas × 3 filas)
          name: filters.name,
          country: filters.country,
          profesion: filters.Profesion,
        },
      });

      setUsers(res.data.data);
      setTotalPages(res.data.pagination.totalPages);
    } catch (error) {
      console.error("Error obteniendo usuarios:", error);
    } finally {
      setLoading(false);
    }
  };

  // 📌 Cargar cada vez que cambian filtros o página
  useEffect(() => {
    fetchUsers();
  }, [page, filters]);

  return (
    <Box p={6} maxW="7xl" mx="auto">
      {/* Header */}
      <VStack spacing={4} mb={10}>
        <Heading
          bgGradient="linear(to-r, blue.400, purple.600)"
          bgClip="text"
          fontSize={{ base: "2xl", md: "4xl" }}
          fontWeight="extrabold"
          textAlign="center"
        >
          DIRECTORIO DE PROFESIONALES
        </Heading>
        <Text color="gray.600" fontSize="lg" textAlign="center">
          Encuentra profesionales del mundo tech listos para colaborar contigo 🚀
        </Text>
        <Link href="/">
          <Button colorScheme="blue" variant="outline" rounded="full">
            🏠 Inicio
          </Button>
        </Link>
      </VStack>

      {/* Filtros */}
      <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={4} mb={10}>
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.400" />
          </InputLeftElement>
          <Input
            placeholder="Buscar por nombre..."
            onChange={(e) => setFilters({ ...filters, name: e.target.value })}
          />
        </InputGroup>

        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <FaGlobe color="gray.400" />
          </InputLeftElement>
          <Input
            placeholder="Filtrar por país..."
            onChange={(e) => setFilters({ ...filters, country: e.target.value })}
          />
        </InputGroup>

        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <Icon as={FaGithub} color="gray.400" />
          </InputLeftElement>
          <Input
            placeholder="Filtrar por área de desarrollo..."
            onChange={(e) => setFilters({ ...filters, Profesion: e.target.value })}
          />
        </InputGroup>
      </Grid>

      {/* Grid de Profesionales */}
      <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={8}>
        {loading ? (
          <Text textAlign="center" color="gray.500" gridColumn="1 / -1">
            Cargando Profesionales...
          </Text>
        ) : users.length > 0 ? (
          users.map((user) => (
            <Card
              key={user._id}
              borderRadius="2xl"
              boxShadow="xl"
              bg="whiteAlpha.900"
              _hover={{ transform: "scale(1.05)", boxShadow: "2xl" }}
              transition="all 0.3s ease"
            >
              <CardBody textAlign="center">
                <Avatar size="xl" src={user.photo || "/default-avatar.jpg"} mb={4} />
                <Heading size="md">{user.name}</Heading>
                <Text color="gray.500">{user.Profesion}</Text>
                <Text fontSize="sm" color="gray.600">
                  {user.country}
                </Text>

                <Wrap justify="center" mt={4}>
                  {user.skills?.map((skill, index) => (
                    <Tag key={index} colorScheme="blue" variant="subtle">
                      {skill}
                    </Tag>
                  ))}
                </Wrap>

                <HStack justify="center" spacing={4} mt={4}>
                  {user.UrlLinkedin && <Icon as={FaLinkedin} boxSize={6} color="blue.500" />}
                  {user.Urlgithub && <Icon as={FaGithub} boxSize={6} color="gray.700" />}
                  {user.Urlinstagram && <Icon as={FaInstagram} boxSize={6} color="pink.500" />}
                </HStack>

                {/* Botón Ver Portafolio */}
                <Box mt={4} textAlign="center">
                  <Button
                    size="sm"
                    colorScheme="blue"
                    onClick={() => router.push(`/${user.username}`)}
                  >
                    Ver Portafolio
                  </Button>
                </Box>
              </CardBody>
            </Card>
          ))
        ) : (
          <Text textAlign="center" color="gray.500" gridColumn="1 / -1">
            No se encontraron usuarios.
          </Text>
        )}
      </SimpleGrid>

      {/* 📌 Paginación */}
      <HStack justify="center" spacing={4} mt={8}>
        <Button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          isDisabled={page === 1}
        >
          Anterior
        </Button>
        <Text>
          Página {page} de {totalPages}
        </Text>
        <Button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          isDisabled={page === totalPages}
        >
          Siguiente
        </Button>
      </HStack>
    </Box>
  );
}
