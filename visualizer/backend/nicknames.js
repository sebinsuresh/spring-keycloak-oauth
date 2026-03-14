export const KEYCLOAK_AUTH_SERVICE = 'Keycloak-Auth-Service';
export const SPRING_BFF = 'Spring-BFF';
export const ANGULAR_CLI = 'Angular-CLI';

export const NICKNAME_MAP = new Map();
NICKNAME_MAP.set('keycloak:8080', KEYCLOAK_AUTH_SERVICE);
NICKNAME_MAP.set('host.docker.internal:8081', SPRING_BFF);
NICKNAME_MAP.set('host.docker.internal:4200', ANGULAR_CLI);

export function getNicknameFromUserAgentHdr(userAgent) {
    if (!userAgent) return null;
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';

    // For now need to assume this is BFF client and not some other app's Java client.
    if (userAgent.includes('Java-http-client/21.0.9')) return 'Spring-BFF Http client 1';
    if (userAgent.includes('Java/21.0.9')) return 'Spring-BFF Http client 2';

    return null;
}

export function resolveNickname(name, port, userAgent) {
    if (!name && (port == null)) return undefined;

    const key = `${name}:${port}`;

    let resolvedNickname = NICKNAME_MAP.get(key);
    if (!resolvedNickname) {
        const detectedSource = getNicknameFromUserAgentHdr(userAgent);
        resolvedNickname = detectedSource;

        if (!resolvedNickname) {
            resolvedNickname = key + (userAgent ? ` (${userAgent})` : '');
        }
    }
    return resolvedNickname;
}
