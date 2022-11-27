import { DAOCosigner } from "../types";
import { Grid, Text, Input, Flex, Button } from "@chakra-ui/react";
import { Fragment, useState } from "react";
import { LCDClient } from "@terra-money/terra.js";
import { IdentityserviceQueryClient } from "../../client/Identityservice.client";
import { useQuery } from "@tanstack/react-query";

const LCD_URL = process.env.NEXT_PUBLIC_LCD_URL as string;
const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID as string;
const IDENTITY_SERVICE_CONTRACT = process.env
  .NEXT_PUBLIC_IDENTITY_SERVICE_CONTRACT as string;

export const ProposalDaoRemoveMembers = ({
  removeMembers,
  setRemoveMembers,
  setRemoveMembersNamesValid,
  daoAddress,
}: {
  removeMembers: {
    name: string;
    id: number;
    address: string;
    percentage: number;
  }[];
  setRemoveMembers: any;
  setRemoveMembersNamesValid: any;
  daoAddress: string;
}) => {
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

    for (let j = 0; j < removeMembers.length; j++) {
      const name = removeMembers[j].name;
      const identityRes = await client.getIdentityByName({ name: name });
      if (identityRes.identity?.name === name) {
        identityAddrs[j] = identityRes.identity?.owner;
      } else {
        identityAddrs[j] = "Invalid identity";
      }
    }

    if (identityAddrs.includes("Invalid identity")) {
      setRemoveMembersNamesValid(false);
    } else {
      setRemoveMembersNamesValid(true);
    }
    return identityAddrs;
  }

  const idsByNamesQuery = useQuery(["identitiesRemoveMembers"], getIdentitiesByNames);

  const [focusedRemoveMembersCosignerIndex, setFocusedRemoveMembersCosignerIndex] = useState(Infinity);

  let removeMembersItem = removeMembers.map((c, i) => {
    if (idsByNamesQuery.data) {
      removeMembers[i].address = idsByNamesQuery.data[i];
    }
    return (
      <Fragment key={c.id}>
        <Grid
          key={i}
          templateColumns="repeat(3, 1fr)"
          templateRows="repeat(1, 1fr)"
          marginTop={4}
        >
          <Input
            placeholder={c.id === 0 ? c.name : "Type name here"}
            size="md"
            marginBottom={2}
            marginRight={8}
            width={300}
            disabled={c.id === 0 ? true : false}
            onChange={(event) => {
              removeMembers[i].name = event.target.value.trim();
              setRemoveMembers(removeMembers);
              setRemoveMembersNamesValid(false);
            }}
            onFocus={() => {
              setFocusedRemoveMembersCosignerIndex(i);
            }}
            onBlur={() => idsByNamesQuery.refetch()}
          />
          <Button
            variant="outline"
            hidden={c.id === 0 ? true : false}
            onClick={() => {
              let newRemoveMembers = removeMembers.filter((item) => item.id !== c.id);
              setRemoveMembers(newRemoveMembers);
            }}
          >
            <Text fontSize={18} fontWeight="bold">
              x
            </Text>
          </Button>
        </Grid>
        <Text fontSize={12}>
          {removeMembers[i].name.length > 0
            ? !idsByNamesQuery.isFetching
              ? idsByNamesQuery?.data?.at(i)
              : (
                i === focusedRemoveMembersCosignerIndex ? "Checking...": idsByNamesQuery?.data?.at(i)
              )
            : ""}
        </Text>
      </Fragment>
    );
  });
  return <ul>{removeMembersItem}</ul>;
};
