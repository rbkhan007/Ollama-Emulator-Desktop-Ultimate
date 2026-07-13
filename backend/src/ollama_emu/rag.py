"""
RAG (Retrieval-Augmented Generation) Engine — PostgreSQL + pgvector
Copyright (c) 2024-2026 Rhasan@dev. All rights reserved.

Features:
- Multiple embedding backends: TF-IDF (built-in), sentence-transformers, API-based
- pgvector cosine/l1/ip distance operators
- HNSW + IVFFlat index support
- Hybrid search (vector + full-text search with Reciprocal Rank Fusion)
- Batch insert for performance
- Configurable dimensions and similarity thresholds
"""
import hashlib
import json
import logging
import math
import os
import re
import uuid
from collections import Counter
from typing import Dict, List, Optional

import numpy as np

from ollama_emu.db import get_conn, get_cursor, is_connected

log = logging.getLogger("ollama-emu.rag")

# ============================================================
# CONFIGURATION
# ============================================================

EMBEDDING_BACKEND = os.environ.get("OLLAMA_EMU_EMBEDDING_BACKEND", "tfidf")
EMBEDDING_DIMENSION = int(os.environ.get("OLLAMA_EMU_EMBEDDING_DIM", "384"))
EMBEDDING_MODEL = os.environ.get("OLLAMA_EMU_EMBEDDING_MODEL", "")
CHUNK_SIZE = int(os.environ.get("OLLAMA_EMU_CHUNK_SIZE", "512"))
CHUNK_OVERLAP = int(os.environ.get("OLLAMA_EMU_CHUNK_OVERLAP", "64"))
DEFAULT_TOP_K = int(os.environ.get("OLLAMA_EMU_RAG_TOP_K", "5"))
MIN_SIMILARITY = float(os.environ.get("OLLAMA_EMU_RAG_MIN_SIM", "0.0"))
HYBRID_ALPHA = float(os.environ.get("OLLAMA_EMU_RAG_HYBRID_ALPHA", "0.7"))
CROSS_ENCODER_MODEL = os.environ.get("OLLAMA_EMU_CROSS_ENCODER_MODEL", "cross-encoder/ms-marco-MiniLM-L-6-v2")
RERANK_ENABLED = os.environ.get("OLLAMA_EMU_RAG_RERANK", "true").lower() == "true"
INDEX_TYPE = os.environ.get("OLLAMA_EMU_RAG_INDEX_TYPE", "hnsw")
HNSW_M = int(os.environ.get("OLLAMA_EMU_RAG_HNSW_M", "16"))
HNSW_EF_CONSTRUCTION = int(os.environ.get("OLLAMA_EMU_RAG_HNSW_EF_CONSTRUCTION", "200"))
IVFFLAT_LISTS = int(os.environ.get("OLLAMA_EMU_RAG_IVFFLAT_LISTS", "100"))

DIMENSION = EMBEDDING_DIMENSION

STOP_WORDS = frozenset(
    "a an the is are was were be been being have has had do does did will would shall should "
    "can could may might must am i me my we us our you your he him his she her it its they them "
    "their this that these those of in on at to for with by from as into through during before "
    "after above below between out off over under again further then once here there when where "
    "why how all any both each few more most other some such no not only own same so than too "
    "very just don now d ll m o re ve y ain aren couldn didn doesn hadn hasn haven isn ma "
    "mightn mustn needn shan shouldn wasn weren won wouldn".split()
)

# ============================================================
# TEXT PROCESSING
# ============================================================

def tokenize(text: str) -> List[str]:
    text = text.lower()
    text = re.sub(r"[^a-z0-9\s]", " ", text)
    tokens = text.split()
    return [t for t in tokens if len(t) > 1 and t not in STOP_WORDS]


def chunk_text(text: str, chunk_size: int = CHUNK_SIZE, overlap: int = CHUNK_OVERLAP) -> List[str]:
    paragraphs = [p.strip() for p in re.split(r"\n{2,}", text) if p.strip()]
    chunks = []
    current = ""
    for para in paragraphs:
        if len(current) + len(para) > chunk_size and current:
            chunks.append(current.strip())
            words = current.split()
            overlap_text = " ".join(words[-overlap:]) if overlap else ""
            current = overlap_text + "\n\n" + para
        else:
            current = (current + "\n\n" + para).strip() if current else para
        while len(current) > chunk_size:
            words = current.split()
            mid = len(words) // 2
            chunks.append(" ".join(words[:mid + overlap]))
            current = " ".join(words[mid - overlap:])
    if current.strip():
        chunks.append(current.strip())
    return chunks if chunks else [text[:chunk_size]]


