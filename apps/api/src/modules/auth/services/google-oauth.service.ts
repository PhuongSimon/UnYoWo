import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface GoogleProfile {
  googleId: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
}

interface GoogleUserInfo {
  sub: string;
  email: string;
  email_verified: boolean;
  name?: string;
  picture?: string;
}

@Injectable()
export class GoogleOAuthService {
  private readonly clientId?: string;
  private readonly clientSecret?: string;
  private readonly redirectUri: string;

  constructor(config: ConfigService) {
    this.clientId = config.get<string>('GOOGLE_CLIENT_ID') || undefined;
    this.clientSecret = config.get<string>('GOOGLE_CLIENT_SECRET') || undefined;
    this.redirectUri = config.get<string>('GOOGLE_REDIRECT_URI') ?? '';
  }

  get enabled() {
    return Boolean(this.clientId && this.clientSecret && this.redirectUri);
  }

  buildAuthUrl(state: string) {
    const params = new URLSearchParams({
      client_id: this.clientId ?? '',
      redirect_uri: this.redirectUri,
      response_type: 'code',
      scope: 'openid email profile',
      state,
      prompt: 'select_account',
    });
    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

  async exchangeCode(code: string): Promise<GoogleProfile> {
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      body: new URLSearchParams({
        code,
        client_id: this.clientId ?? '',
        client_secret: this.clientSecret ?? '',
        redirect_uri: this.redirectUri,
        grant_type: 'authorization_code',
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!tokenRes.ok) throw new Error(`Google token exchange failed: ${tokenRes.status}`);
    const { access_token } = (await tokenRes.json()) as { access_token: string };

    const infoRes = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` },
      signal: AbortSignal.timeout(8000),
    });
    if (!infoRes.ok) throw new Error(`Google userinfo failed: ${infoRes.status}`);
    const info = (await infoRes.json()) as GoogleUserInfo;
    if (!info.email_verified) throw new Error('Google email is not verified');

    return {
      googleId: info.sub,
      email: info.email.toLowerCase(),
      fullName: info.name ?? info.email.split('@')[0],
      avatarUrl: info.picture,
    };
  }
}
