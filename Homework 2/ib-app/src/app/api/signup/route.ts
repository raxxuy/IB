import { NextResponse } from "next/server";
import { SignupFormData } from "@/app/auth/signup/signup-form";
import { validateSignupForm } from "@/lib/utils/forms";
import { createPendingUser, getPendingUserByEmail, getPendingUserByUsername } from "@/lib/db/actions/pendingUsers";
import { getUserByEmail, getUserByUsername } from "@/lib/db/actions/users";
import { createAuthCode } from "@/lib/db/actions/authCodes";
import { generateRandomCode, generateSalt, hashPassword, sendEmail } from "@/lib/utils/misc";

export async function POST(request: Request) {
  const body: SignupFormData = await request.json();

  const validationError = validateSignupForm(body);

  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  // Check for existing username/email
  const existingUser = await getUserByUsername(body.username) || await getPendingUserByUsername(body.username);
  const existingEmail = await getUserByEmail(body.email) || await getPendingUserByEmail(body.email);

  if (existingUser || existingEmail) {
    return NextResponse.json({ error: "Username or email already taken" }, { status: 400 });
  }
  
  // Create pending user and verification code
  const salt = await generateSalt();
  const hashedPassword = await hashPassword(body.password, salt);
  const user = await createPendingUser(body.username, body.email, hashedPassword, salt);
  const code = await generateRandomCode();
  const expiryDate = new Date(Date.now() + 1000 * 60 * 5);

  // Send verification email and store code
  await Promise.all([
    sendEmail(body.email, "Verify your email", `Your verification code is ${code}`),
    createAuthCode(user.id, code, "signup", expiryDate)
  ]);

  return NextResponse.json(
    { message: "Signup successful, check your email for verification" },
    { status: 201 }
  );
}
