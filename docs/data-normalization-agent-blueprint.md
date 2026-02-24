# Data Normalization + Natural Language Query Agent Blueprint

This blueprint describes how to build an agent that can ingest heterogeneous data, normalize it, store it in a database, and answer natural-language questions over that data.

## 1) Target Capabilities

- Accept data from multiple formats (CSV, JSON, Excel, APIs, PDFs, logs, events).
- Detect structure and map incoming fields to a canonical schema.
- Validate and clean records (types, nulls, formats, duplicate handling).
- Store normalized records in OLTP/analytics storage.
- Support natural-language questions ("show monthly revenue by region").
- Return answers with citations (table/row IDs, query fragments, timestamps).

## 2) Reference Architecture

1. **Ingestion Layer**
   - Connectors: file upload, API pull, stream consumers.
   - Converts raw payloads into a common envelope:
     - `source_id`, `ingestion_timestamp`, `raw_payload`, `content_type`.

2. **Profiling + Schema Inference**
   - Detects columns/fields and data types.
   - Computes quality metrics (null %, distinct count, regex fit, min/max).
   - Produces a candidate schema.

3. **Normalization Engine**
   - Deterministic rules first (rename, cast, trim, dedupe).
   - LLM-assisted mapping when deterministic mapping confidence is low.
   - Uses a canonical model (e.g., `customer`, `order`, `product`, `event`).

4. **Validation and Quality Gate**
   - Mandatory field checks.
   - Data contracts (allowed ranges/enums).
   - Quarantine invalid rows for review.

5. **Storage Layer**
   - Bronze/Silver/Gold pattern:
     - Bronze: raw immutable input.
     - Silver: normalized, validated tables.
     - Gold: query-optimized marts/materialized views.

6. **NL Query Layer**
   - Intent parser + semantic layer (metrics, dimensions, joins).
   - Text-to-SQL with guardrails:
     - schema-aware prompt,
     - query allowlist,
     - cost limits,
     - read-only execution.
   - Result formatter + explanation + provenance.

## 3) Canonical Schema Strategy

- Start with a small, stable core of entities.
- Keep source-specific fields in a `metadata` JSON column to avoid blocking ingestion.
- Track lineage fields:
  - `source_name`, `source_record_id`, `ingested_at`, `normalized_at`, `pipeline_version`.

## 4) Suggested Tech Stack

- **Pipeline orchestration**: Airflow, Dagster, or Temporal.
- **Transformations**: dbt / Spark / Python ETL.
- **Storage**:
  - PostgreSQL (transactional + JSONB), or
  - BigQuery/Snowflake for analytics scale.
- **Vector/NL support**: pgvector, Pinecone, Weaviate (optional for semantic retrieval).
- **Agent runtime**: tool-based orchestration where the LLM plans and tools execute.

## 5) Natural Language Query Flow

1. User question arrives.
2. Agent classifies intent:
   - factual lookup,
   - aggregate analytics,
   - trend comparison,
   - anomaly check.
3. Agent composes semantic query plan.
4. SQL generator uses only approved schema catalog.
5. Query runner executes in read-only mode.
6. Agent returns:
   - short answer,
   - optional chart payload,
   - generated SQL,
   - data freshness + source citation.

## 6) Guardrails and Safety

- Enforce tenant/user-level row access policies.
- Maintain an allowlist for selectable tables/views.
- Reject non-read SQL.
- Cap query runtime and scanned bytes.
- Log each question, SQL, and execution stats for auditing.

## 7) MVP Scope (4-6 weeks)

- Ingest CSV + JSON files.
- Normalize into 3 entities (`customers`, `orders`, `products`).
- Rule-first mapper + fallback LLM mapper for unknown columns.
- PostgreSQL storage with lineage columns.
- NL-to-SQL for top 20 analytics questions.
- Admin review screen for quarantined rows.

## 8) Success Metrics

- Mapping accuracy > 95% on known templates.
- Query correctness > 90% on evaluation set.
- P95 NL query latency < 5 seconds.
- Invalid-row quarantine rate trending down per source.

## 9) Practical Next Steps

1. Define canonical schema and business glossary.
2. Build deterministic normalization rules for top 3 sources.
3. Add confidence scoring + human-in-the-loop approval for low-confidence mappings.
4. Implement read-only NL query executor with SQL audit logs.
5. Create an evaluation dataset of 100 NL questions with expected SQL/answers.
