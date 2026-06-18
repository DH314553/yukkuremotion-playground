import fs from 'fs';
import { google }
  from 'googleapis';

const TOKEN_PATH =
  './youtube-token.json';

const CLIENT_PATH =
  './youtube-client.json';

export async function getYoutubeClient() {
  const credentials =
    JSON.parse(
      fs.readFileSync(
        CLIENT_PATH,
        'utf8'
      )
    );

  const {
    client_secret,
    client_id,
    redirect_uris,
  } =
    credentials.installed;

  const auth =
    new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uris[0]
    );

  const token =
    JSON.parse(
      fs.readFileSync(
        TOKEN_PATH,
        'utf8'
      )
    );

  auth.setCredentials(token);

  return auth;
}