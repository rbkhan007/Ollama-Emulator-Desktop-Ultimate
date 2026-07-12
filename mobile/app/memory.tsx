import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TextInput,
  Alert,
  StyleSheet,
  Pressable,
} from "react-native";
import { useApp } from "../lib/AppContext";
import * as api from "../lib/api";
import { COLORS, FONT_SIZE } from "../theme";
import { Card, SectionTitle, PrimaryButton } from "../components/ui";
import { BottomNav } from "../components/BottomNav";
import { useResponsive } from "../lib/layout";

export default function Memory() {
  const { connected } = useApp();
  const responsive = useResponsive();
  const [stats, setStats] = useState<any>(null);
  const [facts, setFacts] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedMsg, setExpandedMsg] = useState<string | null>(null);
  const [msgDetail, setMsgDetail] = useState<any | null>(null);

  const load = useCallback(async () => {
    try {
      const [s, f, se, m] = await Promise.all([
        api.getMemoryStats(),
        api.getMemoryFacts(),
        api.getMemorySessions(),
        api.getMemoryMessages(),
      ]);
      setStats(s || {});
      setFacts(Array.isArray(f) ? f : f?.facts || []);
      setSessions(Array.isArray(se) ? se : se?.sessions || []);
      setMessages(Array.isArray(m) ? m : m?.messages || []);
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

  const doSearch = async () => {
    const q = query.trim();
    if (!q) {
      setResults(null);
      return;
    }
    setBusy(true);
    try {
      const r: any = await api.memorySearch(q);
      const list = Array.isArray(r) ? r : r?.results || [];
      setResults(list);
    } catch {
      setResults([]);
    } finally {
      setBusy(false);
    }
  };

  const delFact = (id: string) =>
    Alert.alert("Delete fact?", "This cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await api.memoryDeleteFact(id);
            setFacts((f) => f.filter((x) => x.id !== id));
          } catch {
            /* ignore */
          }
        },
      },
    ]);

  const clearAll = () =>
    Alert.alert("Clear all memory?", "This deletes every stored fact and message.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Clear",
        style: "destructive",
        onPress: async () => {
          try {
            await api.memoryClear();
            setFacts([]);
            setMessages([]);
            setSessions([]);
            setResults(null);
          } catch {
            /* ignore */
          }
        },
      },
    ]);

  const viewMessageDetail = async (msgId: string) => {
    try {
      setBusy(true);
      const detail = await api.getMemoryMessage(msgId);
      setMsgDetail(detail);
      setExpandedMsg(msgId);
    } catch {
      Alert.alert("Error", "Could not load message detail.");
    } finally {
      setBusy(false);
    }
  };

  const deleteMsg = (msgId: string) =>
    Alert.alert("Delete message?", "This cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await api.deleteMemoryMessage(msgId);
            setMessages((m) => m.filter((x) => x.id !== msgId));
            setExpandedMsg(null);
            setMsgDetail(null);
          } catch {
            /* ignore */
          }
        },
      },
    ]);

  const list = results ?? facts;

  return (
    <View style={styles.container}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        removeClippedSubviews
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.accent} />
        }
      >
        <View style={responsive.inner}>
          <SectionTitle>Overview</SectionTitle>
          <View style={styles.grid}>
            <Stat label="Facts" value={stats?.total_facts ?? stats?.facts ?? 0} />
            <Stat label="Messages" value={stats?.total_messages ?? stats?.messages ?? 0} />
            <Stat label="Sessions" value={sessions.length} />
          </View>

          <SectionTitle>Search memory</SectionTitle>
          <Card>
            <TextInput
              style={styles.input}
              value={query}
              onChangeText={setQuery}
              placeholder="Find a stored fact or message…"
              placeholderTextColor={COLORS.muted}
              returnKeyType="search"
              onSubmitEditing={doSearch}
            />
            <PrimaryButton title={busy ? "Searching…" : "Search"} onPress={doSearch} loading={busy} />
          </Card>

          <View style={styles.rowBetween}>
            <SectionTitle>{results ? "Results" : "Facts"}</SectionTitle>
            {facts.length > 0 && !results && (
              <Pressable onPress={clearAll}>
                <Text style={styles.clear}>Clear all</Text>
              </Pressable>
            )}
          </View>
          {list.length === 0 && (
            <Text style={styles.muted}>
              {results ? "No matches." : "No memories stored yet. Chat with the assistant to build memory."}
            </Text>
          )}
          {list.map((f: any) => (
            <Card key={f.id ?? f.text} style={styles.fact}>
              <Text style={styles.factText}>{f.text || f.content || JSON.stringify(f)}</Text>
              <View style={styles.rowBetween}>
                <Text style={styles.tiny}>{f.created_at || f.updated_at || ""}</Text>
                {f.id && (
                  <Pressable onPress={() => delFact(f.id)}>
                    <Text style={styles.del}>Delete</Text>
                  </Pressable>
                )}
              </View>
            </Card>
          ))}

          {!results && sessions.length > 0 && (
            <>
              <SectionTitle>Sessions</SectionTitle>
              {sessions.slice(0, 10).map((s: any, i: number) => (
                <Card key={s.id ?? i} style={styles.mini}>
                  <Text style={styles.name}>{s.title || s.id || `Session ${i + 1}`}</Text>
                  <Text style={styles.tiny}>{s.updated_at || ""}</Text>
                </Card>
              ))}
            </>
          )}

          {!results && messages.length > 0 && (
            <>
              <SectionTitle>Recent messages</SectionTitle>
              {messages.slice(0, 12).map((m: any, i: number) => (
                <Card key={m.id ?? i} style={styles.mini}>
                  <Pressable onPress={() => viewMessageDetail(m.id)}>
                    <View style={styles.rowBetween}>
                      <Text style={[styles.tiny, { textTransform: "capitalize", flex: 1 }]}>{m.role}</Text>
                      <Pressable onPress={() => deleteMsg(m.id)}>
                        <Text style={styles.del}>Delete</Text>
                      </Pressable>
                    </View>
                    <Text style={styles.muted} numberOfLines={expandedMsg === m.id ? undefined : 2}>
                      {m.content}
                    </Text>
                    {expandedMsg === m.id && msgDetail && (
                      <View style={{ marginTop: 8, backgroundColor: COLORS.surface2, padding: 10, borderRadius: 8 }}>
                        <KV k="ID" v={msgDetail.id || m.id} />
                        <KV k="Role" v={msgDetail.role || m.role} />
                        <KV k="Model" v={msgDetail.model || "-"} />
                        <KV k="Tokens" v={String(msgDetail.token_count ?? "-")} />
                        <KV k="Created" v={msgDetail.created_at || m.created_at || ""} />
                      </View>
                    )}
                  </Pressable>
                </Card>
              ))}
            </>
          )}
        </View>
      </ScrollView>
      <BottomNav />
    </View>
  );
}

