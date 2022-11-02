import { DAOCosigner } from "../types";
import { Grid, Text, Input, Flex, Button } from "@chakra-ui/react";
export const DAOCosignerForm = ({
  cosigners,
  setCosigners,
  owner,
  cosignersTotalWeight,
  setCosignersTotalWeight
}: {
  cosigners: DAOCosigner[];
  setCosigners: any;
  owner: {
    name: string,
    address: string
  };
  cosignersTotalWeight: number[];
  setCosignersTotalWeight: any;
}) => {
  let ownerData: DAOCosigner = {
    name: owner.name,
    id: 0,
    weight: 0,
  }
  cosigners[0] = ownerData;
  let cosignerItem = cosigners.map((c, i) => {
    return (
      <Grid
        key={c.id}
        templateColumns="repeat(3, 1fr)"
        templateRows="repeat(1, 1fr)"
        marginTop={4}
      >
        <Input
          placeholder={c.id === 0 ? c.name : "Type name here"}
          size="md"
          marginBottom={8}
          width={300}
          disabled = {c.id === 0 ? true : false}
          onChange={(event) => {
            cosigners[i].name = event.target.value.trim();
            setCosigners(cosigners);
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
            const value = parseInt(event.target.value.trim());
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
            cosignersTotalWeight[i] = 0
            setCosignersTotalWeight(cosignersTotalWeight);
            let newCosigners = cosigners.filter(item => item.id !== c.id);
            setCosigners(newCosigners);
          }}
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
