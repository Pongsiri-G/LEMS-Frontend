"use client"

import { ReactNode, useEffect } from "react"

export default function ProtectedRoute({
  children,
  roles,
}: {
  children: ReactNode
  roles?: ("admin" | "user")[]
}) {
  // const { isAuthenticated, isLoading } = useAuth()
  // const { isAuthenticated } = useSelector(authSelector)

  // const router = useRouter()

  // useEffect(() => {
  //   // if ( isLoading) return;
    
  //   if (!isAuthenticated) {
  //     router.replace("/login")
  //   } 
  //   // else if (roles && user) { // !roles.includes(user.role)
  //   //   router.replace("/403")
  //   // }
  // }, [isAuthenticated])

  // // if (isLoading) return <p>Loading...</p>
  
  // if (!isAuthenticated) return null

  return <div>{children}</div>
}
