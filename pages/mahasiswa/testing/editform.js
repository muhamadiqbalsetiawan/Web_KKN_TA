import useSWR from 'swr';
import EditForm from '@/components/testing/EditForm';
import Link from 'next/link';
import AuthRoute from '@/components/AuthRoute';
import { useSession } from 'next-auth/react';

export default function Editform({user}) {
  const { data: session } = useSession();
  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const { data, error } = useSWR('/api/mahasiswa/query', fetcher);

  if (!session) {
    // If the user is not authenticated, redirect to the login page
    return (
      <div>
        Redirecting to login...
      </div>
    );
  }

  if (!data && !error) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching data: {error.message}</div>;
  }

  return (
    <AuthRoute>
    <div className="read">
      <div>
      <Link href="/mahasiswa/protected">Home</Link>
      </div>
      <div>
      {data.map((item) => (
        <div key={item.mhs_nim} className="mhs">
          <EditForm data={item} />
        </div>
      ))}
      </div>
    </div>
    </AuthRoute>
  );
}
