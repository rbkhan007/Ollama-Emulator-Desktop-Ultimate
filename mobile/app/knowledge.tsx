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
import * as DocumentPicker from "expo-document-picker";
import { useApp } from "../lib/AppContext";
import * as api from "../lib/api";
import { COLORS, FONT_SIZE } from "../theme";
import { Card, SectionTitle, Input, PrimaryButton, Chip } from "../components/ui";
import { BottomNav } from "../components/BottomNav";
import { useResponsive } from "../lib/layout";

export default function Knowledge() {
  const { connected } = useApp();
  const responsive = useResponsive();
  const [stats, setStats] = useState<any>(null);
  const [collections, setCollections] = useState<string[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [collection, setCollection] = useState("default");
  const [text, setText] = useState("");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [searched, setSearched] = useState(false);
  const [busy, setBusy] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [docChunks, setDocChunks] = useState<any[] | null>(null);
  const [chunkDocId, setChunkDocId] = useState<string | null>(null);
  const [editingChunk, setEditingChunk] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  const load = useCallback(async () => {
    try {
      const [s, c, d] = await Promise.all([
        api.getRagStats(),
        api.getRagCollections(),
        api.getRagDocuments(),
      ]);
      setStats(s || {});
      setCollections((c?.collections as string[]) || (Array.isArray(c) ? c : []) || []);
      setDocuments((d?.documents as any[]) || (Array.isArray(d) ? d : []) || []);
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

  const pickAndUpload = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({ copyToCacheDirectory: true });
      if (res.canceled || !res.assets?.length) return;
      const f = res.assets[0];
      setBusy(true);
      await api.ragUpload(f.uri, f.name, collection);
      await load();
    } catch (e: any) {
      Alert.alert("Upload failed", e?.message || "Could not upload the file.");
    } finally {
      setBusy(false);
    }
  };

  const addText = async () => {
    const t = text.trim();
    if (!t) return;
    setBusy(true);
    try {
      await api.ragAddText(t, collection);
      setText("");
      await load();
    } catch (e: any) {
      Alert.alert("Add text failed", e?.message || "Could not index the text.");
    } finally {
      setBusy(false);
    }
  };

  const doSearch = async () => {
    const q = query.trim();
    if (!q) return;
    setBusy(true);
    try {
      const r: any = await api.ragSearch(q, collection, 5);
      setResults(r?.results || (Array.isArray(r) ? r : []));
      setSearched(true);
    } catch {
      setResults([]);
      setSearched(true);
    } finally {
      setBusy(false);
    }
  };

  const delDoc = (id: string) =>
    Alert.alert("Delete document?", "This removes its chunks from the index.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await api.ragDeleteDoc(id);
            setDocuments((d) => d.filter((x) => x.id !== id));
          } catch {
            /* ignore */
          }
        },
      },
    ]);

  const viewChunks = async (docId: string) => {
    try {
      setBusy(true);
      const chunks: any = await api.getRagChunks(docId);
      setDocChunks(Array.isArray(chunks) ? chunks : chunks?.chunks || []);
      setChunkDocId(docId);
    } catch {
      Alert.alert("Error", "Could not load chunks for this document.");
    } finally {
      setBusy(false);
    }
  };

  const saveChunkEdit = async (chunkId: string) => {
    try {
      setBusy(true);
      await api.updateRagChunk(chunkId, editText);
      setEditingChunk(null);
      setEditText("");
      if (chunkDocId) await viewChunks(chunkDocId);
    } catch {
      Alert.alert("Error", "Could not update chunk.");
    } finally {
      setBusy(false);
    }
  };

  const doReembed = async (chunkId: string) => {
    try {
      setBusy(true);
      await api.reembedChunk(chunkId);
      Alert.alert("Re-embedded", "Chunk has been re-embedded.");
    } catch {
      Alert.alert("Error", "Could not re-embed chunk.");
    } finally {
      setBusy(false);
    }
  };

  if (docChunks !== null && chunkDocId) {
    return (
      <View style={styles.container}>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }} removeClippedSubviews>
          <View style={responsive.inner}>
            <Pressable onPress={() => { setDocChunks(null); setChunkDocId(null); setEditingChunk(null); }}>
              <Text style={[styles.muted, { marginBottom: 12 }]}>← Back to documents</Text>
            </Pressable>
            <SectionTitle>Chunks ({docChunks.length})</SectionTitle>
            {docChunks.map((c: any, i: number) => (
              <Card key={c.id ?? i} style={styles.mini}>
                {editingChunk === c.id ? (
                  <>
                    <TextInput
                      style={[styles.textarea, { minHeight: 80 }]}
                      value={editText}
                      onChangeText={setEditText}
                      multiline
                      placeholderTextColor={COLORS.muted}
                    />
                    <View style={styles.chunkActions}>
                      <PrimaryButton title="Save" onPress={() => saveChunkEdit(c.id)} loading={busy} />
                      <PrimaryButton
                        title="Cancel"
                        color={COLORS.surface2}
                        onPress={() => { setEditingChunk(null); setEditText(""); }}
                      />
                    </View>
                  </>
                ) : (
                  <>
                    <Text style={styles.muted} numberOfLines={6}>
                      {c.text || c.content || JSON.stringify(c)}
                    </Text>
                    <Text style={styles.tiny}>
                      {c.score != null ? `score ${c.score.toFixed(3)} · ` : ""}
                      {c.token_count ?? ""} tokens
                    </Text>
                    <View style={styles.chunkActions}>
                      <Pressable
                        onPress={() => { setEditingChunk(c.id); setEditText(c.text || c.content || ""); }}
                      >
                        <Text style={styles.editLink}>Edit</Text>
                      </Pressable>
                      <Pressable onPress={() => doReembed(c.id)}>
                        <Text style={styles.editLink}>Re-embed</Text>
                      </Pressable>
                    </View>
                  </>
                )}
              </Card>
            ))}
          </View>
        </ScrollView>
        <BottomNav />
      </View>
    );
  }

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
            <Stat label="Collections" value={collections.length} />
            <Stat label="Documents" value={documents.length} />
            <Stat label="Chunks" value={stats?.total_chunks ?? stats?.chunks ?? 0} />
          </View>

          <SectionTitle>Collection</SectionTitle>
          <View style={styles.chips}>
            {collections.length === 0 && <Text style={styles.muted}>No collections yet.</Text>}
            {collections.map((c) => (
              <Chip key={c} label={c} active={c === collection} onPress={() => setCollection(c)} />
            ))}
          </View>

          <SectionTitle>Add a document</SectionTitle>
          <Card>
            <PrimaryButton
              title={busy ? "Uploading…" : "Choose file…"}
              onPress={pickAndUpload}
              loading={busy}
            />
            <Text style={styles.hint}>
              PDF, TXT, MD, DOCX, etc. Files are indexed locally on your server.
            </Text>
          </Card>

          <SectionTitle>Add text</SectionTitle>
          <Card>
            <TextInput
              style={styles.textarea}
              value={text}
              onChangeText={setText}
              placeholder="Paste knowledge to index…"
              placeholderTextColor={COLORS.muted}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
            <PrimaryButton title="Index text" onPress={addText} loading={busy} />
          </Card>

          <SectionTitle>Search knowledge</SectionTitle>
          <Card>
            <TextInput
              style={styles.input}
              value={query}
              onChangeText={setQuery}
              placeholder="Ask a question over your docs…"
              placeholderTextColor={COLORS.muted}
              returnKeyType="search"
              onSubmitEditing={doSearch}
            />
            <PrimaryButton title={busy ? "Searching…" : "Search"} onPress={doSearch} loading={busy} />
          </Card>

          {searched && (
            <>
              <SectionTitle>Results</SectionTitle>
              {results.length === 0 && <Text style={styles.muted}>No matches found.</Text>}
              {results.map((r: any, i: number) => (
                <Card key={i} style={styles.mini}>
                  <Text style={styles.muted} numberOfLines={4}>
                    {r.text || r.content || JSON.stringify(r)}
                  </Text>
                  {r.score != null && <Text style={styles.tiny}>score {r.score.toFixed(3)}</Text>}
                </Card>
              ))}
            </>
          )}

          <SectionTitle>Documents</SectionTitle>
          {documents.length === 0 && (
            <Text style={styles.muted}>No documents indexed yet.</Text>
          )}
          {documents.map((d: any) => (
            <Card key={d.id} style={styles.mini}>
              <Pressable onPress={() => viewChunks(d.id)}>
                <View style={styles.rowBetween}>
                  <Text style={styles.name} numberOfLines={1}>
                    {d.filename || d.name || d.id}
                  </Text>
                  <Pressable onPress={() => delDoc(d.id)}>
                    <Text style={styles.del}>Delete</Text>
                  </Pressable>
                </View>
                <Text style={styles.tiny}>
                  {d.chunks ?? d.chunk_count ?? ""} chunks · {d.collection || "default"}
                </Text>
              </Pressable>
            </Card>
          ))}
        </View>
      </ScrollView>
      <BottomNav />
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
  chips: { flexDirection: "row", flexWrap: "wrap", marginBottom: 4 },
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
  textarea: {
    backgroundColor: COLORS.surface2,
    color: COLORS.text,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 10,
    minHeight: 96,
  },
  hint: { color: COLORS.muted, fontSize: 12, marginTop: 8, lineHeight: 17 },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  del: { color: COLORS.red, fontSize: FONT_SIZE.xs, fontWeight: "700" },
  muted: { color: COLORS.muted, fontSize: FONT_SIZE.sm, marginTop: 2 },
  tiny: { color: COLORS.muted, fontSize: 11, marginTop: 6 },
  name: { color: COLORS.text, fontSize: FONT_SIZE.md, fontWeight: "700", flex: 1, marginRight: 8 },
  mini: { paddingVertical: 12, paddingHorizontal: 14 },
  chunkActions: { flexDirection: "row", gap: 16, marginTop: 10 },
  editLink: { color: COLORS.accent, fontSize: FONT_SIZE.sm, fontWeight: "600" },
});
