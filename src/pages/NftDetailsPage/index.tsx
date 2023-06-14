import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import './NftDetails.scss'
import Details from './Details'
import { IContractType } from 'constants/types'

const NftDetails = () => {
  // if (isLoading) {
  //   return (
  //     <div className="promise_error">
  //       <p>Loading...</p>
  //     </div>
  //   )
  // }

  // if (isError) {
  //   return (
  //     <div className="promise_error">
  //       <p>something went wrong</p>
  //     </div>
  //   )
  // }

  return <Details />
}

const NativeNftIndex: React.FC<{ address: string; id: string }> = ({
  address,
  id,
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const [data, setData] = useState<any>(null)

  // const handleGetData = useCallback(async () => {
  //   if (isInitialized && address && id) {
  //     try {
  //       setIsLoading(true);
  //       const options: any = {
  //         chain: "0x152",
  //         address,
  //         token_id: id,
  //       };
  //       const res = await web3Api.token.getTokenIdMetadata({ ...options });
  //       const formattedData = formatNftObject(res);

  //       if (account && provider) {
  //         if (formattedData.contract_type === IContractType.ERC1155) {
  //           const ipfsData = await getMetadataOfTokenId(
  //             account,
  //             provider,
  //             formattedData.nftContract,
  //             formattedData.tokenId,
  //             Moralis.Cloud,
  //           );
  //           formattedData.nftname = ipfsData?.name;
  //           formattedData.nftimg = ipfsData?.image;
  //           formattedData.nftattributes = ipfsData?.attributes;
  //           formattedData.nftdescription = ipfsData?.description;
  //         }
  //         formattedData.nftSeller =
  //           formattedData.contract_type === IContractType.ERC1155
  //             ? await getOwnerOfNftErc1155(
  //                 account,
  //                 provider,
  //                 formattedData.nftContract,
  //                 formattedData.tokenId,
  //               )
  //             : await getOwnerOfNft(
  //                 account,
  //                 provider,
  //                 formattedData.nftContract,
  //                 formattedData.tokenId,
  //               );
  //       }
  //       setData(formattedData);
  //       setIsLoading(false);
  //     } catch (error) {
  //       setIsLoading(false);
  //       setIsError(true);
  //     }
  //   }

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [isInitialized, address, id, account, provider, Moralis.Cloud]);

  // useEffect(() => {
  //   handleGetData();
  // }, [handleGetData]);

  if (isLoading) {
    return (
      <div className="promise_error">
        <p>Loading...</p>
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="promise_error">
        <p>something went wrong</p>
      </div>
    )
  }

  return <Details {...data} isNative={true} />
}

const NftDetailsPage: React.FC<{}> = () => {
  return <div>hello</div>
}

export default NftDetailsPage
