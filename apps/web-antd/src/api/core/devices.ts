import type { Device } from '#/api/types';

import { requestClient } from '#/api/requestGo';

/**
 * 获取所有设备
 */
export async function getAllDeviceApi() {
  return requestClient.get<Device[]>('/shadow/all');
}
