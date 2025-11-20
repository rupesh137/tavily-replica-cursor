"use client";

import { useEffect, useMemo, useState, useTransition } from "react";

type KeyType = "development" | "production";

type ApiKey = {
  id: string;
  label: string;
  prefix: string;
  createdAt: string;
  lastUsed?: string;
  revoked: boolean;
  keyType: KeyType;
  limitEnabled: boolean;
  monthlyLimit?: number | null;
};

export default function DashboardPage() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [formLabel, setFormLabel] = useState("");
  const [editingKey, setEditingKey] = useState<ApiKey | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [keyType, setKeyType] = useState<KeyType>("development");
  const [limitEnabled, setLimitEnabled] = useState(false);
  const [monthlyLimit, setMonthlyLimit] = useState("1000");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const totalActive = useMemo(
    () => keys.filter((key) => !key.revoked).length,
    [keys],
  );

  const fetchKeys = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/keys");
      const body = await response.json();
      if (!response.ok) {
        throw new Error(body.error || "Unable to fetch keys.");
      }
      setKeys(body.data ?? []);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unexpected error fetching keys.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchKeys();
  }, []);

  const handleSave = () => {
    if (!formLabel.trim()) return;

    startTransition(() => {
      (async () => {
        const payload = {
          label: formLabel.trim(),
          keyType,
          limitEnabled,
          monthlyLimit: limitEnabled ? Number(monthlyLimit) : null,
        };

        const response = await fetch(
          editingKey ? `/api/keys/${editingKey.id}` : "/api/keys",
          {
            method: editingKey ? "PATCH" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          },
        );
        const body = await response.json();
        if (!response.ok) throw new Error(body.error || "Save failed.");

        if (editingKey) {
          setKeys((prev) =>
            prev.map((key) => (key.id === body.data.id ? body.data : key)),
          );
        } else {
          setKeys((prev) => [body.data, ...prev]);
        }

        setActionMessage(
          editingKey ? "Key updated successfully." : "Key created successfully.",
        );
        resetModalState();
      })().catch((err) => {
        setActionMessage(
          err instanceof Error ? err.message : "Unable to save key.",
        );
      });
    });
  };

  const handleRevoke = (id: string, nextState: boolean) => {
    startTransition(() => {
      (async () => {
        const response = await fetch(`/api/keys/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ revoked: nextState }),
        });
        const body = await response.json();
        if (!response.ok) throw new Error(body.error || "Revoke failed.");
        setKeys((prev) => prev.map((key) => (key.id === id ? body.data : key)));
      })().catch((err) => {
        setActionMessage(
          err instanceof Error ? err.message : "Unable to update key status.",
        );
      });
    });
  };

  const handleDelete = (id: string) => {
    startTransition(() => {
      (async () => {
        const response = await fetch(`/api/keys/${id}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          const body = await response.json();
          throw new Error(body.error || "Delete failed.");
        }
        setKeys((prev) => prev.filter((key) => key.id !== id));
        if (editingKey?.id === id) {
          resetModalState();
        }
      })().catch((err) => {
        setActionMessage(
          err instanceof Error ? err.message : "Unable to delete key.",
        );
      });
    });
  };

  const formatDate = (iso?: string) =>
    iso ? new Date(iso).toLocaleString() : "—";

  const handleEdit = (key: ApiKey) => {
    setEditingKey(key);
    setFormLabel(key.label);
    setKeyType(key.keyType);
    setLimitEnabled(key.limitEnabled);
    setMonthlyLimit(key.monthlyLimit?.toString() ?? "1000");
    setIsModalOpen(true);
  };

  const resetModalState = () => {
    setEditingKey(null);
    setFormLabel("");
    setKeyType("development");
    setLimitEnabled(false);
    setMonthlyLimit("1000");
    setIsModalOpen(false);
  };

  const openCreateModal = () => {
    setEditingKey(null);
    setFormLabel("");
    setKeyType("development");
    setLimitEnabled(false);
    setMonthlyLimit("1000");
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-5xl space-y-12">
        <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-emerald-300/70">
              Dashboard
            </p>
            <h1 className="text-4xl font-semibold">API Key Management</h1>
            <p className="mt-2 text-slate-300">
              Create, edit, revoke, and delete keys backed by Supabase. Update
              rows safely without leaving this surface.
            </p>
          </div>
          <div className="rounded-2xl border border-emerald-400/40 bg-emerald-500/10 px-6 py-4 text-right">
            <p className="text-sm text-slate-300">Active keys</p>
            <p className="text-3xl font-semibold text-emerald-300">
              {totalActive}
            </p>
          </div>
        </header>

        <section className="grid gap-8 lg:grid-cols-[2fr,3fr]">
          <div className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-emerald-900/30">
            <h2 className="text-xl font-semibold">Key creation</h2>
            <p className="text-sm text-slate-300">
              Spin up scoped credentials for each environment. Configure usage
              limits to match your billing plan.
            </p>
            <div className="rounded-3xl border border-white/10 bg-black/30 p-6">
              <p className="text-sm font-semibold text-slate-200">
                Create new API key
              </p>
              <p className="text-sm text-slate-400">
                Works for both development and production workloads.
              </p>
              <button
                onClick={openCreateModal}
                className="mt-5 w-full rounded-2xl bg-emerald-400 px-4 py-3 text-base font-semibold text-emerald-950 transition hover:bg-emerald-300"
              >
                Generate key
              </button>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5">
            <div className="border-b border-white/10 px-6 py-4">
              <h2 className="text-xl font-semibold">Keys</h2>
            </div>
            <div className="divide-y divide-white/5">
              {(isLoading || isPending) && (
                <p className="px-6 py-6 text-sm text-slate-400">
                  {isLoading ? "Loading keys…" : "Applying changes…"}
                </p>
              )}
              {error && !isLoading && (
                <p className="px-6 py-6 text-sm text-rose-200">{error}</p>
              )}
              {!isLoading && keys.length === 0 && (
                <p className="px-6 py-12 text-center text-slate-300">
                  No keys yet. Create one to get started.
                </p>
              )}
              {keys.map((key) => (
                <div
                  key={key.id}
                  className="flex flex-col gap-4 px-6 py-5 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <p className="text-base font-semibold">
                      {key.label}{" "}
                      <span className="text-sm text-slate-400">
                        ({key.prefix}••••••)
                      </span>
                    </p>
                    <div className="flex flex-wrap gap-2 py-1 text-xs text-slate-400">
                      <span className="rounded-full border border-white/10 px-3 py-0.5 text-white">
                        {key.keyType === "development"
                          ? "Development"
                          : "Production"}
                      </span>
                      {key.limitEnabled && key.monthlyLimit && (
                        <span className="rounded-full border border-white/10 px-3 py-0.5">
                          Limit {key.monthlyLimit.toLocaleString()}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-400">
                      Created {formatDate(key.createdAt)} · Last used{" "}
                      {formatDate(key.lastUsed)}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        key.revoked
                          ? "bg-rose-500/10 text-rose-200"
                          : "bg-emerald-500/10 text-emerald-200"
                      }`}
                    >
                      {key.revoked ? "Revoked" : "Active"}
                    </span>
                    <button
                      onClick={() => handleEdit(key)}
                      className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold text-white transition hover:border-white hover:bg-white/5"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleRevoke(key.id, !key.revoked)}
                      className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold text-white transition hover:border-white hover:bg-white/5"
                    >
                      {key.revoked ? "Restore" : "Revoke"}
                    </button>
                    <button
                      onClick={() => handleDelete(key.id)}
                      className="rounded-full border border-rose-500/40 px-3 py-1 text-xs font-semibold text-rose-200 transition hover:border-rose-400 hover:bg-rose-500/10"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {actionMessage && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full border border-white/10 bg-black/80 px-6 py-3 text-sm text-white shadow-lg">
          {actionMessage}
          <button
            className="ml-3 text-emerald-300"
            onClick={() => setActionMessage(null)}
          >
            Close
          </button>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-10">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/95 p-8 text-slate-900 shadow-2xl">
            <h3 className="text-sm font-semibold text-slate-500">
              Enter a name and limit for the new API key.
            </h3>

            <div className="mt-6 space-y-6 text-sm">
              <div>
                <p className="font-semibold text-slate-600">
                  Key Name —{" "}
                  <span className="font-normal text-slate-500">
                    A unique name to identify this key
                  </span>
                </p>
                <input
                  value={formLabel}
                  onChange={(event) => setFormLabel(event.target.value)}
                  placeholder="Key Name"
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 outline-none focus:border-indigo-400"
                />
              </div>

              <div className="space-y-3">
                <p className="font-semibold text-slate-600">
                  Key Type —{" "}
                  <span className="font-normal text-slate-500">
                    Choose the environment for this key
                  </span>
                </p>
                <div className="space-y-3">
                  <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4 transition hover:border-indigo-300">
                    <input
                      type="radio"
                      checked={keyType === "development"}
                      onChange={() => setKeyType("development")}
                      className="h-4 w-4 accent-indigo-500"
                    />
                    <div>
                      <p className="font-semibold text-slate-900">
                        Development
                      </p>
                      <p className="text-xs text-slate-500">
                        Rate limited to 100 requests/minute
                      </p>
                    </div>
                  </label>

                  <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4 opacity-70 transition hover:border-indigo-300">
                    <input
                      type="radio"
                      checked={keyType === "production"}
                      onChange={() => setKeyType("production")}
                      className="h-4 w-4 accent-indigo-500"
                    />
                    <div>
                      <p className="font-semibold text-slate-900">
                        Production
                      </p>
                      <p className="text-xs text-slate-500">
                        Rate limited to 1,000 requests/minute
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex cursor-pointer items-center gap-2 text-slate-600">
                  <input
                    type="checkbox"
                    checked={limitEnabled}
                    onChange={() => setLimitEnabled((prev) => !prev)}
                    className="h-4 w-4 accent-indigo-500"
                  />
                  Limit monthly usage*
                </label>
                <input
                  type="number"
                  min={1}
                  value={monthlyLimit}
                  disabled={!limitEnabled}
                  onChange={(event) => setMonthlyLimit(event.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 outline-none disabled:bg-slate-100 focus:border-indigo-400"
                />
                <p className="text-xs text-slate-500">
                  *If the combined usage of all your keys exceeds your account
                  limit, requests will be rejected.
                </p>
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <button
                onClick={handleSave}
                className="flex-1 rounded-full bg-indigo-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400 disabled:bg-slate-300"
                disabled={!formLabel.trim()}
              >
                {editingKey ? "Save" : "Create"}
              </button>
              <button
                onClick={resetModalState}
                className="flex-1 rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

