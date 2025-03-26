export default interface MailOptions<T> {
  from: string;
  to: string;
  subject: string;
  data: T;
  html?: string;
}
