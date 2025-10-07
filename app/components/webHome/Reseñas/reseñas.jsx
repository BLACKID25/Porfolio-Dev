"use client";

import React from "react";
import { reviewsData } from "@/app/components/webHome/Reseñas/Reseña.info";
import { Box, Heading, Text, Flex, Avatar,AvatarBadge } from "@chakra-ui/react";

import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

export function Reviews() {
  return (
    <Box py={16} px={4} textAlign="center" bg="white">
      <Heading as="h2" size="xl" mb={10}>
        Reseña de algunos profesionales en la plataforma
      </Heading>

      <Swiper
        modules={[FreeMode, Pagination]}
        spaceBetween={30}
        slidesPerView="auto"
        freeMode={true}
        loop={true}
        pagination={{ clickable: true }}
        style={{ paddingBottom: "40px" }}
      >
        {reviewsData.map((review, index) => (
          <SwiperSlide key={index} style={{ width: "520px" }}>
            <Box
              p={6}
              bg="white"
              borderRadius="lg"
              border="1px solid"
              borderColor="gray.100"
              boxShadow="lg"
              transition="all 0.3s ease-in-out"
              _hover={{ transform: "translateY(-5px)", boxShadow: "2xl" }}
              h="100%"
            >
              <Text fontSize="3xl" color="blue.200" mb={2}>
                “
              </Text>

              <Text
                as="blockquote"
                fontSize="lg"
                fontStyle="italic"
                color="gray.700"
                mb={4}
              >
                {review.comment}
              </Text>

              <Flex align="center" mt={4}>
                <Avatar
  src={review.avatar}
  name={review.userName}
  loading="lazy"
  size="md"
  mr={4}
  border="2px solid"
  borderColor="blue.200"
>
  <AvatarBadge boxSize="1.25em" bg="green.500" /> 
</Avatar>

                <Box textAlign="left">
                  <Text fontWeight="bold">{review.userName}</Text>
                  <Text fontSize="sm" color="gray.500">
                    {review.userType}
                  </Text>
                </Box>
              </Flex>
            </Box>
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
}