def read_file_content(file_path: str) -> str:
    ext = os.path.splitext(file_path)[1].lower()
    text_exts = {
        ".txt", ".md", ".csv", ".json", ".py", ".js", ".ts", ".java", ".c",
        ".cpp", ".h", ".cs", ".go", ".rs", ".rb", ".php", ".sql", ".html",
        ".css", ".yaml", ".yml", ".toml", ".ini", ".cfg", ".conf", ".log",
        ".sh", ".bat", ".ps1", ".xml", ".rst", ".tex",
    }
    if ext in text_exts:
        with open(file_path, "r", encoding="utf-8", errors="replace") as f:
            return f.read()
    return ""

# ============================================================
# EMBEDDING BACKENDS
# ============================================================

class EmbeddingBackend:
    """Base class for embedding backends."""
    def embed(self, texts: List[str]) -> np.ndarray:
        raise NotImplementedError

    def embed_single(self, text: str) -> np.ndarray:
        return self.embed([text])[0]

    @property
    def dimension(self) -> int:
        return DIMENSION


class TFIDFBackend(EmbeddingBackend):
    """Built-in TF-IDF embedding (no external dependencies)."""
    def __init__(self):
        self._dim = DIMENSION

    @property
    def dimension(self) -> int:
        return self._dim

    def embed(self, texts: List[str]) -> np.ndarray:
        tokens_list = [tokenize(t) for t in texts]
        return self._compute_tfidf(tokens_list)

    def _compute_tfidf(self, tokens_list: List[List[str]]) -> np.ndarray:
        vocab_set = set()
        for tokens in tokens_list:
            vocab_set.update(tokens)
        vocab = sorted(vocab_set)
        term_idx = {t: i for i, t in enumerate(vocab)}

        doc_count = len(tokens_list)
        df = Counter()
        for tokens in tokens_list:
            df.update(set(tokens))
        idf = {}
        for term, freq in df.items():
            idf[term] = math.log((doc_count + 1) / (freq + 1)) + 1

        vectors = []
        for tokens in tokens_list:
            tf = Counter(tokens)
            max_tf = max(tf.values()) if tf else 1
            vec = np.zeros(len(vocab), dtype=np.float32)
            for term, count in tf.items():
                if term in term_idx:
                    tf_val = 0.5 + 0.5 * (count / max_tf)
                    vec[term_idx[term]] = tf_val * idf.get(term, 1.0)
            norm = np.linalg.norm(vec)
            if norm > 0:
                vec /= norm
            vectors.append(vec)

        if not vectors:
            return np.zeros((0, self._dim), dtype=np.float32)

        mat = np.array(vectors, dtype=np.float32)
        if mat.shape[1] > self._dim:
            mat = mat[:, :self._dim]
        elif mat.shape[1] < self._dim:
            mat = np.pad(mat, ((0, 0), (0, self._dim - mat.shape[1])), mode="constant")
        return mat


class SentenceTransformerBackend(EmbeddingBackend):
    """sentence-transformers backend (requires: pip install sentence-transformers)."""
    def __init__(self, model_name: str = "all-MiniLM-L6-v2"):
        self._model_name = model_name or "all-MiniLM-L6-v2"
        self._model = None

    def _load(self):
        if self._model is None:
            try:
                from sentence_transformers import SentenceTransformer
                self._model = SentenceTransformer(self._model_name)
                self._dim = self._model.get_sentence_embedding_dimension()
                log.info("Loaded sentence-transformers model: %s (dim=%d)", self._model_name, self._dim)
            except ImportError:
                log.warning("sentence-transformers not installed, falling back to TF-IDF")
                raise

    @property
    def dimension(self) -> int:
        try:
            self._load()
            return self._dim
        except Exception:
            return DIMENSION

    def embed(self, texts: List[str]) -> np.ndarray:
        self._load()
        embeddings = self._model.encode(texts, show_progress_bar=False, normalize_embeddings=True)
        return np.array(embeddings, dtype=np.float32)


