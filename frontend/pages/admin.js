import Head from "next/head";
import AdminPanel from "../components/AdminPanel";
import "../app/globals.css";

export default function Admin() {
  return (
    <div>
      <Head>
        <title>Admin Panel</title>
        <meta name="description" content="Manage appointments" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <AdminPanel />
      </main>
    </div>
  );
}
