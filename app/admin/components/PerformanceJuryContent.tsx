"use client";

import { useState, useEffect } from 'react';
import {
  FaUsers,
  FaChartBar,
  FaTrophy,
  FaClock,
  FaCheck,
  FaTimes,
  FaStar,
  FaArrowUp,
  FaArrowDown,
  FaMinus,
  FaEye,
  FaSync
} from 'react-icons/fa';

interface JuryPerformance {
  jury: {
    id: string;
    nom: string;
    prenom: string;
    email: string;
    role: string;
    createdAt: string;
  };
  totalEvaluations: number;
  scoreMoyen: number;
  scoreMin: number;
  scoreMax: number;
  ecartType: number;
  decisions: Record<string, number>;
  evalParMois: Record<string, number>;
  distributionScores: Record<string, number>;
  derniereEvaluation: string | null;
}

interface StatsGlobales {
  totalEvaluations: number;
  scoreMoyenGlobal: number;
  totalDemandes: number;
  demandesEnAttente: number;
  demandesApprouvees: number;
  demandesRejetees: number;
  totalJurys: number;
  totalPresidents: number;
  evaluationsParHeure: Record<string, number>;
  evaluationsParMoisGlobal: Record<string, number>;
}

interface ActiviteRecente {
  id: string;
  evaluateur: string;
  roleEvaluateur: string;
  demande: string;
  candidat: string;
  entreprise: string;
  score: number;
  decision: string | null;
  date: string;
}

interface PerformanceData {
  performancesParJury: JuryPerformance[];
  statistiquesGlobales: StatsGlobales;
  activiteRecente: ActiviteRecente[];
}

