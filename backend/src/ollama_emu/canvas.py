"""
Canvas functionality for OllamoMUI - Node-based visual workflow
Copyright (c) 2024-2026 Rhasan@dev. All rights reserved.
"""

import logging
from typing import Dict, List, Optional

from . import db as _db

log = logging.getLogger("ollama-emu.canvas")


# ============================================================
# CANVAS DB OPERATIONS
# ============================================================

CANVAS_SCHEMA_SQL = """
-- ── Canvas Nodes ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS canvas_nodes (
    id          TEXT PRIMARY KEY,
    title       TEXT NOT NULL,
    content     TEXT NOT NULL,
    x           INTEGER NOT NULL DEFAULT 0,
    y           INTEGER NOT NULL DEFAULT 0,
    is_processing BOOLEAN DEFAULT FALSE,
    node_type   TEXT DEFAULT 'default',
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── Canvas Connections ───────────────────────────────────
CREATE TABLE IF NOT EXISTS canvas_connections (
    id          TEXT PRIMARY KEY,
    source_node_id TEXT NOT NULL REFERENCES canvas_nodes(id) ON DELETE CASCADE,
    target_node_id TEXT NOT NULL REFERENCES canvas_nodes(id) ON DELETE CASCADE,
    is_streaming BOOLEAN DEFAULT FALSE,
    color       INTEGER DEFAULT 0x3b82f6,      -- AI Blue
    stream_color INTEGER DEFAULT 0x10b981,    -- AI Streaming Green
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(source_node_id, target_node_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_canvas_nodes_updated ON canvas_nodes(updated_at);
CREATE INDEX IF NOT EXISTS idx_canvas_connections_updated ON canvas_connections(updated_at);
CREATE INDEX IF NOT EXISTS idx_canvas_connections_source ON canvas_connections(source_node_id);
CREATE INDEX IF NOT EXISTS idx_canvas_connections_target ON canvas_connections(target_node_id);
"""


def init_canvas_schema():
    """Create canvas tables and indexes if they don't exist."""
    if not _db.is_connected():
        return False

    try:
        with _db.get_conn() as conn:
            cur = conn.cursor()
            cur.execute(CANVAS_SCHEMA_SQL)
            conn.commit()
        log.info("Canvas schema initialized")
        return True
    except Exception as e:
        log.error(f"Failed to initialize canvas schema: {e}")
        return False


def create_node(node_id: str, title: str, content: str, x: int = 0, y: int = 0,
                is_processing: bool = False, node_type: str = 'default') -> bool:
    """Create a new canvas node."""
    if not _db.is_connected():
        return False

    try:
        with _db.get_cursor() as cur:
            cur.execute(
                """
                INSERT INTO canvas_nodes (id, title, content, x, y, is_processing, node_type)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT (id) DO UPDATE SET
                    title=EXCLUDED.title,
                    content=EXCLUDED.content,
                    x=EXCLUDED.x,
                    y=EXCLUDED.y,
                    is_processing=EXCLUDED.is_processing,
                    node_type=EXCLUDED.node_type,
                    updated_at=NOW()
                """,
                (node_id, title, content, x, y, is_processing, node_type)
            )
        return True
    except Exception as e:
        log.error(f"Failed to create node {node_id}: {e}")
        return False


def get_node(node_id: str) -> Optional[Dict]:
    """Get a single canvas node by ID."""
    if not _db.is_connected():
        return None

    try:
        with _db.get_cursor(commit=False) as cur:
            cur.execute(
                "SELECT id, title, content, x, y, is_processing, node_type, created_at, updated_at FROM canvas_nodes WHERE id=%s",
                (node_id,)
            )
            row = cur.fetchone()
            return dict(row) if row else None
    except Exception as e:
        log.error(f"Failed to get node {node_id}: {e}")
        return None


def get_all_nodes() -> List[Dict]:
    """Get all canvas nodes."""
    if not _db.is_connected():
        return []

    try:
        with _db.get_cursor(commit=False) as cur:
            cur.execute(
                "SELECT id, title, content, x, y, is_processing, node_type, created_at, updated_at FROM canvas_nodes ORDER BY updated_at DESC"
            )
            return [dict(row) for row in cur.fetchall()]
    except Exception as e:
        log.error(f"Failed to get all nodes: {e}")
        return []


