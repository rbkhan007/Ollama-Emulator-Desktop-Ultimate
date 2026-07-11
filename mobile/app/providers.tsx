import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  StyleSheet,
  TextInput,
  Pressable,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useApp } from "../lib/AppContext";
import * as api from "../lib/api";
import { COLORS, FONT_SIZE } from "../theme";
import { Card, SectionTitle, Chip } from "../components/ui";
import { BottomNav } from "../components/BottomNav";
import { useResponsive } from "../lib/layout";

export default function Providers() {
  const { connected } = useApp();
  const responsive = useResponsive();
  const [providers, setProviders] = useState<any[]>([]);
  const [models, setModels] = useState<string[]>([]);
  const [active, setActive] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [busy, setBusy] = useState("");
  const [keys, setKeys] = useState<Record<string, string>>({});
  const [showAdd, setShowAdd] = useState(false);
  const [editProvider, setEditProvider] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>(null);
  const [add, setAdd] = useState({
    name: "",
    url: "",
    type: "openai",
    models_url: "",
    default_model: "",
    api_key: "",
    free_heuristic: false,
  });

  const load = useCallback(async () => {
    try {
      const [p, m, s] = await Promise.all([
        api.getProviders(),
        api.getModels(),
        api.getStatus(),
      ]);
      setProviders(p || []);
      setModels((m.models || []).map((x: any) => x.name));
      setActive(s.active_provider || "");
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (connected) load();
  }, [connected, load]);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const activate = async (name: string) => {
    if (name === active) return;
    setBusy(name + ":activate");
    try {
      await api.setActiveProvider(name);
      await load();
    } catch (e: any) {
      Alert.alert("Error", e.message || "Failed to activate provider");
    } finally {
      setBusy("");
    }
  };

  const saveKey = async (name: string) => {
    const k = (keys[name] || "").trim();
    if (!k) {
      Alert.alert("Enter a key", "Type an API key first, then save.");
      return;
    }
    setBusy(name + ":key");
    try {
      await api.saveProviderKey(name, k);
      setKeys((prev) => ({ ...prev, [name]: "" }));
      await load();
      Alert.alert("Saved", `${name} key saved and set active.`);
    } catch (e: any) {
      Alert.alert("Error", e.message || "Failed to save key");
    } finally {
      setBusy("");
    }
  };

  const remove = (name: string) => {
    Alert.alert("Delete provider", `Remove "${name}" from this server?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          setBusy(name + ":del");
          try {
            await api.deleteProvider(name);
            await load();
          } catch (e: any) {
            Alert.alert("Error", e.message || "Failed to delete");
          } finally {
            setBusy("");
          }
        },
      },
    ]);
  };

  const submitAdd = async () => {
    if (!add.name || !add.url || !add.type) {
      Alert.alert("Missing fields", "Name, URL and type are required.");
      return;
    }
    setBusy("add");
    try {
      await api.addProvider({
        name: add.name.trim(),
        url: add.url.trim(),
        type: add.type.trim(),
        models_url: add.models_url.trim() || undefined,
        default_model: add.default_model.trim(),
        api_key: add.api_key.trim(),
        free_heuristic: add.free_heuristic,
      });
      setAdd({
        name: "",
        url: "",
        type: "openai",
        models_url: "",
        default_model: "",
        api_key: "",
        free_heuristic: false,
      });
      setShowAdd(false);
      await load();
    } catch (e: any) {
      Alert.alert("Error", e.message || "Failed to add provider");
    } finally {
      setBusy("");
    }
  };

  const toggleFree = () =>
    setAdd((p) => ({ ...p, free_heuristic: !p.free_heuristic }));

  return (
    <View style={styles.container}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        removeClippedSubviews
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.accent}
          />
        }
      >
        <View style={responsive.inner}>
          <SectionTitle>Active provider</SectionTitle>
          <Card>
            <Text style={styles.active}>{active || "none"}</Text>
            <Text style={styles.muted}>
              {models.length} model{models.length === 1 ? "" : "s"} available
            </Text>
          </Card>

          <SectionTitle>Models</SectionTitle>
          <View style={styles.chipWrap}>
            {models.map((m) => (
              <Chip key={m} label={m} />
            ))}
            {models.length === 0 && (
              <Text style={styles.muted}>No models loaded yet.</Text>
            )}
          </View>

          <SectionTitle>Configured providers</SectionTitle>
          {providers.map((p) => {
            const isActive = p.name === active;
            const b = busy === p.name + ":activate" || busy === p.name + ":del";
            return (
              <Card
                key={p.name}
                style={isActive && styles.activeCard}
              >
                <View style={styles.rowBetween}>
                  <Text style={styles.name}>{p.name}</Text>
                  {isActive && <Text style={styles.badge}>ACTIVE</Text>}
                </View>
                <Text style={styles.muted}>{p.type}</Text>
                <Text style={styles.muted} numberOfLines={1}>
                  {p.url}
                </Text>
                <Text style={[styles.muted, { marginTop: 6 }]}>
                  {p.api_key_set ? "API key set" : "No API key"}
                </Text>

                <View style={styles.keyRow}>
                  <TextInput
                    style={styles.input}
                    placeholder="Paste API key…"
                    placeholderTextColor={COLORS.muted}
                    secureTextEntry
                    autoCapitalize="none"
                    value={keys[p.name] || ""}
                    onChangeText={(t) =>
                      setKeys((prev) => ({ ...prev, [p.name]: t }))
                    }
                  />
                  <Pressable
                    style={[styles.btn, styles.btnGhost]}
                    onPress={() => saveKey(p.name)}
                    disabled={busy === p.name + ":key"}
                  >
                    <Text style={styles.btnText}>Save key</Text>
                  </Pressable>
                </View>

                <View style={styles.actionRow}>
                  <Pressable
                    style={[
                      styles.btn,
                      isActive ? styles.btnDisabled : styles.btnAccent,
                    ]}
                    onPress={() => activate(p.name)}
                    disabled={isActive || b}
                  >
                    <Text style={styles.btnText}>
                      {isActive ? "Active" : "Set active"}
                    </Text>
                  </Pressable>
                  <Pressable
                    style={[styles.btn, styles.btnDanger]}
                    onPress={() => remove(p.name)}
                    disabled={b}
                  >
                    <Text style={styles.btnText}>Delete</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.btn, styles.btnGhost]}
                    onPress={async () => {
                      try {
                        const data = await api.getProvider(p.name);
                        setEditProvider(p.name);
                        setEditData({
                          url: data.url || p.url,
                          models_url: data.models_url || "",
                          default_model: data.default_model || "",
                          free_heuristic: data.free_heuristic ?? false,
                        });
                      } catch {
                        Alert.alert("Error", "Could not load provider details.");
                      }
                    }}
                  >
                    <Text style={[styles.btnText, { color: COLORS.text }]}>Edit</Text>
                  </Pressable>
                </View>
                {editProvider === p.name && editData && (
                  <View style={{ marginTop: 10, borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: 10 }}>
                    <Field label="URL" value={editData.url} onChange={(t) => setEditData((d: any) => ({ ...d, url: t }))} placeholder="https://api.openai.com/v1" />
                    <Field label="Models URL" value={editData.models_url} onChange={(t) => setEditData((d: any) => ({ ...d, models_url: t }))} placeholder="https://api.openai.com/v1/models" />
                    <Field label="Default model" value={editData.default_model} onChange={(t) => setEditData((d: any) => ({ ...d, default_model: t }))} placeholder="gpt-4o-mini" />
                    <Pressable style={styles.checkRow} onPress={() => setEditData((d: any) => ({ ...d, free_heuristic: !d.free_heuristic }))}>
                      <View style={[styles.checkbox, editData.free_heuristic && styles.checkboxOn]} />
                      <Text style={styles.muted}>Free heuristic</Text>
                    </Pressable>
                    <View style={styles.actionRow}>
                      <Pressable style={[styles.btn, styles.btnAccent]} onPress={async () => {
                        setBusy(p.name + ":edit");
                        try {
                          await api.updateProvider(p.name, editData);
                          setEditProvider(null);
                          setEditData(null);
                          await load();
                        } catch (e: any) {
                          Alert.alert("Error", e.message || "Failed to update");
                        } finally {
                          setBusy("");
                        }
                      }}>
                        <Text style={styles.btnText}>Save</Text>
                      </Pressable>
                      <Pressable style={[styles.btn, styles.btnGhost]} onPress={() => { setEditProvider(null); setEditData(null); }}>
                        <Text style={[styles.btnText, { color: COLORS.text }]}>Cancel</Text>
                      </Pressable>
                    </View>
                  </View>
                )}
              </Card>
            );
          })}

          <Pressable
            style={[styles.btn, styles.btnAccent, { marginTop: 8 }]}
            onPress={() => setShowAdd((v) => !v)}
          >
            <Text style={styles.btnText}>
              {showAdd ? "Cancel" : "+ Add provider"}
            </Text>
          </Pressable>

          {showAdd && (
            <Card style={{ marginTop: 10 }}>
              <Field
                label="Name"
                value={add.name}
                onChange={(t) => setAdd((p) => ({ ...p, name: t }))}
                placeholder="my-provider"
              />
              <Field
                label="Base URL"
                value={add.url}
                onChange={(t) => setAdd((p) => ({ ...p, url: t }))}
                placeholder="https://api.openai.com/v1"
              />
              <Field
                label="Type"
                value={add.type}
                onChange={(t) => setAdd((p) => ({ ...p, type: t }))}
                placeholder="openai | ollama | anthropic"
              />
              <Field
                label="Models URL (optional)"
                value={add.models_url}
                onChange={(t) => setAdd((p) => ({ ...p, models_url: t }))}
                placeholder="https://api.openai.com/v1/models"
              />
              <Field
                label="Default model"
                value={add.default_model}
                onChange={(t) =>
                  setAdd((p) => ({ ...p, default_model: t }))
                }
                placeholder="gpt-4o-mini"
              />
              <Field
                label="API key (optional)"
                value={add.api_key}
                onChange={(t) => setAdd((p) => ({ ...p, api_key: t }))}
                placeholder="sk-…"
                secure
              />
              <Pressable style={styles.checkRow} onPress={toggleFree}>
                <View
                  style={[
                    styles.checkbox,
                    add.free_heuristic && styles.checkboxOn,
                  ]}
                />
                <Text style={styles.muted}>
                  Mark as free-tier (free heuristic)
                </Text>
              </Pressable>
              <Pressable
                style={[styles.btn, styles.btnAccent, { marginTop: 8 }]}
                onPress={submitAdd}
                disabled={busy === "add"}
              >
                {busy === "add" ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.btnText}>Add provider</Text>
                )}
              </Pressable>
            </Card>
          )}
        </View>
      </ScrollView>
      <BottomNav />
    </View>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  secure,
}: {
  label: string;
  value: string;
  onChange: (t: string) => void;
  placeholder?: string;
  secure?: boolean;
}) {
  return (
    <View style={{ marginBottom: 10 }}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={COLORS.muted}
        autoCapitalize="none"
        secureTextEntry={secure}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  active: { color: COLORS.text, fontSize: FONT_SIZE.lg, fontWeight: "700" },
  name: { color: COLORS.text, fontSize: FONT_SIZE.md, fontWeight: "700" },
  muted: { color: COLORS.muted, fontSize: FONT_SIZE.sm, marginTop: 2 },
  badge: {
    color: "#fff",
    backgroundColor: COLORS.accent,
    fontSize: FONT_SIZE.xs,
    fontWeight: "700",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  activeCard: { borderColor: COLORS.accent },
  chipWrap: { flexDirection: "row", flexWrap: "wrap" },
  keyRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    gap: 8,
  },
  actionRow: {
    flexDirection: "row",
    marginTop: 10,
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.surface,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: FONT_SIZE.sm,
  },
  fieldLabel: {
    color: COLORS.muted,
    fontSize: FONT_SIZE.xs,
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  btn: {
    backgroundColor: COLORS.accent,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 40,
  },
  btnAccent: { backgroundColor: COLORS.accent },
  btnGhost: { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border },
  btnDanger: { backgroundColor: "#c0392b" },
  btnDisabled: { backgroundColor: COLORS.border },
  btnText: { color: "#fff", fontWeight: "700", fontSize: FONT_SIZE.sm },
  checkRow: { flexDirection: "row", alignItems: "center", marginTop: 6, gap: 10 },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  checkboxOn: { backgroundColor: COLORS.accent, borderColor: COLORS.accent },
});
