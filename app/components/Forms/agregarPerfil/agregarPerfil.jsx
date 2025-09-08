"use client";

import React, { useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import Swal from "sweetalert2";
// Importamos los componentes de Chakra UI
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Checkbox,
  VStack,
  HStack,
  Heading,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure, // Hook para manejar el estado del modal
  Center,
  SimpleGrid,
} from "@chakra-ui/react";
// Aquí asumimos que los hooks de pago están disponibles
import HandleMercadopago from "../../../hooks/HandleMercadopago";
import { handleWebpayPlus } from "../../../hooks/HandreWebPayPlus";

const ProfileForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nameplan = searchParams.get("plan");

  // Hook de Chakra para manejar el estado del modal, más limpio que useState
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    UrlLinkedin: "",
    Urlgithub: "",
    Urlinstagram: "",
    photo: "",
    curriCV: "",
    country: "",
    Profesion: "",
    ageExpe: "",
    description: "",
    skills: "", // En Chakra, un solo string para el input de habilidades es más sencillo
    typePlan: nameplan,
  });

  const [showProjects, setShowProjects] = useState(false);
  const [projects, setProjects] = useState([
    {
      nameproyect: "",
      tecnologiproyect: "",
      photoproyect: "",
      descproyect: "",
    },
  ]);

  const [usernameForPayment, setUsernameForPayment] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Manejador para el Cloudinary (simulado aquí)
  const handleFileChange = (e) => {
    // Aquí puedes manejar el archivo seleccionado, por ejemplo, guardándolo en el estado
    const file = e.target.files[0];
    if (file) {
      // Por ahora, solo guardamos el nombre del archivo.
      // Aquí es donde en el futuro implementarás la lógica para subir a Cloudinary.
      console.log('Archivo seleccionado:', file);
      // setFormData({ ...formData, curriCV: file.name });
    }
  };

  const handleProjectChange = (e, index) => {
    const { name, value } = e.target;
    const updatedProjects = [...projects];
    updatedProjects[index][name] = value;
    setProjects(updatedProjects);
  };

  // Nuevo manejador para eliminar un proyecto
  const handleRemoveProject = (index) => {
    const updatedProjects = [...projects];
    updatedProjects.splice(index, 1);
    setProjects(updatedProjects);
  };

  // Manejador del envío del formulario

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/perfil", {
        ...formData,
       
      });

      const result = response.data;
      const username = result.data.username;
      localStorage.setItem("username", username);
      setUsernameForPayment(username);

      if (response.status === 201) {
        if (showProjects && projects.length > 0) {
          const proyectosProcesados = projects.map((p) => ({
            ...p,
            tecnologiproyect: p.tecnologiproyect.split(",").map((t) => t.trim()),
          }));

          await axios.post("/api/proyect", {
            name: formData.name,
            proyectos: proyectosProcesados,
          });
        }
      }

      Swal.fire({
        icon: "success",
        title: "Usuario y proyectos PRECREADOS con éxito",
        html: `Haga click en <strong> Ir a pagar <strong/> para <br/> procesar el pago y activar su URL-PORTAFOLIO`,
        showConfirmButton: true,
        confirmButtonText: "Ir a pagar",
        confirmButtonColor: "#3085d6",
      }).then((result) => {
        if (result.isConfirmed) {
          onOpen(); // Abre el modal de Chakra
        }
      });
    } catch (error) {
      if (error.response?.status === 409) {
        const code = error.response.data.code;
        if (code === "EMAIL_DUPLICATE") {
          Swal.fire({
            icon: "error",
            title: "Error",
            html: `Ya existe este correo electrónico registrado<br/> Puedes modificarlo.`,
          });
        } else if (code === "USERNAME_DUPLICATE") {
          Swal.fire({
            icon: "error",
            title: "Error",
            html: `Ya existe un perfil con este nombre de usuario<br/> Puedes modificarlo.`,
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Conflicto al crear el perfil.",
          });
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Error inesperado al crear el perfil.",
        });
      }
    }
  };

  return (
    // Contenedor principal para la imagen de fondo que ocupa toda la página
    <Box
      minH="100vh"
      w="full"
      style={{
        backgroundImage: `url('/Home-general.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      py={10} // Padding vertical para evitar que el formulario toque los bordes
    >
      {/* Box que contiene el formulario, ahora más grande y centrado */}
      <Box
        className="formulario-perfil"
        w={{ base: "90%", md: "70%", lg: "80%" }}
        mx="auto"
        p={8}
        bg="whiteAlpha.800" // Fondo semi-transparente para ver la imagen de atrás
        shadow="3xl"
        rounded="2xl" // Borde más redondeado para un look moderno
      >
        <Box className="nav-tophome" mb={4}>
          <Link href="/">
            <Button colorScheme="teal" variant="outline">
              🏠 Inicio
            </Button>
          </Link>
        </Box>

        <Heading align= "center "as="h2" size="lg" mb={4}>
          Datos de tu Perfil Profesional
        </Heading>

        <form onSubmit={handleSubmit}>
          <VStack spacing={4} align="stretch">
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              {/* Campo para Nombre */}
              <FormControl id="name" isRequired>
                <FormLabel>Nombre y Apellido:</FormLabel>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </FormControl>

              {/* Campo para Email */}
              <FormControl id="email" isRequired>
                <FormLabel>Correo Electrónico:</FormLabel>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </FormControl>

              {/* Campo para Teléfono */}
              <FormControl id="phone" isRequired>
                <FormLabel>Teléfono:</FormLabel>
                <Input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </FormControl>

              {/* Campo para País */}
              <FormControl id="country" isRequired>
                <FormLabel>País:</FormLabel>
                <Input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                />
              </FormControl>

              {/* Campo para Profesión */}
              <FormControl id="Profesion">
                <FormLabel>Profesión:</FormLabel>
                <Input
                  type="text"
                  name="Profesion"
                  value={formData.Profesion}
                  onChange={handleChange}
                />
              </FormControl>

              {/* Campo para Años de experiencia */}
              <FormControl id="ageExpe">
                <FormLabel>Años de experiencia:</FormLabel>
                <Input
                  type="number"
                  name="ageExpe"
                  value={formData.ageExpe}
                  onChange={handleChange}
                />
              </FormControl>
            </SimpleGrid>

            {/* Campos de Redes Sociales */}
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
              <FormControl id="UrlLinkedin">
                <FormLabel>LinkedIn:</FormLabel>
                <Input
                  type="url"
                  name="UrlLinkedin"
                  value={formData.UrlLinkedin}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl id="Urlgithub">
                <FormLabel>GitHub:</FormLabel>
                <Input
                  type="url"
                  name="Urlgithub"
                  value={formData.Urlgithub}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl id="Urlinstagram">
                <FormLabel>Instagram:</FormLabel>
                <Input
                  type="url"
                  name="Urlinstagram"
                  value={formData.Urlinstagram}
                  onChange={handleChange}
                />
              </FormControl>
            </SimpleGrid>

            {/* Campos de subida de archivos (simulados con URL) */}
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <FormControl id="photo">
                <FormLabel>Foto (URL):</FormLabel>
                <Input
                  type="url"
                  name="photo"
                  value={formData.photo}
                  onChange={handleChange}
                />
              </FormControl>

              {/* Sección modificada para el botón de subida del CV */}
              <FormControl id="curriCV">
                <FormLabel>Subir CV:</FormLabel>
                <Input
                  type="file"
                  name="curriCV"
                  onChange={handleFileChange}
                  // Ocultamos el input de archivo y lo estilizamos con un botón
                  style={{ display: 'none' }}
                />
                <Button
                  colorScheme="teal"
                  onClick={() => document.getElementById('curriCV').click()}
                  w="full"
                >
                  Subir Currículum
                </Button>
                {/* Aquí en el futuro puedes mostrar el nombre del archivo cargado */}
                {formData.curriCV && (
                  <Text mt={2} fontSize="sm">
                    Archivo cargado: {formData.curriCV}
                  </Text>
                )}
                {/* <Text mt={2} fontSize="sm" color="gray.500">
                  Archivo cargado: nombre-del-archivo.pdf
                </Text> */}
              </FormControl>
            </SimpleGrid>

            {/* Campo de Habilidades */}
            <FormControl id="skills">
              <FormLabel>Habilidades (separadas por coma):</FormLabel>
              <Input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
              />
            </FormControl>

            {/* Campo de Descripción */}
            <FormControl id="description">
              <FormLabel>Resumen Profesional:</FormLabel>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
              />
            </FormControl>

            {/* Checkbox para Proyectos */}
            <Checkbox
              isChecked={showProjects}
              onChange={(e) => setShowProjects(e.target.checked)}
              colorScheme="blue"
            >
              ¿Deseas agregar proyectos?
            </Checkbox>

            {/* Sección de proyectos (condicional) */}
            {showProjects && (
              <VStack spacing={4} align="stretch" p={4} bg="white" shadow="sm" rounded="lg">
                <Heading as="h3" size="md">
                  Proyectos
                </Heading>
                {projects.map((project, index) => (
                  <Box
                    key={index}
                    p={3}
                    borderWidth="1px"
                    rounded="md"
                    bg="gray.50"
                    shadow="sm"
                  >
                    <HStack justifyContent="space-between" mb={2}>
                      <Heading as="h4" size="sm">
                        Proyecto {index + 1}
                      </Heading>
                      {projects.length > 1 && (
                        <Button
                          size="xs"
                          colorScheme="red"
                          variant="ghost"
                          onClick={() => handleRemoveProject(index)}
                        >
                          Eliminar
                        </Button>
                      )}
                    </HStack>
                    <VStack spacing={2} align="stretch">
                      <FormControl>
                        <FormLabel>Nombre del Proyecto:</FormLabel>
                        <Input
                          type="text"
                          name="nameproyect"
                          value={project.nameproyect}
                          onChange={(e) => handleProjectChange(e, index)}
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Tecnologías (separadas por coma):</FormLabel>
                        <Input
                          type="text"
                          name="tecnologiproyect"
                          value={project.tecnologiproyect}
                          onChange={(e) => handleProjectChange(e, index)}
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel>URL Imagen:</FormLabel>
                        <Input
                          type="url"
                          name="photoproyect"
                          value={project.photoproyect}
                          onChange={(e) => handleProjectChange(e, index)}
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Descripción:</FormLabel>
                        <Textarea
                          name="descproyect"
                          value={project.descproyect}
                          onChange={(e) => handleProjectChange(e, index)}
                          rows={3}
                        />
                      </FormControl>
                    </VStack>
                  </Box>
                ))}

                {projects.length < 3 && (
                  <Button
                    type="button"
                    colorScheme="green"
                    onClick={() =>
                      setProjects([
                        ...projects,
                        {
                          nameproyect: "",
                          tecnologiproyect: "",
                          photoproyect: "",
                          descproyect: "",
                        },
                      ])
                    }
                  >
                    + Agregar otro proyecto
                  </Button>
                )}
              </VStack>
            )}

            <Button
              type="submit"
              colorScheme="blue"
              size="lg"
              mt={4}
            >
              Crear Perfil
            </Button>
          </VStack>
        </form>

        {/* Modal de pago con Chakra UI */}
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Selecciona tu método de pago</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>

                
                {/* Componente de MercadoPago */}
                <Box w="full">
                  <HandleMercadopago
                    initialEmail={formData.email}
                    plan={nameplan}
                    username={usernameForPayment}
                  />
                </Box>
                

                {/* Botón de PayPal (desactivado) */}
                <Button
                  isDisabled
                  leftIcon={
                    <img
                      src="/paypal.svg"
                      alt="PayPal"
                      style={{ height: "24px" }}
                    />
                  }
                  colorScheme="blue"
                  variant="outline"
                  w="full"
                >
                  
                </Button>

                

                
                

                {/* Botón de Webpay Plus */}
                <Button
                  onClick={() =>
                    handleWebpayPlus(formData.email, nameplan, usernameForPayment)
                  }
                  leftIcon={
                    <img
                      src="/webpayplus.png"
                      alt="Webpay Plus"
                      style={{ height: "35px" }}
                    />
                  }
                  colorScheme="purple"
                  variant="outline"
                  w="full"
                >
                 
                </Button>



              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="red" onClick={onClose}>
                Cerrar
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </Box>
  );
};

export default ProfileForm;
