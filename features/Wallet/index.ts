import dynamic from "next/dynamic";

const Wallet = dynamic(() => import("./Wallet"));

export default Wallet;