function KV({ k, v }: { k: string; v: string }) {
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 2 }}>
      <Text style={{ color: COLORS.muted, fontSize: FONT_SIZE.xs }}>{k}</Text>
      <Text style={{ color: COLORS.text, fontSize: FONT_SIZE.xs, flexShrink: 1, marginLeft: 8, textAlign: "right" }}>{v}</Text>
    </View>
  );
}

function Stat({ label, value }: { label: string; value: any }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: 8 },
  stat: {
    flex: 1,
    minWidth: "28%",
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statValue: { color: COLORS.text, fontSize: 22, fontWeight: "800" },
  statLabel: {
    color: COLORS.muted,
    fontSize: FONT_SIZE.xs,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginTop: 4,
  },
  input: {
    backgroundColor: COLORS.surface2,
    color: COLORS.text,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 10,
  },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  clear: { color: COLORS.red, fontSize: FONT_SIZE.xs, fontWeight: "700" },
  del: { color: COLORS.red, fontSize: FONT_SIZE.xs, fontWeight: "700" },
  muted: { color: COLORS.muted, fontSize: FONT_SIZE.sm, marginTop: 2 },
  tiny: { color: COLORS.muted, fontSize: 11, marginTop: 6 },
  name: { color: COLORS.text, fontSize: FONT_SIZE.md, fontWeight: "700" },
  fact: { paddingVertical: 14, paddingHorizontal: 14 },
  factText: { color: COLORS.text, fontSize: FONT_SIZE.sm, lineHeight: 19 },
  mini: { paddingVertical: 12, paddingHorizontal: 14 },
});
