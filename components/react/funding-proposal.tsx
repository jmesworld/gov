import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  Input,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { ProposalRecipientForm } from "./proposal-recipient-form";

export const FundingProposal = ({
  recipients,
  setProposalName,
  setProposalDesc,
  setRecipients,
  setRecipientsNamesValid,
  proposalDesc,
  proposalName,
  proposalMutation,
  isRecipientsNamesValid,
}: {
  recipients: any[];
  setProposalName: any;
  setProposalDesc: any;
  setRecipients: any;
  setRecipientsNamesValid: any;
  proposalDesc: any;
  proposalName: any;
  proposalMutation: any;
  isRecipientsNamesValid: any;
}) => {
  return (
    <Container>
      <Box>
        <Text marginBottom={2} fontSize={24}>
          PROPOSAL NAME
        </Text>
        <Input
          marginBottom={4}
          placeholder="Type your Proposal name here"
          size="lg"
          onChange={(event) => {
            setProposalName(event.target.value.trim());
          }}
        ></Input>
        <Text marginBottom={2} fontSize={24}>
          DESCRIPTION
        </Text>
        <Textarea
          marginBottom={2}
          placeholder="Enter your description here"
          size="lg"
          onChange={(event) => {
            setProposalDesc(event.target.value.trim());
          }}
        ></Textarea>
        <Grid
          templateColumns="repeat(2, 1fr)"
          templateRows="repeat(1, 1fr)"
          marginTop={8}
        >
          <Text fontSize={24}>RECIPIENT</Text>
          <Flex justifyContent="end">
            <Button
              variant="outline"
              width={100}
              onClick={() => {
                setRecipients((recipients: string | any[]) => [
                  ...recipients,
                  {
                    name: "",
                    amount: 0,
                    id: recipients.length + 1,
                    address: "",
                  },
                ]);
              }}
            >
              <Text fontSize={18} fontWeight="bold">
                +
              </Text>
            </Button>
          </Flex>
          <ProposalRecipientForm
            recipients={recipients}
            setRecipients={setRecipients}
            setRecipientsNamesValid={setRecipientsNamesValid}
          />
        </Grid>
        <Flex justifyContent="center" margin={8}>
          <Button
            disabled={
              !(
                isRecipientsNamesValid &&
                proposalName.length > 2 &&
                proposalDesc.length > 2
              )
            }
            width={250}
            height={50}
            variant="outline"
            color="white"
            bgColor="primary.500"
            onClick={() => proposalMutation.mutate()}
          >
            {" "}
            Create DAO Proposal{" "}
          </Button>
        </Flex>
      </Box>
    </Container>
  );
};
