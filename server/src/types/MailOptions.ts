export default interface MailOptions {
  from: string;
  to: string;
  subject: string;
  data: string;
  html?: string;
}
