import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { verifyToken } from '@/app/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Non authentifié' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json(
        { success: false, message: 'Token invalide' },
        { status: 401 }
      );
    }

    // Seuls les SUPER_ADMIN peuvent accéder aux logs
    const user = await prisma.admin.findUnique({
      where: { id: decoded.id },
    });

    if (!user || user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { success: false, message: 'Accès non autorisé' },
        { status: 403 }
      );
    }

    // Récupérer les paramètres de la requête
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const action = searchParams.get('action');
    const entity = searchParams.get('entity');
    const status = searchParams.get('status');
    const userId = searchParams.get('userId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Construire les filtres
    const where: any = {};

    if (action) {
      where.action = action;
    }

    if (entity) {
      where.entity = entity;
    }

    if (status) {
      where.status = status;
    }

    if (userId) {
      where.userId = userId;
    }

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = new Date(startDate);
      }
      if (endDate) {
        where.createdAt.lte = new Date(endDate);
      }
    }

    // Compter le total
    const total = await prisma.log.count({ where });

    // Récupérer les logs avec pagination
    const logs = await prisma.log.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return NextResponse.json({
      success: true,
      data: logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Erreur lors de la récupération des logs:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur serveur', error: error.message },
      { status: 500 }
    );
  }
}

// Endpoint pour obtenir des statistiques sur les logs
export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Non authentifié' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json(
        { success: false, message: 'Token invalide' },
        { status: 401 }
      );
    }

    // Seuls les SUPER_ADMIN peuvent accéder aux logs
    const user = await prisma.admin.findUnique({
      where: { id: decoded.id },
    });

    if (!user || user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { success: false, message: 'Accès non autorisé' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { action: actionFilter } = body;

    // Statistiques générales
    const totalLogs = await prisma.log.count();
    const totalSuccess = await prisma.log.count({ where: { status: 'SUCCESS' } });
    const totalErrors = await prisma.log.count({ where: { status: 'ERROR' } });
    const totalWarnings = await prisma.log.count({ where: { status: 'WARNING' } });

    // Logs par action
    const logsByAction = await prisma.log.groupBy({
      by: ['action'],
      _count: { action: true },
      orderBy: { _count: { action: 'desc' } },
      take: 10,
    });

    // Logs par entité
    const logsByEntity = await prisma.log.groupBy({
      by: ['entity'],
      where: { entity: { not: null } },
      _count: { entity: true },
      orderBy: { _count: { entity: 'desc' } },
      take: 10,
    });

    // Logs par utilisateur
    const logsByUser = await prisma.log.groupBy({
      by: ['userId', 'userName', 'userRole'],
      where: { userId: { not: null } },
      _count: { userId: true },
      orderBy: { _count: { userId: 'desc' } },
      take: 10,
    });

    // Logs des dernières 24h
    const last24Hours = new Date();
    last24Hours.setHours(last24Hours.getHours() - 24);
    const logsLast24h = await prisma.log.count({
      where: { createdAt: { gte: last24Hours } },
    });

    // Logs de la dernière semaine
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    const logsLastWeek = await prisma.log.count({
      where: { createdAt: { gte: lastWeek } },
    });

    // Erreurs récentes
    const recentErrors = await prisma.log.findMany({
      where: { status: 'ERROR' },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          totalLogs,
          totalSuccess,
          totalErrors,
          totalWarnings,
          logsLast24h,
          logsLastWeek,
        },
        byAction: logsByAction.map(item => ({
          action: item.action,
          count: item._count.action,
        })),
        byEntity: logsByEntity.map(item => ({
          entity: item.entity,
          count: item._count.entity,
        })),
        byUser: logsByUser.map(item => ({
          userId: item.userId,
          userName: item.userName,
          userRole: item.userRole,
          count: item._count.userId,
        })),
        recentErrors,
      },
    });
  } catch (error: any) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur serveur', error: error.message },
      { status: 500 }
    );
  }
}
