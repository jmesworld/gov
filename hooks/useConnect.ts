import { useState, useEffect } from "react";
import {
  checkForKeplrInstalled,
  checkJMESInKeplr,
  addJMEStoKeplr,
} from "../actions/keplr";

/* this hook handles the logic for the 'connect wallet' button and displaying the onboarding modal

  * it checks if keplr is installed, and if it is, it checks if JMES chain is added. 
  * If both are true, users can proceed with onboarding which is a 3 step process that users must complete in its entirety or else the process is nullified and users must start over.
  
  * The 3 steps are:
    1) Connect wallet card
       - this will handle the logic for connecting the wallet, same as the 'connect wallet' button on the home page.
       - users must have keplr installed and JMES chain added.
       
    2) Add Funds Card 
       - users must have funds to pay the gas fees associated with creating an identity
 
    3) Create Identity card 
       - Once an address is funded, the user can create an identity and sign in to the app
    
  * Once all 3 steps are completed, the onboarding modal will close and the user will be able to use the app.
*/
const useConnect = () => {
  const [keplr, setKeplr] = useState();
  const [showInstallCard, setShowInstallCard] = useState(false);
  const [installingKeplr, setInstallingKeplr] = useState(false);
  const [keplrError, setKeplrError] = useState(null);
  const [keplrErrorInfo, setKeplrErrorInfo] = useState(null);
  const [keplrStatus, setKeplrStatus] = useState<any>();
  const [keplrStatusInfo, setKeplrStatusInfo] = useState(null);
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [isKeplrInstalled, setIsKeplrInstalled] = useState(false);
  const [jmesInKeplr, setJmesInKeplr] = useState(false);

  useEffect(() => {
    async function checkKeplrAndJMES() {
      const keplrInstalled = await checkForKeplrInstalled();
      setIsKeplrInstalled(keplrInstalled);
      if (keplrInstalled) {
        const jmesExists = await checkJMESInKeplr();
        setJmesInKeplr(jmesExists);
      }
    }
    checkKeplrAndJMES();
  }, []);

  const handleToggleOnboardingModal = () => {
    if (isKeplrInstalled && jmesInKeplr) {
      setShowOnboardingModal(true);
    } else if (isKeplrInstalled && !jmesInKeplr) {
      setShowOnboardingModal(true);
      addJMEStoKeplr();
    } else if (!isKeplrInstalled) {
      setShowInstallCard(true);
    }
  };

  const handleConnect = () => {
    if (!isKeplrInstalled) {
      setShowInstallCard(true);
    } else {
      setShowOnboardingModal(true);
    }
  };

  return {
    keplr,
    isKeplrInstalled,
    showInstallCard,
    installingKeplr,
    keplrError,
    keplrErrorInfo,
    keplrStatus,
    keplrStatusInfo,
    handleConnect,
    handleToggleOnboardingModal,
  };
};
export default useConnect;
