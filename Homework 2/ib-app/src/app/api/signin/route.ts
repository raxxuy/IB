import { NextResponse } from "next/server";
import { validateSigninForm } from "@/lib/utils/forms";
import { getUserByEmail } from "@/lib/db/actions/users";
import { createAuthCode } from "@/lib/db/actions/authCodes";
import { generateRandomCode, hashPassword, sendEmail } from "@/lib/utils/misc";
import { SigninFormData } from "@/app/auth/signin/signin-form";

export async function POST(request: Request) {
  const body: SigninFormData = await request.json();

  const validationError = validateSigninForm(body);

  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const user = await getUserByEmail(body.email);

  if (!user) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 400 });
  }

  const hashedPassword = await hashPassword(body.password, user.passwordSalt);

  if (user.password !== hashedPassword) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 400 });
  }

  const code = await generateRandomCode();
  const expiryDate = new Date(Date.now() + 1000 * 60 * 5);

  // Send authentication email and store code
  await Promise.all([
    sendEmail(body.email, "Authenticate your account", `Your authentication code is ${code}`),
    createAuthCode(user.id, code, "signin", expiryDate)
  ]);

  return NextResponse.json(
    { message: "Signin successful, check your email for authentication" },
    { status: 201 }
  );
}