def update_node(node_id: str, title: Optional[str] = None, content: Optional[str] = None,
                x: Optional[int] = None, y: Optional[int] = None,
                is_processing: Optional[bool] = None, node_type: Optional[str] = None) -> bool:
    """Update a canvas node's properties."""
    if not _db.is_connected():
        return False

    # Build dynamic update query
    updates = []
    values = []

    if title is not None:
        updates.append("title=%s")
        values.append(title)
    if content is not None:
        updates.append("content=%s")
        values.append(content)
    if x is not None:
        updates.append("x=%s")
        values.append(x)
    if y is not None:
        updates.append("y=%s")
        values.append(y)
    if is_processing is not None:
        updates.append("is_processing=%s")
        values.append(is_processing)
    if node_type is not None:
        updates.append("node_type=%s")
        values.append(node_type)

    if not updates:
        return False  # Nothing to update

    updates.append("updated_at=NOW()")
    values.append(node_id)

    try:
        with _db.get_cursor() as cur:
            cur.execute(
                f"UPDATE canvas_nodes SET {', '.join(updates)} WHERE id=%s",
                tuple(values)
            )
            return cur.rowcount > 0
    except Exception as e:
        log.error(f"Failed to update node {node_id}: {e}")
        return False


def delete_node(node_id: str) -> bool:
    """Delete a canvas node and its connections."""
    if not _db.is_connected():
        return False

    try:
        with _db.get_cursor() as cur:
            cur.execute("DELETE FROM canvas_nodes WHERE id=%s", (node_id,))
            return cur.rowcount > 0
    except Exception as e:
        log.error(f"Failed to delete node {node_id}: {e}")
        return False


def create_connection(conn_id: str, source_node_id: str, target_node_id: str,
                     is_streaming: bool = False, color: int = 0x3b82f6,
                     stream_color: int = 0x10b981) -> bool:
    """Create a new canvas connection between two nodes."""
    if not _db.is_connected():
        return False

    # Verify both nodes exist
    source_node = get_node(source_node_id)
    target_node = get_node(target_node_id)
    if not source_node or not target_node:
        log.error("Cannot create connection: source or target node not found")
        return False

    try:
        with _db.get_cursor() as cur:
            cur.execute(
                """
                INSERT INTO canvas_connections (id, source_node_id, target_node_id, is_streaming, color, stream_color)
                VALUES (%s, %s, %s, %s, %s, %s)
                ON CONFLICT (source_node_id, target_node_id) DO UPDATE SET
                    is_streaming=EXCLUDED.is_streaming,
                    color=EXCLUDED.color,
                    stream_color=EXCLUDED.stream_color,
                    updated_at=NOW()
                """,
                (conn_id, source_node_id, target_node_id, is_streaming, color, stream_color)
            )
        return True
    except Exception as e:
        log.error(f"Failed to create connection {conn_id}: {e}")
        return False


def get_connection(conn_id: str) -> Optional[Dict]:
    """Get a single canvas connection by ID."""
    if not _db.is_connected():
        return None

    try:
        with _db.get_cursor(commit=False) as cur:
            cur.execute(
                """
                SELECT id, source_node_id, target_node_id, is_streaming, color, stream_color, created_at, updated_at
                FROM canvas_connections WHERE id=%s
                """,
                (conn_id,)
            )
            row = cur.fetchone()
            return dict(row) if row else None
    except Exception as e:
        log.error(f"Failed to get connection {conn_id}: {e}")
        return None


def get_connection_for_nodes(source_node_id: str, target_node_id: str) -> Optional[Dict]:
    """Get a connection between two specific nodes, if it exists."""
    if not _db.is_connected():
        return None
    try:
        with _db.get_cursor(commit=False) as cur:
            cur.execute(
                """
                SELECT id, source_node_id, target_node_id, is_streaming, color, stream_color, created_at, updated_at
                FROM canvas_connections WHERE source_node_id=%s AND target_node_id=%s
                """,
                (source_node_id, target_node_id)
            )
            row = cur.fetchone()
            return dict(row) if row else None
    except Exception as e:
        log.error(f"Failed to get connection for nodes {source_node_id}->{target_node_id}: {e}")
        return None


