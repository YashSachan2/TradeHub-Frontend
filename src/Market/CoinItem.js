import React from 'react'
import './Coins.css'

const CoinItem = ({ coin }) => {
  const price = coin?.current_price;
  const priceChange = coin?.price_change_percentage_24h;
  const rank = coin?.market_cap_rank;
  const image = coin?.image;
  const symbol = coin?.symbol;
  const totalVolume = coin?.total_volume;
  const marketCap = coin?.market_cap;

  return (
    <div className='coin-row'>
      <p>{rank ?? '—'}</p>

      <div className='img-symbol'>
        <img src={image} alt='' />
        <p>{symbol?.toUpperCase() ?? '—'}</p>
      </div>

      <p>₹{price !== undefined ? price.toFixed(1) : '—'}</p>

      {priceChange !== undefined ? (
        priceChange < 0 ?
          <p className="coin-percent red">{priceChange.toFixed(2)}%</p>
          :
          <p className="coin-percent green">{priceChange.toFixed(2)}%</p>
      ) : (
        <p className="coin-percent">—</p>
      )}

      <p className='hide-mobile'>₹{totalVolume ? totalVolume.toLocaleString() : '—'}</p>
      <p className='hide-mobile'>₹{marketCap ? marketCap.toLocaleString() : '—'}</p>
    </div>
  )
}

export default CoinItem