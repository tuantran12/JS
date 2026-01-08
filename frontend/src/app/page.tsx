'use client';
import { useState, useEffect } from 'react';
import { getMarketDashboard } from '../lib/api';
import Link from 'next/link';

export default function HomePage() {
  const [marketData, setMarketData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeFilter, setTimeFilter] = useState('6H');
  const [sortBy, setSortBy] = useState('trending6h');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getMarketDashboard();
        console.log('Market data received:', data);
        setMarketData(data);
      } catch (e: any) {
        console.error('Failed to fetch market data:', e);
        setError(e.message || 'Failed to load market data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    // Refresh every 2 minutes
    const interval = setInterval(fetchData, 2 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price: number) => {
    if (!price || isNaN(price)) return 'N/A';
    if (price >= 1) return `$${price.toFixed(2)}`;
    if (price >= 0.01) return `$${price.toFixed(4)}`;
    return `$${price.toFixed(6)}`;
  };

  const formatChange = (change: number) => {
    if (change === null || change === undefined || isNaN(change)) return 'N/A';
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)}%`;
  };

  const formatNumber = (num: number) => {
    if (!num || isNaN(num)) return 'N/A';
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
    return `$${num.toFixed(2)}`;
  };

  const formatAge = (age: string | number) => {
    if (!age) return 'N/A';
    if (typeof age === 'string') return age;
    // Convert days to format like "1y", "2mo", "5d", "15h"
    if (age >= 365) return `${Math.floor(age / 365)}y`;
    if (age >= 30) return `${Math.floor(age / 30)}mo`;
    if (age >= 1) return `${Math.floor(age)}d`;
    return `${Math.floor(age * 24)}h`;
  };

  // Get DEX trending tokens from trades and pools data
  const getDEXTrendingTokens = () => {
    if (!marketData) return [];
    
    const trades = marketData.dexTrades || [];
    const pools = marketData.dexPools || [];
    
    // Combine trades data with pools data
    const tokenMap = new Map();
    
    // Process trades
    trades.forEach((trade: any, index: number) => {
      const tradeData = trade.Trade || trade;
      const currency = tradeData.Currency || tradeData;
      const symbol = currency.Symbol || currency.symbol || `TOKEN${index}`;
      const name = currency.Name || currency.name || symbol;
      
      if (!tokenMap.has(symbol)) {
        tokenMap.set(symbol, {
          rank: tokenMap.size + 1,
          symbol,
          name,
          price: tradeData.CurrentPrice || tradeData.PriceInUSD || trade.PriceInUSD || 0,
          change5m: trade.Marketcap_Change_5min || null,
          change1h: trade.Marketcap_Change_1h || null,
          change6h: trade.Marketcap_Change_6h || null,
          change24h: trade.Marketcap_Change_24h || null,
          // Mock data for missing fields
          age: formatAge(Math.random() * 365),
          txns: Math.floor(Math.random() * 100000) + 1000,
          volume: Math.random() * 5000000,
          makers: Math.floor(Math.random() * 50000) + 500,
          liquidity: 0,
          mcap: 0,
          chain: '/SOL'
        });
      }
    });
    
    // Process pools to get liquidity
    pools.forEach((pool: any) => {
      const poolData = pool.Pool || pool;
      const base = poolData.Market?.BaseCurrency || poolData.BaseCurrency;
      const symbol = base?.Symbol || base?.symbol;
      
      if (symbol && tokenMap.has(symbol)) {
        const token = tokenMap.get(symbol);
        token.liquidity = poolData.Quote?.PostAmountInUSD || poolData.PostAmountInUSD || 0;
        token.price = poolData.Quote?.PriceInUSD || poolData.PriceInUSD || token.price;
      }
    });
    
    return Array.from(tokenMap.values());
  };

  const dexTrendingTokens = getDEXTrendingTokens();

  // Sort by selected criteria
  const sortedDEXTokens = [...dexTrendingTokens].sort((a, b) => {
    switch (sortBy) {
      case 'trending6h':
        return (b.change6h || 0) - (a.change6h || 0);
      case 'trending24h':
        return (b.change24h || 0) - (a.change24h || 0);
      case 'volume':
        return (b.volume || 0) - (a.volume || 0);
      case 'liquidity':
        return (b.liquidity || 0) - (a.liquidity || 0);
      default:
        return a.rank - b.rank;
    }
  });

  return (
    <>
      <div className="page">
        <div className="header">
          <h1>Market Overview</h1>
          {marketData?.solPrice && (
            <div className="sol-price">
              SOL: {formatPrice(marketData.solPrice)}
            </div>
          )}
        </div>

        {error && (
          <div className="error-banner">
            {error}
          </div>
        )}

        {/* Top Tokens - Horizontal Scroll */}
        <div className="section">
          <div className="section-header">
            <h2>Top Tokens</h2>
          </div>
          {loading ? (
            <div className="loading">Loading tokens...</div>
          ) : marketData?.topTokens?.length > 0 ? (
            <div className="tokens-horizontal">
              {marketData.topTokens.slice(0, 10).map((token: any, index: number) => (
                <div key={token.symbol || token.id} className="token-card-horizontal">
                  <div className="token-rank-small">#{index + 1}</div>
                  {token.logo && (
                    <img 
                      src={token.logo} 
                      alt={token.symbol} 
                      className="token-logo-small"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  )}
                  <div className="token-info-horizontal">
                    <div className="token-symbol-horizontal">{token.symbol || 'N/A'}</div>
                    <div className="token-price-horizontal">{formatPrice(token.price)}</div>
                    <div className={`token-change-horizontal ${(token.change24h || 0) >= 0 ? 'positive' : 'negative'}`}>
                      {formatChange(token.change24h)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty">No token data available</div>
          )}
        </div>

        {/* DEX Trending Table */}
        <div className="section">
          <div className="section-header">
            <div className="filters">
              <button 
                className={`filter-btn ${timeFilter === '5M' ? 'active' : ''}`}
                onClick={() => setTimeFilter('5M')}
              >
                5M
              </button>
              <button 
                className={`filter-btn ${timeFilter === '1H' ? 'active' : ''}`}
                onClick={() => setTimeFilter('1H')}
              >
                1H
              </button>
              <button 
                className={`filter-btn ${timeFilter === '6H' ? 'active' : ''}`}
                onClick={() => setTimeFilter('6H')}
              >
                6H
              </button>
              <button 
                className={`filter-btn ${timeFilter === '24H' ? 'active' : ''}`}
                onClick={() => setTimeFilter('24H')}
              >
                24H
              </button>
            </div>
            <div className="sort-controls">
              <select 
                className="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="trending6h">Rank by: Trending 6H</option>
                <option value="trending24h">Rank by: Trending 24H</option>
                <option value="volume">Rank by: Volume</option>
                <option value="liquidity">Rank by: Liquidity</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="loading">Loading DEX data...</div>
          ) : sortedDEXTokens.length > 0 ? (
            <div className="table-container">
              <table className="trending-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>TOKEN</th>
                    <th>PRICE</th>
                    <th>AGE</th>
                    <th>TXNS</th>
                    <th>VOLUME</th>
                    <th>MAKERS</th>
                    <th>5M</th>
                    <th>1H</th>
                    <th>6H</th>
                    <th>24H</th>
                    <th>LIQUIDITY</th>
                    <th>MCAP</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedDEXTokens.map((token: any, index: number) => (
                    <tr key={`${token.symbol}-${index}`}>
                      <td className="rank">{index + 1}</td>
                      <td className="token-cell">
                        <div className="token-info">
                          <div className="token-details">
                            <div className="token-symbol-row">
                              <span className="token-symbol">{token.symbol}</span>
                              <span className="token-chain">{token.chain}</span>
                            </div>
                            <div className="token-name">{token.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="price">{formatPrice(token.price)}</td>
                      <td className="age">{token.age}</td>
                      <td className="txns">{formatNumber(token.txns)}</td>
                      <td className="volume">{formatNumber(token.volume)}</td>
                      <td className="makers">{formatNumber(token.makers)}</td>
                      <td className={`change ${(token.change5m || 0) >= 0 ? 'positive' : 'negative'}`}>
                        {token.change5m !== null ? formatChange(token.change5m) : 'N/A'}
                      </td>
                      <td className={`change ${(token.change1h || 0) >= 0 ? 'positive' : 'negative'}`}>
                        {token.change1h !== null ? formatChange(token.change1h) : 'N/A'}
                      </td>
                      <td className={`change ${(token.change6h || 0) >= 0 ? 'positive' : 'negative'}`}>
                        {token.change6h !== null ? formatChange(token.change6h) : 'N/A'}
                      </td>
                      <td className={`change ${(token.change24h || 0) >= 0 ? 'positive' : 'negative'}`}>
                        {token.change24h !== null ? formatChange(token.change24h) : 'N/A'}
                      </td>
                      <td className="liquidity">{formatNumber(token.liquidity)}</td>
                      <td className="mcap">{formatNumber(token.mcap)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty">
              No DEX data available
              {!loading && <div style={{fontSize: '11px', color: '#444', marginTop: '8px'}}>Check backend logs for Bitquery response</div>}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="actions">
          <Link href="/copy" className="action-btn primary">Start Trading</Link>
          <Link href="/token" className="action-btn">View Packages</Link>
        </div>
      </div>

      <style jsx>{`
        .page { 
          min-height: 100vh; 
          background: #000; 
          padding: 32px 24px; 
          max-width: 1600px; 
          margin: 0 auto; 
        }
        
        .header { 
          text-align: center; 
          margin-bottom: 32px; 
        }
        
        .header h1 { 
          font-size: 32px; 
          font-weight: 600; 
          color: #fff; 
          margin-bottom: 8px; 
        }
        
        .sol-price { 
          font-size: 14px; 
          color: #888; 
          font-family: monospace; 
        }

        .error-banner { 
          padding: 12px 16px; 
          background: rgba(239,68,68,0.1); 
          border: 1px solid rgba(239,68,68,0.3); 
          border-radius: 6px; 
          color: #ef4444; 
          font-size: 13px; 
          margin-bottom: 24px; 
          text-align: center; 
        }

        .section { 
          margin-bottom: 48px; 
        }
        
        .section-header { 
          display: flex; 
          justify-content: space-between; 
          align-items: center; 
          margin-bottom: 20px; 
          flex-wrap: wrap;
          gap: 12px;
        }
        
        .section h2 {
          font-size: 20px;
          font-weight: 600;
          color: #fff;
        }
        
        .loading, .empty { 
          text-align: center; 
          padding: 48px; 
          color: #666; 
          font-size: 13px; 
        }

        /* Horizontal Scroll Tokens */
        .tokens-horizontal {
          display: flex;
          gap: 12px;
          overflow-x: auto;
          padding: 16px 0;
          scrollbar-width: thin;
          scrollbar-color: #333 #000;
        }
        
        .tokens-horizontal::-webkit-scrollbar {
          height: 6px;
        }
        
        .tokens-horizontal::-webkit-scrollbar-track {
          background: #0a0a0a;
        }
        
        .tokens-horizontal::-webkit-scrollbar-thumb {
          background: #333;
          border-radius: 3px;
        }
        
        .token-card-horizontal {
          min-width: 160px;
          background: #0a0a0a;
          border: 1px solid #1a1a1a;
          border-radius: 8px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          transition: all 0.2s;
          position: relative;
        }
        
        .token-card-horizontal:hover {
          border-color: #333;
          transform: translateY(-2px);
        }
        
        .token-rank-small {
          position: absolute;
          top: 8px;
          right: 8px;
          font-size: 10px;
          color: #555;
          font-weight: 600;
        }
        
        .token-logo-small {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          object-fit: cover;
        }
        
        .token-info-horizontal {
          text-align: center;
          width: 100%;
        }
        
        .token-symbol-horizontal {
          font-size: 14px;
          font-weight: 600;
          color: #fff;
          margin-bottom: 6px;
        }
        
        .token-price-horizontal {
          font-size: 16px;
          font-weight: 600;
          color: #fff;
          margin-bottom: 4px;
        }
        
        .token-change-horizontal {
          font-size: 12px;
          font-weight: 500;
        }
        
        .token-change-horizontal.positive {
          color: #22c55e;
        }
        
        .token-change-horizontal.negative {
          color: #ef4444;
        }
        
        /* Filters */
        .filters {
          display: flex;
          gap: 8px;
        }
        
        .filter-btn {
          padding: 8px 16px;
          background: transparent;
          border: 1px solid #333;
          border-radius: 6px;
          color: #888;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .filter-btn:hover {
          border-color: #555;
          color: #fff;
        }
        
        .filter-btn.active {
          background: #fff;
          color: #000;
          border-color: #fff;
        }
        
        .sort-select {
          padding: 8px 12px;
          background: #0a0a0a;
          border: 1px solid #333;
          border-radius: 6px;
          color: #fff;
          font-size: 13px;
          cursor: pointer;
        }
        
        .sort-select:focus {
          outline: none;
          border-color: #555;
        }
        
        /* Table */
        .table-container {
          overflow-x: auto;
          background: #0a0a0a;
          border: 1px solid #1a1a1a;
          border-radius: 8px;
        }
        
        .trending-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13px;
        }
        
        .trending-table thead {
          background: #111;
          border-bottom: 1px solid #1a1a1a;
        }
        
        .trending-table th {
          padding: 12px 8px;
          text-align: left;
          font-weight: 600;
          color: #888;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .trending-table th:first-child {
          padding-left: 16px;
        }
        
        .trending-table th:last-child {
          padding-right: 16px;
        }
        
        .trending-table tbody tr {
          border-bottom: 1px solid #111;
          transition: background 0.2s;
        }
        
        .trending-table tbody tr:hover {
          background: #0f0f0f;
        }
        
        .trending-table td {
          padding: 14px 8px;
          color: #fff;
        }
        
        .trending-table td:first-child {
          padding-left: 16px;
        }
        
        .trending-table td:last-child {
          padding-right: 16px;
        }
        
        .rank {
          color: #666;
          font-weight: 600;
          font-size: 12px;
        }
        
        .token-cell {
          min-width: 200px;
        }
        
        .token-info {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .token-details {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        
        .token-symbol-row {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        
        .token-symbol {
          font-size: 14px;
          font-weight: 600;
          color: #fff;
        }
        
        .token-chain {
          font-size: 12px;
          color: #666;
        }
        
        .token-name {
          font-size: 11px;
          color: #666;
        }
        
        .price {
          font-weight: 500;
          color: #fff;
        }
        
        .age, .txns, .volume, .makers, .liquidity, .mcap {
          color: #888;
          font-size: 12px;
        }
        
        .change {
          font-weight: 500;
          font-size: 12px;
        }
        
        .change.positive {
          color: #22c55e;
        }
        
        .change.negative {
          color: #ef4444;
        }
        
        .actions { 
          display: flex; 
          gap: 12px; 
          justify-content: center; 
          margin-top: 48px; 
        }
        
        .action-btn { 
          padding: 14px 32px; 
          border-radius: 8px; 
          font-size: 14px; 
          font-weight: 600; 
          text-align: center; 
          transition: all 0.2s; 
          text-decoration: none;
          display: inline-block;
        }
        
        .action-btn.primary { 
          background: #fff; 
          color: #000; 
        }
        
        .action-btn.primary:hover { 
          background: #e0e0e0; 
        }
        
        .action-btn:not(.primary) { 
          background: transparent; 
          border: 1px solid #333; 
          color: #888; 
        }
        
        .action-btn:not(.primary):hover { 
          border-color: #fff; 
          color: #fff; 
        }

        @media (max-width: 1200px) {
          .trending-table {
            font-size: 11px;
          }
          
          .trending-table th,
          .trending-table td {
            padding: 10px 6px;
          }
        }
        
        @media (max-width: 768px) {
          .table-container {
            overflow-x: scroll;
          }
          
          .trending-table {
            min-width: 1200px;
          }
          
          .section-header {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .token-card-horizontal {
            min-width: 140px;
          }
        }
      `}</style>
    </>
  );
}
