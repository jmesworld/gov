import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { useQuery } from "@tanstack/react-query";
import { getMyDaos } from "../actions/dao";

export function useMyDaosList(
  address: string,
  cosmWasmClient: CosmWasmClient,
  setDataUpdated: Function
) {
  return useQuery(["myDaos"], () => getMyDaos(cosmWasmClient, address), {
    onSuccess: (data) => {
      let storeData = new Map<string, any>();
      storeData.set(address as string, data);
      localStorage.setItem(
        "myDaosData",
        JSON.stringify(Object.fromEntries(storeData))
      );
      setDataUpdated(true);
    },
    refetchInterval: 10,
  });
}
