import { JwtPayload } from "jsonwebtoken";

interface UserData {
  userID: string;
  firstName: string;
  lastName: string;
  email: string;
}

export default interface CustomJwtPayload extends JwtPayload {
  userData: UserData;
}
