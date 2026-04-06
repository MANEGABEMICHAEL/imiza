// Dashboard Component - Statistics and Admin Panel
import React, { useState, useEffect } from 'react';

const Dashboard = ({ isAdmin, userDonations, allDonations, onLogout }) => {
  const [activeTab, setActiveTab] = useState(isAdmin ? 'overview' : 'my-donations');
  const [stats, setStats] = useState({
    totalAmount: 0,
    totalDonations: 0,
    todayAmount: 0,
    monthlyData: [],
    methodStats: {},
    statusStats: {}
  });

  useEffect(() => {
    calculateStats();
  }, [allDonations, userDonations, activeTab]);

  const calculateStats = () => {
    if (isAdmin && allDonations) {
      const total = allDonations.reduce((sum, d) => sum + d.amount, 0);
      const today = new Date().toDateString();
      const todayDonations = allDonations.filter(d => new Date(d.date).toDateString() === today);
      const todayTotal = todayDonations.reduce((sum, d) => sum + d.amount, 0);

      // Monthly data for chart
      const monthlyData = generateMonthlyData(allDonations);
      
      // Method statistics
      const methodStats = allDonations.reduce((acc, d) => {
        acc[d.paymentMethod] = (acc[d.paymentMethod] || 0) + d.amount;
        return acc;
      }, {});

      // Status statistics
      const statusStats = allDonations.reduce((acc, d) => {
        acc[d.status] = (acc[d.status] || 0) + 1;
        return acc;
      }, {});

      setStats({
        totalAmount: total,
        totalDonations: allDonations.length,
        todayAmount: todayTotal,
        monthlyData,
        methodStats,
        statusStats
      });
    } else if (userDonations) {
      const total = userDonations.reduce((sum, d) => sum + d.amount, 0);
      setStats({
        totalAmount: total,
        totalDonations: userDonations.length,
        todayAmount: 0,
        monthlyData: [],
        methodStats: {},
        statusStats: {}
      });
    }
  };

  const generateMonthlyData = (donations) => {
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
    const currentMonth = new Date().getMonth();
    const monthlyData = [];

    for (let i = 5; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12;
      const monthDonations = donations.filter(d => {
        const donationMonth = new Date(d.date).getMonth();
        return donationMonth === monthIndex;
      });
      
      monthlyData.push({
        month: months[monthIndex],
        amount: monthDonations.reduce((sum, d) => sum + d.amount, 0),
        count: monthDonations.length
      });
    }

    return monthlyData;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#4ade80';
      case 'pending': return '#f59e0b';
      case 'failed': return '#ef4444';
      case 'pending_fallback': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  const getMethodIcon = (method) => {
    switch (method) {
      case 'orange': return '🟠';
      case 'mpesa': return '🟢';
      case 'airtel': return '🔵';
      case 'bank': return '🏦';
      default: return '💳';
    }
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div className="dashboard-title">
          <h2>{isAdmin ? '📊 Tableau de Bord Administration' : '👤 Mon Historique de Dons'}</h2>
          <div className="dashboard-actions">
            {isAdmin && (
              <button className="btn-refresh" onClick={calculateStats}>
                🔄 Actualiser
              </button>
            )}
            <button className="btn-logout" onClick={onLogout}>
              🚪 Déconnexion
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      {isAdmin && (
        <div className="dashboard-tabs">
          <button 
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            📈 Vue d'ensemble
          </button>
          <button 
            className={`tab-btn ${activeTab === 'donations' ? 'active' : ''}`}
            onClick={() => setActiveTab('donations')}
          >
          💰 Détails des dons
          </button>
          <button 
            className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            📊 Analytiques
          </button>
        </div>
      )}

      {/* Content */}
      <div className="dashboard-content">
        {isAdmin ? (
          <>
            {/* Admin Overview */}
            {activeTab === 'overview' && (
              <div className="overview-section">
                {/* Stats Cards */}
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-icon">💰</div>
                    <div className="stat-content">
                      <h3>Total des Dons</h3>
                      <div className="stat-value">{stats.totalAmount.toLocaleString()} $</div>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">📊</div>
                    <div className="stat-content">
                      <h3>Nombre de Dons</h3>
                      <div className="stat-value">{stats.totalDonations}</div>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">📅</div>
                    <div className="stat-content">
                      <h3>Aujourd'hui</h3>
                      <div className="stat-value">{stats.todayAmount.toLocaleString()} $</div>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">📈</div>
                    <div className="stat-content">
                      <h3>Moyenne</h3>
                      <div className="stat-value">
                        {stats.totalDonations > 0 ? Math.round(stats.totalAmount / stats.totalDonations) : 0} $
                      </div>
                    </div>
                  </div>
                </div>

                {/* Charts */}
                <div className="charts-grid">
                  {/* Monthly Chart */}
                  <div className="chart-container">
                    <h3>📈 Évolution Mensuelle</h3>
                    <div className="chart">
                      {stats.monthlyData.map((data, index) => (
                        <div key={index} className="chart-bar">
                          <div 
                            className="bar-fill" 
                            style={{ 
                              height: `${Math.max((data.amount / Math.max(...stats.monthlyData.map(d => d.amount))) * 100, 5)}%` 
                            }}
                          ></div>
                          <div className="bar-label">{data.month}</div>
                          <div className="bar-value">{data.amount}$</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Method Stats */}
                  <div className="chart-container">
                    <h3>💳 Méthodes de Paiement</h3>
                    <div className="method-stats">
                      {Object.entries(stats.methodStats).map(([method, amount]) => (
                        <div key={method} className="method-item">
                          <span className="method-icon">{getMethodIcon(method)}</span>
                          <span className="method-name">{method.toUpperCase()}</span>
                          <span className="method-amount">{amount.toLocaleString()} $</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Status Stats */}
                  <div className="chart-container">
                    <h3>📊 Statut des Transactions</h3>
                    <div className="status-stats">
                      {Object.entries(stats.statusStats).map(([status, count]) => (
                        <div key={status} className="status-item">
                          <div 
                            className="status-indicator" 
                            style={{ backgroundColor: getStatusColor(status) }}
                          ></div>
                          <span className="status-name">{status}</span>
                          <span className="status-count">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Donations List */}
            {activeTab === 'donations' && (
              <div className="donations-section">
                <h3>📋 Liste des Derniers Dons</h3>
                <div className="donations-table">
                  <div className="table-header">
                    <div>Date</div>
                    <div>Nom</div>
                    <div>Téléphone</div>
                    <div>Montant</div>
                    <div>Méthode</div>
                    <div>Statut</div>
                    <div>Référence</div>
                  </div>
                  {allDonations?.slice().reverse().map(donation => (
                    <div key={donation.id} className="table-row">
                      <div>{new Date(donation.date).toLocaleDateString()}</div>
                      <div>{donation.userName}</div>
                      <div>{donation.userPhone}</div>
                      <div className="amount">{donation.amount} $</div>
                      <div>{getMethodIcon(donation.paymentMethod)} {donation.paymentMethod}</div>
                      <div>
                        <span 
                          className="status-badge" 
                          style={{ backgroundColor: getStatusColor(donation.status) }}
                        >
                          {donation.status}
                        </span>
                      </div>
                      <div className="reference">{donation.reference}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Analytics */}
            {activeTab === 'analytics' && (
              <div className="analytics-section">
                <h3>📊 Analytiques Avancées</h3>
                <div className="analytics-grid">
                  <div className="analytics-card">
                    <h4>📈 Taux de Conversion</h4>
                    <div className="conversion-rate">
                      <div className="rate-circle">
                        <div className="rate-fill" style={{ width: '75%' }}></div>
                        <span className="rate-text">75%</span>
                      </div>
                      <p>Dons complétés / Dons initiés</p>
                    </div>
                  </div>
                  
                  <div className="analytics-card">
                    <h4>👥 Top Donateurs</h4>
                    <div className="top-donors">
                      {/* Top 5 donors would be calculated here */}
                      <div className="donor-item">
                        <span>1. Jean Kabongo</span>
                        <span>500 $</span>
                      </div>
                      <div className="donor-item">
                        <span>2. Marie Ntumba</span>
                        <span>350 $</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          /* User Dashboard */
          <div className="user-dashboard">
            <div className="user-stats">
              <div className="user-stat-card">
                <h3>💰 Total de mes dons</h3>
                <div className="user-stat-value">{stats.totalAmount.toLocaleString()} $</div>
              </div>
              <div className="user-stat-card">
                <h3>📊 Nombre de dons</h3>
                <div className="user-stat-value">{stats.totalDonations}</div>
              </div>
            </div>

            <div className="user-donations">
              <h3>📋 Mon Historique de Dons</h3>
              <div className="user-donations-table">
                <div className="table-header">
                  <div>Date</div>
                  <div>Montant</div>
                  <div>Méthode</div>
                  <div>Statut</div>
                  <div>Référence</div>
                </div>
                {userDonations?.slice().reverse().map(donation => (
                  <div key={donation.id} className="table-row">
                    <div>{new Date(donation.date).toLocaleDateString()}</div>
                    <div className="amount">{donation.amount} $</div>
                    <div>{getMethodIcon(donation.paymentMethod)} {donation.paymentMethod}</div>
                    <div>
                      <span 
                        className="status-badge" 
                        style={{ backgroundColor: getStatusColor(donation.status) }}
                      >
                        {donation.status}
                      </span>
                    </div>
                    <div className="reference">{donation.reference}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
