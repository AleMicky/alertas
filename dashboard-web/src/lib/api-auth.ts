export type AuthenticatedUser = {
  id: string;
  name: string;
  email?: string;
  accessToken: string;
  expiresAt: number;
  roles: string[];
};

type LoginResponse = {
  accessToken: string;
  expiresIn: string;
  user: {
    sub: string;
    username: string;
    email?: string;
    name: string;
    roles: string[];
  };
};

function getTokenExpiry(accessToken: string): number {
  const [, payload] = accessToken.split(".");

  if (!payload) {
    throw new Error("Token inválido");
  }

  const decoded = JSON.parse(
    Buffer.from(payload, "base64url").toString("utf8"),
  ) as { exp?: number };

  if (!decoded.exp) {
    throw new Error("Token sin expiración");
  }

  return decoded.exp * 1000;
}

export async function authenticateWithApi(
  username: string,
  password: string,
): Promise<AuthenticatedUser> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    throw new Error("NEXT_PUBLIC_API_URL no configurada");
  }

  const response = await fetch(`${apiUrl}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    throw new Error("Credenciales inválidas");
  }

  const data = (await response.json()) as LoginResponse;

  return {
    id: data.user.sub,
    name: data.user.name,
    email: data.user.email,
    accessToken: data.accessToken,
    expiresAt: getTokenExpiry(data.accessToken),
    roles: data.user.roles,
  };
}
