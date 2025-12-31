import { Request, Response } from 'express';
import * as ShopsService from '../services/shops.service';

const stripShopPrivateFields = (shop: any) => {
  if (!shop) return shop;
  const { authUserId, requiresEmailFix, ...rest } = shop;
  return rest;
};

const sanitizeShopPayload = (payload: any) => {
  if (Array.isArray(payload)) return payload.map(stripShopPrivateFields);
  return stripShopPrivateFields(payload);
};

export const getShops = async (req: Request, res: Response) => {
  try {
    const data = await ShopsService.getShops();
    res.json(sanitizeShopPayload(data));
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener tiendas', error });
  }
};

export const getShopById = async (req: Request, res: Response) => {
  try {
    const data = await ShopsService.getShopById(req.params.id);
    if (!data) {
      return res.status(404).json({ message: 'Tienda no encontrada' });
    }
    res.json(sanitizeShopPayload(data));
  } catch (error) {
    res.status(500).json({ message: 'Error al buscar tienda', error });
  }
};

// --- NUEVA FUNCIÓN AGREGADA: El "Mozo" toma el pedido de crear tienda ---
export const createShop = async (req: Request, res: Response) => {
  try {
    // Le pasamos los datos que vienen del formulario (req.body) al Servicio
    const data = await ShopsService.createShop(req.body);
    // Respondemos con éxito (código 201 significa "Creado")
    res.status(201).json(sanitizeShopPayload(data));
  } catch (error) {
    console.error(error); // Para ver el error en la consola si falla
    res.status(500).json({ message: 'Error al crear la tienda', error });
  }
};
// -----------------------------------------------------------------------

export const updateShop = async (req: Request, res: Response) => {
  try {
    const data = await ShopsService.updateShop(req.params.id, req.body);
    res.json(sanitizeShopPayload(data));
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar tienda', error });
  }
};

export const buyStreamQuota = async (req: Request, res: Response) => {
  try {
    const data = await ShopsService.buyStreamQuota(req.params.id, req.body.amount);
    res.json(sanitizeShopPayload(data));
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Error al comprar cupo de stream', error });
  }
};

export const buyReelQuota = async (req: Request, res: Response) => {
  try {
    const data = await ShopsService.buyReelQuota(req.params.id, req.body.amount);
    res.json(sanitizeShopPayload(data));
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Error al comprar cupo de reel', error });
  }
};

export const togglePenalty = async (req: Request, res: Response) => {
  try {
    const data = await ShopsService.togglePenalty(req.params.id);
    res.json(sanitizeShopPayload(data));
  } catch (error) {
    res.status(500).json({ message: 'Error al cambiar penalización', error });
  }
};

export const activateShop = async (req: Request, res: Response) => {
  try {
    const data = await ShopsService.activateShop(req.params.id, req.body?.reason);
    res.json(sanitizeShopPayload(data));
  } catch (error) {
    res.status(500).json({ message: 'Error al activar tienda', error });
  }
};

export const rejectShop = async (req: Request, res: Response) => {
  try {
    const data = await ShopsService.rejectShop(req.params.id, req.body?.reason);
    res.json(sanitizeShopPayload(data));
  } catch (error) {
    res.status(500).json({ message: 'Error al rechazar tienda', error });
  }
};

export const suspendAgenda = async (req: Request, res: Response) => {
  try {
    const days = Number(req.body?.days || 7);
    const data = await ShopsService.suspendAgenda(req.params.id, req.body?.reason, days);
    res.json(sanitizeShopPayload(data));
  } catch (error) {
    res.status(500).json({ message: 'Error al suspender agenda', error });
  }
};

export const liftAgendaSuspension = async (req: Request, res: Response) => {
  try {
    const data = await ShopsService.liftAgendaSuspension(req.params.id);
    res.json(sanitizeShopPayload(data));
  } catch (error) {
    res.status(500).json({ message: 'Error al levantar sancion', error });
  }
};

export const resetShopPassword = async (req: Request, res: Response) => {
  try {
    const data = await ShopsService.resetShopPassword(req.params.id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error al resetear clave', error });
  }
};
