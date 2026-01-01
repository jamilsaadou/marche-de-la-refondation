import { prisma } from './prisma';

export interface LogData {
  userId?: string;
  userEmail?: string;
  userName?: string;
  userRole?: string;
  action: string;
  entity?: string;
  entityId?: string;
  description: string;
  metadata?: any;
  ipAddress?: string;
  userAgent?: string;
  status?: 'SUCCESS' | 'ERROR' | 'WARNING';
  errorMessage?: string;
}

/**
 * Service de logging pour enregistrer toutes les actions dans le système
 */
export const logger = {
  /**
   * Enregistre une action dans les logs
   */
  async log(data: LogData) {
    try {
      await prisma.log.create({
        data: {
          userId: data.userId,
          userEmail: data.userEmail,
          userName: data.userName,
          userRole: data.userRole,
          action: data.action,
          entity: data.entity,
          entityId: data.entityId,
          description: data.description,
          metadata: data.metadata ? JSON.stringify(data.metadata) : null,
          ipAddress: data.ipAddress,
          userAgent: data.userAgent,
          status: data.status || 'SUCCESS',
          errorMessage: data.errorMessage,
        },
      });
    } catch (error) {
      // Ne pas faire échouer l'opération principale si le logging échoue
      console.error('Erreur lors de l\'enregistrement du log:', error);
    }
  },

  /**
   * Log une connexion
   */
  async logLogin(user: any, ipAddress?: string, userAgent?: string) {
    await this.log({
      userId: user.id,
      userEmail: user.email,
      userName: `${user.prenom} ${user.nom}`,
      userRole: user.role,
      action: 'LOGIN',
      entity: 'AUTH',
      description: `Connexion réussie de ${user.prenom} ${user.nom} (${user.role})`,
      ipAddress,
      userAgent,
      status: 'SUCCESS',
    });
  },

  /**
   * Log une déconnexion
   */
  async logLogout(user: any, ipAddress?: string, userAgent?: string) {
    await this.log({
      userId: user.id,
      userEmail: user.email,
      userName: `${user.prenom} ${user.nom}`,
      userRole: user.role,
      action: 'LOGOUT',
      entity: 'AUTH',
      description: `Déconnexion de ${user.prenom} ${user.nom}`,
      ipAddress,
      userAgent,
      status: 'SUCCESS',
    });
  },

  /**
   * Log une tentative de connexion échouée
   */
  async logFailedLogin(email: string, reason: string, ipAddress?: string, userAgent?: string) {
    await this.log({
      userEmail: email,
      action: 'LOGIN_FAILED',
      entity: 'AUTH',
      description: `Échec de connexion pour ${email}`,
      errorMessage: reason,
      ipAddress,
      userAgent,
      status: 'ERROR',
    });
  },

  /**
   * Log la création d'une demande
   */
  async logDemandeCreated(demande: any, ipAddress?: string, userAgent?: string) {
    await this.log({
      action: 'CREATE',
      entity: 'DEMANDE',
      entityId: demande.numeroReference,
      description: `Nouvelle demande créée: ${demande.prenom} ${demande.nom} - ${demande.secteurActivite}`,
      metadata: {
        numeroReference: demande.numeroReference,
        nom: `${demande.prenom} ${demande.nom}`,
        secteur: demande.secteurActivite,
        entreprise: demande.nomEntreprise,
      },
      ipAddress,
      userAgent,
      status: 'SUCCESS',
    });
  },

  /**
   * Log une évaluation
   */
  async logEvaluation(
    user: any,
    demande: any,
    evaluation: any,
    ipAddress?: string,
    userAgent?: string
  ) {
    await this.log({
      userId: user.id,
      userEmail: user.email,
      userName: `${user.prenom} ${user.nom}`,
      userRole: user.role,
      action: evaluation.decision === 'APPROUVE' ? 'APPROVE' : 'REJECT',
      entity: 'EVALUATION',
      entityId: demande.numeroReference,
      description: `${user.prenom} ${user.nom} a ${
        evaluation.decision === 'APPROUVE' ? 'approuvé' : 'rejeté'
      } la demande ${demande.numeroReference} - Score: ${evaluation.scoreTotal}/100`,
      metadata: {
        numeroReference: demande.numeroReference,
        candidat: `${demande.prenom} ${demande.nom}`,
        scoreTotal: evaluation.scoreTotal,
        decision: evaluation.decision,
        estValidationFinale: evaluation.estValidationFinale,
      },
      ipAddress,
      userAgent,
      status: 'SUCCESS',
    });
  },

  /**
   * Log la création d'un utilisateur
   */
  async logUserCreated(createdBy: any, newUser: any, ipAddress?: string, userAgent?: string) {
    await this.log({
      userId: createdBy.id,
      userEmail: createdBy.email,
      userName: `${createdBy.prenom} ${createdBy.nom}`,
      userRole: createdBy.role,
      action: 'CREATE',
      entity: 'USER',
      entityId: newUser.id,
      description: `Nouvel utilisateur créé: ${newUser.prenom} ${newUser.nom} (${newUser.role})`,
      metadata: {
        newUserEmail: newUser.email,
        newUserRole: newUser.role,
        newUserName: `${newUser.prenom} ${newUser.nom}`,
      },
      ipAddress,
      userAgent,
      status: 'SUCCESS',
    });
  },

  /**
   * Log la modification d'un utilisateur
   */
  async logUserUpdated(updatedBy: any, updatedUser: any, changes: any, ipAddress?: string, userAgent?: string) {
    await this.log({
      userId: updatedBy.id,
      userEmail: updatedBy.email,
      userName: `${updatedBy.prenom} ${updatedBy.nom}`,
      userRole: updatedBy.role,
      action: 'UPDATE',
      entity: 'USER',
      entityId: updatedUser.id,
      description: `Utilisateur modifié: ${updatedUser.prenom} ${updatedUser.nom}`,
      metadata: {
        updatedUserEmail: updatedUser.email,
        changes,
      },
      ipAddress,
      userAgent,
      status: 'SUCCESS',
    });
  },

  /**
   * Log la suppression d'un utilisateur
   */
  async logUserDeleted(deletedBy: any, deletedUser: any, ipAddress?: string, userAgent?: string) {
    await this.log({
      userId: deletedBy.id,
      userEmail: deletedBy.email,
      userName: `${deletedBy.prenom} ${deletedBy.nom}`,
      userRole: deletedBy.role,
      action: 'DELETE',
      entity: 'USER',
      entityId: deletedUser.id,
      description: `Utilisateur supprimé: ${deletedUser.prenom} ${deletedUser.nom} (${deletedUser.email})`,
      metadata: {
        deletedUserEmail: deletedUser.email,
        deletedUserRole: deletedUser.role,
      },
      ipAddress,
      userAgent,
      status: 'SUCCESS',
    });
  },

  /**
   * Log une action personnalisée
   */
  async logCustomAction(
    user: any | null,
    action: string,
    entity: string,
    description: string,
    metadata?: any,
    ipAddress?: string,
    userAgent?: string
  ) {
    await this.log({
      userId: user?.id,
      userEmail: user?.email,
      userName: user ? `${user.prenom} ${user.nom}` : undefined,
      userRole: user?.role,
      action,
      entity,
      description,
      metadata,
      ipAddress,
      userAgent,
      status: 'SUCCESS',
    });
  },

  /**
   * Log une erreur
   */
  async logError(
    user: any | null,
    action: string,
    entity: string,
    description: string,
    error: any,
    ipAddress?: string,
    userAgent?: string
  ) {
    await this.log({
      userId: user?.id,
      userEmail: user?.email,
      userName: user ? `${user.prenom} ${user.nom}` : undefined,
      userRole: user?.role,
      action,
      entity,
      description,
      errorMessage: error?.message || String(error),
      metadata: { error: error?.stack },
      ipAddress,
      userAgent,
      status: 'ERROR',
    });
  },
};

/**
 * Fonction utilitaire pour extraire l'IP et le User-Agent d'une requête Next.js
 */
export function getRequestInfo(request: Request) {
  const ipAddress = request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    'unknown';
  const userAgent = request.headers.get('user-agent') || 'unknown';
  
  return { ipAddress, userAgent };
}
