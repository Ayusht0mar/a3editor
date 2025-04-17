import "next-auth"

declare module "next-auth" {
  interface User {
    id: string
    username?: string
    providers?: string[]
  }
  
  interface Session {
    user: User
  }
} 