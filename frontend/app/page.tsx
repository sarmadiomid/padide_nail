import Head from "next/head";
import Main from "../components/Main";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Padide nail</title>
        <meta name="description" content="Book your appointment online" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Main />
      </main>
    </div>
  );
}
