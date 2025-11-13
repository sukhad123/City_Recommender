"use client";

import { Card, CardBody, CardHeader, Button } from "@heroui/react";

export default function JobCard({ job }) {
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
        <div className="flex justify-between items-center">
          <span className="text-sm">{job.salary}</span>
          <Button
            as="a"
            href={job.url}
            target="_blank"
            rel="noopener noreferrer"
            color="secondary"
          >
            View & Apply
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}