class OpenAIEmbeddingBackend(EmbeddingBackend):
    """OpenAI-compatible embedding API backend."""
    def __init__(self, api_url: str = "", api_key: str = "", model: str = "text-embedding-3-small"):
        self._api_url = api_url or os.environ.get("OLLAMA_EMU_EMBEDDING_API_URL", "")
        self._api_key = api_key or os.environ.get("OLLAMA_EMU_EMBEDDING_API_KEY", "")
        self._model = model or os.environ.get("OLLAMA_EMU_EMBEDDING_MODEL", "text-embedding-3-small")
        self._dim = DIMENSION

    @property
    def dimension(self) -> int:
        return self._dim

    def embed(self, texts: List[str]) -> np.ndarray:
        if not self._api_url:
            raise ValueError("OLLAMA_EMU_EMBEDDING_API_URL not set")
        import httpx
        headers = {"Content-Type": "application/json"}
        if self._api_key:
            headers["Authorization"] = f"Bearer {self._api_key}"
        all_embeddings = []
        batch_size = 20
        for i in range(0, len(texts), batch_size):
            batch = texts[i:i + batch_size]
            resp = httpx.post(
                self._api_url,
                json={"input": batch, "model": self._model},
                headers=headers,
                timeout=30,
            )
            resp.raise_for_status()
            data = resp.json()
            for item in sorted(data.get("data", []), key=lambda x: x["index"]):
                all_embeddings.append(item["embedding"])
        mat = np.array(all_embeddings, dtype=np.float32)
        if mat.shape[1] > self._dim:
            mat = mat[:, :self._dim]
        elif mat.shape[1] < self._dim:
            mat = np.pad(mat, ((0, 0), (0, self._dim - mat.shape[1])), mode="constant")
        return mat


def get_embedding_backend() -> EmbeddingBackend:
    """Get the configured embedding backend."""
    backend = EMBEDDING_BACKEND.lower()
    if backend == "sentence-transformers" or backend == "st":
        try:
            return SentenceTransformerBackend(EMBEDDING_MODEL)
        except Exception:
            log.warning("Falling back to TF-IDF embedding backend")
            return TFIDFBackend()
    elif backend == "openai" or backend == "api":
        return OpenAIEmbeddingBackend(model=EMBEDDING_MODEL)
    else:
        return TFIDFBackend()


# ============================================================
# CROSS-ENCODER RERANKER
# ============================================================

_cross_encoder = None


def get_cross_encoder():
    """Get or initialize the cross-encoder reranker (lazy load)."""
    global _cross_encoder
    if not RERANK_ENABLED:
        return None
    if _cross_encoder is not None:
        return _cross_encoder
    try:
        from sentence_transformers import CrossEncoder
        _cross_encoder = CrossEncoder(CROSS_ENCODER_MODEL)
        log.info("Loaded cross-encoder model: %s", CROSS_ENCODER_MODEL)
    except ImportError:
        log.warning("sentence-transformers not installed — cross-encoder reranking disabled")
        return None
    except Exception as e:
        log.warning("Could not load cross-encoder '%s': %s", CROSS_ENCODER_MODEL, e)
        return None
    return _cross_encoder


_backend: Optional[EmbeddingBackend] = None


def get_backend() -> EmbeddingBackend:
    global _backend
    if _backend is None:
        _backend = get_embedding_backend()
    return _backend


def embed_texts(texts: List[str]) -> np.ndarray:
    """Embed a list of texts using the configured backend."""
    return get_backend().embed(texts)


def embed_query(text: str) -> np.ndarray:
    """Embed a single query text."""
    return get_backend().embed_single(text)


# ============================================================
# pgvector OPERATIONS
# ============================================================

def vector_to_sql(vec: np.ndarray) -> str:
    """Convert numpy array to pgvector SQL string."""
    return "[" + ",".join(f"{v:.6f}" for v in vec.tolist()) + "]"


