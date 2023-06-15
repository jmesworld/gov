import dynamic from "next/dynamic";

const NavBar = dynamic(() => import("./NavBar"));

export { NavBar };
