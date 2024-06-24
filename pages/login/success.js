// Import necessary dependencies
import {  useSession } from 'next-auth/react';

// Your component or page
export default function YourPage() {
  // Use the useSession hook inside the SessionProvider
  const { data : Session, status} = useSession();
  return (
    <div>
      {status === "loading" && <div>Loading...</div>}
      {status === "authenticated" && <div>Private content</div>}
      {status === "unauthenticated" && <div>Public content</div>} <br/>
      <>
      {Session && 
      <div>
        Data:<br/>
        {"username: " + Session.user.username} <br/>
        {"id:" + Session.user.token}<br/>
        {"image:" + Session.user.image} <br/>
        {"role:" + Session.user.role} 
        
      </div>
      }
      <br/>
      {JSON.stringify(Session)}
      {!Session && <div>Data Public content</div>}
      </>
    </div>
  )
}

