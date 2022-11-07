import { DAOCosigner } from "../types";
import { Grid, Text, Input, Flex, Button } from "@chakra-ui/react";
import { useState } from "react";
import { LCDClient } from "@terra-money/terra.js";
import { IdentityserviceQueryClient } from "../../client/Identityservice.client";
import { useQuery } from "@tanstack/react-query";

const LCD_URL = process.env.NEXT_PUBLIC_LCD_URL as string;
const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID as string;
const IDENTITY_SERVICE_CONTRACT = process.env.NEXT_PUBLIC_IDENTITY_SERVICE_CONTRACT as string;

export const ProposalRecipientForm = ({
  recipients,
  setRecipients,
  setRecipientsNamesValid,
}: {
  recipients: {
    name: string;
    amount: number;
    id: number;
    address: string;
  }[];
  setRecipients: any;
  setRecipientsNamesValid: any;
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

    for (let j = 0; j < recipients.length; j++) {
      const name = recipients[j].name;
      const identityRes = await client.getIdentityByName({ name: name });
      if (identityRes.identity?.name === name) {
        identityAddrs[j] = identityRes.identity?.owner;
      } else {
        identityAddrs[j] = "Invalid identity";
      }
    }

    if (identityAddrs.includes("Invalid identity")) {
      setRecipientsNamesValid(false);
    } else {
      setRecipientsNamesValid(true);
    }
    return identityAddrs;
  }

  const idsByNamesQuery = useQuery(["identities"], getIdentitiesByNames);

  let recipientItem = recipients.map((c, i) => {
    if (idsByNamesQuery.data) {
      recipients[i].address = idsByNamesQuery.data[i];
    }
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
              recipients[i].name = event.target.value.trim();
              setRecipients(recipients);
              setRecipientsNamesValid(false);
            }}
          />
          <Input
            placeholder="amount"
            size="md"
            marginLeft={8}
            marginRight={8}
            type="number"
            width={150}
            onChange={(event) => {
              let value = parseInt(event.target.value.trim());
              recipients[i].amount = Math.ceil(value);
              setRecipients(recipients);
            }}
          />
          <Button
            variant="outline"
            hidden={c.id === 0 ? true : false}
            onClick={() => {
              let newRecipients = recipients.filter((item) => item.id !== c.id);
              setRecipients(newRecipients);
            }}
          >
            <Text fontSize={18} fontWeight="bold">
              x
            </Text>
          </Button>
        </Grid>
        <Text fontSize={12}>
          {idsByNamesQuery?.data ? idsByNamesQuery?.data[i] : ""}
        </Text>
      </>
    );
  });
  return <ul>{recipientItem}</ul>;
};
