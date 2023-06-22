import dynamic from "next/dynamic";

const loadComponent = (name: any) => dynamic(() => import(`./${name}`));
const loadComponents = () => ({
  Dao: loadComponent("Dao"),
  Wallet: loadComponent("Wallet"),
  Governance: loadComponent("Governance"),
  Onboarding: loadComponent("Onboarding"),
  Header: loadComponent("Header"),
});
export default loadComponents;
