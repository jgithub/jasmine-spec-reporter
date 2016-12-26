import { ExecutionDisplay } from "./execution-display";
import { ExecutionMetrics } from "./execution-metrics";

export class SpecReporter {
    private started: boolean = false;
    private finished: boolean = false;
    private display: ExecutionDisplay;
    private metrics: ExecutionMetrics;
    private options: any;

    constructor(options?: any) {
        this.options = options || {};
        this.display = new ExecutionDisplay(this.options);
        this.metrics = new ExecutionMetrics();
    }

    jasmineStarted(info: any): void {
        this.started = true;
        this.metrics.start(info);
        this.display.jasmineStarted(info);
    }

    jasmineDone(info: any): void {
        this.metrics.stop(info);
        this.display.summary(this.metrics);
        this.finished = true;
    }

    suiteStarted(suite: any): void {
        this.display.suiteStarted(suite);
    }

    suiteDone(): void {
        this.display.suiteDone();
    }

    specStarted(spec: any): void {
        this.metrics.startSpec();
        this.display.specStarted(spec);
    }

    specDone(spec: any): void {
        this.metrics.stopSpec(spec);
        if (spec.status === "pending") {
            this.metrics.pendingSpecs++;
            this.display.pending(spec);
        } else if (spec.status === "passed") {
            this.metrics.successfulSpecs++;
            this.display.successful(spec);
        } else if (spec.status === "failed") {
            this.metrics.failedSpecs++;
            this.display.failed(spec);
        }
    }
}
