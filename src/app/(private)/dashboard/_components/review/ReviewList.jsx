"use client";
import { Card, CardBody, Spinner } from "@heroui/react"; 
import { Star } from "lucide-react";

export default function ReviewList({ reviews, loading }) {
  return (
    <div className="flex-1 overflow-y-auto space-y-4 border rounded-lg p-2 max-h-[70vh]">
      {loading ? (
          <div className="flex justify-center items-center py-6">
          <Spinner color="warning" size="lg" />  
        </div>
      ) : (
        reviews.map((review) => {
          const rating = parseInt(review.rating || "0", 10);
          const formattedDate = new Date(review.createdAt).toLocaleDateString(
            "en-CA",
            { year: "numeric", month: "short", day: "numeric" }
          );

          return (
            <Card key={review._id} className="bg-gray-800">
              <CardBody>
                <div className="border-b border-gray-700 pb-1 mb-2">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-semibold text-blue-400">
                      {review.user || "Anonymous"}
                    </p>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={18}
                          className={
                            star <= rating
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-500"
                          }
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 uppercase tracking-wide">
                    <span>{review.city}</span>
                    <span>{formattedDate}</span>
                  </div>
                </div>
                <p className="text-white">{review.comment}</p>
              </CardBody>
            </Card>
          );
        })
      )}
    </div>
  );
}
