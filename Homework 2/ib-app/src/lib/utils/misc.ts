"use server";

import { pbkdf2Sync, randomBytes } from "crypto";
import nodemailer from "nodemailer";

export async function generateRandomCode() {
  return randomBytes(3).toString("hex");
}

export async function generateToken() {
  return randomBytes(16).toString("hex");
}

export async function generateSalt() {
  return randomBytes(16).toString("hex");
}

export async function hashPassword(password: string, salt: string) {
  return pbkdf2Sync(password, salt, parseInt(process.env.SALT_ROUNDS || "1000"), 16, 'sha512').toString('hex');
}

export async function sendEmail(to: string, subject: string, body: string) {
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_HOST,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const info = await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    text: body,
  });

  return info;
}
