export interface Device {
  id: string;
  modelName: string;
  points?: any;
  online: boolean;
  ttl: string;
  disconnectTimes: number;
  updatedAt: string;
}
