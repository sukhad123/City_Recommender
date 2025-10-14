"use client";

import Link from "next/link";
import { Card, CardBody, Button, Divider } from "@heroui/react";
import { CheckCircle2, MapPin, MessageSquare, Brain } from "lucide-react";

function Bullet({ icon: Icon, children }) {
  return (
    <li className="flex items-start gap-3">
      <Icon className="h-5 w-5 mt-0.5" aria-hidden />
      <span className="text-base leading-relaxed">{children}</span>
    </li>
  );
}

export default function AboutSection() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 my-12"
    >
<Card
  shadow="lg"
  className="rounded-3xl bg-content1 text-white" 
>
  <CardBody className="p-6 sm:p-10">
   
    <header className="max-w-3xl">
      <p className="text-xs uppercase tracking-wider opacity-80">
        PRJ666 Team 9
      </p>
      <h2
        id="about-heading"
        className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight"
      >
        About City Recommender
      </h2>
      <p className="mt-3 text-base sm:text-lg opacity-90">
        We help newcomers and residents find the right Canadian city —
        balancing budget, commute, lifestyle, and essentials.
      </p>
    </header>

          <Divider className="my-8" />

         
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
       
            <div className="lg:col-span-3 space-y-4">
              <p className="text-base leading-relaxed">
                Our approach blends a <strong>machine-learning recommendation</strong> model
                with <strong>lived-experience city reviews</strong>. The result is a simple,
                trustworthy way to compare places and decide with confidence—without noisy dashboards
                or dark patterns.
              </p>
              <ul className="space-y-3">
                <Bullet icon={MapPin}>Actionable city profiles: cost of living, jobs, schools, healthcare, community.</Bullet>
                <Bullet icon={MessageSquare}>Concise, moderated reviews that value useful signal over hype.</Bullet>
                <Bullet icon={Brain}>Smart matching tuned to what matters to you.</Bullet>
              </ul>
              <p className="text-base leading-relaxed">
                Built with clarity, accessibility, and privacy in mind.
              </p>
            </div>

         
            <aside className="lg:col-span-2">
              <div className="rounded-2xl border border-default-200/60 p-5 bg-content2/40">
                <h3 className="text-lg font-medium">Why trust us</h3>
                <ul className="mt-3 space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 mt-0.5" aria-hidden />
                    <span>Readable, skimmable layouts (WCAG-friendly)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 mt-0.5" aria-hidden />
                    <span>Privacy-first, no dark patterns</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 mt-0.5" aria-hidden />
                    <span>Evidence over hype: practical data + real experiences</span>
                  </li>
                </ul>

                <div className="mt-5 flex flex-wrap gap-3">
                  <Button
                    as={Link}
                    href="/about"
                    color="primary"
                    className="min-w-[128px]"
                    aria-label="Learn more about our mission and approach"
                  >
                    Learn more
                  </Button>
                 
                </div>
              </div>
            </aside>
          </div>
        </CardBody>
      </Card>
    </section>
  );
}
