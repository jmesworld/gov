import { DAOCosigner } from "../types";
import { Grid, Text, Input, Flex, Button } from "@chakra-ui/react";
import { useState } from "react";
import { LCDClient } from "@terra-money/terra.js";
import { IdentityserviceQueryClient } from "../../client/Identityservice.client";
import { useQuery } from "@tanstack/react-query";

const LCD_URL = process.env.NEXT_PUBLIC_LCD_URL as string;
const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID as string;
const IDENTITY_SERVICE_CONTRACT = process.env
  .NEXT_PUBLIC_IDENTITY_SERVICE_CONTRACT as string;

export const DAOCosignerForm = ({
  cosigners,
  setCosigners,
  owner,
  cosignersTotalWeight,
  setCosignersTotalWeight,
  setIdNamesValid,
}: {
  cosigners: DAOCosigner[];
  setCosigners: any;
  owner: {
    name: string;
    address: string;
  };
  cosignersTotalWeight: number[];
  setCosignersTotalWeight: any;
  setIdNamesValid: any;
}) => {
  let ownerData: DAOCosigner = {
    name: owner.name,
    id: 0,
    weight: 0,
  };
  cosigners[0] = ownerData;

  const LCDOptions = {
    URL: LCD_URL,
    chainID: CHAIN_ID,
  };

  const lcdClient = new LCDClient(LCDOptions);
  const client: IdentityserviceQueryClient = new IdentityserviceQueryClient(
    lcdClient,
    IDENTITY_SERVICE_CONTRACT
  );

  async function getIdentitiesByNames() {
    let identityAddrs = new Array();

    for (let j = 0; j < cosigners.length; j++) {
      const name = cosigners[j].name;
      const identityRes = await client.getIdentityByName({ name: name });
      if (identityRes.identity?.name === name) {
        identityAddrs[j] = identityRes.identity?.owner;
      } else {
        identityAddrs[j] = "Invalid identity";
      }
    }

    if (identityAddrs.includes("Invalid identity")) {
      setIdNamesValid(false);
    } else {
      setIdNamesValid(true);
    }
    return identityAddrs;
  }

  const idsByNamesQuery = useQuery(["identities"], getIdentitiesByNames);

  let cosignerItem = cosigners.map((c, i) => {
    return (
      <>
        <Grid
          key={c.id}
          templateColumns="repeat(3, 1fr)"
          templateRows="repeat(1, 1fr)"
          marginTop={4}
        >
          <Input
            placeholder={c.id === 0 ? c.name : "Type name here"}
            size="md"
            marginBottom={2}
            width={300}
            disabled={c.id === 0 ? true : false}
            onChange={(event) => {
              cosigners[i].name = event.target.value.trim();
              setCosigners(cosigners);
              setIdNamesValid(false);
            }}
          />
          <Input
            placeholder="% vote power"
            size="md"
            marginLeft={8}
            marginRight={8}
            type="number"
            width={150}
            onChange={(event) => {
              let value = parseInt(event.target.value.trim());
              cosignersTotalWeight[i] = value;
              setCosignersTotalWeight(cosignersTotalWeight);
              cosigners[i].weight = Math.ceil((value / 100) * cosigners.length);
              setCosigners(cosigners);
            }}
          />
          <Button
            variant="outline"
            hidden={c.id === 0 ? true : false}
            onClick={() => {
              cosignersTotalWeight[i] = 0;
              setCosignersTotalWeight(cosignersTotalWeight);
              let newCosigners = cosigners.filter((item) => item.id !== c.id);
              setCosigners(newCosigners);
            }}
          >
            <Text fontSize={18} fontWeight="bold">
              x
            </Text>
          </Button>
        </Grid>
        <Text fontSize={12}>
          {
            // @ts-ignore
            !idsByNamesQuery.isLoading && idsByNamesQuery.data[i] !== undefined
              ? // @ts-ignore
                idsByNamesQuery?.data[i]
              : cosigners[i].name.length > 1
              ? "Loading"
              : ""
          }
        </Text>
      </>
    );
  });
  return <ul>{cosignerItem}</ul>;
};
