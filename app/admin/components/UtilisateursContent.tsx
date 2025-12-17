"use client";

import { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaCheck, FaTimes, FaSave } from 'react-icons/fa';

interface User {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  role: string;
  actif: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function UtilisateursContent() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [showAddUser, setShowAddUser] = useState(false);
  const [editingUser, setEditingUser] = useState<string | null>(null);
  
  // Form states
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    password: '',
    role: 'JURY',
    actif: true,
  });

  const roles = [
    { id: 'SUPER_ADMIN', label: 'Super Admin', color: 'red', description: 'Accès complet à toutes les fonctionnalités' },
    { id: 'ADMIN', label: 'Admin', color: 'orange', description: 'Gestion des utilisateurs et accès administratifs' },
    { id: 'SUPERVISEUR', label: 'Superviseur', color: 'blue', description: 'Supervision des opérations et validation' },
    { id: 'JURY', label: 'Jury', color: 'purple', description: 'Évaluation des demandes d\'exposants' },
    { id: 'GESTIONNAIRE', label: 'Gestionnaire', color: 'green', description: 'Gestion quotidienne des kiosques et exposants' },
    { id: 'COMPTABLE', label: 'Comptable', color: 'yellow', description: 'Gestion financière et paiements' },
  ];

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('auth-token');
      if (!token) {
        window.location.href = '/admin/login';
        return;
      }

      const response = await fetch('/api/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          alert('Vous n\'avez pas les permissions nécessaires');
          return;
        }
        throw new Error('Erreur lors du chargement des utilisateurs');
      }

      const data = await response.json();
      if (data.success) {
        setUsers(data.data);
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors du chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nom || !formData.prenom || !formData.email || !formData.password) {
      alert('Tous les champs sont requis');
      return;
    }

    try {
      const token = localStorage.getItem('auth-token');
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la création');
      }

      alert('Utilisateur créé avec succès !');
      setShowAddUser(false);
      setFormData({ nom: '', prenom: '', email: '', password: '', role: 'JURY', actif: true });
      fetchUsers();
    } catch (error: any) {
      alert(error.message || 'Erreur lors de la création');
    }
  };

  const handleUpdateUser = async (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    try {
      const token = localStorage.getItem('auth-token');
      const response = await fetch('/api/users', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: userId,
          nom: user.nom,
          prenom: user.prenom,
          email: user.email,
          role: user.role,
          actif: user.actif,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la modification');
      }

      alert('Utilisateur modifié avec succès !');
      setEditingUser(null);
      fetchUsers();
    } catch (error: any) {
      alert(error.message || 'Erreur lors de la modification');
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur "${userName}" ?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('auth-token');
      const response = await fetch(`/api/users?id=${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la suppression');
      }

      alert('Utilisateur supprimé avec succès !');
      fetchUsers();
    } catch (error: any) {
      alert(error.message || 'Erreur lors de la suppression');
    }
  };

  const handleToggleActif = async (userId: string, currentActif: boolean) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    try {
      const token = localStorage.getItem('auth-token');
      const response = await fetch('/api/users', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: userId,
          actif: !currentActif,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la modification');
      }

      fetchUsers();
    } catch (error: any) {
      alert(error.message || 'Erreur lors de la modification du statut');
    }
  };

  const updateUserField = (userId: string, field: keyof User, value: any) => {
    setUsers(users.map(u => u.id === userId ? { ...u, [field]: value } : u));
  };

  const filteredUsers = selectedRole === 'all' 
    ? users 
    : users.filter(u => u.role === selectedRole);

  const getRoleColor = (role: string) => {
    const roleConfig = roles.find(r => r.id === role);
    return roleConfig?.color || 'gray';
  };

  const getRoleLabel = (role: string) => {
    const roleConfig = roles.find(r => r.id === role);
    return roleConfig?.label || role;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des utilisateurs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-sm text-gray-600 mb-1">Total Utilisateurs</p>
          <p className="text-2xl font-bold text-gray-900">{users.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-sm text-gray-600 mb-1">Administrateurs</p>
          <p className="text-2xl font-bold text-red-600">
            {users.filter(u => u.role === 'ADMIN' || u.role === 'SUPER_ADMIN').length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-sm text-gray-600 mb-1">Jury</p>
          <p className="text-2xl font-bold text-purple-600">
            {users.filter(u => u.role === 'JURY').length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-sm text-gray-600 mb-1">Actifs</p>
          <p className="text-2xl font-bold text-green-600">
            {users.filter(u => u.actif).length}
          </p>
        </div>
      </div>

      {/* Roles Cards */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Rôles et Permissions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {roles.map((role) => (
            <div key={role.id} className={`p-4 rounded-lg border-2 border-${role.color}-200 bg-${role.color}-50`}>
              <div className="flex items-center justify-between mb-2">
                <h4 className={`font-bold text-${role.color}-700`}>{role.label}</h4>
                <span className={`px-2 py-1 text-xs font-semibold text-${role.color}-700 bg-${role.color}-200 rounded-full`}>
                  {users.filter(u => u.role === role.id).length}
                </span>
              </div>
              <p className="text-sm text-gray-600">{role.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Users Management */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <h3 className="text-lg font-bold text-gray-900">Liste des Utilisateurs</h3>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">Tous les rôles</option>
              {roles.map(role => (
                <option key={role.id} value={role.id}>{role.label}</option>
              ))}
            </select>
          </div>
          <button
            onClick={() => setShowAddUser(!showAddUser)}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            <FaPlus />
            <span>Ajouter Utilisateur</span>
          </button>
        </div>

        {/* Add User Form */}
        {showAddUser && (
          <form onSubmit={handleCreateUser} className="mb-6 p-6 bg-gray-50 rounded-lg border-2 border-primary-200">
            <h4 className="font-bold text-gray-900 mb-4">Nouvel Utilisateur</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prénom *</label>
                <input 
                  type="text" 
                  value={formData.prenom}
                  onChange={(e) => setFormData({...formData, prenom: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg" 
                  placeholder="Ex: Ibrahim" 
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
                <input 
                  type="text" 
                  value={formData.nom}
                  onChange={(e) => setFormData({...formData, nom: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg" 
                  placeholder="Ex: Saidou" 
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg" 
                  placeholder="email@marche.ne" 
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe *</label>
                <input 
                  type="password" 
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg" 
                  placeholder="Min 8 caractères" 
                  required
                  minLength={8}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rôle *</label>
                <select 
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  {roles.map(role => (
                    <option key={role.id} value={role.id}>{role.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex space-x-3 mt-4">
              <button 
                type="submit"
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Créer Utilisateur
              </button>
              <button 
                type="button"
                onClick={() => {
                  setShowAddUser(false);
                  setFormData({ nom: '', prenom: '', email: '', password: '', role: 'JURY', actif: true });
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Annuler
              </button>
            </div>
          </form>
        )}

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Utilisateur</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rôle</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    Aucun utilisateur trouvé
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const roleColor = getRoleColor(user.role);
                  const isEditing = editingUser === user.id;
                  
                  return (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className={`w-10 h-10 rounded-full bg-gradient-to-br from-${roleColor}-400 to-${roleColor}-600 flex items-center justify-center text-white font-bold mr-3`}>
                            {user.prenom[0]}{user.nom[0]}
                          </div>
                          {isEditing ? (
                            <div className="space-y-1">
                              <input
                                type="text"
                                value={user.prenom}
                                onChange={(e) => updateUserField(user.id, 'prenom', e.target.value)}
                                className="text-sm font-medium px-2 py-1 border rounded"
                                placeholder="Prénom"
                              />
                              <input
                                type="text"
                                value={user.nom}
                                onChange={(e) => updateUserField(user.id, 'nom', e.target.value)}
                                className="text-sm font-medium px-2 py-1 border rounded"
                                placeholder="Nom"
                              />
                            </div>
                          ) : (
                            <span className="text-sm font-medium text-gray-900">
                              {user.prenom} {user.nom}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {isEditing ? (
                          <input
                            type="email"
                            value={user.email}
                            onChange={(e) => updateUserField(user.id, 'email', e.target.value)}
                            className="text-sm px-2 py-1 border rounded w-full"
                          />
                        ) : (
                          <span className="text-sm text-gray-600">{user.email}</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {isEditing ? (
                          <select
                            value={user.role}
                            onChange={(e) => updateUserField(user.id, 'role', e.target.value)}
                            className="text-sm px-2 py-1 border rounded"
                          >
                            {roles.map(role => (
                              <option key={role.id} value={role.id}>{role.label}</option>
                            ))}
                          </select>
                        ) : (
                          <span className={`px-3 py-1 text-xs font-semibold text-${roleColor}-700 bg-${roleColor}-100 rounded-full`}>
                            {getRoleLabel(user.role)}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggleActif(user.id, user.actif)}
                          className={`px-3 py-1 text-xs font-semibold rounded-full cursor-pointer hover:opacity-80 ${
                            user.actif 
                              ? 'text-green-700 bg-green-100' 
                              : 'text-gray-700 bg-gray-100'
                          }`}
                        >
                          {user.actif ? 'Actif' : 'Inactif'}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          {isEditing ? (
                            <>
                              <button 
                                onClick={() => handleUpdateUser(user.id)}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg" 
                                title="Sauvegarder"
                              >
                                <FaSave />
                              </button>
                              <button 
                                onClick={() => {
                                  setEditingUser(null);
                                  fetchUsers(); // Recharger pour annuler les changements
                                }}
                                className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg" 
                                title="Annuler"
                              >
                                <FaTimes />
                              </button>
                            </>
                          ) : (
                            <>
                              <button 
                                onClick={() => setEditingUser(user.id)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" 
                                title="Modifier"
                              >
                                <FaEdit />
                              </button>
                              <button 
                                onClick={() => handleDeleteUser(user.id, `${user.prenom} ${user.nom}`)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg" 
                                title="Supprimer"
                              >
                                <FaTrash />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Permissions Matrix */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Matrice des Permissions</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Permission</th>
                <th className="px-4 py-3 text-center font-medium text-red-700">Super Admin</th>
                <th className="px-4 py-3 text-center font-medium text-orange-700">Admin</th>
                <th className="px-4 py-3 text-center font-medium text-blue-700">Superviseur</th>
                <th className="px-4 py-3 text-center font-medium text-purple-700">Jury</th>
                <th className="px-4 py-3 text-center font-medium text-green-700">Gestionnaire</th>
                <th className="px-4 py-3 text-center font-medium text-yellow-700">Comptable</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {[
                { label: 'Gestion des utilisateurs', superAdmin: true, admin: true, superviseur: false, jury: false, gestionnaire: false, comptable: false },
                { label: 'Gestion des demandes', superAdmin: true, admin: true, superviseur: true, jury: true, gestionnaire: false, comptable: false },
                { label: 'Évaluation candidats', superAdmin: true, admin: true, superviseur: true, jury: true, gestionnaire: false, comptable: false },
                { label: 'Gestion exposants', superAdmin: true, admin: true, superviseur: true, jury: false, gestionnaire: true, comptable: false },
                { label: 'Attribution kiosques', superAdmin: true, admin: true, superviseur: true, jury: false, gestionnaire: true, comptable: false },
                { label: 'Gestion paiements', superAdmin: true, admin: true, superviseur: true, jury: false, gestionnaire: false, comptable: true },
                { label: 'Rapports financiers', superAdmin: true, admin: true, superviseur: true, jury: false, gestionnaire: false, comptable: true },
                { label: 'Paramètres système', superAdmin: true, admin: true, superviseur: false, jury: false, gestionnaire: false, comptable: false },
              ].map((perm, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{perm.label}</td>
                  <td className="px-4 py-3 text-center">
                    {perm.superAdmin ? <FaCheck className="text-green-600 mx-auto" /> : <FaTimes className="text-red-400 mx-auto" />}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {perm.admin ? <FaCheck className="text-green-600 mx-auto" /> : <FaTimes className="text-red-400 mx-auto" />}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {perm.superviseur ? <FaCheck className="text-green-600 mx-auto" /> : <FaTimes className="text-red-400 mx-auto" />}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {perm.jury ? <FaCheck className="text-green-600 mx-auto" /> : <FaTimes className="text-red-400 mx-auto" />}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {perm.gestionnaire ? <FaCheck className="text-green-600 mx-auto" /> : <FaTimes className="text-red-400 mx-auto" />}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {perm.comptable ? <FaCheck className="text-green-600 mx-auto" /> : <FaTimes className="text-red-400 mx-auto" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
