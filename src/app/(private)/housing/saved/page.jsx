"use client";

import { useEffect, useState } from "react";
import { Button, Card, CardBody, CardHeader, Image, Chip } from "@heroui/react";
import {
  listSavedHousing,
  deleteSavedHousing,
} from "../../../../repositories/savedHousing";
import { useAuthInfo } from "../../../auth/utils/getCurrentUserDetails";

export default function SavedHousingPage() {
  const user = useAuthInfo();
  const [rows, setRows] = useState([]);

  useEffect(() => {
    let on = true;
    (async () => {
      if (!user?.email) return;
      const data = await listSavedHousing(user.email);
      if (on) setRows(data ?? []);
    })();
    return () => (on = false);
  }, [user?.email]);

  async function onDelete(id) {
    if (!id) return;
    const res = await deleteSavedHousing(id, user.email);
    if (res?.ok) setRows((prev) => prev.filter((r) => r.id !== id));
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Saved Housing</h1>
      {rows.length === 0 ? (
        <p className="text-gray-500">No saved listings yet.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {rows.map((r) => (
            <Card key={r.id} shadow="sm" className="overflow-hidden">
              {r.image ? (
                <Image
                  removeWrapper
                  src={r.image}
                  alt={r.title}
                  className="w-full h-40 object-cover"
                />
              ) : null}
              <CardHeader className="flex flex-col gap-1">
                <div className="flex items-center justify-between w-full">
                  <h3 className="text-lg font-semibold line-clamp-1">
                    {r.title}
                  </h3>
                  <Chip size="sm" className="bg-gray-800 text-white">
                    {r.type ?? "—"}
                  </Chip>
                </div>
                <p className="text-sm text-gray-500 line-clamp-1">
                  {r.address ?? "—"}
                </p>
              </CardHeader>
              <CardBody className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>
                    {r.city || "—"}, {r.province || "—"}
                  </span>
                  <span className="font-semibold">{r.priceText ?? "—"}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>{r.beds != null ? `${r.beds} bd` : "—"}</span>
                  <span>{r.baths != null ? `${r.baths} ba` : "—"}</span>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    as="a"
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    color="secondary"
                    size="sm"
                  >
                    Open
                  </Button>
                  <Button
                    color="danger"
                    variant="light"
                    size="sm"
                    onPress={() => onDelete(r.id)}
                  >
                    Delete
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