def create_embedding_index():
    """Create the appropriate vector index (HNSW or IVFFlat)."""
    if not is_connected():
        return
    try:
        with get_conn() as conn:
            cur = conn.cursor()
            cur.execute("SELECT COUNT(*) FROM rag_chunks WHERE embedding IS NOT NULL")
            count = cur.fetchone()[0]

            if count == 0:
                log.info("No embeddings yet, skipping index creation.")
                return

            if INDEX_TYPE.lower() == "hnsw":
                cur.execute("""
                    CREATE INDEX IF NOT EXISTS idx_chunks_embedding_hnsw
                    ON rag_chunks USING hnsw (embedding vector_cosine_ops)
                    WITH (m = %s, ef_construction = %s)
                """, (HNSW_M, HNSW_EF_CONSTRUCTION))
                conn.commit()
                log.info("HNSW embedding index created/verified (m=%d, ef_construction=%d, %d vectors).",
                         HNSW_M, HNSW_EF_CONSTRUCTION, count)
            else:
                lists = min(IVFFLAT_LISTS, count // 10) if count >= 100 else 10
                cur.execute(f"""
                    CREATE INDEX IF NOT EXISTS idx_chunks_embedding_ivfflat
                    ON rag_chunks USING ivfflat (embedding vector_cosine_ops)
                    WITH (lists = {lists})
                """)
                conn.commit()
                log.info("IVFFlat embedding index created/verified (lists=%d, %d vectors).", lists, count)
    except Exception as e:
        log.debug("Could not create embedding index: %s", e)


def drop_embedding_index():
    """Drop the vector index if it exists."""
    if not is_connected():
        return
    try:
        with get_conn() as conn:
            cur = conn.cursor()
            cur.execute("DROP INDEX IF EXISTS idx_chunks_embedding_hnsw")
            cur.execute("DROP INDEX IF EXISTS idx_chunks_embedding_ivfflat")
            conn.commit()
    except Exception as e:
        log.debug("Could not drop embedding index: %s", e)


def vector_stats() -> dict:
    """Get statistics about the vector data."""
    if not is_connected():
        return {"connected": False}
    with get_cursor(commit=False) as cur:
        cur.execute("SELECT COUNT(*) FROM rag_chunks WHERE embedding IS NOT NULL")
        indexed = cur.fetchone()["count"]
        cur.execute("SELECT COUNT(*) FROM rag_chunks WHERE embedding IS NULL")
        unindexed = cur.fetchone()["count"]
        cur.execute("SELECT pg_column_size(embedding) FROM rag_chunks WHERE embedding IS NOT NULL LIMIT 1")
        row = cur.fetchone()
        bytes_per_vector = row["pg_column_size"] if row else 0

        cur.execute("""
            SELECT indexname FROM pg_indexes
            WHERE tablename = 'rag_chunks' AND indexname LIKE 'idx_chunks_embedding%'
        """)
        indexes = [r["indexname"] for r in cur.fetchall()]

    return {
        "connected": True,
        "indexed_vectors": indexed,
        "unindexed_vectors": unindexed,
        "total_vectors": indexed + unindexed,
        "bytes_per_vector": bytes_per_vector,
        "dimension": DIMENSION,
        "index_type": INDEX_TYPE,
        "indexes": indexes,
        "embedding_backend": EMBEDDING_BACKEND,
    }


# ============================================================
# RAG ENGINE
# ============================================================

class RAGEngine:
    def __init__(self):
        if is_connected():
            stats = self.stats()
            vstats = vector_stats()
            log.info(
                "RAG engine initialized (PostgreSQL + pgvector). "
                "%d documents, %d chunks, %d vectors indexed. Backend: %s, Index: %s",
                stats["documents"], stats["chunks"], vstats.get("indexed_vectors", 0),
                EMBEDDING_BACKEND, INDEX_TYPE,
            )
        else:
            log.warning("RAG engine: PostgreSQL not connected — RAG features unavailable.")

    def add_document(self, file_path: str, collection: str = "default", metadata: dict = None) -> dict:
        if not is_connected():
            return {"error": "PostgreSQL not connected"}
        filename = os.path.basename(file_path)
        content = read_file_content(file_path)
        if not content.strip():
            return {"error": f"Could not read or empty file: {filename}"}
        file_hash = hashlib.md5(content.encode()).hexdigest()

        with get_cursor() as cur:
            cur.execute("SELECT id FROM rag_documents WHERE file_hash=%s", (file_hash,))
            existing = cur.fetchone()
            if existing:
                return {"warning": f"Document already indexed: {filename}", "doc_id": existing["id"]}

            doc_id = str(uuid.uuid4())[:12]
            chunks = chunk_text(text=content)
            cur.execute(
                "INSERT INTO rag_documents (id, filename, file_hash, chunk_count, collection, metadata) VALUES (%s,%s,%s,%s,%s,%s)",
                (doc_id, filename, file_hash, len(chunks), collection, json.dumps(metadata or {})),
            )

            chunk_ids = []
            chunk_contents = []
            for i, chunk in enumerate(chunks):
                chunk_id = f"{doc_id}_{i:04d}"
                chunk_ids.append(chunk_id)
                chunk_contents.append(chunk)
                cur.execute(
                    "INSERT INTO rag_chunks (id, doc_id, chunk_index, content) VALUES (%s,%s,%s,%s)",
                    (chunk_id, doc_id, i, chunk),
                )
                cur.execute(
                    "INSERT INTO rag_fts (doc_id, content) VALUES (%s, to_tsvector('english', %s))",
                    (doc_id, chunk),
                )

            embeddings = embed_texts(chunk_contents)
            for i, chunk_id in enumerate(chunk_ids):
                vec = embeddings[i] if i < len(embeddings) else np.zeros(DIMENSION, dtype=np.float32)
                vec_str = vector_to_sql(vec)
                cur.execute(
                    "UPDATE rag_chunks SET embedding = %s::vector, tokens = %s WHERE id = %s",
                    (vec_str, json.dumps(tokenize(chunk_contents[i])), chunk_id),
                )

        log.info("Indexed document '%s' -> %d chunks (collection: %s, backend: %s)",
                 filename, len(chunks), collection, EMBEDDING_BACKEND)
        return {
            "doc_id": doc_id, "filename": filename, "chunks": len(chunks),
            "collection": collection, "embedding_backend": EMBEDDING_BACKEND,
        }

    def add_text(self, text: str, name: str = "text", collection: str = "default", metadata: dict = None) -> dict:
        tmp_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), f"_tmp_{uuid.uuid4().hex[:8]}.txt")
        with open(tmp_path, "w", encoding="utf-8") as f:
            f.write(text)
        try:
            result = self.add_document(tmp_path, collection, metadata)
            if "filename" in result:
                result["filename"] = name
        finally:
            try:
                os.remove(tmp_path)
            except OSError:
                pass
        return result

    def add_texts_batch(self, texts: List[Dict], collection: str = "default") -> dict:
        """Batch insert multiple texts."""
        if not is_connected():
            return {"error": "PostgreSQL not connected"}
        results = []
        for item in texts:
            r = self.add_text(
                text=item.get("text", ""),
                name=item.get("name", "text"),
                collection=collection,
                metadata=item.get("metadata"),
            )
            results.append(r)
        return {"processed": len(results), "results": results}

    def search(self, query: str, top_k: int = DEFAULT_TOP_K, collection: str = None,
               min_score: float = MIN_SIMILARITY, hybrid: bool = True) -> List[dict]:
        if not is_connected():
            return []

        query_tokens = tokenize(query)
        if not query_tokens:
            return []

        q_vec = embed_query(query)
        q_vec_str = vector_to_sql(q_vec)

        vector_results = []
        fts_results = []

        with get_cursor(commit=False) as cur:
            if collection:
                cur.execute("""
                    SELECT c.id AS chunk_id, c.content, c.chunk_index, c.doc_id,
                           d.filename, d.collection,
                           1 - (c.embedding <=> %s::vector) AS score
                    FROM rag_chunks c
                    JOIN rag_documents d ON c.doc_id = d.id
                    WHERE c.embedding IS NOT NULL AND d.collection = %s
                    ORDER BY c.embedding <=> %s::vector
                    LIMIT %s
                """, (q_vec_str, collection, q_vec_str, top_k * 3))
            else:
                cur.execute("""
                    SELECT c.id AS chunk_id, c.content, c.chunk_index, c.doc_id,
                           d.filename, d.collection,
                           1 - (c.embedding <=> %s::vector) AS score
                    FROM rag_chunks c
                    JOIN rag_documents d ON c.doc_id = d.id
                    WHERE c.embedding IS NOT NULL
                    ORDER BY c.embedding <=> %s::vector
                    LIMIT %s
                """, (q_vec_str, q_vec_str, top_k * 3))

            for row in cur.fetchall():
                vector_results.append({
                    "chunk_id": row["chunk_id"],
                    "content": row["content"],
                    "chunk_index": row["chunk_index"],
                    "doc_id": row["doc_id"],
                    "filename": row["filename"],
                    "collection": row["collection"],
                    "vector_score": round(float(row["score"]), 4),
                })

            if collection:
                cur.execute("""
                    SELECT c.id AS chunk_id, c.content, c.chunk_index, c.doc_id,
                           d.filename, d.collection,
                           ts_rank_cd(f.content, plainto_tsquery('english', %s)) AS rank
                    FROM rag_fts f
                    JOIN rag_chunks c ON f.doc_id = c.doc_id AND f.content = to_tsvector('english', c.content)
                    JOIN rag_documents d ON c.doc_id = d.id
                    WHERE f.content @@ plainto_tsquery('english', %s) AND d.collection = %s
                    ORDER BY rank DESC
                    LIMIT %s
                """, (query, query, collection, top_k * 3))
            else:
                cur.execute("""
                    SELECT c.id AS chunk_id, c.content, c.chunk_index, c.doc_id,
                           d.filename, d.collection,
                           ts_rank_cd(f.content, plainto_tsquery('english', %s)) AS rank
                    FROM rag_fts f
                    JOIN rag_chunks c ON f.doc_id = c.doc_id AND f.content = to_tsvector('english', c.content)
                    JOIN rag_documents d ON c.doc_id = d.id
                    WHERE f.content @@ plainto_tsquery('english', %s)
                    ORDER BY rank DESC
                    LIMIT %s
                """, (query, query, top_k * 3))

            for row in cur.fetchall():
                fts_results.append({
                    "chunk_id": row["chunk_id"],
                    "content": row["content"],
                    "chunk_index": row["chunk_index"],
                    "doc_id": row["doc_id"],
                    "filename": row["filename"],
                    "collection": row["collection"],
                    "fts_score": round(float(row["rank"]), 4),
                })

        if hybrid and vector_results and fts_results:
            results = self._rrf_merge(vector_results, fts_results, top_k * 2, min_score)
        elif vector_results:
            results = vector_results
        elif fts_results:
            results = [{**r, "vector_score": 0.0, "fts_score": r.pop("fts_score", 0.5)} for r in fts_results]
        else:
            return []

        results = [r for r in results[:top_k * 2] if r.get("vector_score", r.get("fts_score", 0)) >= min_score]
        results = self.rerank(query, results, top_k)
        return results

    def _rrf_merge(self, vector_results: List[dict], fts_results: List[dict],
                   top_k: int, min_score: float) -> List[dict]:
        """Reciprocal Rank Fusion to merge vector and FTS results."""
        k = 60
        scores = {}

        for rank, r in enumerate(vector_results):
            cid = r["chunk_id"]
            rrf = (1 - HYBRID_ALPHA) / (k + rank + 1)
            scores[cid] = scores.get(cid, {"rrf": 0, "data": r})
            scores[cid]["rrf"] += rrf
            scores[cid]["data"]["vector_score"] = r.get("vector_score", 0)

        for rank, r in enumerate(fts_results):
            cid = r["chunk_id"]
            rrf = HYBRID_ALPHA / (k + rank + 1)
            scores[cid] = scores.get(cid, {"rrf": 0, "data": r})
            scores[cid]["rrf"] += rrf
            scores[cid]["data"]["fts_score"] = r.get("fts_score", 0)

        merged = []
        for cid, info in scores.items():
            entry = info["data"]
            entry["score"] = round(info["rrf"], 4)
            merged.append(entry)

        merged.sort(key=lambda x: x["score"], reverse=True)
        return [r for r in merged[:top_k] if r.get("score", 0) >= min_score]

    def rerank(self, query: str, results: List[dict], top_k: int = None) -> List[dict]:
        """Re-rank results using a cross-encoder for improved relevance."""
        if not results:
            return results
        cross = get_cross_encoder()
        if cross is None:
            return results
        try:
            pairs = [(query, r["content"]) for r in results]
            scores = cross.score(pairs)
            for i, r in enumerate(results):
                r["cross_score"] = round(float(scores[i]), 4)
            results.sort(key=lambda x: x["cross_score"], reverse=True)
            if top_k:
                results = results[:top_k]
        except Exception as e:
            log.warning("Cross-encoder reranking failed: %s", e)
        return results

    def search_vector(self, query: str, top_k: int = DEFAULT_TOP_K, collection: str = None) -> List[dict]:
        """Vector-only search (no FTS fallback)."""
        return self.search(query, top_k=top_k, collection=collection, hybrid=False)

    def search_fts(self, query: str, top_k: int = DEFAULT_TOP_K, collection: str = None) -> List[dict]:
        """Full-text search only."""
        if not is_connected():
            return []
        results = []
        with get_cursor(commit=False) as cur:
            if collection:
                cur.execute("""
                    SELECT c.id AS chunk_id, c.content, c.chunk_index, c.doc_id,
                           d.filename, d.collection,
                           ts_rank_cd(f.content, plainto_tsquery('english', %s)) AS rank
                    FROM rag_fts f
                    JOIN rag_chunks c ON f.doc_id = c.doc_id AND f.content = to_tsvector('english', c.content)
                    JOIN rag_documents d ON c.doc_id = d.id
                    WHERE f.content @@ plainto_tsquery('english', %s) AND d.collection = %s
                    ORDER BY rank DESC LIMIT %s
                """, (query, query, collection, top_k))
            else:
                cur.execute("""
                    SELECT c.id AS chunk_id, c.content, c.chunk_index, c.doc_id,
                           d.filename, d.collection,
                           ts_rank_cd(f.content, plainto_tsquery('english', %s)) AS rank
                    FROM rag_fts f
                    JOIN rag_chunks c ON f.doc_id = c.doc_id AND f.content = to_tsvector('english', c.content)
                    JOIN rag_documents d ON c.doc_id = d.id
                    WHERE f.content @@ plainto_tsquery('english', %s)
                    ORDER BY rank DESC LIMIT %s
                """, (query, query, top_k))
            for row in cur.fetchall():
                results.append({
                    "chunk_id": row["chunk_id"], "content": row["content"],
                    "chunk_index": row["chunk_index"], "doc_id": row["doc_id"],
                    "filename": row["filename"], "collection": row["collection"],
                    "score": round(float(row["rank"]), 4),
                    "source": f"{row['filename']}#chunk{row['chunk_index']}",
                })
        return results

    def build_context(self, query: str, max_tokens: int = 3000, top_k: int = DEFAULT_TOP_K,
                      collection: str = None, hybrid: bool = True) -> str:
        results = self.search(query, top_k=top_k, collection=collection, hybrid=hybrid)
        if not results:
            return ""
        context_parts = []
        total_len = 0
        for r in results:
            score_pct = r.get("score", r.get("vector_score", 0)) * 100
            text = f"[Source: {r.get('filename', '?')}#chunk{r.get('chunk_index', '?')} | Score: {score_pct:.1f}%]\n{r['content']}"
            est_tokens = len(text.split()) * 1.3
            if total_len + est_tokens > max_tokens:
                break
            context_parts.append(text)
            total_len += est_tokens
        if not context_parts:
            return ""
        return (
            "The following context was retrieved from the user's documents to help answer the question. "
            "Use it if relevant, otherwise answer from your own knowledge.\n\n"
            "--- Retrieved Context ---\n"
            + "\n\n---\n\n".join(context_parts)
            + "\n--- End Context ---\n\n"
        )

    def delete_document(self, doc_id: str) -> dict:
        if not is_connected():
            return {"error": "PostgreSQL not connected"}
        with get_cursor() as cur:
            cur.execute("SELECT filename FROM rag_documents WHERE id=%s", (doc_id,))
            doc = cur.fetchone()
            if not doc:
                return {"error": "Document not found"}
            cur.execute("DELETE FROM rag_chunks WHERE doc_id=%s", (doc_id,))
            cur.execute("DELETE FROM rag_fts WHERE doc_id=%s", (doc_id,))
            cur.execute("DELETE FROM rag_documents WHERE id=%s", (doc_id,))
        log.info("Deleted document '%s' (id=%s)", doc["filename"], doc_id)
        return {"deleted": doc["filename"], "doc_id": doc_id}

    def reindex_document(self, doc_id: str) -> dict:
        """Re-embed a document with the current backend."""
        if not is_connected():
            return {"error": "PostgreSQL not connected"}
        with get_cursor(commit=False) as cur:
            cur.execute("SELECT filename, collection, metadata FROM rag_documents WHERE id=%s", (doc_id,))
            doc = cur.fetchone()
            if not doc:
                return {"error": "Document not found"}
            cur.execute("SELECT id, content FROM rag_chunks WHERE doc_id=%s ORDER BY chunk_index", (doc_id,))
            chunks = cur.fetchall()

            contents = [c["content"] for c in chunks]
            embeddings = embed_texts(contents)

            for i, chunk in enumerate(chunks):
                vec = embeddings[i] if i < len(embeddings) else np.zeros(DIMENSION, dtype=np.float32)
                cur.execute(
                    "UPDATE rag_chunks SET embedding = %s::vector WHERE id = %s",
                    (vector_to_sql(vec), chunk["id"]),
                )
        log.info("Re-indexed document '%s' (%d chunks)", doc["filename"], len(chunks))
        return {"reindexed": doc["filename"], "chunks": len(chunks)}

    def reembed_chunk(self, chunk_id: str, new_content: str):
        """Re-embed a single chunk after its content is updated."""
        if not is_connected():
            return {"error": "PostgreSQL not connected"}
        vec = embed_texts([new_content])[0]
        with get_cursor() as cur:
            cur.execute(
                "UPDATE rag_chunks SET embedding = %s::vector, content = %s WHERE id = %s",
                (vector_to_sql(vec), new_content, chunk_id),
            )
            cur.execute(
                "UPDATE rag_fts SET content = to_tsvector('english', %s) WHERE doc_id = (SELECT doc_id FROM rag_chunks WHERE id = %s)",
                (new_content, chunk_id),
            )
        return {"reembedded": chunk_id}

    def list_documents(self, collection: str = None) -> List[dict]:
        if not is_connected():
            return []
        with get_cursor(commit=False) as cur:
            if collection:
                cur.execute(
                    "SELECT id, filename, chunk_count, collection, metadata, created_at FROM rag_documents WHERE collection=%s ORDER BY created_at DESC",
                    (collection,),
                )
            else:
                cur.execute("SELECT id, filename, chunk_count, collection, metadata, created_at FROM rag_documents ORDER BY created_at DESC")
            rows = cur.fetchall()
        return [
            {
                "id": r["id"], "filename": r["filename"], "chunks": r["chunk_count"],
                "collection": r["collection"],
                "metadata": r["metadata"] if isinstance(r["metadata"], dict) else json.loads(r["metadata"] or "{}"),
                "created_at": str(r["created_at"]),
            }
            for r in rows
        ]

    def list_collections(self) -> List[dict]:
        if not is_connected():
            return []
        with get_cursor(commit=False) as cur:
            cur.execute(
                "SELECT collection, COUNT(*) AS doc_count, SUM(chunk_count) AS total_chunks FROM rag_documents GROUP BY collection"
            )
            rows = cur.fetchall()
        return [{"name": r["collection"], "documents": r["doc_count"], "chunks": r["total_chunks"] or 0} for r in rows]

    def stats(self) -> dict:
        if not is_connected():
            return {"documents": 0, "chunks": 0, "collections": 0, "indexed": False}
        with get_cursor(commit=False) as cur:
            cur.execute("SELECT COUNT(*) FROM rag_documents")
            docs = cur.fetchone()["count"]
            cur.execute("SELECT COUNT(*) FROM rag_chunks")
            chunks = cur.fetchone()["count"]
            cur.execute("SELECT COUNT(DISTINCT collection) FROM rag_documents")
            collections = cur.fetchone()["count"]
            cur.execute("SELECT COUNT(*) FROM rag_chunks WHERE embedding IS NOT NULL")
            vectors = cur.fetchone()["count"]
        return {
            "documents": docs, "chunks": chunks, "collections": collections,
            "vectors": vectors, "indexed": chunks > 0,
            "embedding_backend": EMBEDDING_BACKEND, "index_type": INDEX_TYPE,
        }

    def clear(self, collection: str = None) -> dict:
        if not is_connected():
            return {"error": "PostgreSQL not connected"}
        with get_cursor() as cur:
            if collection:
                cur.execute("DELETE FROM rag_chunks WHERE doc_id IN (SELECT id FROM rag_documents WHERE collection=%s)", (collection,))
                cur.execute("DELETE FROM rag_fts WHERE doc_id IN (SELECT id FROM rag_documents WHERE collection=%s)", (collection,))
                cur.execute("DELETE FROM rag_documents WHERE collection=%s", (collection,))
            else:
                cur.execute("DELETE FROM rag_chunks")
                cur.execute("DELETE FROM rag_fts")
                cur.execute("DELETE FROM rag_documents")
        log.info("Cleared RAG index (collection=%s)", collection or "ALL")
        return {"cleared": True, "collection": collection or "all"}
