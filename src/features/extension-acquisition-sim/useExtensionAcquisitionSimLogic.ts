import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  forceErrorOnJob,
  loadAcquisitionJob,
  pauseJob,
  resumeJob,
  retryFailedItem,
  startJob,
  tickJob,
} from "./extensionAcquisitionSim.api";
import {
  getSimStepDelayMs,
  isJobTerminal,
} from "./extensionAcquisitionSim.helpers";
import type { AcquisitionJob } from "@/mocks/demoStore.types";
import { isDemoStoreFailure } from "@/mocks/demoStore.errors";

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

export function useExtensionAcquisitionSimLogic() {
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get("job");

  const [job, setJob] = useState<AcquisitionJob | null>(null);
  const [loading, setLoading] = useState(Boolean(jobId));
  const [error, setError] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState(false);

  const tickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const jobRef = useRef<AcquisitionJob | null>(null);

  jobRef.current = job;

  const clearTickTimer = useCallback(() => {
    if (tickTimerRef.current) {
      clearTimeout(tickTimerRef.current);
      tickTimerRef.current = null;
    }
  }, []);

  const loadJob = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const loaded = await loadAcquisitionJob(id);
      setJob(loaded);
    } catch (err) {
      setJob(null);
      setError(
        getErrorMessage(
          err,
          isDemoStoreFailure(err)
            ? "Could not load acquisition job."
            : "Could not load acquisition job.",
        ),
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    clearTickTimer();
    if (!jobId) {
      setJob(null);
      setLoading(false);
      setError(null);
      return;
    }
    void loadJob(jobId);
    return clearTickTimer;
  }, [jobId, loadJob, clearTickTimer]);

  const scheduleTick = useCallback(() => {
    clearTickTimer();
    tickTimerRef.current = setTimeout(() => {
      void (async () => {
        const current = jobRef.current;
        if (!current || current.status !== "running") return;

        setIsBusy(true);
        try {
          const next = await tickJob(current.id);
          setJob(next);
          if (next.status === "running" && !isJobTerminal(next.status)) {
            scheduleTick();
          }
        } catch (err) {
          setError(getErrorMessage(err, "Simulation tick failed."));
        } finally {
          setIsBusy(false);
        }
      })();
    }, getSimStepDelayMs());
  }, [clearTickTimer]);

  useEffect(() => {
    if (job?.status === "running") {
      scheduleTick();
    } else {
      clearTickTimer();
    }
    return clearTickTimer;
  }, [job?.status, job?.id, scheduleTick, clearTickTimer]);

  const runMutation = useCallback(
    async (action: () => Promise<AcquisitionJob>) => {
      setIsBusy(true);
      setError(null);
      try {
        const next = await action();
        setJob(next);
        return next;
      } catch (err) {
        setError(getErrorMessage(err, "Action failed."));
        throw err;
      } finally {
        setIsBusy(false);
      }
    },
    [],
  );

  const handleStart = useCallback(async () => {
    if (!jobId) return;
    await runMutation(() => startJob(jobId));
  }, [jobId, runMutation]);

  const handlePause = useCallback(async () => {
    if (!jobId) return;
    clearTickTimer();
    await runMutation(() => pauseJob(jobId));
  }, [jobId, runMutation, clearTickTimer]);

  const handleResume = useCallback(async () => {
    if (!jobId) return;
    await runMutation(() => resumeJob(jobId));
  }, [jobId, runMutation]);

  const handleForceError = useCallback(async () => {
    if (!jobId) return;
    await runMutation(() => forceErrorOnJob(jobId));
  }, [jobId, runMutation]);

  const handleRetryFailed = useCallback(async () => {
    if (!jobId) return;
    await runMutation(() => retryFailedItem(jobId));
  }, [jobId, runMutation]);

  const handleRetryLoad = useCallback(() => {
    if (jobId) void loadJob(jobId);
  }, [jobId, loadJob]);

  return {
    jobId,
    job,
    loading,
    error,
    isBusy,
    handleStart,
    handlePause,
    handleResume,
    handleForceError,
    handleRetryFailed,
    handleRetryLoad,
  };
}
