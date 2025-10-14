"use client";

import { useState, useEffect, useRef } from "react";
import {
  Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,
  Button, Input, Textarea,
} from "@heroui/react";
import { sendContactEmail } from "../../repositories/contact";

export default function ContactFormModal({ isOpen, onClose, supportEmail = "support@example.com" }) {

  const [name, setName]       = useState("");
  const [email, setEmail]     = useState("");
  const [message, setMessage] = useState("");

  const [errors, setErrors]   = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);

  const nameRef    = useRef(null);
  const emailRef   = useRef(null);
  const messageRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      setName(""); setEmail(""); setMessage("");
      setErrors({ name: "", email: "", message: "" });
      setSending(false); setSuccess(false);
    }
  }, [isOpen]);

  const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
  const fieldError = (field, value) => {
    const v = (value ?? "").trim();
    if (field === "name" && !v) return "Name is required";
    if (field === "email" && !v) return "Email is required";
    if (field === "email" && v && !isEmail(v)) return "Enter a valid email";
    if (field === "message" && !v) return "Message is required";
    return "";
  };

  const validateAll = ({ name, email, message }) => ({
    name: fieldError("name", name),
    email: fieldError("email", email),
    message: fieldError("message", message),
  });

  const firstErrorKey = (errs) =>
    (errs.name && "name") || (errs.email && "email") || (errs.message && "message") || "";

  const focusField = (key) => {
    if (key === "name" && nameRef.current) nameRef.current.focus();
    else if (key === "email" && emailRef.current) emailRef.current.focus();
    else if (key === "message" && messageRef.current) messageRef.current.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fd = new FormData(e.currentTarget);
    const nameNow = String(fd.get("name") || "");
    const emailNow = String(fd.get("email") || "");
    const messageNow = String(fd.get("message") || "");

    if (name !== nameNow) setName(nameNow);
    if (email !== emailNow) setEmail(emailNow);
    if (message !== messageNow) setMessage(messageNow);

    const nextErrors = validateAll({ name: nameNow, email: emailNow, message: messageNow });
    setErrors(nextErrors);

    const bad = firstErrorKey(nextErrors);
    if (bad) {
      focusField(bad);
      return;
    }

    try {
      setSending(true);
      await sendContactEmail({ name: nameNow, email: emailNow, message: messageNow });
      setSuccess(true);
    } catch {
      setErrors((prev) => ({ ...prev, message: "Failed to send. Please try again or email us directly." }));
      focusField("message");
    } finally {
      setSending(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} backdrop="blur">
      <ModalContent>
        <ModalHeader>Contact Us</ModalHeader>

        {success ? (
          <>
            <ModalBody>
              <p className="text-green-600 font-medium">Message sent successfully!</p>
              <p>We’ll get back to you at <span className="font-medium">{email}</span> soon.</p>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onPress={onClose}>Close</Button>
            </ModalFooter>
          </>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <ModalBody className="space-y-4">
              <Input
                name="name"
                inputRef={nameRef}
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)} 
                onBlur={() => setErrors((p) => ({ ...p, name: fieldError("name", name) }))}
                isInvalid={!!errors.name}
                errorMessage={errors.name}
              />
              <Input
                name="email"
                inputRef={emailRef}
                type="email"
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setErrors((p) => ({ ...p, email: fieldError("email", email) }))}
                isInvalid={!!errors.email}
                errorMessage={errors.email}
              />
              <Textarea
                name="message"
                ref={messageRef}
                label="Message"
                minRows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)} 
                onBlur={() => setErrors((p) => ({ ...p, message: fieldError("message", message) }))}
                isInvalid={!!errors.message}
                errorMessage={errors.message}
              />

              <div className="text-sm text-gray-500">
                Can’t submit? Email us at{" "}
                <a href={`mailto:${supportEmail}`} className="underline">
                  {supportEmail}
                </a>.
              </div>
            </ModalBody>

            <ModalFooter>
              <Button type="button" onPress={onClose} disabled={sending}>Cancel</Button>
              <Button type="submit" color="primary" isLoading={sending}>
                {sending ? "Sending..." : "Send"}
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
}
