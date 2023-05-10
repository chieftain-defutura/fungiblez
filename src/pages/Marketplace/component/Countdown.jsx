import React from "react";
import ReactCountdown from "react-countdown";
import { Button } from "components";

const Countdown = ({ endTime, address, owner, setOpen }) => {
  const renderer = ({ completed, days, minutes, seconds, hours }) => {
    if (completed) {
      return (
        <>
          <div className="card-auction">
            <p>Auction Ended.</p>
          </div>
        </>
      );
    } else {
      return (
        <>
          <div className="card-auction">
            <p>Auction ends in</p>
            <p>
              {days}d :{hours}h :{minutes}m :{seconds}s
            </p>
          </div>
          <div className="nft_card-container_controls">
            {address.toLowerCase() !== owner.toLowerCase() && (
              <Button onClick={() => setOpen(true)}>place bid</Button>
            )}
          </div>
        </>
      );
    }
  };

  return <ReactCountdown date={Number(endTime)} renderer={renderer} />;
};

export default Countdown;
