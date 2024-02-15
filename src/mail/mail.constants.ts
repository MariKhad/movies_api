export const FROM_EMAIL = 'marina89eng@gmail.com';
const MAIL_SERVER = 'smtp.gmail.com';
const MAIL_TOKEN = 'htnf gwow azhj aztx';
export const SETTINGS = {
  host: MAIL_SERVER,
  port: 465,
  secure: true,
  logger: true,
  auth: {
    user: FROM_EMAIL,
    pass: MAIL_TOKEN,
  },
};
