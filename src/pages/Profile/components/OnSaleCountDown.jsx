import { Button } from 'components'
import ReactCountdown from 'react-countdown'

const OnSaleCountDown = ({
  handleFinishAuction,
  handleRemoveSale,
  endTime,
}) => {
  console.log(endTime)
  const renderer = ({ completed, days, minutes, seconds, hours }) => {
    if (completed) {
      return (
        <>
          <div className="auction">
            <p>Auction Ended.</p>
            <div className="nft_card-container_controls">
              <Button onClick={handleFinishAuction}>Finish Auction</Button>
            </div>
          </div>
        </>
      )
    } else {
      return (
        <>
          <div className="auction">
            <p>Auction ends in</p>
            <p>
              {days}d :{hours}h :{minutes}m :{seconds}s
            </p>
          </div>
          <div className="nft_card-container_controls">
            <Button onClick={handleRemoveSale}>Remove Sale</Button>
          </div>
        </>
      )
    }
  }

  return <ReactCountdown date={Number(endTime)} renderer={renderer} />
}

export default OnSaleCountDown
