export interface AssumeStagePort {
    shop(): AssumeRunningPort;
    erp(): AssumeRunningPort;
    tax(): AssumeRunningPort;
    clock(): AssumeRunningPort;
}

export interface AssumeRunningPort {
    shouldBeRunning(): Promise<AssumeStagePort>;
}
