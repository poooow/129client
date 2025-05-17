export type DataRow = {
  receivedAt: Date;
  clientId: number;
  timeStamp?: string;
  data?: string[];
  info?: string;
  error?: string;
};
