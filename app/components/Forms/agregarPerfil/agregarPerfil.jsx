"use client";

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import Swal from "sweetalert2";
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
  SimpleGrid,
  useDisclosure,
  Image as ChakraImage,
  IconButton,
  Spinner,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import imageCompression from "browser-image-compression";
import { FaFilePdf } from "react-icons/fa";
import { usePaymentModal } from "@/app/hooks/usePaymentModal";

const ProfileForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nameplan = searchParams.get("plan");

  const { PaymentModal, onOpen } = usePaymentModal();

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
    skills: "",
    typePlan: nameplan,
  });

  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [cvFile, setCvFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [showProjects, setShowProjects] = useState(false);
  const [projects, setProjects] = useState([{ nameproyect: "", tecnologiproyect: "", photoproyect: "", descproyect: "" }]);
  const [usernameForPayment, setUsernameForPayment] = useState(null);

  const photoInputRef = useRef(null);
  const cvInputRef = useRef(null);

  // abrir modal de pago si se setea username
  useEffect(() => {
    if (usernameForPayment) onOpen();
  }, [usernameForPayment, onOpen]);

  useEffect(() => {
    return () => {
      if (photoPreview) URL.revokeObjectURL(photoPreview);
    };
  }, [photoPreview]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onCvSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCvFile(file);
  };

  const onPhotoSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressedFile = await imageCompression(file, { maxSizeMB: 1, maxWidthOrHeight: 800, useWebWorker: true });
      const previewUrl = URL.createObjectURL(compressedFile);
      if (photoPreview) URL.revokeObjectURL(photoPreview);
      setPhotoFile(compressedFile);
      setPhotoPreview(previewUrl);
    } catch {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const removePhoto = () => {
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhotoFile(null);
    setPhotoPreview(null);
  };

  const removeCv = () => setCvFile(null);

  const handleProjectChange = (e, index) => {
    const { name, value } = e.target;
    const updated = [...projects];
    updated[index][name] = value;
    setProjects(updated);
  };

  const handleRemoveProject = (index) => {
    const updated = [...projects];
    updated.splice(index, 1);
    setProjects(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      const payload = { ...formData };

      // subir foto
      if (photoFile) {
        const fd = new FormData();
        fd.append("file", photoFile, photoFile.name || "photo.jpg");
        fd.append("fileType", "PHOTO");
        const resPhoto = await axios.post("/api/upload", fd, { headers: { "Content-Type": "multipart/form-data" } });
        payload.photo = resPhoto.data.url || "";
      }

      // subir CV
      
        if (cvFile) {
          // Validar tipo MIME
          if (cvFile.type !== "application/pdf") {
            Swal.fire({
              icon: "warning",
              title: "Archivo inválido",
              text: "Solo se permiten archivos PDF para el CV.",
            });
            setUploading(false);
            return;
          }

          // Validar extensión (opcional)
          if (!cvFile.name.toLowerCase().endsWith(".pdf")) {
            Swal.fire({
              icon: "warning",
              title: "Archivo inválido",
              text: "El archivo debe tener extensión .pdf.",
            });
            setUploading(false);
            return;
          }
          const fd2 = new FormData();
          fd2.append("file", cvFile, cvFile.name || "cv.pdf");
          fd2.append("fileType", "CURRICV");

          try {
            const resCv = await axios.post("/api/upload", fd2, {
              headers: { "Content-Type": "multipart/form-data" },
            });
            payload.curriCV = resCv.data.url || "";
          } catch (error) {
            console.error("Error al subir CV:", error);
            Swal.fire({
              icon: "error",
              title: "Error al subir CV",
              text: "Hubo un problema subiendo el CV. Intenta nuevamente.",
            });
            setUploading(false);
            return;
          }
        }

      // procesar proyectos
      if (showProjects && projects.length > 0) {
        payload.proyectos = projects.map((p) => ({
          ...p,
          tecnologiproyect: typeof p.tecnologiproyect === "string" ? p.tecnologiproyect.split(",").map((t) => t.trim()) : p.tecnologiproyect,
        }));
      }

      // crear perfil
      const response = await axios.post("/api/perfil", payload);
      const result = response.data;
      const username = result.data?.username;
      if (username) localStorage.setItem("username", username);

      // limpieza local
      if (photoPreview) URL.revokeObjectURL(photoPreview);
      setPhotoFile(null);
      setPhotoPreview(null);
      setCvFile(null);

      // crear proyectos si existen
      if (response.status === 201 && showProjects && payload.proyectos) {
        await axios.post("/api/proyect", { name: payload.name, proyectos: payload.proyectos });
      }

      Swal.fire({
        icon: "success",
        title: "Perfil creado",
        html: `Usuario precreado correctamente.`,
        confirmButtonText: "Ir a pagar",
      }).then((r) => {
        if (r.isConfirmed && username) {
          setUsernameForPayment(username);
        }
      });

    } catch (err) {
      // usuario ya existe
      if (err.response?.status === 409) {
        const existingUser = err.response.data.data;
        Swal.fire({
          icon: "warning",
          title: "Usuario ya registrado",
          text: "Ya existe un perfil registrado con este correo electrónico. ¿Deseas procesar el pago ahora?",
          showCancelButton: true,
          confirmButtonText: "Sí, pagar ahora",
          cancelButtonText: "Cancelar",
        }).then((result) => {
          if (result.isConfirmed && existingUser?.username) {
              // 🔹 Reseteamos y luego seteamos
              setUsernameForPayment(null);
              setTimeout(() => {
                setUsernameForPayment(existingUser.username);
              }, 0);
            }
          });
          return;
        }

      // otros errores
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.message || err.message || "Error al crear el perfil o subir archivos.",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box
      minH="100vh"
      w="full"
      style={{
        backgroundImage: `url('/Home-general.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      py={10}
    >
      <Box
        w={{ base: "90%", md: "70%", lg: "80%" }}
        mx="auto"
        p={8}
        bg="whiteAlpha.800"
        shadow="3xl"
        rounded="2xl"
      >
        <Box mb={4}>
          <Link href="/">
            <Button colorScheme="teal" variant="outline">
              🏠 Inicio
            </Button>
          </Link>
        </Box>

        <Heading align="center" as="h2" size="lg" mb={4}>
          Datos de tu Perfil Profesional
        </Heading>

        <form onSubmit={handleSubmit}>
          <VStack spacing={4} align="stretch">
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <FormControl id="name" isRequired>
                <FormLabel>Nombre y Apellido:</FormLabel>
                <Input name="name" value={formData.name} onChange={handleChange} />
              </FormControl>

              <FormControl id="email" isRequired>
                <FormLabel>Correo Electrónico:</FormLabel>
                <Input name="email" type="email" value={formData.email} onChange={handleChange} />
              </FormControl>

              <FormControl id="phone" isRequired>
                <FormLabel>Teléfono:</FormLabel>
                <Input name="phone" value={formData.phone} onChange={handleChange} />
              </FormControl>

              <FormControl id="country" isRequired>
                <FormLabel>País:</FormLabel>
                <Input name="country" value={formData.country} onChange={handleChange} />
              </FormControl>

              <FormControl id="Profesion">
                <FormLabel>Profesión:</FormLabel>
                <Input name="Profesion" value={formData.Profesion} onChange={handleChange} />
              </FormControl>

              <FormControl id="ageExpe">
                <FormLabel>Años de experiencia:</FormLabel>
                <Input name="ageExpe" type="number" value={formData.ageExpe} onChange={handleChange} />
              </FormControl>
            </SimpleGrid>

            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
              <FormControl id="UrlLinkedin">
                <FormLabel>LinkedIn:</FormLabel>
                <Input name="UrlLinkedin" value={formData.UrlLinkedin} onChange={handleChange} />
              </FormControl>
              <FormControl id="Urlgithub">
                <FormLabel>GitHub:</FormLabel>
                <Input name="Urlgithub" value={formData.Urlgithub} onChange={handleChange} />
              </FormControl>
              <FormControl id="Urlinstagram">
                <FormLabel>Instagram:</FormLabel>
                <Input name="Urlinstagram" value={formData.Urlinstagram} onChange={handleChange} />
              </FormControl>
            </SimpleGrid>

            {/* FOTO y CV: se guardan local y se suben en handleSubmit */}
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <FormControl id="photo">
                <FormLabel>Foto:</FormLabel>
                <HStack>
                  <Input
                    ref={photoInputRef}
                    type="file"
                    accept="image/*"
                    onChange={onPhotoSelect}
                    style={{ display: "none" }}
                  />
                  <Button colorScheme="teal" onClick={() => photoInputRef.current.click()}>
                    Subir Foto
                  </Button>

                  {photoPreview ? (
                    <HStack spacing={2} align="center">
                      <ChakraImage boxSize="48px" objectFit="cover" src={photoPreview} alt="preview" borderRadius="md" />
                      <Text fontSize="sm" color="gray.600" noOfLines={1}>
                        {photoFile?.name || "imagen"}
                      </Text>
                      <IconButton aria-label="Eliminar foto" icon={<CloseIcon />} size="sm" onClick={removePhoto} />
                    </HStack>
                  ) : (
                    <Text fontSize="sm" color="gray.500">No hay foto seleccionada</Text>
                  )}
                </HStack>
              </FormControl>

              <FormControl id="curriCV">
                <FormLabel>Currículum:</FormLabel>
                <HStack>
                  <Input
                    ref={cvInputRef}
                    id="curriCV"
                    type="file"
                    accept="application/pdf"
                    onChange={onCvSelect}
                    style={{ display: "none" }}
                  />
                  <Button colorScheme="teal" onClick={() => cvInputRef.current.click()}>
                    Subir CV
                  </Button>

                  {cvFile ? (
                    <HStack spacing={2}>
                      <FaFilePdf color="red" />
                      <Text fontSize="sm" color="gray.600" noOfLines={1}>
                        {cvFile.name}
                      </Text>
                      <IconButton aria-label="Eliminar CV" icon={<CloseIcon />} size="sm" onClick={removeCv} />
                    </HStack>
                  ) : (
                    <Text fontSize="sm" color="gray.500">No hay CV seleccionado</Text>
                  )}
                </HStack>
              </FormControl>
            </SimpleGrid>

            <FormControl id="skills">
              <FormLabel>Habilidades (separadas por coma):</FormLabel>
              <Input name="skills" value={formData.skills} onChange={handleChange} />
            </FormControl>

            <FormControl id="description">
              <FormLabel>Resumen Profesional:</FormLabel>
              <Textarea name="description" value={formData.description} onChange={handleChange} rows={4} />
            </FormControl>

            <Checkbox isChecked={showProjects} onChange={(e) => setShowProjects(e.target.checked)} colorScheme="blue">
              ¿Deseas agregar proyectos?
            </Checkbox>

            {showProjects && (
              <VStack spacing={4} align="stretch" p={4} bg="white" rounded="lg">
                <Heading as="h3" size="md">Proyectos</Heading>

                {projects.map((project, index) => (
                  <Box key={index} p={3} borderWidth="1px" rounded="md" bg="gray.50">
                    <HStack justifyContent="space-between" mb={2}>
                      <Heading as="h4" size="sm">Proyecto {index + 1}</Heading>
                      {projects.length > 1 && (
                        <Button size="xs" colorScheme="red" variant="ghost" onClick={() => handleRemoveProject(index)}>
                          Eliminar
                        </Button>
                      )}
                    </HStack>

                    <VStack spacing={2} align="stretch">
                      <FormControl>
                        <FormLabel>Nombre del Proyecto:</FormLabel>
                        <Input type="text" name="nameproyect" value={project.nameproyect} onChange={(e) => handleProjectChange(e, index)} />
                      </FormControl>

                      <FormControl>
                        <FormLabel>Tecnologías:</FormLabel>
                        <Input type="text" name="tecnologiproyect" value={project.tecnologiproyect} onChange={(e) => handleProjectChange(e, index)} />
                      </FormControl>

                      <FormControl>
                        <FormLabel>URL Imagen:</FormLabel>
                        <Input type="url" name="photoproyect" value={project.photoproyect} onChange={(e) => handleProjectChange(e, index)} />
                      </FormControl>

                      <FormControl>
                        <FormLabel>Descripción:</FormLabel>
                        <Textarea name="descproyect" value={project.descproyect} onChange={(e) => handleProjectChange(e, index)} rows={3} />
                      </FormControl>
                    </VStack>
                  </Box>
                ))}

                {projects.length < 3 && (
                  <Button type="button" colorScheme="green" onClick={() => setProjects([...projects, { nameproyect: "", tecnologiproyect: "", photoproyect: "", descproyect: "" }])}>
                    + Agregar otro proyecto
                  </Button>
                )}
              </VStack>
            )}

            <Button type="submit" colorScheme="blue" size="lg" mt={4} disabled={uploading}>
              {uploading ? <><Spinner size="sm" mr={2} /> Subiendo...</> : "Crear Perfil"}
            </Button>
          </VStack>
        </form>

        {/* Modal de pago */}
        {usernameForPayment && (
          <PaymentModal
            isOpen={true}          // 🔹 siempre abierto cuando usernameForPayment existe
            onClose={() => router.push("/")} // 🔹 si se cierra, lo manda al inicio
            initialEmail={formData.email}
            plan={nameplan}
            username={usernameForPayment}
            skipOrderCheck={true}
          />
        )}
      </Box>
    </Box>
  );
};

export default ProfileForm;