def get_all_connections() -> List[Dict]:
    """Get all canvas connections."""
    if not _db.is_connected():
        return []

    try:
        with _db.get_cursor(commit=False) as cur:
            cur.execute(
                """
                SELECT id, source_node_id, target_node_id, is_streaming, color, stream_color, created_at, updated_at
                FROM canvas_connections ORDER BY updated_at DESC
                """
            )
            return [dict(row) for row in cur.fetchall()]
    except Exception as e:
        log.error(f"Failed to get all connections: {e}")
        return []


def get_connections_for_node(node_id: str) -> List[Dict]:
    """Get all connections where the node is either source or target."""
    if not _db.is_connected():
        return []

    try:
        with _db.get_cursor(commit=False) as cur:
            cur.execute(
                """
                SELECT id, source_node_id, target_node_id, is_streaming, color, stream_color, created_at, updated_at
                FROM canvas_connections
                WHERE source_node_id=%s OR target_node_id=%s
                ORDER BY updated_at DESC
                """,
                (node_id, node_id)
            )
            return [dict(row) for row in cur.fetchall()]
    except Exception as e:
        log.error(f"Failed to get connections for node {node_id}: {e}")
        return []


def update_connection(conn_id: str, is_streaming: Optional[bool] = None,
                     color: Optional[int] = None, stream_color: Optional[int] = None) -> bool:
    """Update a canvas connection's properties."""
    if not _db.is_connected():
        return False

    # Build dynamic update query
    updates = []
    values = []

    if is_streaming is not None:
        updates.append("is_streaming=%s")
        values.append(is_streaming)
    if color is not None:
        updates.append("color=%s")
        values.append(color)
    if stream_color is not None:
        updates.append("stream_color=%s")
        values.append(stream_color)

    if not updates:
        return False  # Nothing to update

    updates.append("updated_at=NOW()")
    values.append(conn_id)

    try:
        with _db.get_cursor() as cur:
            cur.execute(
                f"UPDATE canvas_connections SET {', '.join(updates)} WHERE id=%s",
                tuple(values)
            )
            return cur.rowcount > 0
    except Exception as e:
        log.error(f"Failed to update connection {conn_id}: {e}")
        return False


def delete_connection(conn_id: str) -> bool:
    """Delete a canvas connection."""
    if not _db.is_connected():
        return False

    try:
        with _db.get_cursor() as cur:
            cur.execute("DELETE FROM canvas_connections WHERE id=%s", (conn_id,))
            return cur.rowcount > 0
    except Exception as e:
        log.error(f"Failed to delete connection {conn_id}: {e}")
        return False


def get_canvas_state() -> Dict:
    """Get the complete canvas state (nodes and connections)."""
    if not _db.is_connected():
        return {"nodes": [], "connections": []}

    try:
        nodes = get_all_nodes()
        connections = get_all_connections()
        return {
            "nodes": nodes,
            "connections": connections
        }
    except Exception as e:
        log.error(f"Failed to get canvas state: {e}")
        return {"nodes": [], "connections": []}


def save_canvas_state(nodes: List[Dict], connections: List[Dict]) -> bool:
    """Save the complete canvas state, replacing existing data."""
    if not _db.is_connected():
        return False

    try:
        with _db.get_cursor() as cur:
            # Delete existing data
            cur.execute("DELETE FROM canvas_connections")
            cur.execute("DELETE FROM canvas_nodes")

            # Insert nodes
            for node in nodes:
                cur.execute(
                    """
                    INSERT INTO canvas_nodes (id, title, content, x, y, is_processing, node_type)
                    VALUES (%s, %s, %s, %s, %s, %s, %s)
                    """,
                    (
                        node.get("id"),
                        node.get("title", ""),
                        node.get("content", ""),
                        node.get("x", 0),
                        node.get("y", 0),
                        node.get("isProcessing", False),
                        node.get("type", "default")
                    )
                )

            # Insert connections
            for conn in connections:
                cur.execute(
                    """
                    INSERT INTO canvas_connections (id, source_node_id, target_node_id, is_streaming, color, stream_color)
                    VALUES (%s, %s, %s, %s, %s, %s)
                    """,
                    (
                        conn.get("id"),
                        conn.get("sourceNodeId"),
                        conn.get("targetNodeId"),
                        conn.get("isStreaming", False),
                        conn.get("color", 0x3b82f6),
                        conn.get("streamColor", 0x10b981)
                    )
                )

            conn.commit()
        return True
    except Exception as e:
        log.error(f"Failed to save canvas state: {e}")
        return False
