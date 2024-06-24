import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function AuthRoute({ children }) {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Check if we are on the client side before using router
    if (typeof window !== "undefined") {
      if (!session) {
        // If the user is not authenticated, redirect to the login page
        router.push("/login");
      }
    }
  }, [session, router]);

  // If the user is authenticated or if we're on the server side, render the protected content
  return children;
}
