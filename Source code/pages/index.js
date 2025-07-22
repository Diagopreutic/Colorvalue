import Head from "next/head";
import ColorPicker from "../components/ColorPicker";

export default function Home() {
  return (
    <div>
      <Head>
        <title>colourValue</title>
        <meta name="description" content="Generateds value of a colour selected" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <ColorPicker />
    </div>
  );
}
