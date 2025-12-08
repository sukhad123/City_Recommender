"use client";

import { useEffect, useState } from "react";
import { Button, Card, CardBody, CardHeader } from "@heroui/react";
import {
  listSavedJobs,
  deleteSavedJob,
} from "../../../../repositories/savedJobs";
import { useAuthInfo } from "../../../auth/utils/getCurrentUserDetails";
export default function SavedJobsPage() {
  const user = useAuthInfo();
  const [rows, setRows] = useState([]);

  useEffect(() => {
    let on = true;
    (async () => {
      if (!user?.email) return;
      const data = await listSavedJobs(user.email);
      if (on) setRows(data ?? []);
    })();
    return () => (on = false);
  }, [user?.email]);

  async function onDelete(id) {
    if (!id) return;
    const res = await deleteSavedJob(id, user.email);
    if (res?.ok) setRows((prev) => prev.filter((r) => r.id !== id));
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Saved Jobs</h1>
      {rows.length === 0 ? (
        <p className="text-gray-500">No saved jobs yet.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {rows.map((r) => (
            <Card key={r.id}>
              <CardHeader className="flex flex-col gap-1">
                <h3 className="text-lg font-semibold">{r.title}</h3>
                <p className="text-sm text-gray-500">
                  {r.company ?? "—"} • {r.location ?? "—"}
                </p>
              </CardHeader>
              <CardBody className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>{r.salary ?? "—"}</span>
                  <div className="flex gap-2">
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
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
