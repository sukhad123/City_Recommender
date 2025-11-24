"use client";
import { useState, useEffect } from "react";
import { Button, Input, Card, CardBody, CardFooter } from "@heroui/react";
import { cities } from "../../../../utils/cities";
import { CitySearch } from "../../../../utils/CitySearch";
import ConfirmModal from "./ConfirmModal";

export default function UserReviews({ userEmail }) {
  const [reviews, setReviews] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ comment: "", city: "" });
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [modalMsg, setModalMsg] = useState("");

  useEffect(() => {
    if (!userEmail) return;
    async function fetchReviews() {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/reviews?userEmail=${encodeURIComponent(userEmail)}`
        );
        if (!res.ok) throw new Error("Failed to fetch reviews");
        const data = await res.json();
        setReviews(data.reviews || []);
      } catch (error) {
        alert("Error loading reviews.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchReviews();
  }, [userEmail]);

  const handleDelete = async (id) => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/reviews/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setReviews((prev) => prev.filter((r) => r.id !== id));
      setConfirmOpen(false);
      setPendingDeleteId(null);
    } catch (error) {
      // Optionally show an ErrorModal here
      alert("Failed to delete review.");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (review) => {
    setEditingId(review.id);
    setEditData({
      comment: review.comment,
      city: review.city,
    });
  };

  const handleSave = async (id) => {
    const isValidCity = cities.includes(editData.city);
    if (!editData.comment.trim() || !isValidCity) {
      alert("Comment and City must be set to a valid city.");
      return;
    }
    setIsSaving(true);
    try {
      const res = await fetch(`/api/reviews/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });
      if (!res.ok) throw new Error("Update failed");
      setReviews((prev) =>
        prev.map((r) =>
          r.id === id
            ? { ...r, ...editData, updatedAt: new Date().toISOString() }
            : r
        )
      );
      setEditingId(null);
    } catch (error) {
      alert("Failed to update review.");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData({ comment: "", city: "" });
  };

  if (loading)
    return <div className="mt-6 text-gray-500">Loading reviews...</div>;

  if (!reviews.length)
    return <div className="mt-6 text-gray-500">No reviews found.</div>;

  return (
    <>
      <div className="mt-8 space-y-4 mb-16">
        <h2 className="text-xl font-semibold mb-3">My Reviews</h2>
        {reviews.map((review) => {
          // Validate city for Save button per review item
          const isValidCity = cities.includes(editData.city);
          return (
            <Card key={review.id} className="w-full">
              <CardBody>
                {editingId === review.id ? (
                  <div className="flex flex-col gap-4">
                    <div>
                      <label>Comment</label>
                      <Input
                        value={editData.comment}
                        onChange={(e) =>
                          setEditData((prev) => ({
                            ...prev,
                            comment: e.target.value,
                          }))
                        }
                        disabled={isSaving}
                      />
                    </div>
                    <div>
                      <label>City</label>
                      <CitySearch
                        value={editData.city}
                        onChange={(city) =>
                          setEditData((prev) => ({ ...prev, city }))
                        }
                        disabled={isSaving}
                        placeholder="Search city…"
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-primary font-semibold">
                      {review.city.replace("_", " ")}
                    </p>
                    <p className="text-lg text-gray-100">{review.comment}</p>
                    <p className="text-xs text-gray-400">
                      Last updated:{" "}
                      {new Date(review.updatedAt).toLocaleString()}
                    </p>
                  </>
                )}
              </CardBody>
              <CardFooter className="flex gap-2">
                {editingId === review.id ? (
                  <>
                    <Button
                      color="primary"
                      onPress={() => handleSave(review.id)}
                      disabled={
                        isSaving || !editData.comment.trim() || !isValidCity
                      }
                    >
                      Save
                    </Button>
                    <Button
                      color="secondary"
                      onPress={handleCancel}
                      disabled={isSaving}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      color="primary"
                      onPress={() => handleEdit(review)}
                      disabled={isSaving}
                    >
                      Edit
                    </Button>
                    <Button
                      color="danger"
                      onPress={() => {
                        setModalMsg("Delete this review?");
                        setPendingDeleteId(review.id);
                        setConfirmOpen(true);
                      }}
                      disabled={isSaving}
                    >
                      Delete
                    </Button>
                  </>
                )}
              </CardFooter>
            </Card>
          );
        })}
      </div>
      <ConfirmModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => handleDelete(pendingDeleteId)}
        message={modalMsg}
        loading={isSaving}
      />
    </>
  );
}
