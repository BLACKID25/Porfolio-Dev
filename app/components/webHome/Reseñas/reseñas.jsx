"use client";

import React from "react";

import { map } from "lodash";
import { reviewsData } from "../../../hooks/Reseña.info";

import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Flex,
  Avatar,
} from "@chakra-ui/react";
// Ya no necesitas este archivo CSS
// import "./reseñas.css";

export function Reviews() {
  return (
    <Box py={16} px={4} textAlign="center">
      <Heading as="h2" size="xl" mb={10}>
        Reseña de algunos profesionales en la plataforma
      </Heading>

      <SimpleGrid
        columns={{ base: 1, md: 2 }}
        spacing={8}
        maxW="container.xl"
        mx="auto"
      >
        {map(reviewsData, (review, index) => (
          <Box
            key={index}
            p={6}
            bg="white"
            borderRadius="lg"
            boxShadow="md"
            transition="all 0.3s ease-in-out"
            _hover={{ transform: "translateY(-5px)", boxShadow: "xl" }}
          >
            <Text
              as="blockquote"
              fontStyle="italic"
              color="gray.600"
              mb={4}
            >
              "{review.comment}"
            </Text>

            <Flex align="center" justify="center" mt={4}>
              {/* Usa el componente Avatar para el círculo y el borde */}
              <Avatar
                src={review.avatar}
                name={review.userName}
                size="md"
                mr={4}
              />
              <Box textAlign="left">
                <Text fontWeight="bold">{review.userName}</Text>
                <Text fontSize="sm" color="gray.500">
                  {review.userType}
                </Text>
              </Box>
            </Flex>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
}