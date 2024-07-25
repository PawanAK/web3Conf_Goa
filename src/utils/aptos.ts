import { Aptos } from "@aptos-labs/ts-sdk";

export const aptos = new Aptos();

export const getFaBalance = async (
  ownerAddress: string,
  assetType: string
): Promise<number> => {
  const data = await aptos.getCurrentFungibleAssetBalances({
    options: {
      where: {
        owner_address: { _eq: ownerAddress },
        asset_type: { _eq: assetType },
      },
    },
  });
  return data[0]?.amount ?? 0;
};
