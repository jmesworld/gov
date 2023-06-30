import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { DaoMembersQueryClient } from '../client/DaoMembers.client';
import { DaoMultisigQueryClient } from '../client/DaoMultisig.client';
import { IdentityserviceQueryClient } from '../client/Identityservice.client';

const LCD_URL = process.env.NEXT_PUBLIC_LCD_URL as string;
const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID as string;
const IDENTITY_SERVICE_CONTRACT = process.env
  .NEXT_PUBLIC_IDENTITY_SERVICE_CONTRACT as string;
const NEXT_PUBLIC_GOVERNANCE_CONTRACT = process.env
  .NEXT_PUBLIC_GOVERNANCE_CONTRACT as string;

export async function getMyDaos(
  cosmWasmClient: CosmWasmClient,
  address: string,
  identityService?: IdentityserviceQueryClient,
) {
  const client: IdentityserviceQueryClient =
    identityService ??
    new IdentityserviceQueryClient(cosmWasmClient, IDENTITY_SERVICE_CONTRACT);

  let myDaos: any = 'undefined';

  let _data: any[] = [];
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
      const daoMembersQueryClient = new DaoMembersQueryClient(
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
