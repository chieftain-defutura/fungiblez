import React from 'react'

// import { ReactComponent as HeartIcon } from "assets/icons/heart.svg";
import { ReactComponent as CronosIcon } from 'assets/icons/cronos.svg'
import { LazyImage } from 'components'
import CardControls from './components/CardControls'

// const RenderCollectionDetails = () => {
//   return (
//     <div className="nft_collection-details">
//       <div className="flex mb-32">
//         <LazyImage src="" />
//         <div>
//           <h2 className="mb-5">data.name</h2>
//         </div>
//       </div>
//       <div className="grid">
//         <div>
//           <div className="flex g-5">
//             <CronosIcon width={14} height={14} className="cronos" />
//           </div>
//           <p>FLOOR PRICE</p>
//         </div>
//         <div>
//           <div className="flex g-5">
//             <CronosIcon width={14} height={14} className="cronos" />
//           </div>
//           <p>TOTAL VOL</p>
//         </div>
//         <div>
//           <p>ITEMS</p>
//         </div>
//         <div>
//           <p>OWNERS</p>
//         </div>
//       </div>
//     </div>
//   )
// }

const Details: React.FC = () => {
  // const [auctionInfo, setAuctionInfo] = useState<IAuctionInfo | null>(null);
  // const [isApproved, setIsApproved] = useState(false);

  // const handleFetchIsApproved = useCallback(async () => {
  //   if (account && provider && chainId) {
  //     setIsApproved(
  //       await getApproveNFT(account, provider, chainId, nftContract),
  //     );
  //   }
  // }, [account, provider, chainId, nftContract]);

  // const handleGetData = useCallback(async () => {
  //   if (account && provider) {
  //     try {
  //       const res = await getActiveAuctionIdsInfo(
  //         account,
  //         provider,
  //         chainId,
  //         nftContract,
  //       );
  //       setAuctionInfo(res.find((f) => f.tokenId === tokenId));
  //     } catch (error) {}
  //   }
  // }, [nftContract, account, provider, chainId, tokenId]);

  // useEffect(() => {
  //   handleGetData();
  //   handleFetchIsApproved();
  // }, [handleGetData, handleFetchIsApproved]);

  // const renderTokenDetails = (
  //   <div className="flex-column g-25 pt-24 pb-24">
  //     <div className="flex-between">
  //       <p className="text-secondary">Token ID</p>
  //     </div>
  //     <div className="flex-between">
  //       <p className="text-secondary">Blockchain</p>
  //       <p className="text-primary">Cronos</p>
  //     </div>
  //     <div className="flex-between">
  //       <p className="text-secondary">Token Standard</p>
  //       <p className="text-primary">{'ERC-721'}</p>
  //     </div>
  //     <div className="flex-between">
  //       <p className="text-secondary">Contract</p>
  //       <p className="text-primary">
  //         {/* <a
  //           href={blockExplorer(nftContract)}
  //           target="_blank"
  //           rel="noopener noreferrer"
  //           className="flex g-5"
  //         >
  //           <span className="text-pink">{getEllipsisTxt(nftContract)}</span>
  //           <ExternalLink />
  //         </a> */}
  //       </p>
  //     </div>
  //   </div>
  // )

  // const renderProperties = (
  //   <div className="pt-24 pb-24">
  //     <div className="properties_block">
  //       <div>
  //         <p>attribute.trait_type</p>
  //         <span>attribute.value</span>
  //       </div>
  //     </div>
  //   </div>
  // )

  // const renderCollectionDetails = (
  //   <div className="pt-24 pb-24">
  //     <RenderCollectionDetails />
  //   </div>
  // )

  // const renderOfferDetails = (
  //   <div className="pt-24 pb-24">
  //     <p>No data found</p>
  //   </div>
  // )

  // const renderActivityDetails = (
  //   <div className="pt-24 pb-24">
  //     <p>No data found</p>
  //   </div>
  // )

  return (
    <div className="collection_details">
      <div className="mx pad">
        <div className="nft_grid_wrapper">
          <div className="nft_grid_wrapper-card">
            <div className="nft_card">
              <LazyImage src="" alt="" />
              <div className="flex-between">
                <div>
                  <p className="font-regular">nftname</p>
                  <p style={{ fontSize: '12px' }}>jahj</p>
                </div>
                <div>
                  {/* <div className="flex g-5">
                    <HeartIcon />
                    <p className="font-regular">{123}</p>
                  </div> */}
                  <div className="flex g-5">
                    <CronosIcon width={14} height={14} className="cronos" />
                    {/* <p className="font-regular">
                      {auctionInfo
                        ? `${n4.format(auctionInfo.heighestBid)} ${
                            auctionInfo.symbol
                          }`
                        : `${n4.format(Number(buyNowPrice) / 10 ** 18)} CRO`}
                    </p> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="nft_grid_wrapper-details">
            <div className="flex-column g-16">
              <h1>nftname</h1>
              <div className="flex g-16">
                <p>Price</p>
                <p className="flex g-5">
                  <CronosIcon width={14} height={14} className="cronos" />
                  {/* <span>
                    {auctionInfo
                      ? `${n4.format(auctionInfo.heighestBid)} ${
                          auctionInfo.symbol
                        }`
                      : `${n4.format(Number(buyNowPrice) / 10 ** 18)} CRO`}
                  </span> */}
                </p>
              </div>
              <div className="flex controls g-16">
                <CardControls />

                {/* {isAuthenticated ? (
                  auctionInfo ? (
                  ) : isOwner ? (
                    <ListCardControls
            
                    />
                  ) : null
                ) : (
                  <UnlockWallet />
                )} */}
              </div>
            </div>
          </div>
        </div>
        <div className="accordion_grid_wrapper">
          <div className="accordion_grid_wrapper-column">
            sjjs
            {/* <Accordion
              icon={<Property />}
              title={"properties"}
              children={renderProperties}
            />
            <Accordion
              icon={<TokenDetails />}
              title={"Token details"}
              children={renderTokenDetails}
            />
            <Accordion
              icon={<Collection />}
              title={"Collection Details"}
              children={renderCollectionDetails}
            /> */}
          </div>
          <div className="accordion_grid_wrapper-column">
            {/* <Accordion
              icon={<Offers />}
              title={"Offers"}
              children={renderOfferDetails}
            />
            <Accordion
              icon={<Activity />}
              title={"Activity"}
              children={renderActivityDetails}
            /> */}
            ajkjks
          </div>
        </div>
      </div>
    </div>
  )
}

export default Details
