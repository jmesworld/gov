import { useState } from 'react';
import { GovernanceQueryClient } from '../client/Governance.client';
import { useGovernanceProposalsQuery } from '../client/Governance.react-query';
import { ProposalQueryStatus } from '../client/Governance.types';
import { NEXT_PUBLIC_GOVERNANCE_CONTRACT } from '../config/defaults';
import { useCosmWasmClientContext } from '../contexts/CosmWasmClient';
import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { Button } from '@chakra-ui/react';

const Example = () => {
  const { cosmWasmClient } = useCosmWasmClientContext();

  const governanceQueryClient = new GovernanceQueryClient(
    cosmWasmClient as CosmWasmClient,
    NEXT_PUBLIC_GOVERNANCE_CONTRACT,
  );

  const [startBefore, setStartBefore] = useState(0);
  const [status, setStatus] = useState('active' as ProposalQueryStatus);
  const [limit, setLimit] = useState(10);

  const {
    data,
    isFetching: isLoading,
    error,
    refetch,
  } = useGovernanceProposalsQuery({
    client: governanceQueryClient,
    args: {
      status,
      limit: Number(limit) ? Number(limit) : 10,
      startBefore: startBefore ?? undefined,
    },
    options: {
      queryKey: ['governanceProposals', status, limit, startBefore],
      refetchOnWindowFocus: false,
      cacheTime: 0,
      staleTime: 0,
    },
  });

  return (
    <>
      <div>
        <p> start before</p>
        <input
          type="number"
          value={startBefore}
          onChange={e =>
            setStartBefore(
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              /// @ts-ignore
              Number(e.target.value) ? Number(e.target.value) : undefined,
            )
          }
        />
        <p> status</p>
        <select
          value={status}
          onChange={e => setStatus(e.target.value as ProposalQueryStatus)}
        >
          <option value="active">active</option>
          <option value="success_concluded">Success Concluded</option>
          <option value="expired_concluded">Expired Concluded</option>
        </select>
        <p> limit</p>
        <input
          type="number"
          value={limit}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          /// @ts-ignore
          onChange={e => setLimit(e.target.value)}
        />
        <Button onClick={() => refetch()}>refetch</Button>
      </div>

      <div>
        {isLoading && <p>loading...</p>}

        <p>data</p>
        <pre>{JSON.stringify(data, null, 2)}</pre>

        <p>error</p>
        <pre>{JSON.stringify(error, null, 2)}</pre>
      </div>
    </>
  );
};

export default Example;
