"use client";

import { useState, useEffect } from 'react';
import {
  FaSearch,
  FaFilter,
  FaDownload,
  FaCheckCircle,
  FaExclamationCircle,
  FaExclamationTriangle,
  FaUser,
  FaCalendar,
  FaClock,
  FaInfoCircle,
  FaChevronDown,
  FaChevronUp,
} from 'react-icons/fa';

interface Log {
  id: string;
  userId: string | null;
  userEmail: string | null;
  userName: string | null;
  userRole: string | null;
  action: string;
  entity: string | null;
  entityId: string | null;
  description: string;
  metadata: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  status: string;
  errorMessage: string | null;
  createdAt: string;
}

interface LogStats {
  overview: {
    totalLogs: number;
    totalSuccess: number;
    totalErrors: number;
    totalWarnings: number;
    logsLast24h: number;
    logsLastWeek: number;
  };
  byAction: Array<{ action: string; count: number }>;
  byEntity: Array<{ entity: string; count: number }>;
  byUser: Array<{ userId: string; userName: string; userRole: string; count: number }>;
  recentErrors: Log[];
}

export default function LogsContent() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [stats, setStats] = useState<LogStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  
  // Filtres
  const [actionFilter, setActionFilter] = useState('');
  const [entityFilter, setEntityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  // Détails du log sélectionné
  const [selectedLog, setSelectedLog] = useState<Log | null>(null);
  const [expandedLogs, setExpandedLogs] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchLogs();
    fetchStats();
  }, [page, actionFilter, entityFilter, statusFilter, startDate, endDate]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('auth-token');
      if (!token) return;

      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
      });

      if (actionFilter) params.append('action', actionFilter);
      if (entityFilter) params.append('entity', entityFilter);
      if (statusFilter) params.append('status', statusFilter);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const response = await fetch(`/api/logs?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setLogs(data.data);
          setTotalPages(data.pagination.totalPages);
          setTotal(data.pagination.total);
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement des logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    setStatsLoading(true);
    try {
      const token = localStorage.getItem('auth-token');
      if (!token) return;

      const response = await fetch('/api/logs', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setStats(data.data);
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  const toggleLogExpansion = (logId: string) => {
    const newExpanded = new Set(expandedLogs);
    if (newExpanded.has(logId)) {
      newExpanded.delete(logId);
    } else {
      newExpanded.add(logId);
    }
    setExpandedLogs(newExpanded);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return <FaCheckCircle className="text-green-500" />;
      case 'ERROR':
        return <FaExclamationCircle className="text-red-500" />;
      case 'WARNING':
        return <FaExclamationTriangle className="text-yellow-500" />;
      default:
        return <FaInfoCircle className="text-blue-500" />;
    }
  };

  const getActionBadgeColor = (action: string) => {
    const colors: { [key: string]: string } = {
      'LOGIN': 'bg-green-100 text-green-700',
      'LOGOUT': 'bg-gray-100 text-gray-700',
      'LOGIN_FAILED': 'bg-red-100 text-red-700',
      'CREATE': 'bg-blue-100 text-blue-700',
      'UPDATE': 'bg-yellow-100 text-yellow-700',
      'DELETE': 'bg-red-100 text-red-700',
      'APPROVE': 'bg-green-100 text-green-700',
      'REJECT': 'bg-red-100 text-red-700',
    };
    return colors[action] || 'bg-gray-100 text-gray-700';
  };

  const exportLogs = () => {
    // Créer un CSV des logs
    const headers = ['Date', 'Utilisateur', 'Action', 'Entité', 'Description', 'Statut', 'IP'];
    const rows = logs.map(log => [
      new Date(log.createdAt).toLocaleString('fr-FR'),
      log.userName || 'Système',
      log.action,
      log.entity || '-',
      log.description,
      log.status,
      log.ipAddress || '-',
    ]);

    let csv = headers.join(',') + '\n';
    rows.forEach(row => {
      csv += row.map(cell => `"${cell}"`).join(',') + '\n';
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `logs_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Statistiques */}
      {!statsLoading && stats && (
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4">📊 Vue d'ensemble</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <p className="text-sm text-gray-600 mb-1">Total des logs</p>
              <p className="text-2xl font-bold text-gray-900">{stats.overview.totalLogs.toLocaleString()}</p>
            </div>
            <div className="bg-green-50 rounded-lg shadow-sm p-4 border border-green-200">
              <p className="text-sm text-green-700 mb-1">Succès</p>
              <p className="text-2xl font-bold text-green-600">{stats.overview.totalSuccess.toLocaleString()}</p>
            </div>
            <div className="bg-red-50 rounded-lg shadow-sm p-4 border border-red-200">
              <p className="text-sm text-red-700 mb-1">Erreurs</p>
              <p className="text-2xl font-bold text-red-600">{stats.overview.totalErrors.toLocaleString()}</p>
            </div>
            <div className="bg-yellow-50 rounded-lg shadow-sm p-4 border border-yellow-200">
              <p className="text-sm text-yellow-700 mb-1">Avertissements</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.overview.totalWarnings.toLocaleString()}</p>
            </div>
            <div className="bg-blue-50 rounded-lg shadow-sm p-4 border border-blue-200">
              <p className="text-sm text-blue-700 mb-1">Dernières 24h</p>
              <p className="text-2xl font-bold text-blue-600">{stats.overview.logsLast24h.toLocaleString()}</p>
            </div>
            <div className="bg-purple-50 rounded-lg shadow-sm p-4 border border-purple-200">
              <p className="text-sm text-purple-700 mb-1">Dernière semaine</p>
              <p className="text-2xl font-bold text-purple-600">{stats.overview.logsLastWeek.toLocaleString()}</p>
            </div>
          </div>

          {/* Statistiques par action et entité */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {/* Top Actions */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <FaFilter className="mr-2 text-blue-500" />
                Top Actions
              </h4>
              <div className="space-y-2">
                {stats.byAction.slice(0, 5).map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getActionBadgeColor(item.action)}`}>
                      {item.action}
                    </span>
                    <span className="font-bold text-gray-900">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Entités */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <FaInfoCircle className="mr-2 text-green-500" />
                Top Entités
              </h4>
              <div className="space-y-2">
                {stats.byEntity.slice(0, 5).map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">{item.entity}</span>
                    <span className="font-bold text-gray-900">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Utilisateurs */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <FaUser className="mr-2 text-purple-500" />
                Utilisateurs Actifs
              </h4>
              <div className="space-y-2">
                {stats.byUser.slice(0, 5).map((item, idx) => (
                  <div key={idx} className="text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 font-medium truncate">{item.userName}</span>
                      <span className="font-bold text-gray-900 ml-2">{item.count}</span>
                    </div>
                    <p className="text-xs text-gray-500">{item.userRole}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Erreurs récentes */}
          {stats.recentErrors.length > 0 && (
            <div className="bg-red-50 rounded-lg shadow-sm p-4 mt-6 border border-red-200">
              <h4 className="font-semibold text-red-900 mb-3 flex items-center">
                <FaExclamationCircle className="mr-2" />
                Erreurs Récentes
              </h4>
              <div className="space-y-2">
                {stats.recentErrors.map((error) => (
                  <div key={error.id} className="bg-white rounded p-3 border border-red-100">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{error.description}</p>
                        <p className="text-xs text-red-600 mt-1">{error.errorMessage}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(error.createdAt).toLocaleString('fr-FR')} - {error.userName || 'Système'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Filtres */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">🔍 Filtres</h3>
          <button
            onClick={() => {
              setActionFilter('');
              setEntityFilter('');
              setStatusFilter('');
              setStartDate('');
              setEndDate('');
              setPage(1);
            }}
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            Réinitialiser
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Action</label>
            <select
              value={actionFilter}
              onChange={(e) => { setActionFilter(e.target.value); setPage(1); }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-sm"
            >
              <option value="">Toutes</option>
              <option value="LOGIN">Connexion</option>
              <option value="LOGOUT">Déconnexion</option>
              <option value="LOGIN_FAILED">Échec connexion</option>
              <option value="CREATE">Création</option>
              <option value="UPDATE">Modification</option>
              <option value="DELETE">Suppression</option>
              <option value="APPROVE">Approbation</option>
              <option value="REJECT">Rejet</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Entité</label>
            <select
              value={entityFilter}
              onChange={(e) => { setEntityFilter(e.target.value); setPage(1); }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-sm"
            >
              <option value="">Toutes</option>
              <option value="AUTH">Authentification</option>
              <option value="DEMANDE">Demande</option>
              <option value="EVALUATION">Évaluation</option>
              <option value="USER">Utilisateur</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-sm"
            >
              <option value="">Tous</option>
              <option value="SUCCESS">Succès</option>
              <option value="ERROR">Erreur</option>
              <option value="WARNING">Avertissement</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date début</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => { setStartDate(e.target.value); setPage(1); }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date fin</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => { setEndDate(e.target.value); setPage(1); }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Liste des logs */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900">📝 Historique des Logs</h3>
            <p className="text-sm text-gray-600">{total.toLocaleString()} log(s) au total</p>
          </div>
          <button
            onClick={exportLogs}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
          >
            <FaDownload />
            <span>Exporter CSV</span>
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Chargement des logs...</p>
            </div>
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            Aucun log trouvé avec ces filtres
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {logs.map((log) => {
              const isExpanded = expandedLogs.has(log.id);
              return (
                <div key={log.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="mt-1">
                        {getStatusIcon(log.status)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${getActionBadgeColor(log.action)}`}>
                            {log.action}
                          </span>
                          {log.entity && (
                            <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700">
                              {log.entity}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-900 mb-1">{log.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span className="flex items-center">
                            <FaUser className="mr-1" />
                            {log.userName || 'Système'}
                          </span>
                          <span className="flex items-center">
                            <FaClock className="mr-1" />
                            {new Date(log.createdAt).toLocaleString('fr-FR')}
                          </span>
                          {log.ipAddress && (
                            <span>IP: {log.ipAddress}</span>
                          )}
                        </div>
                        {log.errorMessage && (
                          <div className="mt-2 p-2 bg-red-50 rounded text-xs text-red-700">
                            <strong>Erreur:</strong> {log.errorMessage}
                          </div>
                        )}
                        {isExpanded && log.metadata && (
                          <div className="mt-2 p-3 bg-gray-50 rounded text-xs">
                            <strong className="text-gray-700">Métadonnées:</strong>
                            <pre className="mt-1 text-gray-600 overflow-x-auto">
                              {JSON.stringify(JSON.parse(log.metadata), null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    </div>
                    {log.metadata && (
                      <button
                        onClick={() => toggleLogExpansion(log.id)}
                        className="ml-2 p-2 text-gray-400 hover:text-gray-600"
                      >
                        {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Page {page} sur {totalPages}
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-3 py-1 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                Précédent
              </button>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="px-3 py-1 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                Suivant
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
