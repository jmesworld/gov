import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { useQuery } from "@tanstack/react-query";
import { getMyDaos } from "../actions/dao";
import { useEffect } from "react";

export function useMyDaosList(
  address: string,
  cosmWasmClient: CosmWasmClient,
  setSelectedDao: Function,
  setSelectedDaoName: Function,
  callback: Function
) {
  const updateLocalStorage = (data: any) => {
    let storeData = new Map<string, any>();
    storeData.set(address as string, data);
    const newData = Object.fromEntries(storeData);

    const existingData = localStorage.getItem("myDaosData");
    const existingParsedData = existingData ? JSON.parse(existingData) : {};

    // Compare new data with existing data
    if (JSON.stringify(newData) !== JSON.stringify(existingParsedData)) {
      localStorage.setItem("myDaosData", JSON.stringify(newData));

      //Automatically select the newly created Dao
      if (!!existingData) {
        setSelectedDao(newData[address][0]?.address);
        setSelectedDaoName(newData[address][0]?.name);
        callback();
      }
    }
  };

  useEffect(() => {
    // Event listener for 'storage' event
    const handleStorageUpdate = (event: StorageEvent) => {
      if (event.key === "myDaosData") {
        const storedData = JSON.parse(event.newValue as string);
        const newData = storedData[address];
        if (newData) {
          updateLocalStorage(newData);
        }
      }
    };

    // Add event listener
    window.addEventListener("storage", handleStorageUpdate);

    return () => {
      // Clean up the event listener on component unmount
      window.removeEventListener("storage", handleStorageUpdate);
    };
  }, [address, setSelectedDao]);

  return useQuery(["myDaos"], () => getMyDaos(cosmWasmClient, address), {
    onSuccess: (data) => updateLocalStorage(data),
    refetchInterval: 10000,
  });
}
