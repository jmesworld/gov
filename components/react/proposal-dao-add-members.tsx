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

export const ProposalDaoAddMembers = ({
  addMembers,
  setAddMembers,
  setAddMembersNamesValid,
  daoAddress,
}: {
  addMembers: {
    name: string;
    id: number;
    address: string;
    percentage: number;
  }[];
  setAddMembers: any;
  setAddMembersNamesValid: any;
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

    for (let j = 0; j < addMembers.length; j++) {
      const name = addMembers[j].name;
      const identityRes = await client.getIdentityByName({ name: name });
      if (identityRes.identity?.name === name) {
        identityAddrs[j] = identityRes.identity?.owner;
      } else {
        identityAddrs[j] = "Invalid identity";
      }
    }

    if (identityAddrs.includes("Invalid identity")) {
      setAddMembersNamesValid(false);
    } else {
      setAddMembersNamesValid(true);
    }
    return identityAddrs;
  }

  const idsByNamesQuery = useQuery(
    ["identitiesAddMembers"],
    getIdentitiesByNames
  );

  const [addMembersFocusedCosignerIndex, setAddMembersFocusedCosignerIndex] =
    useState(Infinity);

  let addMembersItem = addMembers.map((c, i) => {
    if (idsByNamesQuery.data) {
      addMembers[i].address = idsByNamesQuery.data[i];
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
            width={300}
            disabled={c.id === 0 ? true : false}
            onChange={(event) => {
              addMembers[i].name = event.target.value.trim();
              setAddMembers(addMembers);
              setAddMembersNamesValid(false);
            }}
            onFocus={() => {
              setAddMembersFocusedCosignerIndex(i);
            }}
            onBlur={() => idsByNamesQuery.refetch()}
          />
          <Input
            placeholder="% vote power"
            size="md"
            marginLeft={8}
            marginRight={8}
            type="number"
            width={120}
            max={99}
            onChange={(event) => {
              let value = parseInt(event.target.value.trim());
              if (value >= 100) {
                event.target.value = "100";
              }
              addMembers[i].percentage = value;
              setAddMembers(addMembers);
            }}
          />
          <Button
            variant="outline"
            hidden={c.id === 0 ? true : false}
            onClick={() => {
              let newAddMembers = addMembers.filter((item) => item.id !== c.id);
              setAddMembers(newAddMembers);
            }}
          >
            <Text fontSize={18} fontWeight="bold">
              x
            </Text>
          </Button>
        </Grid>
        <Text fontSize={12}>
          {addMembers[i].name.length > 0
            ? !idsByNamesQuery.isFetching
              ? idsByNamesQuery?.data?.at(i)
              : i === addMembersFocusedCosignerIndex
              ? "Checking..."
              : idsByNamesQuery?.data?.at(i)
            : ""}
        </Text>
      </Fragment>
    );
  });
  return <ul>{addMembersItem}</ul>;
};
