'use client';
import { useEffect, useState, useCallback } from 'react';
import { listSmartWallets, getFollowing, getPositions, getCopyMetrics, getCopyConfig, unfollowSmartWallet } from '../../lib/api';
import FollowModal from '../../components/copy/FollowModal';
import ClosePositionModal from '../../components/copy/ClosePositionModal';
import SmartWalletCard from '../../components/copy/SmartWalletCard';
import FollowingCard from '../../components/copy/FollowingCard';
import PositionCard from '../../components/copy/PositionCard';
import BottomStats from '../../components/copy/BottomStats';

type Tab = 'social' | 'following';
type SubTab = 'list' | 'positions';

export default function CopyPage() {
  const [tab, setTab] = useState<Tab>('social');
  const [subTab, setSubTab] = useState<SubTab>('list');
  const [wallets, setWallets] = useState<any[]>([]);
  const [following, setFollowing] = useState<any[]>([]);
  const [positions, setPositions] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any>(null);
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [simulatorMode, setSimulatorMode] = useState(false);

  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('roi');
  const [period, setPeriod] = useState('30');
  const [modeFilter, setModeFilter] = useState('');

  const [followModalOpen, setFollowModalOpen] = useState(false);
  const [followWallet, setFollowWallet] = useState<any>(null);
  const [closeModalOpen, setCloseModalOpen] = useState(false);
  const [positionToClose, setPositionToClose] = useState<any>(null);

  const token = typeof window !== 'undefined' ? localStorage.getItem('senkai_token') || '' : '';

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const [walletsRes, followingRes, positionsRes, metricsRes, configRes] = await Promise.all([
        listSmartWallets(token, { search, sort, period }),
        getFollowing(token),
        getPositions(token, { mode: modeFilter }),
        getCopyMetrics(token),
        getCopyConfig()
      ]);
      setWallets(walletsRes.wallets || []);
      setFollowing(followingRes.follows || []);
      setPositions(positionsRes.positions || []);
      setMetrics(metricsRes);
      setConfig(configRes);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }, [token, search, sort, period, modeFilter]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const handleFollow = (wallet: any) => {
    setFollowWallet(wallet);
    setFollowModalOpen(true);
  };

  const handleUnfollow = async (smartWalletId: string, mode: string) => {
    await unfollowSmartWallet(token, smartWalletId, mode as any);
    refresh();
  };

  const handleClosePosition = (pos: any) => {
    setPositionToClose(pos);
    setCloseModalOpen(true);
  };

  return (
    <>
      <div className="page">
        <div className="tabs">
          <button className={tab === 'social' ? 'active' : ''} onClick={() => setTab('social')}>
            Trading Social
          </button>
          <button className={tab === 'following' ? 'active' : ''} onClick={() => setTab('following')}>
            My Following
          </button>
        </div>

        {tab === 'following' && (
          <div className="sub-tabs">
            <button className={subTab === 'list' ? 'active' : ''} onClick={() => setSubTab('list')}>
              Following List
            </button>
            <button className={subTab === 'positions' ? 'active' : ''} onClick={() => setSubTab('positions')}>
              My Positions
            </button>
          </div>
        )}

        <div className="filters">
          <input
            type="text"
            placeholder="Search wallet..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          
          {tab === 'social' && (
            <>
              <select value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="roi">Sort: ROI</option>
                <option value="pnl">Sort: PNL</option>
                <option value="winrate">Sort: Win Rate</option>
              </select>
              <select value={period} onChange={(e) => setPeriod(e.target.value)}>
                <option value="7">7 Days</option>
                <option value="30">30 Days</option>
                <option value="90">90 Days</option>
              </select>
              <label className="sim-toggle">
                <input type="checkbox" checked={simulatorMode} onChange={(e) => setSimulatorMode(e.target.checked)} />
                <span>Simulator</span>
              </label>
            </>
          )}

          {tab === 'following' && subTab === 'positions' && (
            <select value={modeFilter} onChange={(e) => setModeFilter(e.target.value)}>
              <option value="">All Modes</option>
              <option value="live">Live</option>
              <option value="sim">Simulator</option>
            </select>
          )}
        </div>

        <div className="content">
          {loading && <div className="loading">Loading...</div>}

          {tab === 'social' && !loading && (
            <div className="grid">
              {wallets.map((w) => (
                <SmartWalletCard key={w.id} wallet={w} simulatorMode={simulatorMode} onFollow={() => handleFollow(w)} />
              ))}
              {wallets.length === 0 && <div className="empty">No smart wallets found</div>}
            </div>
          )}

          {tab === 'following' && subTab === 'list' && !loading && (
            <div className="grid">
              {following.map((f) => (
                <FollowingCard key={f.id} follow={f} onUnfollow={() => handleUnfollow(f.smartWallet?.id, f.mode)} />
              ))}
              {following.length === 0 && <div className="empty">Not following any wallets</div>}
            </div>
          )}

          {tab === 'following' && subTab === 'positions' && !loading && (
            <div className="grid">
              {positions.map((p) => (
                <PositionCard key={p.id} position={p} onClose={() => handleClosePosition(p)} />
              ))}
              {positions.length === 0 && <div className="empty">No positions</div>}
            </div>
          )}
        </div>

        <BottomStats metrics={metrics} config={config} />

        {followModalOpen && followWallet && (
          <FollowModal
            wallet={followWallet}
            simulatorMode={simulatorMode}
            config={config}
            onClose={() => { setFollowModalOpen(false); setFollowWallet(null); }}
            onSuccess={() => { setFollowModalOpen(false); setFollowWallet(null); refresh(); }}
            token={token}
          />
        )}

        {closeModalOpen && positionToClose && (
          <ClosePositionModal
            position={positionToClose}
            onClose={() => { setCloseModalOpen(false); setPositionToClose(null); }}
            onSuccess={() => { setCloseModalOpen(false); setPositionToClose(null); refresh(); }}
            token={token}
          />
        )}
      </div>

      <style jsx>{`
        .page { min-height: 100vh; background: #000; padding-bottom: 80px; }

        .tabs { display: flex; gap: 8px; padding: 16px 24px; border-bottom: 1px solid #111; }
        .tabs button { padding: 10px 20px; background: transparent; border: 1px solid #222; border-radius: 6px; color: #666; font-size: 13px; font-weight: 500; cursor: pointer; }
        .tabs button:hover { border-color: #444; color: #fff; }
        .tabs button.active { background: #fff; border-color: #fff; color: #000; }

        .sub-tabs { display: flex; gap: 8px; padding: 12px 24px; background: #050505; }
        .sub-tabs button { padding: 6px 14px; background: transparent; border: none; color: #555; font-size: 12px; cursor: pointer; }
        .sub-tabs button:hover { color: #fff; }
        .sub-tabs button.active { color: #fff; text-decoration: underline; }

        .filters { display: flex; align-items: center; gap: 12px; padding: 16px 24px; flex-wrap: wrap; }
        .search-input { padding: 10px 14px; background: #0a0a0a; border: 1px solid #1a1a1a; border-radius: 6px; color: #fff; font-size: 13px; width: 200px; }
        .search-input:focus { outline: none; border-color: #fff; }
        select { padding: 10px 14px; background: #0a0a0a; border: 1px solid #1a1a1a; border-radius: 6px; color: #fff; font-size: 13px; }

        .sim-toggle { display: flex; align-items: center; gap: 8px; color: #666; font-size: 12px; cursor: pointer; }
        .sim-toggle input { width: 14px; height: 14px; }

        .content { padding: 24px; }
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
        .loading, .empty { text-align: center; padding: 48px; color: #666; font-size: 13px; }
      `}</style>
    </>
  );
}
