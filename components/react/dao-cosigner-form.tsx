import { DAOCosigner } from "../types";
import { Grid, Text, Input, Flex, Button } from "@chakra-ui/react";
export const DAOCosignerForm = ({
  cosigners,
  setCosigners,
}: {
  cosigners: DAOCosigner[];
  setCosigners: any;
}) => {
  const cosignerItem = cosigners.map((c, i) => {
    return (
      <Grid
        key={i}
        templateColumns="repeat(3, 1fr)"
        templateRows="repeat(1, 1fr)"
        marginTop={4}
      >
        <Input placeholder="Type name" size="md" marginBottom={8} width={300} onChange={(event) => {
          cosigners[i].name = event.target.value.trim();
          setCosigners(cosigners);
        }} />
        <Input
          placeholder="% vote power"
          size="md"
          marginLeft={8}
          marginRight={8}
          type = 'number'
          width={150} onChange={(event) => {
            const value = parseInt(event.target.value.trim());
            cosigners[i].weight = Math.ceil((value / 100) * cosigners.length);
            setCosigners(cosigners);
          }}
        />
        <Button
          variant="outline"
          onClick={() =>
            setCosigners((cosigners: []) => [...cosigners])
          }
        >
          <Text fontSize={18} fontWeight="bold">
            x
          </Text>
        </Button>
      </Grid>
    );
  });
  return <ul>{cosignerItem}</ul>;
};
