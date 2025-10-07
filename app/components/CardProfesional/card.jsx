"use client";
import { useRouter } from "next/navigation";
import {
  Avatar,
  Box,
  Card,
  CardBody,
  Heading,
  Text,
  Wrap,
  Tag,
  HStack,
  Icon,
  VStack,
  Button,
} from "@chakra-ui/react";
import { FaLinkedin, FaGithub, FaInstagram, FaFacebook } from "react-icons/fa";

const UserCard = ({ user }) => {
  const router = useRouter();

  const skillsArray = Array.isArray(user.skills)
    ? user.skills.flatMap((skill) => skill.split(","))
    : user.skills?.split(",") || [];

  const handleClick = () => {
    if (user?.username) {
      router.push(`/${user.username}`);
    } else {
      console.warn("El usuario no tiene username definido");
    }
  };

  return (
    <Card
      borderRadius="3xl"
      boxShadow="xl"
      bg="whiteAlpha.900"
      _hover={{ transform: "scale(1.05)", boxShadow: "2xl" }}
      transition="all 0.4s ease"
      p={4}
      position="relative" // Para que el botón se posicione correctamente
      overflow="visible" // Para que el botón sobresalga si es necesario
    >
        <CardBody textAlign="center">
        {/* Avatar */}
        <Box
          mb={4}
          borderRadius="full"
          overflow="hidden"
          w="120px"
          h="120px"
          mx="auto"
          transition="all 0.3s ease"
          _hover={{ transform: "scale(1.1)" }}
        >
          <Avatar
            size="full"
            src={user.photo || "/Persona1.jpg"}
            name={user.name}
          />
        </Box>

        {/* Nombre y Profesión */}
        <Heading size="md">{user.name}</Heading>
        <Text color="gray.500" fontWeight="semibold">
          {user.Profesion || "Profesión"}
        </Text>
        <Text fontSize="sm" color="gray.600">
          {user.ageExpe ? `${user.ageExpe} años de experiencia` : ""}
        </Text>
        <Text fontSize="sm" color="gray.600">
          País: {user.country || ""}
        </Text>

        {/* Skills */}
        {skillsArray.length > 0 && (
          <Box mt={3}>
            <Wrap justify="center" spacing={2}>
              {skillsArray.map((skill, index) => (
                <Tag
                  key={index}
                  colorScheme="blue"
                  variant="subtle"
                  cursor="pointer"
                  _hover={{ bg: "blue.300", color: "white" }}
                >
                  {skill.trim()}
                </Tag>
              ))}
            </Wrap>
          </Box>
        )}

        {/* Redes sociales */}
        <VStack spacing={2} mt={4}>
          <HStack spacing={4} justify="center">
            {user.UrlLinkedin && (
              <Icon
                as={FaLinkedin}
                boxSize={6}
                color="blue.500"
                cursor="pointer"
                _hover={{ color: "blue.700", transform: "scale(1.2)" }}
                onClick={() => window.open(user.UrlLinkedin, "_blank")}
              />
            )}
            {user.Urlgithub && (
              <Icon
                as={FaGithub}
                boxSize={6}
                color="gray.700"
                cursor="pointer"
                _hover={{ color: "gray.900", transform: "scale(1.2)" }}
                onClick={() => window.open(user.Urlgithub, "_blank")}
              />
            )}
            {user.Urlinstagram && (
              <Icon
                as={FaInstagram}
                boxSize={6}
                color="pink.500"
                cursor="pointer"
                _hover={{ color: "pink.700", transform: "scale(1.2)" }}
                onClick={() => window.open(user.Urlinstagram, "_blank")}
              />
            )}
            {user.Urlfacebook && (
              <Icon
                as={FaFacebook}
                boxSize={6}
                color="blue.600"
                cursor="pointer"
                _hover={{ color: "blue.800", transform: "scale(1.2)" }}
                onClick={() => window.open(user.Urlfacebook, "_blank")}
              />
            )}
          </HStack>
        </VStack>
      </CardBody>
    </Card>
  );
};

export default UserCard;
