import { Card, CardBody, Divider } from '@heroui/react'

export default function InfoSection({ title, subtitle, children }) {
  return (
    <Card shadow="sm">
      <CardBody className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-2">{title}</h2>
          {subtitle && (
            <p className="text-sm text-default-500">{subtitle}</p>
          )}
          <Divider className="mt-3" />
        </div>
        <div className="space-y-4">{children}</div>
      </CardBody>
    </Card>
  );
}
