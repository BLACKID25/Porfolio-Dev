import React from "react";
import Image from "next/image";
import { map } from "lodash";
import { reviewsData } from "@/app/Hooks/Reseña.info";
import "./reseñas.css";

export function Reviews() {
  return (
    <div className="reviews">
      <h2>Reseña de algunos profesionales en la plataforma</h2>

      <div className="reviews__list">
        {map(reviewsData, (review, index) => (
          <div key={index}>
            <p>{review.comment}</p>
            <div className="reviews__list-user">
              {/* Se agregan width y height */}
              {console.log("Ruta de la imagen:", review.avatar)}
              <Image 
                src={review.avatar} 
                alt={`Avatar de ${review.userName}`} 
                width={50} 
                height={50} 
                className="reviews__avatar"
              />
              <div>
                <span>{review.userName}</span> <br />
                <span>{review.userType}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
