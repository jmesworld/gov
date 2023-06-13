import dynamic from "next/dynamic";
const Content = dynamic(() => import("./Content"));

export default function Home() {
  return (
    <>
      <Content />;
    </>
  );
}
