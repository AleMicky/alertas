type KeycloakTokenResponse = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  refresh_expires_in: number;
  token_type: string;
  scope?: string;
};

type KeycloakErrorResponse = {
  error?: string;
  error_description?: string;
};

function getIssuer(): string {
  const issuer = process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER?.trim();
  if (!issuer) {
    throw new Error(
      'NEXT_PUBLIC_KEYCLOAK_ISSUER no está configurado (ej. http://localhost:8080/realms/alertas)',
    );
  }
  return issuer.replace(/\/$/, '');
}

function getClientId(): string {
  return (
    process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID?.trim() || 'alertas-web'
  );
}

function tokenUrl(): string {
  return `${getIssuer()}/protocol/openid-connect/token`;
}

async function requestToken(
  body: URLSearchParams,
): Promise<KeycloakTokenResponse> {
  const response = await fetch(tokenUrl(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  });

  const payload = (await response.json()) as
    | KeycloakTokenResponse
    | KeycloakErrorResponse;

  if (!response.ok) {
    const error = payload as KeycloakErrorResponse;
    throw new Error(
      error.error_description ||
        error.error ||
        'No se pudo obtener el token de Keycloak',
    );
  }

  const tokens = payload as KeycloakTokenResponse;
  if (!tokens.access_token || !tokens.refresh_token) {
    throw new Error('Respuesta de Keycloak sin access_token o refresh_token');
  }

  return tokens;
}

export const keycloakToken = {
  login: (username: string, password: string) => {
    const body = new URLSearchParams({
      grant_type: 'password',
      client_id: getClientId(),
      username,
      password,
      scope: 'openid profile email',
    });
    return requestToken(body);
  },

  refresh: (refreshToken: string) => {
    const body = new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: getClientId(),
      refresh_token: refreshToken,
    });
    return requestToken(body);
  },
};
