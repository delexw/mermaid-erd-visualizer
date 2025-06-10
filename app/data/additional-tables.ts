import type { Table } from "~/types/erd";

// Additional tables from the comprehensive mermaid diagram
export const additionalTables: Table[] = [
  {
    id: "commercial_transaction_fulfillment_records",
    name: "commercial_transaction_fulfillment_records",
    modelPath: "app/models/commercial_transaction/fulfillment_record.rb",
    fields: [
      { name: "id", type: "integer", isPrimaryKey: true },
      { name: "document_number", type: "string" },
      { name: "commercial_transaction_id", type: "integer", isForeignKey: true, foreignKeyTarget: "commercial_transaction_records" },
      { name: "fulfilled_at", type: "datetime" },
      { name: "created_at", type: "datetime" },
      { name: "updated_at", type: "datetime" }
    ]
  },
  {
    id: "commercial_transaction_support_offers",
    name: "commercial_transaction_support_offers",
    modelPath: "app/models/commercial_transaction/support_offer.rb",
    fields: [
      { name: "id", type: "integer", isPrimaryKey: true },
      { name: "commercial_transaction_id", type: "integer", isForeignKey: true, foreignKeyTarget: "commercial_transaction_records" },
      { name: "duration", type: "integer" },
      { name: "created_at", type: "datetime" },
      { name: "updated_at", type: "datetime" }
    ]
  },
  {
    id: "commercial_transaction_license_offers",
    name: "commercial_transaction_license_offers",
    modelPath: "app/models/commercial_transaction/license_offer.rb",
    fields: [
      { name: "id", type: "integer", isPrimaryKey: true },
      { name: "commercial_transaction_id", type: "integer", isForeignKey: true, foreignKeyTarget: "commercial_transaction_records" },
      { name: "license_version_id", type: "integer", isForeignKey: true, foreignKeyTarget: "license_versions" },
      { name: "created_at", type: "datetime" },
      { name: "updated_at", type: "datetime" }
    ]
  },
  {
    id: "commercial_transaction_taxes",
    name: "commercial_transaction_taxes",
    modelPath: "app/models/commercial_transaction/tax.rb",
    fields: [
      { name: "id", type: "integer", isPrimaryKey: true },
      { name: "commercial_transaction_id", type: "integer", isForeignKey: true, foreignKeyTarget: "commercial_transaction_records" },
      { name: "name", type: "string" },
      { name: "amount", type: "integer" },
      { name: "created_at", type: "datetime" },
      { name: "updated_at", type: "datetime" }
    ]
  },
  {
    id: "purchase_reversals",
    name: "purchase_reversals",
    modelPath: "app/models/purchase/reversal.rb",
    fields: [
      { name: "id", type: "integer", isPrimaryKey: true },
      { name: "purchase_reversal_authorization_id", type: "integer", isForeignKey: true, foreignKeyTarget: "purchase_reversal_authorizations" },
      { name: "reversal_type", type: "string" },
      { name: "purchase_id", type: "integer", isForeignKey: true, foreignKeyTarget: "purchases" },
      { name: "reversed_at", type: "datetime" },
      { name: "created_at", type: "datetime" }
    ]
  },
  {
    id: "purchase_reversal_authorizations",
    name: "purchase_reversal_authorizations",
    modelPath: "app/models/purchase/reversal_authorization.rb",
    fields: [
      { name: "id", type: "integer", isPrimaryKey: true },
      { name: "authorizing_user_id", type: "integer", isForeignKey: true, foreignKeyTarget: "users" },
      { name: "reason", type: "string" },
      { name: "created_at", type: "datetime" },
      { name: "updated_at", type: "datetime" }
    ]
  },
  {
    id: "purchase_refund_envato_goodwill_events",
    name: "purchase_refund_envato_goodwill_events",
    modelPath: "app/models/purchase/refund/envato_goodwill_event.rb",
    fields: [
      { name: "id", type: "integer", isPrimaryKey: true },
      { name: "authorizing_user_id", type: "integer", isForeignKey: true, foreignKeyTarget: "users" },
      { name: "buyer_id", type: "integer", isForeignKey: true, foreignKeyTarget: "users" },
      { name: "purchase_id", type: "integer", isForeignKey: true, foreignKeyTarget: "purchases" },
      { name: "request_reason", type: "string" },
      { name: "total_refunded_amount", type: "integer" },
      { name: "created_at", type: "datetime" },
      { name: "updated_at", type: "datetime" }
    ]
  },
  {
    id: "purchase_refund_author_envato_shared_events",
    name: "purchase_refund_author_envato_shared_events",
    modelPath: "app/models/purchase/refund/author_envato_shared_event.rb",
    fields: [
      { name: "id", type: "integer", isPrimaryKey: true },
      { name: "authorizing_user_id", type: "integer", isForeignKey: true, foreignKeyTarget: "users" },
      { name: "author_id", type: "integer", isForeignKey: true, foreignKeyTarget: "users" },
      { name: "buyer_id", type: "integer", isForeignKey: true, foreignKeyTarget: "users" },
      { name: "purchase_id", type: "integer", isForeignKey: true, foreignKeyTarget: "purchases" },
      { name: "request_reason", type: "string" },
      { name: "total_refunded_amount", type: "integer" },
      { name: "created_at", type: "datetime" },
      { name: "updated_at", type: "datetime" }
    ]
  },
  {
    id: "purchase_refund_cash_events",
    name: "purchase_refund_cash_events",
    modelPath: "app/models/purchase/refund/cash_event.rb",
    fields: [
      { name: "id", type: "integer", isPrimaryKey: true },
      { name: "authorizing_user_id", type: "integer", isForeignKey: true, foreignKeyTarget: "users" },
      { name: "buyer_id", type: "integer", isForeignKey: true, foreignKeyTarget: "users" },
      { name: "purchase_id", type: "integer", isForeignKey: true, foreignKeyTarget: "purchases" },
      { name: "request_reason", type: "string" },
      { name: "total_refunded_amount", type: "integer" },
      { name: "created_at", type: "datetime" },
      { name: "updated_at", type: "datetime" }
    ]
  },
  {
    id: "purchase_fraudulent_reversals",
    name: "purchase_fraudulent_reversals",
    modelPath: "app/models/purchase/fraudulent_reversal.rb",
    fields: [
      { name: "id", type: "integer", isPrimaryKey: true },
      { name: "purchase_id", type: "integer", isForeignKey: true, foreignKeyTarget: "purchases" },
      { name: "authorizing_user_id", type: "integer", isForeignKey: true, foreignKeyTarget: "users" },
      { name: "reason", type: "string" },
      { name: "created_at", type: "datetime" },
      { name: "updated_at", type: "datetime" },
      { name: "preemptive", type: "boolean" },
      { name: "fraud_type", type: "string" }
    ]
  },
  {
    id: "buying_orders",
    name: "buying_orders",
    modelPath: "app/models/buying/order.rb",
    fields: [
      { name: "id", type: "integer", isPrimaryKey: true },
      { name: "quote_id", type: "integer", isForeignKey: true, foreignKeyTarget: "orders" },
      { name: "user_id", type: "integer", isForeignKey: true, foreignKeyTarget: "users" },
      { name: "saga_id", type: "integer", isForeignKey: true, foreignKeyTarget: "buying_checkouts" },
      { name: "pending_deposit_id", type: "integer", isForeignKey: true, foreignKeyTarget: "pending_deposits" },
      { name: "payment_method", type: "string" },
      { name: "payment_gateway", type: "string" },
      { name: "unique_code", type: "string" },
      { name: "order_number", type: "integer" },
      { name: "site", type: "string" },
      { name: "cost", type: "integer" },
      { name: "created_at", type: "datetime" },
      { name: "updated_at", type: "datetime" }
    ]
  },
  {
    id: "buying_order_fulfillments",
    name: "buying_order_fulfillments",
    modelPath: "app/models/buying/order_fulfillment.rb",
    fields: [
      { name: "id", type: "integer", isPrimaryKey: true },
      { name: "order_id", type: "integer", isForeignKey: true, foreignKeyTarget: "buying_orders" },
      { name: "created_at", type: "datetime" },
      { name: "updated_at", type: "datetime" }
    ]
  },
  {
    id: "item_support_entitlements",
    name: "item_support_entitlements",
    modelPath: "app/models/item_support/entitlement.rb",
    fields: [
      { name: "id", type: "integer", isPrimaryKey: true },
      { name: "purchase_id", type: "integer", isForeignKey: true, foreignKeyTarget: "purchases" },
      { name: "item_id", type: "integer", isForeignKey: true, foreignKeyTarget: "items" },
      { name: "user_id", type: "integer", isForeignKey: true, foreignKeyTarget: "users" },
      { name: "expires_at", type: "datetime" },
      { name: "created_at", type: "datetime" },
      { name: "updated_at", type: "datetime" },
      { name: "extended", type: "boolean" },
      { name: "extended_expires_at", type: "datetime" },
      { name: "duration", type: "integer" },
      { name: "extended_duration", type: "integer" }
    ]
  },
  {
    id: "item_support_grants",
    name: "item_support_grants",
    modelPath: "app/models/item_support/grant.rb",
    fields: [
      { name: "id", type: "integer", isPrimaryKey: true },
      { name: "entitlement_id", type: "integer", isForeignKey: true, foreignKeyTarget: "item_support_entitlements" },
      { name: "grant_id", type: "string" },
      { name: "created_at", type: "datetime" },
      { name: "updated_at", type: "datetime" },
      { name: "duration", type: "integer" },
      { name: "expires_at", type: "datetime" },
      { name: "revoked", type: "boolean" },
      { name: "revoked_at", type: "datetime" },
      { name: "revocation_reason", type: "string" }
    ]
  },
  {
    id: "license_grants",
    name: "license_grants",
    modelPath: "app/models/licensing/license_grant.rb",
    fields: [
      { name: "id", type: "integer", isPrimaryKey: true },
      { name: "purchase_code", type: "string" },
      { name: "license_version_id", type: "integer", isForeignKey: true, foreignKeyTarget: "license_versions" },
      { name: "created_at", type: "datetime" },
      { name: "updated_at", type: "datetime" },
      { name: "revoked", type: "boolean" },
      { name: "revoked_at", type: "datetime" },
      { name: "revocation_reason", type: "string" },
      { name: "revoking_user_id", type: "integer", isForeignKey: true, foreignKeyTarget: "users" }
    ]
  },
  {
    id: "license_revocations",
    name: "license_revocations",
    modelPath: "app/models/licensing/license_revocation.rb",
    fields: [
      { name: "id", type: "integer", isPrimaryKey: true },
      { name: "license_grant_id", type: "integer", isForeignKey: true, foreignKeyTarget: "license_grants" },
      { name: "revoking_user_id", type: "integer", isForeignKey: true, foreignKeyTarget: "users" },
      { name: "reason", type: "string" },
      { name: "created_at", type: "datetime" },
      { name: "updated_at", type: "datetime" }
    ]
  },
  {
    id: "refund_requests",
    name: "refund_requests",
    modelPath: "app/models/refund/refund_request.rb",
    fields: [
      { name: "id", type: "integer", isPrimaryKey: true },
      { name: "purchase_id", type: "integer", isForeignKey: true, foreignKeyTarget: "purchases" },
      { name: "requesting_user_id", type: "integer", isForeignKey: true, foreignKeyTarget: "users" },
      { name: "reason", type: "string" },
      { name: "description", type: "text" },
      { name: "state", type: "string" },
      { name: "created_at", type: "datetime" },
      { name: "updated_at", type: "datetime" },
      { name: "assigned_to_user_id", type: "integer", isForeignKey: true, foreignKeyTarget: "users" },
      { name: "resolved_at", type: "datetime" },
      { name: "resolved_by_user_id", type: "integer", isForeignKey: true, foreignKeyTarget: "users" },
      { name: "resolution", type: "string" },
      { name: "resolution_notes", type: "text" }
    ]
  },
  {
    id: "refund_request_events",
    name: "refund_request_events",
    modelPath: "app/models/refund/refund_request/event.rb",
    fields: [
      { name: "id", type: "integer", isPrimaryKey: true },
      { name: "refund_request_id", type: "integer", isForeignKey: true, foreignKeyTarget: "refund_requests" },
      { name: "user_id", type: "integer", isForeignKey: true, foreignKeyTarget: "users" },
      { name: "event_type", type: "string" },
      { name: "description", type: "text" },
      { name: "created_at", type: "datetime" },
      { name: "updated_at", type: "datetime" },
      { name: "metadata", type: "text" }
    ]
  },
  {
    id: "user_badge_order_preferences",
    name: "user_badge_order_preferences",
    modelPath: "app/models/badges/order_preference.rb",
    fields: [
      { name: "id", type: "integer", isPrimaryKey: true },
      { name: "user_id", type: "integer", isForeignKey: true, foreignKeyTarget: "users" },
      { name: "choices", type: "text" },
      { name: "created_at", type: "datetime" },
      { name: "updated_at", type: "datetime" }
    ]
  },
  {
    id: "user_badges_seen_cache",
    name: "user_badges_seen_cache",
    modelPath: "app/models/badges/user_badges_seen_cache.rb",
    fields: [
      { name: "id", type: "integer", isPrimaryKey: true },
      { name: "user_id", type: "integer", isForeignKey: true, foreignKeyTarget: "users" },
      { name: "serialized_badges", type: "text" }
    ]
  },
  {
    id: "site_stats",
    name: "site_stats",
    modelPath: "app/models/site_stat.rb",
    fields: [
      { name: "id", type: "integer", isPrimaryKey: true },
      { name: "site", type: "string" },
      { name: "stat_name", type: "string" },
      { name: "stat_value", type: "integer" },
      { name: "created_at", type: "datetime" },
      { name: "updated_at", type: "datetime" },
      { name: "period", type: "string" },
      { name: "stat_date", type: "date" }
    ]
  },
  {
    id: "top_author_caches",
    name: "top_author_caches",
    modelPath: "app/models/top_author_cache.rb",
    fields: [
      { name: "id", type: "integer", isPrimaryKey: true },
      { name: "user_id", type: "integer", isForeignKey: true, foreignKeyTarget: "users" },
      { name: "site", type: "string" },
      { name: "category", type: "string" },
      { name: "rank", type: "integer" },
      { name: "sales_count", type: "integer" },
      { name: "average_rating", type: "integer" },
      { name: "created_at", type: "datetime" },
      { name: "updated_at", type: "datetime" },
      { name: "period", type: "string" },
      { name: "cache_date", type: "date" }
    ]
  },
  {
    id: "top_author_accumulation_caches",
    name: "top_author_accumulation_caches",
    modelPath: "app/models/top_author_accumulation_cache.rb",
    fields: [
      { name: "id", type: "integer", isPrimaryKey: true },
      { name: "user_id", type: "integer", isForeignKey: true, foreignKeyTarget: "users" },
      { name: "site", type: "string" },
      { name: "category", type: "string" },
      { name: "total_sales", type: "integer" },
      { name: "total_earnings", type: "integer" },
      { name: "created_at", type: "datetime" },
      { name: "updated_at", type: "datetime" },
      { name: "cache_date", type: "date" }
    ]
  },
  {
    id: "user_featured_items",
    name: "user_featured_items",
    modelPath: "app/models/featured_item.rb",
    fields: [
      { name: "id", type: "integer", isPrimaryKey: true },
      { name: "item_id", type: "integer", isForeignKey: true, foreignKeyTarget: "items" },
      { name: "feature_type", type: "string" },
      { name: "featured_at", type: "datetime" },
      { name: "featured_by_user_id", type: "integer", isForeignKey: true, foreignKeyTarget: "users" },
      { name: "expires_at", type: "datetime" },
      { name: "created_at", type: "datetime" },
      { name: "updated_at", type: "datetime" },
      { name: "site", type: "string" },
      { name: "category", type: "string" },
      { name: "sort_order", type: "integer" }
    ]
  },
  {
    id: "user_exclusive_periods",
    name: "user_exclusive_periods",
    modelPath: "app/models/exclusive_period.rb",
    fields: [
      { name: "id", type: "integer", isPrimaryKey: true },
      { name: "user_id", type: "integer", isForeignKey: true, foreignKeyTarget: "users" },
      { name: "starts_at", type: "datetime" },
      { name: "ends_at", type: "datetime" },
      { name: "created_at", type: "datetime" },
      { name: "updated_at", type: "datetime" },
      { name: "reason", type: "string" },
      { name: "created_by_user_id", type: "integer", isForeignKey: true, foreignKeyTarget: "users" }
    ]
  },
  {
    id: "popular_chart_lines",
    name: "popular_chart_lines",
    modelPath: "app/models/popular_chart_line.rb",
    fields: [
      { name: "id", type: "integer", isPrimaryKey: true },
      { name: "item_id", type: "integer", isForeignKey: true, foreignKeyTarget: "items" },
      { name: "site", type: "string" },
      { name: "category", type: "string" },
      { name: "rank", type: "integer" },
      { name: "created_at", type: "datetime" },
      { name: "updated_at", type: "datetime" },
      { name: "chart_date", type: "date" },
      { name: "period", type: "string" }
    ]
  },
  {
    id: "user_clickthrough_totals",
    name: "user_clickthrough_totals",
    modelPath: "app/models/user_clickthrough_total.rb",
    fields: [
      { name: "id", type: "integer", isPrimaryKey: true },
      { name: "user_id", type: "integer", isForeignKey: true, foreignKeyTarget: "users" },
      { name: "total", type: "integer" },
      { name: "created_at", type: "datetime" },
      { name: "updated_at", type: "datetime" },
      { name: "site", type: "string" },
      { name: "period", type: "string" },
      { name: "total_date", type: "date" }
    ]
  },
  {
    id: "short_download_urls",
    name: "short_download_urls",
    modelPath: "app/models/short_download_url.rb",
    fields: [
      { name: "id", type: "integer", isPrimaryKey: true },
      { name: "purchase_id", type: "integer", isForeignKey: true, foreignKeyTarget: "purchases" },
      { name: "short_code", type: "string" },
      { name: "created_at", type: "datetime" },
      { name: "updated_at", type: "datetime" },
      { name: "expires_at", type: "datetime" },
      { name: "download_count", type: "integer" },
      { name: "max_downloads", type: "integer" }
    ]
  },
  {
    id: "purchase_unique_code_downloads",
    name: "purchase_unique_code_downloads",
    modelPath: "app/models/purchase_unique_code_download.rb",
    fields: [
      { name: "id", type: "integer", isPrimaryKey: true },
      { name: "unique_code", type: "string" },
      { name: "created_at", type: "datetime" },
      { name: "updated_at", type: "datetime" },
      { name: "ip_address", type: "string" },
      { name: "user_agent", type: "string" },
      { name: "user_id", type: "integer", isForeignKey: true, foreignKeyTarget: "users" }
    ]
  },
  {
    id: "item_short_descriptions",
    name: "item_short_descriptions",
    modelPath: "app/models/item_short_description.rb",
    fields: [
      { name: "id", type: "integer", isPrimaryKey: true },
      { name: "item_id", type: "integer", isForeignKey: true, foreignKeyTarget: "items" },
      { name: "description", type: "text" },
      { name: "created_at", type: "datetime" },
      { name: "updated_at", type: "datetime" },
      { name: "language", type: "string" }
    ]
  },
  {
    id: "item_license_prices",
    name: "item_license_prices",
    modelPath: "app/models/item/license_price.rb",
    fields: [
      { name: "id", type: "integer", isPrimaryKey: true },
      { name: "item_id", type: "integer", isForeignKey: true, foreignKeyTarget: "items" },
      { name: "license_type", type: "string" },
      { name: "price", type: "integer" },
      { name: "created_at", type: "datetime" },
      { name: "updated_at", type: "datetime" },
      { name: "currency", type: "string" },
      { name: "active", type: "boolean" }
    ]
  },
  {
    id: "item_url_names",
    name: "item_url_names",
    modelPath: "app/models/item/url_name.rb",
    fields: [
      { name: "id", type: "integer", isPrimaryKey: true },
      { name: "item_id", type: "integer", isForeignKey: true, foreignKeyTarget: "items" },
      { name: "url_name", type: "string" },
      { name: "created_at", type: "datetime" },
      { name: "updated_at", type: "datetime" },
      { name: "active", type: "boolean" }
    ]
  },
  {
    id: "item_legal_takedowns",
    name: "item_legal_takedowns",
    modelPath: "app/models/item/legal_takedown.rb",
    fields: [
      { name: "id", type: "integer", isPrimaryKey: true },
      { name: "item_id", type: "integer", isForeignKey: true, foreignKeyTarget: "items" },
      { name: "takedown_uuid", type: "binary" },
      { name: "created_at", type: "datetime" },
      { name: "updated_at", type: "datetime" }
    ]
  },
  {
    id: "item_download_counters",
    name: "item_download_counters",
    modelPath: "app/models/item/download_counter.rb",
    fields: [
      { name: "id", type: "integer", isPrimaryKey: true },
      { name: "item_id", type: "integer", isForeignKey: true, foreignKeyTarget: "items" },
      { name: "total_downloads", type: "integer" },
      { name: "created_at", type: "datetime" },
      { name: "updated_at", type: "datetime" },
      { name: "counter_date", type: "date" }
    ]
  },
  {
    id: "item_price_change_events",
    name: "item_price_change_events",
    modelPath: "app/models/item/price_change_event.rb",
    fields: [
      { name: "id", type: "integer", isPrimaryKey: true },
      { name: "item_id", type: "integer", isForeignKey: true, foreignKeyTarget: "items" },
      { name: "user_id", type: "integer", isForeignKey: true, foreignKeyTarget: "users" },
      { name: "old_price", type: "integer" },
      { name: "new_price", type: "integer" },
      { name: "license_type", type: "string" },
      { name: "created_at", type: "datetime" },
      { name: "updated_at", type: "datetime" },
      { name: "reason", type: "string" }
    ]
  },
  {
    id: "item_concealments",
    name: "item_concealments",
    modelPath: "app/models/item/concealment.rb",
    fields: [
      { name: "id", type: "integer", isPrimaryKey: true },
      { name: "item_id", type: "integer", isForeignKey: true, foreignKeyTarget: "items" },
      { name: "concealed_by_user_id", type: "integer", isForeignKey: true, foreignKeyTarget: "users" },
      { name: "reason", type: "text" },
      { name: "created_at", type: "datetime" },
      { name: "updated_at", type: "datetime" }
    ]
  },
  {
    id: "item_related_identifiers",
    name: "item_related_identifiers",
    modelPath: "app/models/item/related_identifier.rb",
    fields: [
      { name: "id", type: "bigint", isPrimaryKey: true },
      { name: "item_id", type: "bigint", isForeignKey: true, foreignKeyTarget: "items" },
      { name: "related_identifiers", type: "json" },
      { name: "dam_id", type: "string" }
    ]
  },
  {
    id: "item_author_recommended_collections",
    name: "item_author_recommended_collections",
    modelPath: "app/models/item/author_recommended_collection.rb",
    fields: [
      { name: "id", type: "integer", isPrimaryKey: true },
      { name: "item_id", type: "integer", isForeignKey: true, foreignKeyTarget: "items" },
      { name: "collection_id", type: "integer", isForeignKey: true, foreignKeyTarget: "collections" },
      { name: "created_at", type: "datetime" },
      { name: "updated_at", type: "datetime" }
    ]
  },
  {
    id: "item_license_pending_price_changes",
    name: "item_license_pending_price_changes",
    modelPath: "app/models/item_license_pending_price_change.rb",
    fields: [
      { name: "id", type: "integer", isPrimaryKey: true },
      { name: "item_id", type: "integer", isForeignKey: true, foreignKeyTarget: "items" },
      { name: "license_type", type: "string" },
      { name: "current_price", type: "integer" },
      { name: "new_price", type: "integer" },
      { name: "effective_date", type: "datetime" },
      { name: "created_at", type: "datetime" },
      { name: "updated_at", type: "datetime" },
      { name: "applied", type: "boolean" }
    ]
  },
  {
    id: "item_sources",
    name: "item_sources",
    modelPath: "app/models/item_source.rb",
    fields: [
      { name: "id", type: "integer", isPrimaryKey: true },
      { name: "item_id", type: "integer", isForeignKey: true, foreignKeyTarget: "items" },
      { name: "source_type", type: "string" },
      { name: "source_url", type: "string" },
      { name: "created_at", type: "datetime" },
      { name: "updated_at", type: "datetime" },
      { name: "metadata", type: "text" }
    ]
  },
  {
    id: "attachment_uuids",
    name: "attachment_uuids",
    modelPath: "app/models/attachment_uuid.rb",
    fields: [
      { name: "id", type: "integer", isPrimaryKey: true },
      { name: "attachment_id", type: "integer", isForeignKey: true, foreignKeyTarget: "attachments" },
      { name: "uuid", type: "binary" },
      { name: "created_at", type: "datetime" },
      { name: "updated_at", type: "datetime" }
    ]
  },
  {
    id: "s3_locations",
    name: "s3_locations",
    modelPath: "app/models/s3_location.rb",
    fields: [
      { name: "id", type: "integer", isPrimaryKey: true },
      { name: "bucket", type: "string" },
      { name: "key", type: "string" },
      { name: "created_at", type: "datetime" },
      { name: "updated_at", type: "datetime" },
      { name: "region", type: "string" },
      { name: "storage_class", type: "string" },
      { name: "file_size", type: "integer" }
    ]
  },
  {
    id: "private_free_files",
    name: "private_free_files",
    modelPath: "app/models/private_free_file.rb",
    fields: [
      { name: "id", type: "integer", isPrimaryKey: true },
      { name: "item_id", type: "integer", isForeignKey: true, foreignKeyTarget: "items" },
      { name: "user_id", type: "integer", isForeignKey: true, foreignKeyTarget: "users" },
      { name: "created_at", type: "datetime" },
      { name: "updated_at", type: "datetime" },
      { name: "expires_at", type: "datetime" },
      { name: "active", type: "boolean" }
    ]
  },
  {
    id: "one_off_download_lookups",
    name: "one_off_download_lookups",
    modelPath: "app/models/one_off_download/lookup.rb",
    fields: [
      { name: "id", type: "integer", isPrimaryKey: true },
      { name: "attachment_id", type: "integer", isForeignKey: true, foreignKeyTarget: "attachments" },
      { name: "token", type: "string" },
      { name: "accessed_at", type: "datetime" },
      { name: "created_at", type: "datetime" }
    ]
  },
  {
    id: "nav_ad_sites",
    name: "nav_ad_sites",
    modelPath: "app/models/nav_ad_site.rb",
    fields: [
      { name: "id", type: "integer", isPrimaryKey: true },
      { name: "nav_ad_id", type: "integer", isForeignKey: true, foreignKeyTarget: "nav_ads" },
      { name: "site", type: "string" },
      { name: "created_at", type: "datetime" },
      { name: "updated_at", type: "datetime" }
    ]
  },
  {
    id: "tax_determination_failures",
    name: "tax_determination_failures",
    modelPath: "app/models/tax_determination_failure.rb",
    fields: [
      { name: "id", type: "integer", isPrimaryKey: true },
      { name: "user_id", type: "integer", isForeignKey: true, foreignKeyTarget: "users" },
      { name: "quote_id", type: "integer", isForeignKey: true, foreignKeyTarget: "orders" },
      { name: "error_message", type: "string" },
      { name: "error_details", type: "text" },
      { name: "created_at", type: "datetime" },
      { name: "updated_at", type: "datetime" },
      { name: "tax_service", type: "string" }
    ]
  }
]; 