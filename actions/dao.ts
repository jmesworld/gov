import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { DaoMultisigQueryClient } from '../client/DaoMultisig.client';
import { IdentityserviceQueryClient } from '../client/Identityservice.client';

export async function getMyDaos(
  cosmWasmClient: CosmWasmClient,
  address: string,
  identityService: IdentityserviceQueryClient,
) {
  const client: IdentityserviceQueryClient = identityService;

  let myDaos: any = 'undefined';

  const _data: any[] = [];
  let _startAfter = 0;
  let _isDataComplete = false;
  while (!_isDataComplete) {
    const _current_batch_data = await client.daos({
      limit: 30,
      startAfter: _startAfter,
      order: 'ascending',
    });

    if (_current_batch_data.daos.length === 0) {
      _isDataComplete = true;
      break;
    }
    _data.push(..._current_batch_data.daos);
    _startAfter += 30;
  }
  _data.reverse();
  if (_data) {
    myDaos = [];
    for (const i in _data) {
      const daoAddrs = _data[i][1];

      const daoMultisigQueryClient = new DaoMultisigQueryClient(
        cosmWasmClient,
        daoAddrs,
      );

      const voter: any = await daoMultisigQueryClient.voter({
        address: address as string,
      });

      if (voter.weight >= 0 && voter.weight !== null) {
        const config = await daoMultisigQueryClient.config();
        myDaos.push({
          name: config.dao_name,
          address: daoAddrs,
        });
      }
    }
  }
  return myDaos;
}
