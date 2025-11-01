import React, { memo } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Target, 
  Tag, 
  Eye,
  ArrowRight,
  Award,
  Shield,
  Activity,
  Building2,
  Briefcase,
  PieChart,
  BarChart3,
  Calculator,
  Clock,
  Wallet,
  TrendingUp as Growth,
  Globe,
  Coins,
  Zap,
  Mountain,
  Leaf,
  Car,
  Home,
  Heart,
  Star,
  Crown,
  Gem
} from 'lucide-react';

const StockDataTable = memo(({ fundSummaries, onFundClick, orderBy, orderDirection, onSortChange }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(amount || 0);
  };

  const formatPercentage = (value) => {
    if (value == null || isNaN(value)) {
      return 'N/A';
    }
    return `${value.toFixed(2)}%`;
  };

  const getProfitLossColor = (value) => {
    if (value > 0) return 'text-green-600';
    if (value < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getProfitLossBgColor = (value) => {
    if (value > 0) return 'bg-gradient-to-r from-green-50 to-emerald-50';
    if (value < 0) return 'bg-gradient-to-r from-red-50 to-rose-50';
    return 'bg-gradient-to-r from-gray-50 to-slate-50';
  };

  const getProfitLossIcon = (value) => {
    if (value > 0) return TrendingUp;
    if (value < 0) return TrendingDown;
    return Activity;
  };

  const getFundIcon = (fund) => {
    if (fund.isEmergency) return Shield;
    if (fund.profitLossPercent > 10) return Award;
    if (fund.profitLossPercent > 0) return Growth;
    return Target;
  };

  const getTagIcon = (tag) => {
    if (!tag) return Tag;
    
    const tagLower = tag.toLowerCase();
    
    // International/Global funds
    if (tagLower.includes('international') || tagLower.includes('global') || tagLower.includes('foreign')) return Globe;
    
    // Metal/Commodity funds
    if (tagLower.includes('metal') || tagLower.includes('gold') || tagLower.includes('silver') || tagLower.includes('commodity')) return Coins;
    
    // Energy/Power funds
    if (tagLower.includes('energy') || tagLower.includes('power') || tagLower.includes('oil') || tagLower.includes('gas')) return Zap;
    
    // Infrastructure/Real Estate funds
    if (tagLower.includes('infrastructure') || tagLower.includes('real estate') || tagLower.includes('reit')) return Building2;
    
    // Technology funds
    if (tagLower.includes('technology') || tagLower.includes('tech') || tagLower.includes('it') || tagLower.includes('flexi cap') || tagLower.includes('flexicap')) return Zap;
    
    // Healthcare/Pharma funds
    if (tagLower.includes('healthcare') || tagLower.includes('pharma') || tagLower.includes('medical')) return Heart;
    
    // Banking/Financial funds
    if (tagLower.includes('banking') || tagLower.includes('financial') || tagLower.includes('finance')) return Wallet;
    
    // Auto funds
    if (tagLower.includes('auto') || tagLower.includes('automobile') || tagLower.includes('vehicle')) return Car;
    
    // FMCG/Consumer funds
    if (tagLower.includes('fmcg') || tagLower.includes('consumer') || tagLower.includes('retail')) return Home;
    
    // ESG/Sustainable funds
    if (tagLower.includes('esg') || tagLower.includes('sustainable') || tagLower.includes('green')) return Leaf;
    
    // Small Cap funds
    if (tagLower.includes('small cap') || tagLower.includes('smallcap')) return Star;
    
    // Mid Cap funds
    if (tagLower.includes('mid cap') || tagLower.includes('midcap')) return Crown;
    
    // Large Cap funds
    if (tagLower.includes('large cap') || tagLower.includes('largecap')) return Gem;
    
    // Equity/Growth funds
    if (tagLower.includes('equity') || tagLower.includes('growth')) return TrendingUp;
    
    // Debt/Bond funds
    if (tagLower.includes('debt') || tagLower.includes('bond')) return Shield;
    
    // Hybrid/Balanced funds
    if (tagLower.includes('hybrid') || tagLower.includes('balanced')) return PieChart;
    
    // Sector/Theme funds
    if (tagLower.includes('sector') || tagLower.includes('theme')) return Building2;
    
    // Index/ETF funds
    if (tagLower.includes('index') || tagLower.includes('etf')) return BarChart3;
    
    // Liquid/Overnight funds
    if (tagLower.includes('liquid') || tagLower.includes('overnight')) return Clock;
    
    // Corporate/Credit funds
    if (tagLower.includes('corporate') || tagLower.includes('credit')) return Briefcase;
    
    // Government/Gilt funds
    if (tagLower.includes('government') || tagLower.includes('gilt')) return Building2;
    
    // Money Market funds
    if (tagLower.includes('money') || tagLower.includes('market')) return Wallet;
    
    // Tax Saving funds
    if (tagLower.includes('tax') || tagLower.includes('saving') || tagLower.includes('elss')) return Calculator;
    
    return Tag;
  };

  const getTagColor = (tag) => {
    if (!tag) return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
    
    const tagLower = tag.toLowerCase();
    
    // International/Global funds - Blue
    if (tagLower.includes('international') || tagLower.includes('global') || tagLower.includes('foreign')) 
      return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-700';
    
    // Metal/Commodity funds - Gold/Yellow
    if (tagLower.includes('metal') || tagLower.includes('gold') || tagLower.includes('silver') || tagLower.includes('commodity')) 
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    
    // Energy/Power funds - Orange
    if (tagLower.includes('energy') || tagLower.includes('power') || tagLower.includes('oil') || tagLower.includes('gas')) 
      return 'bg-orange-100 text-orange-800 border-orange-200';
    
    // Infrastructure/Real Estate funds - Purple
    if (tagLower.includes('infrastructure') || tagLower.includes('real estate') || tagLower.includes('reit')) 
      return 'bg-purple-100 text-purple-800 border-purple-200';
    
    // Technology funds - Cyan
    if (tagLower.includes('technology') || tagLower.includes('tech') || tagLower.includes('it') || tagLower.includes('flexi cap') || tagLower.includes('flexicap')) 
      return 'bg-cyan-100 text-cyan-800 border-cyan-200';
    
    // Healthcare/Pharma funds - Pink
    if (tagLower.includes('healthcare') || tagLower.includes('pharma') || tagLower.includes('medical')) 
      return 'bg-pink-100 text-pink-800 border-pink-200';
    
    // Banking/Financial funds - Green
    if (tagLower.includes('banking') || tagLower.includes('financial') || tagLower.includes('finance')) 
      return 'bg-green-100 text-green-800 border-green-200';
    
    // Auto funds - Red
    if (tagLower.includes('auto') || tagLower.includes('automobile') || tagLower.includes('vehicle')) 
      return 'bg-red-100 text-red-800 border-red-200';
    
    // FMCG/Consumer funds - Indigo
    if (tagLower.includes('fmcg') || tagLower.includes('consumer') || tagLower.includes('retail')) 
      return 'bg-indigo-100 text-indigo-800 border-indigo-200';
    
    // ESG/Sustainable funds - Emerald
    if (tagLower.includes('esg') || tagLower.includes('sustainable') || tagLower.includes('green')) 
      return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    
    // Small Cap funds - Rose
    if (tagLower.includes('small cap') || tagLower.includes('smallcap')) 
      return 'bg-rose-100 text-rose-800 border-rose-200';
    
    // Mid Cap funds - Violet
    if (tagLower.includes('mid cap') || tagLower.includes('midcap')) 
      return 'bg-violet-100 text-violet-800 border-violet-200';
    
    // Large Cap funds - Amber
    if (tagLower.includes('large cap') || tagLower.includes('largecap')) 
      return 'bg-amber-100 text-amber-800 border-amber-200';
    
    // Equity/Growth funds - Sky Blue
    if (tagLower.includes('equity') || tagLower.includes('growth')) 
      return 'bg-sky-100 text-sky-800 border-sky-200';
    
    // Debt/Bond funds - Slate
    if (tagLower.includes('debt') || tagLower.includes('bond')) 
      return 'bg-slate-100 text-slate-800 border-slate-200';
    
    // Hybrid/Balanced funds - Teal
    if (tagLower.includes('hybrid') || tagLower.includes('balanced')) 
      return 'bg-teal-100 text-teal-800 border-teal-200';
    
    // Sector/Theme funds - Fuchsia
    if (tagLower.includes('sector') || tagLower.includes('theme')) 
      return 'bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200';
    
    // Index/ETF funds - Stone
    if (tagLower.includes('index') || tagLower.includes('etf')) 
      return 'bg-stone-100 text-stone-800 border-stone-200';
    
    // Liquid/Overnight funds - Neutral
    if (tagLower.includes('liquid') || tagLower.includes('overnight')) 
      return 'bg-neutral-100 text-neutral-800 border-neutral-200';
    
    // Corporate/Credit funds - Zinc
    if (tagLower.includes('corporate') || tagLower.includes('credit')) 
      return 'bg-zinc-100 text-zinc-800 border-zinc-200';
    
    // Government/Gilt funds - Gray
    if (tagLower.includes('government') || tagLower.includes('gilt')) 
      return 'bg-gray-100 text-gray-800 border-gray-200';
    
    // Money Market funds - Lime
    if (tagLower.includes('money') || tagLower.includes('market')) 
      return 'bg-lime-100 text-lime-800 border-lime-200';
    
    // Tax Saving funds - Orange
    if (tagLower.includes('tax') || tagLower.includes('saving') || tagLower.includes('elss')) 
      return 'bg-orange-100 text-orange-800 border-orange-200';
    
    return 'bg-gray-100 text-gray-700 border-gray-200';
  };

  if (!fundSummaries || fundSummaries.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="mb-8">
          <div className="w-20 h-20 mx-auto bg-slate-100 dark:bg-gray-700 rounded-lg flex items-center justify-center shadow-sm">
            <Target className="w-10 h-10 text-slate-500 dark:text-gray-400" />
          </div>
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">No Investments Found</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto leading-relaxed">
          Start building your portfolio by searching for mutual funds above
        </p>
        <div className="inline-flex items-center px-4 py-2 bg-slate-100 dark:bg-gray-700 text-slate-700 dark:text-gray-300 rounded-lg shadow-sm">
          <Wallet className="w-4 h-4 mr-2" />
          <span className="font-medium">Ready to invest?</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Enhanced Table Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl px-6 py-4 border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Your Investments</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Click on any fund to view detailed information</p>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Sort Options */}
            {onSortChange && (
              <div className="flex items-center gap-2">
                {[
                  { value: 'TOTAL_VALUE', label: 'Total Value', icon: 'Wallet' },
                  { value: 'PROFIT_PERCENT', label: 'Profit %', icon: 'TrendingUp' },
                  { value: 'TAG', label: 'Tag', icon: 'Tag' },
                  { value: 'FUND_NAME', label: 'Fund Name', icon: 'BarChart3' }
                ].map((option) => {
                  const isActive = orderBy === option.value;
                  const IconComponent = {
                    Wallet: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>,
                    TrendingUp: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
                    Tag: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>,
                    BarChart3: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                  }[option.icon];
                  
                  return (
                    <button
                      key={option.value}
                      onClick={() => onSortChange(option.value, orderBy === option.value && orderDirection === 'ASC' ? 'DESC' : 'ASC')}
                      className={`px-3 py-2 text-xs font-medium rounded-lg transition-all ${
                        isActive
                          ? `bg-gray-900 dark:bg-gray-600 text-white dark:text-gray-100`
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        {IconComponent && <IconComponent />}
                        <span>{option.label}</span>
                        {isActive && (
                          <div className="flex items-center space-x-1">
                            {orderDirection === 'ASC' ? (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                              </svg>
                            ) : (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            )}
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

      </div>
      
      {/* Fund List Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 border-b-2 border-gray-200 dark:border-gray-600">
            <tr>
              <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 dark:text-gray-300">
                Fund Details
              </th>
              <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 dark:text-gray-300">
                Tag
              </th>
              <th className="px-6 py-3.5 text-right text-xs font-medium text-gray-500 dark:text-gray-300">
                Invested
              </th>
              <th className="px-6 py-3.5 text-right text-xs font-medium text-gray-500 dark:text-gray-300">
                Current Value
              </th>
              <th className="px-6 py-3.5 text-right text-xs font-medium text-gray-500 dark:text-gray-300">
                P&L
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {fundSummaries.map((fund, index) => {
              const FundIcon = getFundIcon(fund);
              const ProfitLossIcon = getProfitLossIcon(fund.profitLoss);
              const TagIcon = getTagIcon(fund.tag);
              const isProfit = fund.profitLoss > 0;
              
              return (
              <tr
                key={fund.fundId || fund.schemeCode}
                  className="group hover:bg-gradient-to-r hover:from-blue-50 hover:via-purple-50 hover:to-indigo-50 dark:hover:from-gray-700 dark:hover:via-gray-700 dark:hover:to-gray-700 cursor-pointer transition-all duration-300 border-l-4 border-transparent hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-md"
                onClick={() => onFundClick(fund)}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                  {/* Fund Details */}
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className="p-2.5 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg shadow-sm group-hover:shadow-lg group-hover:scale-110 transition-all duration-300">
                          <Target className="w-4 h-4 text-white" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 break-words group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                        {fund.name || fund.schemeName}
                        </h4>
                        {fund.isEmergency && (
                          <div className="flex items-center mt-1">
                            <Shield className="w-3 h-3 text-red-500 dark:text-red-400 mr-1" />
                            <span className="text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 px-2 py-1 rounded">
                              Emergency Fund
                          </span>
                          </div>
                        )}
                    </div>
                  </div>
                </td>

                {/* Tag */}
                <td className="px-6 py-4">
                    {fund.tag && (
                      <div className={`inline-flex items-center px-2.5 py-1.5 rounded text-xs font-medium border ${getTagColor(fund.tag)}`}>
                        <TagIcon className="w-3 h-3 mr-1.5" />
                        {fund.tag}
                      </div>
                    )}
                  </td>

                {/* Invested Amount */}
                <td className="px-6 py-4 text-right">
                  <div className="inline-flex items-center space-x-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors">
                    <Wallet className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{formatCurrency(fund.totalInvested)}</span>
                  </div>
                </td>

                {/* Current Value */}
                <td className="px-6 py-4 text-right">
                  <div className="inline-flex items-center space-x-2 px-3 py-1.5 bg-green-50 dark:bg-green-900/20 rounded-lg group-hover:bg-green-100 dark:group-hover:bg-green-900/30 transition-colors">
                    <Target className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{formatCurrency(fund.totalValue)}</span>
                  </div>
                </td>

                {/* Profit/Loss */}
                <td className="px-6 py-4 text-right">
                  <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg group-hover:shadow-md transition-all" 
                    style={{
                      backgroundColor: isProfit ? '#f0fdf4' : '#fef2f2',
                      color: isProfit ? '#166534' : '#991b1b'
                    }}>
                    <ProfitLossIcon className={`w-4 h-4 ${isProfit ? 'text-green-600' : 'text-red-600'}`} />
                    <div className="text-right">
                      <div className={`text-sm font-bold ${getProfitLossColor(fund.profitLoss)}`}>
                    {formatCurrency(fund.profitLoss)}
                      </div>
                      <div className={`text-xs font-semibold ${getProfitLossColor(fund.profitLossPercent)} mt-0.5`}>
                    {formatPercentage(fund.profitLossPercent)}
                      </div>
                    </div>
                  </div>
                </td>

              </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {/* Footer */}
      <div className="bg-slate-50 dark:bg-gray-700 rounded-lg p-4 text-center">
        <div className="flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-400">
          <Activity className="w-4 h-4" />
          <span className="text-sm">Click on any fund to view detailed information</span>
        </div>
      </div>
    </div>
  );
});

StockDataTable.displayName = 'StockDataTable';

export default StockDataTable;