export default function PerformanceJuryContent() {
  const [data, setData] = useState<PerformanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedJury, setSelectedJury] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'overview' | 'detail'>('overview');

  useEffect(() => {
    fetchPerformances();
  }, []);

  const fetchPerformances = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('auth-token');
      if (!token) {
        window.location.href = '/admin/login';
        return;
      }

      const response = await fetch('/api/evaluations/performances', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 403) {
          setError('Accès réservé au Super Administrateur');
          return;
        }
        throw new Error('Erreur lors du chargement');
      }

      const result = await response.json();
      if (result.success) {
        setData(result.data);
      } else {
        setError(result.message);
      }
    } catch (err) {
      console.error('Erreur:', err);
      setError('Erreur lors du chargement des performances');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des performances...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-4">⚠</div>
          <p className="text-red-600 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { performancesParJury, statistiquesGlobales, activiteRecente } = data;

  const selectedJuryData = selectedJury
    ? performancesParJury.find(p => p.jury.id === selectedJury)
    : null;

  // Classement des jurys par nombre d'évaluations
  const classement = [...performancesParJury]
    .filter(p => p.jury.role === 'JURY')
    .sort((a, b) => b.totalEvaluations - a.totalEvaluations);

  const comparatifJurys = [...performancesParJury].sort(
    (a, b) => b.totalEvaluations - a.totalEvaluations
  );
  const maxEvaluations = Math.max(...comparatifJurys.map(p => p.totalEvaluations), 1);
  const totalEvaluationsComparatif = comparatifJurys.reduce((sum, p) => sum + p.totalEvaluations, 0);
  const comparatifSegments = comparatifJurys.filter(p => p.totalEvaluations > 0);
  const donutColors = [
    '#4F46E5', '#F59E0B', '#10B981', '#EF4444', '#8B5CF6',
    '#06B6D4', '#F97316', '#22C55E', '#E11D48', '#6366F1'
  ];

  const heuresEntries = Object.entries(statistiquesGlobales.evaluationsParHeure || {})
    .sort(([a], [b]) => a.localeCompare(b));
  const maxHeure = Math.max(...heuresEntries.map(([, count]) => count), 1);

  const moisGlobalEntries = Object.entries(statistiquesGlobales.evaluationsParMoisGlobal || {})
    .sort(([a], [b]) => a.localeCompare(b));
  const maxMoisGlobal = Math.max(...moisGlobalEntries.map(([, count]) => count), 1);

  const moisLabels: Record<string, string> = {
    '01': 'Jan', '02': 'Fév', '03': 'Mar', '04': 'Avr',
    '05': 'Mai', '06': 'Jun', '07': 'Jul', '08': 'Aoû',
    '09': 'Sep', '10': 'Oct', '11': 'Nov', '12': 'Déc'
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-blue-100';
    if (score >= 40) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const getBarColor = (key: string) => {
    const colors: Record<string, string> = {
      '0-20': 'bg-red-500',
      '21-40': 'bg-orange-500',
      '41-60': 'bg-yellow-500',
      '61-80': 'bg-blue-500',
      '81-100': 'bg-green-500'
    };
    return colors[key] || 'bg-gray-500';
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Performances des Jurys</h2>
            <p className="text-white/90">Suivi et analyse des activit&eacute;s d&apos;&eacute;valuation</p>
          </div>
          <button
            onClick={fetchPerformances}
            className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
          >
            <FaSync className="text-sm" />
            <span>Actualiser</span>
          </button>
        </div>
      </div>

      {/* Statistiques globales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-indigo-500">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <FaChartBar className="text-indigo-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{statistiquesGlobales.totalEvaluations}</p>
          <p className="text-sm text-gray-600">Total &eacute;valuations</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-purple-500">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FaStar className="text-purple-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{statistiquesGlobales.scoreMoyenGlobal}<span className="text-lg text-gray-500">/100</span></p>
          <p className="text-sm text-gray-600">Score moyen global</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-green-500">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <FaUsers className="text-green-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{statistiquesGlobales.totalJurys + statistiquesGlobales.totalPresidents}</p>
          <p className="text-sm text-gray-600">{statistiquesGlobales.totalJurys} jurys + {statistiquesGlobales.totalPresidents} pr&eacute;sident(s)</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-orange-500">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <FaClock className="text-orange-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{statistiquesGlobales.demandesEnAttente}</p>
          <p className="text-sm text-gray-600">Demandes en attente</p>
        </div>
      </div>

      {/* Résumé des décisions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FaChartBar className="text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{statistiquesGlobales.totalDemandes}</p>
              <p className="text-sm text-gray-600">Total demandes</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <FaCheck className="text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{statistiquesGlobales.demandesApprouvees}</p>
              <p className="text-sm text-gray-600">Approuv&eacute;es</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-red-100 rounded-lg">
              <FaTimes className="text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">{statistiquesGlobales.demandesRejetees}</p>
              <p className="text-sm text-gray-600">Rejet&eacute;es</p>
            </div>
          </div>
        </div>
      </div>

      {/* Vue par onglets */}
      <div className="flex space-x-2 border-b border-gray-200">
        <button
          onClick={() => { setViewMode('overview'); setSelectedJury(null); }}
          className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
            viewMode === 'overview'
              ? 'bg-white text-indigo-600 border border-b-white border-gray-200 -mb-px'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Vue d&apos;ensemble
        </button>
        <button
          onClick={() => setViewMode('detail')}
          className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
            viewMode === 'detail'
              ? 'bg-white text-indigo-600 border border-b-white border-gray-200 -mb-px'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          D&eacute;tail par jury
        </button>
      </div>

      {viewMode === 'overview' ? (
        <>
          {/* Comparatifs & tendances */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Comparatif des jurys */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <FaChartBar className="text-indigo-500" />
                <span>Comparatif des jurys</span>
              </h3>
              {comparatifSegments.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Aucune donn&eacute;e de jury disponible</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6 items-center">
                  <div className="flex items-center justify-center">
                    <svg width="200" height="200" viewBox="0 0 200 200" className="overflow-visible">
                      <circle
                        cx="100"
                        cy="100"
                        r="70"
                        fill="none"
                        stroke="#E5E7EB"
                        strokeWidth="20"
                      />
                      {(() => {
                        const circumference = 2 * Math.PI * 70;
                        let offset = 0;
                        return comparatifSegments.map((perf, index) => {
                          const length = (perf.totalEvaluations / totalEvaluationsComparatif) * circumference;
                          const dasharray = `${length} ${circumference - length}`;
                          const dashoffset = -offset;
                          offset += length;
                          const color = donutColors[index % donutColors.length];
                          return (
                            <circle
                              key={perf.jury.id}
                              cx="100"
                              cy="100"
                              r="70"
                              fill="none"
                              stroke={color}
                              strokeWidth="20"
                              strokeDasharray={dasharray}
                              strokeDashoffset={dashoffset}
                              strokeLinecap="butt"
                              transform="rotate(-90 100 100)"
                            />
                          );
                        });
                      })()}
                      <text x="100" y="96" textAnchor="middle" className="fill-gray-900" fontSize="20" fontWeight="700">
                        {totalEvaluationsComparatif}
                      </text>
                      <text x="100" y="118" textAnchor="middle" className="fill-gray-500" fontSize="11">
                        candidatures
                      </text>
                      <text x="100" y="132" textAnchor="middle" className="fill-gray-500" fontSize="11">
                        trait&eacute;es
                      </text>
                    </svg>
                  </div>

                  <div className="space-y-3">
                    {comparatifSegments.map((perf, index) => {
                      const color = donutColors[index % donutColors.length];
                      const percentage = totalEvaluationsComparatif > 0
                        ? Math.round((perf.totalEvaluations / totalEvaluationsComparatif) * 100)
                        : 0;
                      return (
                        <div key={perf.jury.id} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3 min-w-0">
                            <span
                              className="inline-block w-3 h-3 rounded-full"
                              style={{ backgroundColor: color }}
                            />
                            <span className="text-sm font-medium text-gray-700 truncate">
                              {perf.jury.prenom} {perf.jury.nom}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600">
                            <span className="font-semibold text-gray-900">{perf.totalEvaluations}</span>
                            <span className="ml-2 text-gray-500">{percentage}%</span>
                          </div>
                        </div>
                      );
                    })}
                    <p className="text-xs text-gray-500">
                      R&eacute;partition du nombre de candidatures trait&eacute;es par jury.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Horaire d'évaluation */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <FaClock className="text-orange-500" />
                <span>Horaire d&apos;&eacute;valuation</span>
              </h3>
              {statistiquesGlobales.totalEvaluations === 0 ? (
                <p className="text-gray-500 text-center py-8">Aucune &eacute;valuation enregistr&eacute;e</p>
              ) : (
                <div className="flex items-end gap-1 h-56">
                  {heuresEntries.map(([heure, count], index) => {
                    const heightPercent = (count / maxHeure) * 100;
                    return (
                      <div key={heure} className="flex-1 flex flex-col items-center">
                        <div className="w-full bg-gray-100 rounded-t-lg relative" style={{ height: '200px' }}>
                          <div
                            className="absolute bottom-0 w-full bg-gradient-to-t from-orange-500 to-amber-400 rounded-t-lg transition-all duration-500"
                            style={{ height: `${Math.max(heightPercent, count > 0 ? 4 : 0)}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-gray-500 mt-1">
                          {index % 3 === 0 ? `${heure}h` : ''}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
              {statistiquesGlobales.totalEvaluations > 0 && (
                <p className="text-xs text-gray-500 mt-3">
                  Distribution des &eacute;valuations par heure (0-23h)
                </p>
              )}
            </div>
          </div>

          {/* Tendance globale mensuelle */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <FaChartBar className="text-purple-500" />
              <span>Tendance mensuelle globale</span>
            </h3>
            {statistiquesGlobales.totalEvaluations === 0 ? (
              <p className="text-gray-500 text-center py-8">Aucune &eacute;valuation enregistr&eacute;e</p>
            ) : (
              <div className="flex items-end justify-between space-x-2 h-48">
                {moisGlobalEntries.map(([moisKey, count]) => {
                  const moisNum = moisKey.split('-')[1];
                  const annee = moisKey.split('-')[0]?.slice(2);
                  const heightPercent = (count / maxMoisGlobal) * 100;
                  return (
                    <div key={moisKey} className="flex-1 flex flex-col items-center">
                      <span className="text-xs font-bold text-gray-900 mb-1">{count}</span>
                      <div className="w-full bg-gray-100 rounded-t-lg relative" style={{ height: '160px' }}>
                        <div
                          className="absolute bottom-0 w-full bg-gradient-to-t from-purple-600 to-purple-400 rounded-t-lg transition-all duration-500"
                          style={{ height: `${Math.max(heightPercent, count > 0 ? 5 : 0)}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500 mt-1">
                        {moisLabels[moisNum] || moisNum} {annee}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Classement des jurys */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <FaTrophy className="text-yellow-500" />
              <span>Classement des Jurys</span>
            </h3>

            {classement.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Aucune donn&eacute;e de jury disponible</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">#</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Jury</th>
                      <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600">&Eacute;valuations</th>
                      <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600">Score moyen</th>
                      <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600">Min / Max</th>
                      <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600">&Eacute;cart-type</th>
                      <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600">Derni&egrave;re activit&eacute;</th>
                      <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {classement.map((perf, index) => (
                      <tr key={perf.jury.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
                            index === 0 ? 'bg-yellow-100 text-yellow-700' :
                            index === 1 ? 'bg-gray-100 text-gray-700' :
                            index === 2 ? 'bg-orange-100 text-orange-700' :
                            'bg-gray-50 text-gray-500'
                          }`}>
                            {index + 1}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-semibold text-gray-900">{perf.jury.prenom} {perf.jury.nom}</p>
                            <p className="text-xs text-gray-500">{perf.jury.email}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="inline-flex items-center px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full font-bold text-sm">
                            {perf.totalEvaluations}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full font-bold text-sm ${getScoreBgColor(perf.scoreMoyen)} ${getScoreColor(perf.scoreMoyen)}`}>
                            {perf.scoreMoyen}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="text-sm text-gray-600">
                            {perf.scoreMin} / {perf.scoreMax}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`text-sm font-medium ${
                            perf.ecartType <= 10 ? 'text-green-600' :
                            perf.ecartType <= 20 ? 'text-yellow-600' :
                            'text-red-600'
                          }`}>
                            {perf.ecartType}
                            {perf.ecartType <= 10 && <FaMinus className="inline ml-1 text-xs" />}
                            {perf.ecartType > 10 && perf.ecartType <= 20 && <FaArrowUp className="inline ml-1 text-xs" />}
                            {perf.ecartType > 20 && <FaArrowUp className="inline ml-1 text-xs text-red-600" />}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          {perf.derniereEvaluation ? (
                            <span className="text-xs text-gray-500">
                              {formatDate(perf.derniereEvaluation)}
                            </span>
                          ) : (
                            <span className="text-xs text-gray-400 italic">Aucune</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => { setSelectedJury(perf.jury.id); setViewMode('detail'); }}
                            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="Voir le d&eacute;tail"
                          >
                            <FaEye />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Président du Jury */}
          {performancesParJury.filter(p => p.jury.role === 'PRESIDENT_JURY').length > 0 && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <FaStar className="text-indigo-500" />
                <span>Pr&eacute;sident(s) du Jury</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {performancesParJury.filter(p => p.jury.role === 'PRESIDENT_JURY').map(perf => (
                  <div key={perf.jury.id} className="border border-indigo-200 rounded-lg p-4 bg-indigo-50/30">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-bold text-gray-900">{perf.jury.prenom} {perf.jury.nom}</p>
                        <p className="text-xs text-gray-500">{perf.jury.email}</p>
                      </div>
                      <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold">
                        PR&Eacute;SIDENT
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div>
                        <p className="text-2xl font-bold text-indigo-600">{perf.totalEvaluations}</p>
                        <p className="text-xs text-gray-500">Validations</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-green-600">{perf.decisions['APPROUVE'] || 0}</p>
                        <p className="text-xs text-gray-500">Approuv&eacute;es</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-red-600">{perf.decisions['REJETE'] || 0}</p>
                        <p className="text-xs text-gray-500">Rejet&eacute;es</p>
                      </div>
                    </div>
                    {perf.derniereEvaluation && (
                      <p className="text-xs text-gray-500 mt-3">
                        Derni&egrave;re validation : {formatDate(perf.derniereEvaluation)}
                      </p>
                    )}
                    <button
                      onClick={() => { setSelectedJury(perf.jury.id); setViewMode('detail'); }}
                      className="mt-3 w-full text-center text-sm text-indigo-600 hover:bg-indigo-100 py-2 rounded-lg transition-colors"
                    >
                      Voir le d&eacute;tail
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Activité récente */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <FaClock className="text-gray-500" />
              <span>Activit&eacute; r&eacute;cente</span>
            </h3>

            {activiteRecente.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Aucune activit&eacute; r&eacute;cente</p>
            ) : (
              <div className="space-y-3">
                {activiteRecente.map(activite => (
                  <div key={activite.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className={`p-2 rounded-full ${
                      activite.decision === 'APPROUVE' ? 'bg-green-100' :
                      activite.decision === 'REJETE' ? 'bg-red-100' :
                      'bg-blue-100'
                    }`}>
                      {activite.decision === 'APPROUVE' ? <FaCheck className="text-green-600 text-sm" /> :
                       activite.decision === 'REJETE' ? <FaTimes className="text-red-600 text-sm" /> :
                       <FaChartBar className="text-blue-600 text-sm" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        <span className="font-bold">{activite.evaluateur}</span>
                        <span className="text-gray-500"> a &eacute;valu&eacute; </span>
                        <span className="font-semibold">{activite.candidat}</span>
                        {activite.entreprise && <span className="text-gray-500"> ({activite.entreprise})</span>}
                      </p>
                      <p className="text-xs text-gray-500">
                        R&eacute;f: {activite.demande} &bull; {formatDate(activite.date)}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold ${getScoreBgColor(activite.score)} ${getScoreColor(activite.score)}`}>
                        {activite.score}/100
                      </span>
                      {activite.decision && (
                        <p className={`text-xs mt-1 font-semibold ${
                          activite.decision === 'APPROUVE' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {activite.decision === 'APPROUVE' ? 'Approuv&eacute;' : 'Rejet&eacute;'}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        /* Vue détail d'un jury */
        <DetailJuryView
          performances={performancesParJury}
          selectedJuryId={selectedJury}
          onSelectJury={setSelectedJury}
          moisLabels={moisLabels}
          formatDate={formatDate}
          getScoreColor={getScoreColor}
          getScoreBgColor={getScoreBgColor}
          getBarColor={getBarColor}
        />
      )}
    </div>
  );
}

// Composant vue détaillée d'un jury
function DetailJuryView({
  performances,
  selectedJuryId,
  onSelectJury,
  moisLabels,
  formatDate,
  getScoreColor,
  getScoreBgColor,
  getBarColor
}: {
  performances: JuryPerformance[];
  selectedJuryId: string | null;
  onSelectJury: (id: string) => void;
  moisLabels: Record<string, string>;
  formatDate: (d: string) => string;
  getScoreColor: (s: number) => string;
  getScoreBgColor: (s: number) => string;
  getBarColor: (k: string) => string;
}) {
  const selected = selectedJuryId
    ? performances.find(p => p.jury.id === selectedJuryId)
    : performances[0] || null;

  if (performances.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 text-center">
        <p className="text-gray-500">Aucun jury disponible</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Sélecteur de jury */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2">S&eacute;lectionner un jury</label>
        <select
          value={selected?.jury.id || ''}
          onChange={(e) => onSelectJury(e.target.value)}
          className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          {performances.map(p => (
            <option key={p.jury.id} value={p.jury.id}>
              {p.jury.prenom} {p.jury.nom} ({p.jury.role === 'PRESIDENT_JURY' ? 'Pr\u00e9sident' : 'Jury'})
            </option>
          ))}
        </select>
      </div>

      {selected && (
        <>
          {/* Profil et résumé */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xl">
                    {selected.jury.prenom[0]}{selected.jury.nom[0]}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{selected.jury.prenom} {selected.jury.nom}</h3>
                  <p className="text-sm text-gray-500">{selected.jury.email}</p>
                  <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                    selected.jury.role === 'PRESIDENT_JURY'
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'bg-purple-100 text-purple-700'
                  }`}>
                    {selected.jury.role === 'PRESIDENT_JURY' ? 'Pr\u00e9sident du Jury' : 'Membre du Jury'}
                  </span>
                </div>
              </div>
              {selected.derniereEvaluation && (
                <div className="text-right">
                  <p className="text-xs text-gray-500">Derni&egrave;re activit&eacute;</p>
                  <p className="text-sm font-medium text-gray-700">{formatDate(selected.derniereEvaluation)}</p>
                </div>
              )}
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center p-3 bg-indigo-50 rounded-lg">
                <p className="text-2xl font-bold text-indigo-600">{selected.totalEvaluations}</p>
                <p className="text-xs text-gray-600">&Eacute;valuations</p>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <p className={`text-2xl font-bold ${getScoreColor(selected.scoreMoyen)}`}>{selected.scoreMoyen}</p>
                <p className="text-xs text-gray-600">Score moyen</p>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <p className="text-2xl font-bold text-red-600">{selected.scoreMin}</p>
                <p className="text-xs text-gray-600">Score min</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">{selected.scoreMax}</p>
                <p className="text-xs text-gray-600">Score max</p>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                <p className={`text-2xl font-bold ${
                  selected.ecartType <= 10 ? 'text-green-600' :
                  selected.ecartType <= 20 ? 'text-yellow-600' :
                  'text-red-600'
                }`}>{selected.ecartType}</p>
                <p className="text-xs text-gray-600">&Eacute;cart-type</p>
              </div>
            </div>
          </div>

          {/* Graphiques */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Distribution des scores */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h4 className="text-md font-bold text-gray-900 mb-4">Distribution des scores</h4>
              {selected.totalEvaluations === 0 ? (
                <p className="text-gray-500 text-center py-8">Aucune &eacute;valuation</p>
              ) : (
                <div className="space-y-3">
                  {Object.entries(selected.distributionScores).map(([tranche, count]) => {
                    const maxCount = Math.max(...Object.values(selected.distributionScores), 1);
                    const percentage = (count / maxCount) * 100;
                    return (
                      <div key={tranche}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700">{tranche}</span>
                          <span className="text-sm font-bold text-gray-900">{count}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className={`${getBarColor(tranche)} h-3 rounded-full transition-all duration-500`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Activité par mois */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h4 className="text-md font-bold text-gray-900 mb-4">&Eacute;valuations par mois (6 derniers mois)</h4>
              {selected.totalEvaluations === 0 ? (
                <p className="text-gray-500 text-center py-8">Aucune &eacute;valuation</p>
              ) : (
                <div className="flex items-end justify-between space-x-2 h-48">
                  {Object.entries(selected.evalParMois).map(([moisKey, count]) => {
                    const moisNum = moisKey.split('-')[1];
                    const maxCount = Math.max(...Object.values(selected.evalParMois), 1);
                    const heightPercent = (count / maxCount) * 100;
                    return (
                      <div key={moisKey} className="flex-1 flex flex-col items-center">
                        <span className="text-xs font-bold text-gray-900 mb-1">{count}</span>
                        <div className="w-full bg-gray-100 rounded-t-lg relative" style={{ height: '160px' }}>
                          <div
                            className="absolute bottom-0 w-full bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-lg transition-all duration-500"
                            style={{ height: `${Math.max(heightPercent, count > 0 ? 5 : 0)}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500 mt-1">{moisLabels[moisNum] || moisNum}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Décisions du président */}
          {selected.jury.role === 'PRESIDENT_JURY' && Object.keys(selected.decisions).length > 0 && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h4 className="text-md font-bold text-gray-900 mb-4">R&eacute;partition des d&eacute;cisions</h4>
              <div className="flex items-center space-x-8">
                <div className="flex-1">
                  <div className="flex items-center space-x-4">
                    {Object.entries(selected.decisions).map(([decision, count]) => {
                      const total = Object.values(selected.decisions).reduce((a, b) => a + b, 0);
                      const percentage = total > 0 ? ((count / total) * 100).toFixed(1) : '0';
                      return (
                        <div key={decision} className="flex-1 text-center">
                          <div className={`p-4 rounded-lg ${
                            decision === 'APPROUVE' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                          }`}>
                            <p className={`text-3xl font-bold ${
                              decision === 'APPROUVE' ? 'text-green-600' : 'text-red-600'
                            }`}>{count}</p>
                            <p className="text-sm text-gray-600 mt-1">
                              {decision === 'APPROUVE' ? 'Approuv\u00e9es' : 'Rejet\u00e9es'}
                            </p>
                            <p className={`text-xs font-semibold mt-1 ${
                              decision === 'APPROUVE' ? 'text-green-500' : 'text-red-500'
                            }`}>{percentage}%</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Barre de progression */}
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden flex">
                      {Object.entries(selected.decisions).map(([decision, count]) => {
                        const total = Object.values(selected.decisions).reduce((a, b) => a + b, 0);
                        const percentage = total > 0 ? (count / total) * 100 : 0;
                        return (
                          <div
                            key={decision}
                            className={`h-4 transition-all duration-500 ${
                              decision === 'APPROUVE' ? 'bg-green-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
