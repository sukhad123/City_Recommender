"use client";
import { useState, useEffect } from "react";
import {
  Button,
  Input,
  Card,
  CardBody,
  CardFooter,
  Select,
  SelectItem,
} from "@heroui/react";

const canadianCities = [
  "Toronto",
  "Montreal",
  "Vancouver",
  "Calgary",
  "Edmonton",
  "Ottawa",
  "Winnipeg",
  "Quebec_City",
  "Hamilton",
  "Kitchener",
  "London",
  "Victoria",
  "Halifax",
  "Oshawa",
  "Windsor",
  "Saskatoon",
  "Regina",
  "St_Johns",
  "Kelowna",
];

export default function UserReviews({ userEmail }) {
  const [reviews, setReviews] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ comment: "", city: "" });
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);

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
    if (!window.confirm("Delete this review?")) return;
    setIsSaving(true);
    try {
      const res = await fetch(`/api/reviews/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setReviews((prev) => prev.filter((r) => r.id !== id));
    } catch (error) {
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
    if (!editData.comment.trim() || !editData.city.trim()) {
      alert("Comment and City cannot be empty.");
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
    <div className="mt-8 space-y-4">
      <h2 className="text-xl font-semibold mb-3">My Reviews</h2>
      {reviews.map((review) => (
        <Card key={review.id} className="w-full">
          <CardBody>
            {editingId === review.id ? (
              <>
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
                  <Select
                    selectedKeys={editData.city ? [editData.city] : []}
                    onSelectionChange={(keys) => {
                      // keys is a set or array depending on the component API
                      // If Set: Array.from(keys)[0]
                      // If Array: keys[0]
                      const value = Array.isArray(keys)
                        ? keys[0]
                        : Array.from(keys)[0];
                      setEditData((prev) => ({ ...prev, city: value }));
                    }}
                    disabled={isSaving}
                  >
                    {canadianCities.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city.replace("_", " ")}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
              </>
            ) : (
              <>
                <p className="text-gray-700">
                  <strong>Comment:</strong> {review.comment}
                </p>
                <p className="text-gray-600">
                  <strong>City:</strong> {review.city.replace("_", " ")}
                </p>
                <p className="text-xs text-gray-400">
                  Last updated: {new Date(review.updatedAt).toLocaleString()}
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
                  disabled={isSaving}
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
                  onPress={() => handleDelete(review.id)}
                  disabled={isSaving}
                >
                  Delete
                </Button>
              </>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
