import { deleteAuthCode, getAuthCodeByUserId } from "@/lib/db/actions/authCodes";
import { deletePendingUser, getPendingUserByEmail } from "@/lib/db/actions/pendingUsers";
import { createSession } from "@/lib/db/actions/sessions";
import { createUser, getUserByEmail } from "@/lib/db/actions/users";
import { validateSignupCode } from "@/lib/utils/forms";
import { generateToken } from "@/lib/utils/misc";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { email, code } = await request.json();

  const validationError = validateSignupCode(code);

  if (validationError) {
    return NextResponse.json(
      { error: validationError },
      { status: 400 }
    );
  }

  const user = await getPendingUserByEmail(email) || await getUserByEmail(email);

  if (!user) {
    return NextResponse.json(
      { error: "User not found" },
      { status: 404 }
    );
  }

  const authCode = await getAuthCodeByUserId(user.id);

  if (!authCode) {
    return NextResponse.json(
      { error: "Code not found" },
      { status: 404 }
    );
  }

  if (authCode.code !== code) {
    return NextResponse.json(
      { error: "Invalid code" },
      { status: 400 }
    );
  }

  await deleteAuthCode(authCode.id);

  if (authCode.type === "signup") {
    await deletePendingUser(user.id);
    await createUser(user.username, user.email, user.password, user.passwordSalt);
  } else {
    const token = await generateToken();
    const expiryDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
    await createSession(user.id, token, expiryDate);

    return NextResponse.json(
      { token, expiryDate },
      { status: 200 }
    );
  } 

  return NextResponse.json(
    { message: "Verification successful" },
    { status: 200 }
  );
}
