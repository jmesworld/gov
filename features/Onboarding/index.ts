import dynamic from "next/dynamic";

const OnboardingModal = dynamic(() => import("./OnboardingModal"));
const OnboardingProgressIndicator = dynamic(
  () => import("./components/OnboardingProgressIndicator")
);
const AddJMESCard = dynamic(() => import("./components/AddJMESCard"));
const AddTokensCard = dynamic(() => import("./components/AddTokensCard"));
const ChooseUsernameCard = dynamic(
  () => import("./components/ChooseUsernameCard")
);
const ConnectWalletCard = dynamic(
  () => import("./components/ConnectWalletCard")
);
const InstallKeplrCard = dynamic(() => import("./components/InstallKeplrCard"));

const Onboarding = {
  OnboardingModal,
  OnboardingProgressIndicator,
  AddJMESCard,
  AddTokensCard,
  ChooseUsernameCard,
  ConnectWalletCard,
  InstallKeplrCard,
};

export { Onboarding };
