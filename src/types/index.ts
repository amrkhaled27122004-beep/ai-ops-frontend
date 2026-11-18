export type ServerStatus = 'healthy' | 'warning' | 'critical' | 'offline';

export type AlertSeverity = 'critical' | 'high' | 'medium' | 'low';
export type AlertStatus = 'active' | 'acknowledged' | 'resolved';

export type IncidentScenario =
  | 'memory_leak'
  | 'cpu_spike'
  | 'disk_exhaustion'
  | 'latency_surge';

export interface Server {
  id: string;
  name: string;
  hostname: string;
  region: string;
  status: ServerStatus;
  riskScore: number;
  cpu: number;
  memory: number;
  disk: number;
  network: number;
  uptime: number;
  temperature: number;
  predictions: Prediction[];
  riskHistory: { timestamp: string; risk: number }[];
}

export interface Prediction {
  metric: string;
  currentValue: number;
  predictedValue: number;
  timeToThreshold: string;
  confidence: number;
  recommendation: string;
}

export interface Alert {
  id: string;
  serverId: string;
  serverName: string;
  severity: AlertSeverity;
  status: AlertStatus;
  title: string;
  description: string;
  metric: string;
  threshold: number;
  current: number;
  createdAt: string;
  prediction: string;
}

export interface ActivityEvent {
  id: string;
  type: 'alert' | 'recovery' | 'deployment' | 'scaling' | 'simulator';
  message: string;
  serverName: string;
  timestamp: string;
  severity: AlertSeverity | 'info';
}

export interface RiskTrendPoint {
  timestamp: string;
  fleetRisk: number;
  criticalCount: number;
  warningCount: number;
}

export interface ServiceHealth {
  name: string;
  status: ServerStatus;
  latency: number;
  errorRate: number;
  throughput: number;
  instances: number;
}
