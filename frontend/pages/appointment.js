import Head from "next/head";
import BookingForm from "../components/BookingForm";
import { useRouter } from "next/router";

import "../app/globals.css";

export default function Appointment() {
  const router = useRouter();
  const { title } = router.query;
  return (
    <div>
      <Head>
        <title>Online Appointment Booking</title>
        <meta name="description" content="Book your appointment online" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <BookingForm title={title} />
      </main>
    </div>
  );
}
