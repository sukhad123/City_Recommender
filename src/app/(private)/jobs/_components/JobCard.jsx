"use client";

import { useState } from "react";
import { Card, CardBody, CardHeader, Button } from "@heroui/react";
import { saveJobForUser } from "../../../../repositories/savedJobs";
import { useAuthInfo } from "../../../auth/utils/getCurrentUserDetails";

export default function JobCard({ job }) {
  const user = useAuthInfo();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function onSave() {
    if (!user?.email) return;
    setSaving(true);
    const res = await saveJobForUser(job, user.email);
    setSaving(false);
    if (res?.ok) setSaved(true);
  }

  return (
    <Card shadow="sm" className="overflow-hidden">
      <CardHeader className="flex flex-col gap-1">
        <h3 className="text-lg font-semibold">{job.title}</h3>
        <p className="text-sm text-gray-500">
          {job.company} • {job.location}
        </p>
      </CardHeader>
      <CardBody className="space-y-3">
        <p className="text-sm text-gray-600 line-clamp-3">{job.snippet}</p>
        <div className="flex justify-between items-center gap-2">
          <span className="text-sm">{job.salary}</span>
          <div className="flex gap-2">
            <Button
              as="a"
              href={job.url}
              target="_blank"
              rel="noopener noreferrer"
              color="secondary"
            >
              View & Apply
            </Button>
            <Button
              color={saved ? "success" : "primary"}
              variant={saved ? "flat" : "solid"}
              onPress={onSave}
              isLoading={saving}
              isDisabled={saved}
            >
              {saved ? "Saved" : "Save"}
            </Button>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
