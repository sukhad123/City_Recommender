import { Card, CardBody, Image } from '@heroui/react'
import { MapPin } from 'lucide-react'

export default function CityHeader({ title, subtitle, imageUrl }) {
  return (
    <Card className="overflow-hidden" shadow="lg">
      <div className="relative h-64 w-full">
        <Image
          src={imageUrl}
          alt={title}
          className="h-64 w-full object-cover"
          radius="none"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>
      <CardBody className="px-6 py-6">
        <div className="flex items-center gap-3 mb-2">
          <MapPin size={24} className="text-primary" />
          <h1 className="text-3xl font-bold text-foreground">{title}</h1>
        </div>
        {subtitle && (
          <p className="text-default-500 text-lg">{subtitle}</p>
        )}
      </CardBody>
    </Card>
  );
}
