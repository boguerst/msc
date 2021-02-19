export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  emailVerified: boolean;
  profile: string; // A: Admin, O: Room's owner, C: Client
}
