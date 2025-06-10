import type { ERDData, Table, Relationship } from "~/types/erd";

// Extract tables from the mermaid diagram - comprehensive data from mermaid_diagram.txt
export const tables: Table[] = [
  {
    id: "users",
    name: "users",
    modelPath: "app/models/user.rb",
    fields: [
      { name: "id", type: "integer", isPrimaryKey: true },
      { name: "envato_uuid", type: "binary" },
      { name: "email", type: "string" },
      { name: "username", type: "string" },
      { name: "by_line", type: "string" },
      { name: "lives_in", type: "string" },
      { name: "profile_image_id", type: "integer", isForeignKey: true, foreignKeyTarget: "attachments" },
      { name: "profile", type: "text" },
      { name: "disabled_at", type: "datetime" },
      { name: "disabled_by_user_id", type: "integer", isForeignKey: true, foreignKeyTarget: "users" },
      { name: "reason_for_disabled", type: "text" },
      { name: "created_at", type: "datetime" },
      { name: "updated_at", type: "datetime" },
      { name: "interested_in", type: "string" },
      { name: "referred_by", type: "string" },
      { name: "referred_by_user_id", type: "integer", isForeignKey: true, foreignKeyTarget: "users" },
      { name: "can_withdrawal_earnings", type: "boolean" },
      { name: "sales_count", type: "integer" },
      { name: "average_rating", type: "integer" },
      { name: "profile_image_url", type: "string" },
      { name: "signup_site", type: "string" },
      { name: "exclusive_until", type: "datetime" },
      { name: "purchase_count", type: "integer" },
      { name: "user_clickthrough_id", type: "integer", isForeignKey: true, foreignKeyTarget: "clickthroughs" },
      { name: "failed_signins", type: "integer" },
      { name: "locked_out_until", type: "datetime" },
      { name: "responded_to_author_agreement", type: "boolean" },
      { name: "profile_html_cache", type: "text" },
      { name: "country_code", type: "string" },
      { name: "invoice_to", type: "text" },
      { name: "ratings_count", type: "integer" },
      { name: "flagged_at", type: "datetime" },
      { name: "country_subdivision_code", type: "string" },
      { name: "banned_from_item_comments", type: "boolean" },
      { name: "confirmed_email_at", type: "datetime" }
    ]
  },
  {
    id: "account_sign_ups",
    name: "account_sign_ups",
    modelPath: "app/models/user/account_sign_up.rb",
    fields: [
      { name: "id", type: "integer", isPrimaryKey: true },
      { name: "user_id", type: "integer", isForeignKey: true, foreignKeyTarget: "users" },
      { name: "username", type: "string" },
      { name: "password_hash", type: "string" },
      { name: "password_salt", type: "string" },
      { name: "created_at", type: "datetime" },
      { name: "updated_at", type: "datetime" }
    ]
  },
  {
    id: "items",
    name: "items",
    modelPath: "app/models/item.rb",
    fields: [
      { name: "id", type: "integer", isPrimaryKey: true },
      { name: "user_id", type: "integer", isForeignKey: true, foreignKeyTarget: "users" },
      { name: "name", type: "string" },
      { name: "short_description", type: "string" },
      { name: "description", type: "text" },
      { name: "state", type: "string" },
      { name: "site", type: "string" },
      { name: "root_category", type: "string" },
      { name: "created_at", type: "datetime" },
      { name: "updated_at", type: "datetime" },
      { name: "public_bookmarks_count", type: "integer" },
      { name: "total_downloads", type: "integer" },
      { name: "item_type", type: "string" },
      { name: "concealed", type: "boolean" },
      { name: "concealed_at", type: "datetime" },
      { name: "concealed_by_user_id", type: "integer", isForeignKey: true, foreignKeyTarget: "users" },
      { name: "concealment_reason", type: "text" },
      { name: "exclusive", type: "boolean" },
      { name: "exclusive_until", type: "datetime" },
      { name: "average_rating", type: "integer" },
      { name: "ratings_count", type: "integer" },
      { name: "url_name", type: "string" },
      { name: "featured", type: "boolean" },
      { name: "featured_at", type: "datetime" },
      { name: "featured_by_user_id", type: "integer", isForeignKey: true, foreignKeyTarget: "users" },
      { name: "weekly_featured", type: "boolean" },
      { name: "weekly_featured_at", type: "datetime" },
      { name: "weekly_featured_by_user_id", type: "integer", isForeignKey: true, foreignKeyTarget: "users" },
      { name: "daily_featured", type: "boolean" },
      { name: "daily_featured_at", type: "datetime" },
      { name: "daily_featured_by_user_id", type: "integer", isForeignKey: true, foreignKeyTarget: "users" },
      { name: "free_file", type: "boolean" },
      { name: "free_file_at", type: "datetime" },
      { name: "free_file_by_user_id", type: "integer", isForeignKey: true, foreignKeyTarget: "users" }
    ]
  },
  {
    id: "purchases",
    name: "purchases",
    modelPath: "app/models/purchase.rb",
    fields: [
      { name: "id", type: "integer", isPrimaryKey: true },
      { name: "user_id", type: "integer", isForeignKey: true, foreignKeyTarget: "users" },
      { name: "item_id", type: "integer", isForeignKey: true, foreignKeyTarget: "items" },
      { name: "author_id", type: "integer", isForeignKey: true, foreignKeyTarget: "users" },
      { name: "unique_code", type: "string" },
      { name: "base_amount", type: "integer" },
      { name: "site", type: "string" },
      { name: "created_at", type: "datetime" },
      { name: "updated_at", type: "datetime" },
      { name: "licence", type: "string" },
      { name: "order_entry_id", type: "integer", isForeignKey: true, foreignKeyTarget: "order_entries" },
      { name: "downloadable", type: "boolean" },
      { name: "payment_method", type: "string" },
      { name: "payment_gateway", type: "string" },
      { name: "deposit_id", type: "integer", isForeignKey: true, foreignKeyTarget: "deposits" },
      { name: "envato_entity", type: "string" },
      { name: "support_included", type: "boolean" },
      { name: "support_expires_at", type: "datetime" },
      { name: "support_duration", type: "integer" },
      { name: "extended_support", type: "boolean" },
      { name: "extended_support_expires_at", type: "datetime" },
      { name: "extended_support_duration", type: "integer" }
    ]
  },
  {
    id: "collections",
    name: "collections",
    modelPath: "app/models/collection.rb",
    fields: [
      { name: "id", type: "integer", isPrimaryKey: true },
      { name: "user_id", type: "integer", isForeignKey: true, foreignKeyTarget: "users" },
      { name: "name", type: "string" },
      { name: "description", type: "text" },
      { name: "publically_visible", type: "boolean" },
      { name: "bookmark_count", type: "integer" },
      { name: "special_role", type: "string" },
      { name: "disabled_at", type: "datetime" },
      { name: "created_at", type: "datetime" },
      { name: "updated_at", type: "datetime" },
      { name: "image_file_name", type: "string" },
      { name: "image_content_type", type: "string" },
      { name: "image_file_size", type: "integer" },
      { name: "image_updated_at", type: "datetime" }
    ]
  },
  {
    id: "bookmarks",
    name: "bookmarks",
    modelPath: "app/models/bookmark.rb",
    fields: [
      { name: "id", type: "integer", isPrimaryKey: true },
      { name: "item_id", type: "integer", isForeignKey: true, foreignKeyTarget: "items" },
      { name: "collection_id", type: "integer", isForeignKey: true, foreignKeyTarget: "collections" },
      { name: "description", type: "string" },
      { name: "created_at", type: "datetime" },
      { name: "updated_at", type: "datetime" }
    ]
  },
  {
    id: "item_comments",
    name: "item_comments",
    modelPath: "app/models/comment.rb",
    fields: [
      { name: "id", type: "integer", isPrimaryKey: true },
      { name: "item_id", type: "integer", isForeignKey: true, foreignKeyTarget: "items" },
      { name: "user_id", type: "integer", isForeignKey: true, foreignKeyTarget: "users" },
      { name: "body", type: "text" },
      { name: "created_at", type: "datetime" },
      { name: "updated_at", type: "datetime" },
      { name: "disabled", type: "boolean" },
      { name: "disabled_by_user_id", type: "integer", isForeignKey: true, foreignKeyTarget: "users" },
      { name: "disabled_reason", type: "text" },
      { name: "disabled_at", type: "datetime" },
      { name: "parent_id", type: "integer", isForeignKey: true, foreignKeyTarget: "item_comments" },
      { name: "publicly_visible", type: "boolean" },
      { name: "reviewed", type: "boolean" }
    ]
  },
  {
    id: "item_ratings",
    name: "item_ratings",
    modelPath: "app/models/rating.rb",
    fields: [
      { name: "id", type: "integer", isPrimaryKey: true },
      { name: "user_id", type: "integer", isForeignKey: true, foreignKeyTarget: "users" },
      { name: "item_id", type: "integer", isForeignKey: true, foreignKeyTarget: "items" },
      { name: "rating", type: "integer" },
      { name: "comment", type: "text" },
      { name: "created_at", type: "datetime" },
      { name: "updated_at", type: "datetime" },
      { name: "publicly_visible", type: "boolean" },
      { name: "reviewed", type: "boolean" },
      { name: "disabled_at", type: "datetime" },
      { name: "disabled_by_user_id", type: "integer", isForeignKey: true, foreignKeyTarget: "users" },
      { name: "replaced_by_id", type: "integer", isForeignKey: true, foreignKeyTarget: "item_ratings" }
    ]
  },
  {
    id: "deposits",
    name: "deposits",
    modelPath: "app/models/payment/deposit.rb",
    fields: [
      { name: "id", type: "integer", isPrimaryKey: true },
      { name: "user_id", type: "integer", isForeignKey: true, foreignKeyTarget: "users" },
      { name: "uuid", type: "string" },
      { name: "amount", type: "integer" },
      { name: "bonus", type: "integer" },
      { name: "payment_service", type: "string" },
      { name: "payment_gateway", type: "string" },
      { name: "created_at", type: "datetime" },
      { name: "updated_at", type: "datetime" },
      { name: "country", type: "string" },
      { name: "ip_address", type: "string" },
      { name: "payer_id", type: "string" },
      { name: "transaction_id", type: "string" },
      { name: "envato_entity", type: "string" },
      { name: "reversed", type: "boolean" },
      { name: "reversed_at", type: "datetime" },
      { name: "reversal_reason", type: "string" },
      { name: "referral_awarded_to_user_id", type: "integer", isForeignKey: true, foreignKeyTarget: "users" }
    ]
  },
  {
    id: "tags",
    name: "tags",
    modelPath: "app/models/tag.rb",
    fields: [
      { name: "id", type: "integer", isPrimaryKey: true },
      { name: "name", type: "string" },
      { name: "created_at", type: "datetime" },
      { name: "updated_at", type: "datetime" },
      { name: "group_name", type: "string" },
      { name: "approved", type: "boolean" },
      { name: "approved_by_user_id", type: "integer", isForeignKey: true, foreignKeyTarget: "users" },
      { name: "approved_at", type: "datetime" }
    ]
  },
  {
    id: "items_tags",
    name: "items_tags",
    modelPath: "app/models/item_tag.rb",
    fields: [
      { name: "id", type: "bigint", isPrimaryKey: true },
      { name: "tagable_type", type: "string" },
      { name: "tagable_id", type: "integer", isForeignKey: true, foreignKeyTarget: "items" },
      { name: "tag_id", type: "integer", isForeignKey: true, foreignKeyTarget: "tags" },
      { name: "group", type: "string" }
    ]
  },
  {
    id: "categories",
    name: "categories",
    modelPath: "app/models/category.rb",
    fields: [
      { name: "id", type: "integer", isPrimaryKey: true },
      { name: "name", type: "string" },
      { name: "path", type: "string" },
      { name: "parent_id", type: "integer", isForeignKey: true, foreignKeyTarget: "categories" },
      { name: "created_at", type: "datetime" },
      { name: "updated_at", type: "datetime" },
      { name: "active", type: "boolean" },
      { name: "site", type: "string" },
      { name: "sort_order", type: "integer" },
      { name: "description", type: "string" },
      { name: "meta_title", type: "string" },
      { name: "meta_description", type: "string" },
      { name: "meta_keywords", type: "string" }
    ]
  },
  {
    id: "attachments",
    name: "attachments",
    modelPath: "app/models/attachment.rb",
    fields: [
      { name: "id", type: "integer", isPrimaryKey: true },
      { name: "scope_key", type: "string" },
      { name: "scope_value", type: "integer" },
      { name: "file_name", type: "string" },
      { name: "content_type", type: "string" },
      { name: "file_size", type: "integer" },
      { name: "created_at", type: "datetime" },
      { name: "updated_at", type: "datetime" },
      { name: "storage_key", type: "string" },
      { name: "processed", type: "boolean" },
      { name: "processing_error", type: "string" },
      { name: "metadata", type: "text" }
    ]
  },
  {
    id: "attributes",
    name: "attributes",
    modelPath: "app/models/item_attribute.rb",
    fields: [
      { name: "id", type: "integer", isPrimaryKey: true },
      { name: "item_id", type: "integer", isForeignKey: true, foreignKeyTarget: "items" },
      { name: "name", type: "string" },
      { name: "value", type: "text" },
      { name: "created_at", type: "datetime" },
      { name: "updated_at", type: "datetime" },
      { name: "attribute_type", type: "string" },
      { name: "required", type: "boolean" },
      { name: "sort_order", type: "integer" }
    ]
  },
  {
    id: "orders",
    name: "orders",
    modelPath: "app/models/order.rb",
    fields: [
      { name: "id", type: "integer", isPrimaryKey: true },
      { name: "user_id", type: "integer", isForeignKey: true, foreignKeyTarget: "users" },
      { name: "site", type: "string" },
      { name: "created_at", type: "datetime" },
      { name: "updated_at", type: "datetime" },
      { name: "state", type: "string" },
      { name: "total_amount", type: "integer" },
      { name: "currency", type: "string" },
      { name: "support_only", type: "boolean" },
      { name: "payment_method", type: "string" },
      { name: "payment_gateway", type: "string" },
      { name: "handling_fee_amount", type: "integer" }
    ]
  },
  {
    id: "order_entries",
    name: "order_entries",
    modelPath: "app/models/order_entry.rb",
    fields: [
      { name: "id", type: "integer", isPrimaryKey: true },
      { name: "order_id", type: "integer", isForeignKey: true, foreignKeyTarget: "orders" },
      { name: "item_id", type: "integer", isForeignKey: true, foreignKeyTarget: "items" },
      { name: "licence", type: "string" },
      { name: "amount", type: "integer" },
      { name: "created_at", type: "datetime" },
      { name: "updated_at", type: "datetime" },
      { name: "support_included", type: "boolean" },
      { name: "support_duration", type: "integer" },
      { name: "extended_support", type: "boolean" },
      { name: "extended_support_duration", type: "integer" }
    ]
  },
  {
    id: "item_events",
    name: "item_events",
    modelPath: "app/models/item_event.rb",
    fields: [
      { name: "id", type: "integer", isPrimaryKey: true },
      { name: "name", type: "string" },
      { name: "item_id", type: "integer", isForeignKey: true, foreignKeyTarget: "items" },
      { name: "user_id", type: "integer", isForeignKey: true, foreignKeyTarget: "users" },
      { name: "reason", type: "text" },
      { name: "created_at", type: "datetime" },
      { name: "updated_at", type: "datetime" },
      { name: "automatic", type: "boolean" },
      { name: "type", type: "string" },
      { name: "special_args", type: "text" },
      { name: "item_update_id", type: "integer", isForeignKey: true, foreignKeyTarget: "item_updates" },
      { name: "bulk_proofed", type: "boolean" },
      { name: "event_source", type: "string" }
    ]
  },
  {
    id: "item_updates",
    name: "item_updates",
    modelPath: "app/models/item_update.rb",
    fields: [
      { name: "id", type: "integer", isPrimaryKey: true },
      { name: "item_id", type: "integer", isForeignKey: true, foreignKeyTarget: "items" },
      { name: "name", type: "string" },
      { name: "short_description", type: "string" },
      { name: "description", type: "text" },
      { name: "state", type: "string" },
      { name: "site", type: "string" },
      { name: "root_category", type: "string" },
      { name: "created_at", type: "datetime" },
      { name: "updated_at", type: "datetime" },
      { name: "tags", type: "text" },
      { name: "gpl_version_2", type: "boolean" },
      { name: "gpl_version_3", type: "boolean" },
      { name: "mit_license", type: "boolean" },
      { name: "apache_license", type: "boolean" },
      { name: "bsd_license", type: "boolean" },
      { name: "creative_commons", type: "boolean" },
      { name: "other_open_source", type: "boolean" }
    ]
  },
  {
    id: "item_summaries",
    name: "item_summaries",
    modelPath: "app/models/item_summary.rb",
    fields: [
      { name: "id", type: "integer", isPrimaryKey: true },
      { name: "item_id", type: "integer", isForeignKey: true, foreignKeyTarget: "items" },
      { name: "name", type: "string" },
      { name: "short_description", type: "string" },
      { name: "description", type: "text" },
      { name: "state", type: "string" },
      { name: "site", type: "string" },
      { name: "root_category", type: "string" },
      { name: "created_at", type: "datetime" },
      { name: "updated_at", type: "datetime" },
      { name: "user_id", type: "integer", isForeignKey: true, foreignKeyTarget: "users" },
      { name: "username", type: "string" },
      { name: "by_line", type: "string" },
      { name: "lives_in", type: "string" },
      { name: "average_rating", type: "integer" },
      { name: "ratings_count", type: "integer" },
      { name: "total_downloads", type: "integer" },
      { name: "public_bookmarks_count", type: "integer" },
      { name: "concealed", type: "boolean" },
      { name: "exclusive", type: "boolean" },
      { name: "featured", type: "boolean" },
      { name: "weekly_featured", type: "boolean" },
      { name: "daily_featured", type: "boolean" },
      { name: "free_file", type: "boolean" },
      { name: "url_name", type: "string" },
      { name: "item_type", type: "string" },
      { name: "tags", type: "text" },
      { name: "saleable", type: "boolean" },
      { name: "last_updated_at", type: "datetime" }
    ]
  },
  {
    id: "pending_deposits",
    name: "pending_deposits",
    modelPath: "app/models/payment/pending_deposit.rb",
    fields: [
      { name: "id", type: "integer", isPrimaryKey: true },
      { name: "user_id", type: "integer", isForeignKey: true, foreignKeyTarget: "users" },
      { name: "item_number", type: "string" },
      { name: "amount", type: "integer" },
      { name: "bonus", type: "integer" },
      { name: "complete", type: "boolean" },
      { name: "expires_at", type: "datetime" },
      { name: "created_at", type: "datetime" },
      { name: "updated_at", type: "datetime" },
      { name: "country", type: "string" },
      { name: "ip_address", type: "string" },
      { name: "type", type: "string" },
      { name: "item_id", type: "integer", isForeignKey: true, foreignKeyTarget: "items" },
      { name: "cancelled_at", type: "datetime" },
      { name: "licence", type: "string" },
      { name: "payment_service", type: "string" },
      { name: "payer_id", type: "string" },
      { name: "token", type: "string" },
      { name: "attachment_accessor", type: "string" },
      { name: "retry_count", type: "integer" },
      { name: "retries_disabled", type: "boolean" },
      { name: "envato_entity", type: "string" }
    ]
  },
  {
    id: "payment_messages",
    name: "payment_messages",
    modelPath: "app/models/payment/message.rb",
    fields: [
      { name: "id", type: "integer", isPrimaryKey: true },
      { name: "pending_deposit_id", type: "integer", isForeignKey: true, foreignKeyTarget: "pending_deposits" },
      { name: "deposit_id", type: "integer", isForeignKey: true, foreignKeyTarget: "deposits" },
      { name: "status", type: "string" },
      { name: "transaction_id", type: "string" },
      { name: "params", type: "text" },
      { name: "raw_post", type: "text" },
      { name: "created_at", type: "datetime" },
      { name: "updated_at", type: "datetime" },
      { name: "payment_service", type: "string" },
      { name: "site", type: "string" },
      { name: "type", type: "string" },
      { name: "envato_entity", type: "string" }
    ]
  },
  {
    id: "manual_adjustments",
    name: "manual_adjustments",
    modelPath: "app/models/manual_adjustment.rb",
    fields: [
      { name: "id", type: "integer", isPrimaryKey: true },
      { name: "user_id", type: "integer", isForeignKey: true, foreignKeyTarget: "users" },
      { name: "amount", type: "integer" },
      { name: "reason", type: "string" },
      { name: "type", type: "string" },
      { name: "created_at", type: "datetime" },
      { name: "updated_at", type: "datetime" },
      { name: "admin_user_id", type: "integer", isForeignKey: true, foreignKeyTarget: "users" },
      { name: "reference", type: "string" },
      { name: "processed", type: "boolean" },
      { name: "processed_at", type: "datetime" },
      { name: "processing_error", type: "string" },
      { name: "currency", type: "string" },
      { name: "adjustment_category", type: "string" }
    ]
  },
  {
    id: "commercial_transaction_records",
    name: "commercial_transaction_records",
    modelPath: "app/models/commercial_transaction/record.rb",
    fields: [
      { name: "id", type: "integer", isPrimaryKey: true },
      { name: "type", type: "string" },
      { name: "base_amount", type: "integer" },
      { name: "buyer_amount_including_consumption_tax_collected", type: "integer" },
      { name: "buyer_amount_excluding_consumption_tax_collected", type: "integer" },
      { name: "seller_amount_before_income_tax_collected", type: "integer" },
      { name: "seller_amount_after_income_tax_collected", type: "integer" },
      { name: "created_at", type: "datetime" },
      { name: "updated_at", type: "datetime" },
      { name: "voided_commercial_transaction_id", type: "integer", isForeignKey: true, foreignKeyTarget: "commercial_transaction_records" },
      { name: "currency", type: "string" },
      { name: "tax_jurisdiction", type: "string" },
      { name: "tax_charged", type: "boolean" }
    ]
  },
  {
    id: "carts",
    name: "carts",
    modelPath: "app/models/cart.rb",
    fields: [
      { name: "id", type: "integer", isPrimaryKey: true },
      { name: "user_id", type: "integer", isForeignKey: true, foreignKeyTarget: "users" },
      { name: "site", type: "string" },
      { name: "created_at", type: "datetime" },
      { name: "updated_at", type: "datetime" },
      { name: "session_id", type: "string" },
      { name: "persistent", type: "boolean" }
    ]
  },
  {
    id: "cart_entries",
    name: "cart_entries",
    modelPath: "app/models/cart_entry.rb",
    fields: [
      { name: "id", type: "integer", isPrimaryKey: true },
      { name: "cart_id", type: "integer", isForeignKey: true, foreignKeyTarget: "carts" },
      { name: "item_id", type: "integer", isForeignKey: true, foreignKeyTarget: "items" },
      { name: "licence", type: "string" },
      { name: "created_at", type: "datetime" },
      { name: "updated_at", type: "datetime" },
      { name: "support_included", type: "boolean" },
      { name: "support_duration", type: "integer" },
      { name: "extended_support", type: "boolean" },
      { name: "extended_support_duration", type: "integer" }
    ]
  },
  {
    id: "licenses",
    name: "licenses",
    modelPath: "app/models/licensing/license.rb",
    fields: [
      { name: "id", type: "integer", isPrimaryKey: true },
      { name: "name", type: "string" },
      { name: "description", type: "string" },
      { name: "created_at", type: "datetime" },
      { name: "updated_at", type: "datetime" },
      { name: "active", type: "boolean" },
      { name: "license_type", type: "string" },
      { name: "terms_url", type: "string" },
      { name: "terms_text", type: "text" }
    ]
  },
  {
    id: "license_versions",
    name: "license_versions",
    modelPath: "app/models/licensing/license_version.rb",
    fields: [
      { name: "id", type: "integer", isPrimaryKey: true },
      { name: "license_id", type: "integer", isForeignKey: true, foreignKeyTarget: "licenses" },
      { name: "version", type: "string" },
      { name: "terms", type: "text" },
      { name: "created_at", type: "datetime" },
      { name: "updated_at", type: "datetime" },
      { name: "active", type: "boolean" },
      { name: "effective_from", type: "datetime" },
      { name: "effective_until", type: "datetime" }
    ]
  },
  {
    id: "user_badges",
    name: "user_badges",
    modelPath: "app/models/badges/badge.rb",
    fields: [
      { name: "id", type: "integer", isPrimaryKey: true },
      { name: "user_id", type: "integer", isForeignKey: true, foreignKeyTarget: "users" },
      { name: "name", type: "string" },
      { name: "expires_at", type: "datetime" },
      { name: "created_at", type: "datetime" },
      { name: "updated_at", type: "datetime" }
    ]
  },
  {
    id: "signin_attempts",
    name: "signin_attempts",
    modelPath: "app/models/signin_attempt.rb",
    fields: [
      { name: "id", type: "integer", isPrimaryKey: true },
      { name: "email", type: "string" },
      { name: "ip_address", type: "string" },
      { name: "successful", type: "boolean" },
      { name: "created_at", type: "datetime" },
      { name: "updated_at", type: "datetime" },
      { name: "user_agent", type: "string" },
      { name: "failure_reason", type: "string" },
      { name: "user_id", type: "integer", isForeignKey: true, foreignKeyTarget: "users" }
    ]
  },
  {
    id: "user_history",
    name: "user_history",
    modelPath: "app/models/user/history.rb",
    fields: [
      { name: "id", type: "integer", isPrimaryKey: true },
      { name: "username", type: "string" },
      { name: "user_id", type: "integer", isForeignKey: true, foreignKeyTarget: "users" },
      { name: "created_at", type: "datetime" }
    ]
  },
  {
    id: "share_keys",
    name: "share_keys",
    modelPath: "app/models/share_key.rb",
    fields: [
      { name: "id", type: "integer", isPrimaryKey: true },
      { name: "shareable_type", type: "string" },
      { name: "shareable_id", type: "integer" },
      { name: "key", type: "string" },
      { name: "created_at", type: "datetime" },
      { name: "updated_at", type: "datetime" },
      { name: "expires_at", type: "datetime" },
      { name: "active", type: "boolean" }
    ]
  },
  {
    id: "item_faqs",
    name: "item_faqs",
    modelPath: "app/models/item_faq.rb",
    fields: [
      { name: "id", type: "integer", isPrimaryKey: true },
      { name: "item_id", type: "integer", isForeignKey: true, foreignKeyTarget: "items" },
      { name: "question", type: "string" },
      { name: "answer", type: "text" },
      { name: "created_at", type: "datetime" },
      { name: "updated_at", type: "datetime" },
      { name: "published", type: "boolean" },
      { name: "sort_order", type: "integer" }
    ]
  },
  {
    id: "nav_ads",
    name: "nav_ads",
    modelPath: "app/models/nav_ad.rb",
    fields: [
      { name: "id", type: "integer", isPrimaryKey: true },
      { name: "name", type: "string" },
      { name: "url", type: "string" },
      { name: "image_url", type: "string" },
      { name: "created_at", type: "datetime" },
      { name: "updated_at", type: "datetime" },
      { name: "active", type: "boolean" },
      { name: "starts_at", type: "datetime" },
      { name: "ends_at", type: "datetime" },
      { name: "target_audience", type: "string" }
    ]
  },
  // Additional tables from comprehensive mermaid diagram
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
      { name: "saga_id", type: "integer" },
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
  // Final batch of tables from comprehensive mermaid diagram
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
  }
];

// Comprehensive relationships extracted from the mermaid diagram
export const relationships: Relationship[] = [
  // Core User Relationships
  {
    id: "users_account_sign_ups",
    fromTable: "users",
    toTable: "account_sign_ups",
    type: "one-to-many",
    description: "User has account"
  },
  {
    id: "users_items",
    fromTable: "users",
    toTable: "items",
    type: "one-to-many",
    description: "User authors items"
  },
  {
    id: "users_purchases",
    fromTable: "users",
    toTable: "purchases",
    type: "one-to-many",
    description: "User makes purchases"
  },
  {
    id: "users_collections",
    fromTable: "users",
    toTable: "collections",
    type: "one-to-many",
    description: "User creates collections"
  },
  {
    id: "users_comments",
    fromTable: "users",
    toTable: "item_comments",
    type: "one-to-many",
    description: "User writes comments"
  },
  {
    id: "users_ratings",
    fromTable: "users",
    toTable: "item_ratings",
    type: "one-to-many",
    description: "User gives ratings"
  },
  {
    id: "users_deposits",
    fromTable: "users",
    toTable: "deposits",
    type: "one-to-many",
    description: "User makes deposits"
  },
  {
    id: "users_orders",
    fromTable: "users",
    toTable: "orders",
    type: "one-to-many",
    description: "User places orders"
  },

  // Item Relationships
  {
    id: "items_purchases",
    fromTable: "items",
    toTable: "purchases",
    type: "one-to-many",
    description: "Item is purchased"
  },
  {
    id: "items_bookmarks",
    fromTable: "items",
    toTable: "bookmarks",
    type: "one-to-many",
    description: "Item is bookmarked"
  },
  {
    id: "items_comments",
    fromTable: "items",
    toTable: "item_comments",
    type: "one-to-many",
    description: "Item has comments"
  },
  {
    id: "items_ratings",
    fromTable: "items",
    toTable: "item_ratings",
    type: "one-to-many",
    description: "Item has ratings"
  },
  {
    id: "items_tags",
    fromTable: "items",
    toTable: "items_tags",
    type: "one-to-many",
    description: "Item is tagged with"
  },
  {
    id: "items_attributes",
    fromTable: "items",
    toTable: "attributes",
    type: "one-to-many",
    description: "Item has attributes"
  },
  {
    id: "items_order_entries",
    fromTable: "items",
    toTable: "order_entries",
    type: "one-to-many",
    description: "Item is ordered as"
  },

  // Collection Relationships
  {
    id: "collections_bookmarks",
    fromTable: "collections",
    toTable: "bookmarks",
    type: "one-to-many",
    description: "Collection contains bookmarks"
  },

  // Tag Relationships
  {
    id: "tags_items_tags",
    fromTable: "tags",
    toTable: "items_tags",
    type: "one-to-many",
    description: "Tag is applied to items"
  },
  {
    id: "users_tags",
    fromTable: "users",
    toTable: "tags",
    type: "one-to-many",
    description: "User approves tags"
  },

  // Category Relationships
  {
    id: "categories_subcategories",
    fromTable: "categories",
    toTable: "categories",
    type: "one-to-many",
    description: "Category has subcategories"
  },

  // Order Relationships
  {
    id: "orders_order_entries",
    fromTable: "orders",
    toTable: "order_entries",
    type: "one-to-many",
    description: "Order contains entries"
  },
  {
    id: "order_entries_purchases",
    fromTable: "order_entries",
    toTable: "purchases",
    type: "one-to-many",
    description: "Order entry results in purchase"
  },

  // Payment Relationships
  {
    id: "deposits_purchases",
    fromTable: "deposits",
    toTable: "purchases",
    type: "one-to-many",
    description: "Deposit funds purchases"
  },

  // User Self-Referential Relationships
  {
    id: "users_refers",
    fromTable: "users",
    toTable: "users",
    type: "one-to-many",
    description: "User refers other users"
  },
  {
    id: "users_disables",
    fromTable: "users",
    toTable: "users",
    type: "one-to-many",
    description: "User disables other users"
  },

  // Comment Self-Referential
  {
    id: "comments_replies",
    fromTable: "item_comments",
    toTable: "item_comments",
    type: "one-to-many",
    description: "Comment has replies"
  },

  // Rating Self-Referential
  {
    id: "ratings_replacements",
    fromTable: "item_ratings",
    toTable: "item_ratings",
    type: "one-to-many",
    description: "Rating is replaced by another"
  }
];

export const erdData: ERDData = {
  tables,
  relationships
};

// Mermaid diagram content - complete content from mermaid_diagram.txt
export const mermaidDiagram = ` erDiagram
    users {
        string model_path "app/models/user.rb"
        integer id PK
        binary envato_uuid
        string email
        string username
        string by_line
        string lives_in
        integer profile_image_id "FK->attachments"
        text profile
        datetime disabled_at
        integer disabled_by_user_id "FK->users"
        text reason_for_disabled
        datetime created_at
        datetime updated_at
        string interested_in
        string referred_by
        integer referred_by_user_id "FK->users"
        boolean can_withdrawal_earnings
        integer sales_count
        integer average_rating
        string profile_image_url
        string signup_site
        datetime exclusive_until
        integer purchase_count
        integer user_clickthrough_id "FK->clickthroughs"
        integer failed_signins
        datetime locked_out_until
        boolean responded_to_author_agreement
        text profile_html_cache
        string country_code
        text invoice_to
        integer ratings_count
        datetime flagged_at
        string country_subdivision_code
        boolean banned_from_item_comments
        datetime confirmed_email_at
    }

    account_sign_ups {
        string model_path "app/models/user/account_sign_up.rb"
        integer id PK
        integer user_id "FK->users"
        string username
        string password_hash
        string password_salt
        datetime created_at
        datetime updated_at
    }

    items {
        string model_path "app/models/item.rb"
        integer id PK
        integer user_id "FK->users"
        string name
        string short_description
        text description
        string state
        string site
        string root_category
        datetime created_at
        datetime updated_at
        integer public_bookmarks_count
        integer total_downloads
        string item_type
        boolean concealed
        datetime concealed_at
        integer concealed_by_user_id "FK->users"
        text concealment_reason
        boolean exclusive
        datetime exclusive_until
        integer average_rating
        integer ratings_count
        string url_name
        boolean featured
        datetime featured_at
        integer featured_by_user_id "FK->users"
        boolean weekly_featured
        datetime weekly_featured_at
        integer weekly_featured_by_user_id "FK->users"
        boolean daily_featured
        datetime daily_featured_at
        integer daily_featured_by_user_id "FK->users"
        boolean free_file
        datetime free_file_at
        integer free_file_by_user_id "FK->users"
    }

    purchases {
        string model_path "app/models/purchase.rb"
        integer id PK
        integer user_id "FK->users"
        integer item_id "FK->items"
        integer author_id "FK->users"
        string unique_code
        integer base_amount
        string site
        datetime created_at
        datetime updated_at
        string licence
        integer order_entry_id "FK->order_entries"
        boolean downloadable
        string payment_method
        string payment_gateway
        integer deposit_id "FK->deposits"
        string envato_entity
        boolean support_included
        datetime support_expires_at
        integer support_duration
        boolean extended_support
        datetime extended_support_expires_at
        integer extended_support_duration
    }

    collections {
        string model_path "app/models/collection.rb"
        integer id PK
        integer user_id "FK->users"
        string name
        text description
        boolean publically_visible
        integer bookmark_count
        string special_role
        datetime disabled_at
        datetime created_at
        datetime updated_at
        string image_file_name
        string image_content_type
        integer image_file_size
        datetime image_updated_at
    }

    bookmarks {
        string model_path "app/models/bookmark.rb"
        integer id PK
        integer item_id "FK->items"
        integer collection_id "FK->collections"
        string description
        datetime created_at
        datetime updated_at
    }

    item_comments {
        string model_path "app/models/comment.rb"
        integer id PK
        integer item_id "FK->items"
        integer user_id "FK->users"
        text body
        datetime created_at
        datetime updated_at
        boolean disabled
        integer disabled_by_user_id "FK->users"
        text disabled_reason
        datetime disabled_at
        integer parent_id "FK->item_comments"
        boolean publicly_visible
        boolean reviewed
    }

    item_ratings {
        string model_path "app/models/rating.rb"
        integer id PK
        integer user_id "FK->users"
        integer item_id "FK->items"
        integer rating
        text comment
        datetime created_at
        datetime updated_at
        boolean publicly_visible
        boolean reviewed
        datetime disabled_at
        integer disabled_by_user_id "FK->users"
        integer replaced_by_id "FK->item_ratings"
    }

    tags {
        string model_path "app/models/tag.rb"
        integer id PK
        string name
        datetime created_at
        datetime updated_at
        string group_name
        boolean approved
        integer approved_by_user_id "FK->users"
        datetime approved_at
    }

    items_tags {
        string model_path "app/models/item_tag.rb"
        bigint id PK
        string tagable_type
        integer tagable_id "FK->items_or_item_updates"
        integer tag_id "FK->tags"
        string group
    }

    categories {
        string model_path "app/models/category.rb"
        integer id PK
        string name
        string path
        integer parent_id "FK->categories"
        datetime created_at
        datetime updated_at
        boolean active
        string site
        integer sort_order
        string description
        string meta_title
        string meta_description
        string meta_keywords
    }

    attachments {
        string model_path "app/models/attachment.rb"
        integer id PK
        string scope_key
        integer scope_value
        string file_name
        string content_type
        integer file_size
        datetime created_at
        datetime updated_at
        string storage_key
        boolean processed
        string processing_error
        text metadata
    }

    attributes {
        string model_path "app/models/item_attribute.rb"
        integer id PK
        integer item_id "FK->items"
        string name
        text value
        datetime created_at
        datetime updated_at
        string attribute_type
        boolean required
        integer sort_order
    }

    item_events {
        string model_path "app/models/item_event.rb"
        integer id PK
        string name
        integer item_id "FK->items"
        integer user_id "FK->users"
        text reason
        datetime created_at
        datetime updated_at
        boolean automatic
        string type
        text special_args
        integer item_update_id "FK->item_updates"
        boolean bulk_proofed
        string event_source
    }

    item_updates {
        string model_path "app/models/item_update.rb"
        integer id PK
        integer item_id "FK->items"
        string name
        string short_description
        text description
        string state
        string site
        string root_category
        datetime created_at
        datetime updated_at
        text tags
        boolean gpl_version_2
        boolean gpl_version_3
        boolean mit_license
        boolean apache_license
        boolean bsd_license
        boolean creative_commons
        boolean other_open_source
    }

    item_summaries {
        string model_path "app/models/item_summary.rb"
        integer id PK
        integer item_id "FK->items"
        string name
        string short_description
        text description
        string state
        string site
        string root_category
        datetime created_at
        datetime updated_at
        integer user_id "FK->users"
        string username
        string by_line
        string lives_in
        integer average_rating
        integer ratings_count
        integer total_downloads
        integer public_bookmarks_count
        boolean concealed
        boolean exclusive
        boolean featured
        boolean weekly_featured
        boolean daily_featured
        boolean free_file
        string url_name
        string item_type
        text tags
        boolean saleable
        datetime last_updated_at
    }

    deposits {
        string model_path "app/models/payment/deposit.rb"
        integer id PK
        integer user_id "FK->users"
        string uuid
        integer amount
        integer bonus
        string payment_service
        string payment_gateway
        datetime created_at
        datetime updated_at
        string country
        string ip_address
        string payer_id
        string transaction_id
        string envato_entity
        boolean reversed
        datetime reversed_at
        string reversal_reason
        integer referral_awarded_to_user_id "FK->users"
    }

    pending_deposits {
        string model_path "app/models/payment/pending_deposit.rb"
        integer id PK
        integer user_id "FK->users"
        string item_number
        integer amount
        integer bonus
        boolean complete
        datetime expires_at
        datetime created_at
        datetime updated_at
        string country
        string ip_address
        string type
        integer item_id "FK->items"
        datetime cancelled_at
        string licence
        string payment_service
        string payer_id
        string token
        string attachment_accessor
        integer retry_count
        boolean retries_disabled
        string envato_entity
    }

    payment_messages {
        string model_path "app/models/payment/message.rb"
        integer id PK
        integer pending_deposit_id "FK->pending_deposits"
        integer deposit_id "FK->deposits"
        string status
        string transaction_id
        text params
        text raw_post
        datetime created_at
        datetime updated_at
        string payment_service
        string site
        string type
        string envato_entity
    }

    manual_adjustments {
        string model_path "app/models/manual_adjustment.rb"
        integer id PK
        integer user_id "FK->users"
        integer amount
        string reason
        string type
        datetime created_at
        datetime updated_at
        integer admin_user_id "FK->users"
        string reference
        boolean processed
        datetime processed_at
        string processing_error
        string currency
        string adjustment_category
    }

    commercial_transaction_records {
        string model_path "app/models/commercial_transaction/record.rb"
        integer id PK
        string type
        integer base_amount
        integer buyer_amount_including_consumption_tax_collected
        integer buyer_amount_excluding_consumption_tax_collected
        integer seller_amount_before_income_tax_collected
        integer seller_amount_after_income_tax_collected
        datetime created_at
        datetime updated_at
        integer voided_commercial_transaction_id "FK->commercial_transaction_records"
        string currency
        string tax_jurisdiction
        boolean tax_charged
    }

    commercial_transaction_fulfillment_records {
        string model_path "app/models/commercial_transaction/fulfillment_record.rb"
        integer id PK
        string document_number
        integer commercial_transaction_id "FK->commercial_transaction_records"
        datetime fulfilled_at
        datetime created_at
        datetime updated_at
    }

    commercial_transaction_support_offers {
        string model_path "app/models/commercial_transaction/support_offer.rb"
        integer id PK
        integer commercial_transaction_id "FK->commercial_transaction_records"
        integer duration
        datetime created_at
        datetime updated_at
    }

    commercial_transaction_license_offers {
        string model_path "app/models/commercial_transaction/license_offer.rb"
        integer id PK
        integer commercial_transaction_id "FK->commercial_transaction_records"
        integer license_version_id "FK->license_versions"
        datetime created_at
        datetime updated_at
    }

    commercial_transaction_taxes {
        string model_path "app/models/commercial_transaction/tax.rb"
        integer id PK
        integer commercial_transaction_id "FK->commercial_transaction_records"
        string name
        integer amount
        datetime created_at
        datetime updated_at
    }

    purchase_reversals {
        string model_path "app/models/purchase/reversal.rb"
        integer id PK
        integer purchase_reversal_authorization_id "FK->purchase_reversal_authorizations"
        string reversal_type
        integer purchase_id "FK->purchases"
        datetime reversed_at
        datetime created_at
    }

    purchase_reversal_authorizations {
        string model_path "app/models/purchase/reversal_authorization.rb"
        integer id PK
        integer authorizing_user_id "FK->users"
        string reason
        datetime created_at
        datetime updated_at
    }

    purchase_refund_envato_goodwill_events {
        string model_path "app/models/purchase/refund/envato_goodwill_event.rb"
        integer id PK
        integer authorizing_user_id "FK->users"
        integer buyer_id "FK->users"
        integer purchase_id "FK->purchases"
        string request_reason
        integer total_refunded_amount
        datetime created_at
        datetime updated_at
    }

    purchase_refund_author_envato_shared_events {
        string model_path "app/models/purchase/refund/author_envato_shared_event.rb"
        integer id PK
        integer authorizing_user_id "FK->users"
        integer author_id "FK->users"
        integer buyer_id "FK->users"
        integer purchase_id "FK->purchases"
        string request_reason
        integer total_refunded_amount
        datetime created_at
        datetime updated_at
    }

    purchase_refund_cash_events {
        string model_path "app/models/purchase/refund/cash_event.rb"
        integer id PK
        integer authorizing_user_id "FK->users"
        integer buyer_id "FK->users"
        integer purchase_id "FK->purchases"
        string request_reason
        integer total_refunded_amount
        datetime created_at
        datetime updated_at
    }

    purchase_fraudulent_reversals {
        string model_path "app/models/purchase/fraudulent_reversal.rb"
        integer id PK
        integer purchase_id "FK->purchases"
        integer authorizing_user_id "FK->users"
        string reason
        datetime created_at
        datetime updated_at
        boolean preemptive
        string fraud_type
    }

    buying_orders {
        string model_path "app/models/buying/order.rb"
        integer id PK
        integer quote_id "FK->orders"
        integer user_id "FK->users"
        integer saga_id "FK->buying_checkouts"
        integer pending_deposit_id "FK->pending_deposits"
        string payment_method
        string payment_gateway
        string unique_code
        integer order_number
        string site
        integer cost
        datetime created_at
        datetime updated_at
    }

    buying_order_fulfillments {
        string model_path "app/models/buying/order_fulfillment.rb"
        integer id PK
        integer order_id "FK->buying_orders"
        datetime created_at
        datetime updated_at
    }

    orders {
        string model_path "app/models/order.rb"
        integer id PK
        integer user_id "FK->users"
        string site
        datetime created_at
        datetime updated_at
        string state
        integer total_amount
        string currency
        boolean support_only
        string payment_method
        string payment_gateway
        integer handling_fee_amount
    }

    order_entries {
        string model_path "app/models/order_entry.rb"
        integer id PK
        integer order_id "FK->orders"
        integer item_id "FK->items"
        string licence
        integer amount
        datetime created_at
        datetime updated_at
        boolean support_included
        integer support_duration
        boolean extended_support
        integer extended_support_duration
    }

    carts {
        string model_path "app/models/cart.rb"
        integer id PK
        integer user_id "FK->users"
        string site
        datetime created_at
        datetime updated_at
        string session_id
        boolean persistent
    }

    cart_entries {
        string model_path "app/models/cart_entry.rb"
        integer id PK
        integer cart_id "FK->carts"
        integer item_id "FK->items"
        string licence
        datetime created_at
        datetime updated_at
        boolean support_included
        integer support_duration
        boolean extended_support
        integer extended_support_duration
    }

    item_support_entitlements {
        string model_path "app/models/item_support/entitlement.rb"
        integer id PK
        integer purchase_id "FK->purchases"
        integer item_id "FK->items"
        integer user_id "FK->users"
        datetime expires_at
        datetime created_at
        datetime updated_at
        boolean extended
        datetime extended_expires_at
        integer duration
        integer extended_duration
    }

    item_support_grants {
        string model_path "app/models/item_support/grant.rb"
        integer id PK
        integer entitlement_id "FK->item_support_entitlements"
        string grant_id
        datetime created_at
        datetime updated_at
        integer duration
        datetime expires_at
        boolean revoked
        datetime revoked_at
        string revocation_reason
    }

    licenses {
        string model_path "app/models/licensing/license.rb"
        integer id PK
        string name
        string description
        datetime created_at
        datetime updated_at
        boolean active
        string license_type
        string terms_url
        text terms_text
    }

    license_versions {
        string model_path "app/models/licensing/license_version.rb"
        integer id PK
        integer license_id "FK->licenses"
        string version
        text terms
        datetime created_at
        datetime updated_at
        boolean active
        datetime effective_from
        datetime effective_until
    }

    license_grants {
        string model_path "app/models/licensing/license_grant.rb"
        integer id PK
        string purchase_code
        integer license_version_id "FK->license_versions"
        datetime created_at
        datetime updated_at
        boolean revoked
        datetime revoked_at
        string revocation_reason
        integer revoking_user_id "FK->users"
    }

    license_revocations {
        string model_path "app/models/licensing/license_revocation.rb"
        integer id PK
        integer license_grant_id "FK->license_grants"
        integer revoking_user_id "FK->users"
        string reason
        datetime created_at
        datetime updated_at
    }

    refund_requests {
        string model_path "app/models/refund/refund_request.rb"
        integer id PK
        integer purchase_id "FK->purchases"
        integer requesting_user_id "FK->users"
        string reason
        text description
        string state
        datetime created_at
        datetime updated_at
        integer assigned_to_user_id "FK->users"
        datetime resolved_at
        integer resolved_by_user_id "FK->users"
        string resolution
        text resolution_notes
    }

    refund_request_events {
        string model_path "app/models/refund/refund_request/event.rb"
        integer id PK
        integer refund_request_id "FK->refund_requests"
        integer user_id "FK->users"
        string event_type
        text description
        datetime created_at
        datetime updated_at
        text metadata
    }

    user_badges {
        string model_path "app/models/badges/badge.rb"
        integer id PK
        integer user_id "FK->users"
        string name
        datetime expires_at
        datetime created_at
        datetime updated_at
    }

    user_badge_order_preferences {
        string model_path "app/models/badges/order_preference.rb"
        integer id PK
        integer user_id "FK->users"
        text choices
        datetime created_at
        datetime updated_at
    }

    user_badges_seen_cache {
        string model_path "app/models/badges/user_badges_seen_cache.rb"
        integer id PK
        integer user_id "FK->users"
        text serialized_badges
    }

    site_stats {
        string model_path "app/models/site_stat.rb"
        integer id PK
        string site
        string stat_name
        integer stat_value
        datetime created_at
        datetime updated_at
        string period
        date stat_date
    }

    top_author_caches {
        string model_path "app/models/top_author_cache.rb"
        integer id PK
        integer user_id "FK->users"
        string site
        string category
        integer rank
        integer sales_count
        integer average_rating
        datetime created_at
        datetime updated_at
        string period
        date cache_date
    }

    top_author_accumulation_caches {
        string model_path "app/models/top_author_accumulation_cache.rb"
        integer id PK
        integer user_id "FK->users"
        string site
        string category
        integer total_sales
        integer total_earnings
        datetime created_at
        datetime updated_at
        date cache_date
    }

    user_featured_items {
        string model_path "app/models/featured_item.rb"
        integer id PK
        integer item_id "FK->items"
        string feature_type
        datetime featured_at
        integer featured_by_user_id "FK->users"
        datetime expires_at
        datetime created_at
        datetime updated_at
        string site
        string category
        integer sort_order
    }

    user_exclusive_periods {
        string model_path "app/models/exclusive_period.rb"
        integer id PK
        integer user_id "FK->users"
        datetime starts_at
        datetime ends_at
        datetime created_at
        datetime updated_at
        string reason
        integer created_by_user_id "FK->users"
    }

    popular_chart_lines {
        string model_path "app/models/popular_chart_line.rb"
        integer id PK
        integer item_id "FK->items"
        string site
        string category
        integer rank
        datetime created_at
        datetime updated_at
        date chart_date
        string period
    }

    user_clickthrough_totals {
        string model_path "app/models/user_clickthrough_total.rb"
        integer id PK
        integer user_id "FK->users"
        integer total
        datetime created_at
        datetime updated_at
        string site
        string period
        date total_date
    }

    signin_attempts {
        string model_path "app/models/signin_attempt.rb"
        integer id PK
        string email
        string ip_address
        boolean successful
        datetime created_at
        datetime updated_at
        string user_agent
        string failure_reason
        integer user_id "FK->users"
    }

    user_history {
        string model_path "app/models/user/history.rb"
        integer id PK
        string username
        integer user_id "FK->users"
        datetime created_at
    }



    share_keys {
        string model_path "app/models/share_key.rb"
        integer id PK
        string shareable_type
        integer shareable_id
        string key
        datetime created_at
        datetime updated_at
        datetime expires_at
        boolean active
    }

    short_download_urls {
        string model_path "app/models/short_download_url.rb"
        integer id PK
        integer purchase_id FK
        string short_code
        datetime created_at
        datetime updated_at
        datetime expires_at
        integer download_count
        integer max_downloads
    }

    purchase_unique_code_downloads {
        string model_path "app/models/purchase_unique_code_download.rb"
        integer id PK
        string unique_code
        datetime created_at
        datetime updated_at
        string ip_address
        string user_agent
        integer user_id FK
    }

    item_faqs {
        string model_path "app/models/item_faq.rb"
        integer id PK
        integer item_id FK
        string question
        text answer
        datetime created_at
        datetime updated_at
        boolean published
        integer sort_order
    }

    item_short_descriptions {
        string model_path "app/models/item_short_description.rb"
        integer id PK
        integer item_id FK
        text description
        datetime created_at
        datetime updated_at
        string language
    }

    item_license_prices {
        string model_path "app/models/item/license_price.rb"
        integer id PK
        integer item_id FK
        string license_type
        integer price
        datetime created_at
        datetime updated_at
        string currency
        boolean active
    }

    item_url_names {
        string model_path "app/models/item/url_name.rb"
        integer id PK
        integer item_id FK
        string url_name
        datetime created_at
        datetime updated_at
        boolean active
    }

    item_legal_takedowns {
        string model_path "app/models/item/legal_takedown.rb"
        integer id PK
        integer item_id FK
        binary takedown_uuid
        datetime created_at
        datetime updated_at
    }

    item_download_counters {
        string model_path "app/models/item/download_counter.rb"
        integer id PK
        integer item_id FK
        integer total_downloads
        datetime created_at
        datetime updated_at
        date counter_date
    }

    item_price_change_events {
        string model_path "app/models/item/price_change_event.rb"
        integer id PK
        integer item_id FK
        integer user_id FK
        integer old_price
        integer new_price
        string license_type
        datetime created_at
        datetime updated_at
        string reason
    }

    item_concealments {
        string model_path "app/models/item/concealment.rb"
        integer id PK
        integer item_id FK
        integer concealed_by_user_id FK
        text reason
        datetime created_at
        datetime updated_at
    }

    item_related_identifiers {
        string model_path "app/models/item/related_identifier.rb"
        bigint id PK
        bigint item_id FK
        json related_identifiers
        string dam_id
    }

    item_author_recommended_collections {
        string model_path "app/models/item/author_recommended_collection.rb"
        integer id PK
        integer item_id FK
        integer collection_id FK
        datetime created_at
        datetime updated_at
    }

    item_license_pending_price_changes {
        string model_path "app/models/item_license_pending_price_change.rb"
        integer id PK
        integer item_id FK
        string license_type
        integer current_price
        integer new_price
        datetime effective_date
        datetime created_at
        datetime updated_at
        boolean applied
    }

    item_sources {
        string model_path "app/models/item_source.rb"
        integer id PK
        integer item_id FK
        string source_type
        string source_url
        datetime created_at
        datetime updated_at
        text metadata
    }

    attachment_uuids {
        string model_path "app/models/attachment_uuid.rb"
        integer id PK
        integer attachment_id FK
        binary uuid
        datetime created_at
        datetime updated_at
    }

    s3_locations {
        string model_path "app/models/s3_location.rb"
        integer id PK
        string bucket
        string key
        datetime created_at
        datetime updated_at
        string region
        string storage_class
        integer file_size
    }

    private_free_files {
        string model_path "app/models/private_free_file.rb"
        integer id PK
        integer item_id FK
        integer user_id FK
        datetime created_at
        datetime updated_at
        datetime expires_at
        boolean active
    }

    one_off_download_lookups {
        string model_path "app/models/one_off_download/lookup.rb"
        integer id PK
        integer attachment_id FK
        string token
        datetime accessed_at
        datetime created_at
    }

    nav_ads {
        string model_path "app/models/nav_ad.rb"
        integer id PK
        string name
        string url
        string image_url
        datetime created_at
        datetime updated_at
        boolean active
        datetime starts_at
        datetime ends_at
        string target_audience
    }

    nav_ad_sites {
        string model_path "app/models/nav_ad_site.rb"
        integer id PK
        integer nav_ad_id FK
        string site
        datetime created_at
        datetime updated_at
    }

    tax_determination_failures {
        string model_path "app/models/tax_determination_failure.rb"
        integer id PK
        integer user_id FK
        integer quote_id FK
        string error_message
        text error_details
        datetime created_at
        datetime updated_at
        string tax_service
    }

    %% Core User Relationships
    users ||--o{ account_sign_ups : "has_account"
    users ||--o{ items : "authors"
    users ||--o{ purchases : "buys"
    users ||--o{ collections : "creates"
    users ||--o{ comments : "writes"
    users ||--o{ item_ratings : "rates"
    users ||--o{ signin_attempts : "attempts"
    users ||--o{ user_history : "has_history"
    users ||--o{ manual_adjustments : "receives"
    users ||--o{ deposits : "makes"
    users ||--o{ pending_deposits : "initiates"
    users ||--o{ exclusive_periods : "has"
    users ||--o{ top_author_caches : "ranked_in"
    users ||--o{ user_badges : "earns"
    users ||--o{ user_clickthrough_totals : "tracked_for"
    users ||--o{ top_author_accumulation_caches : "accumulated_in"

    %% User Self-Referential Relationships
    users ||--o{ users : "refers"
    users ||--o{ users : "disables"

    %% Item Relationships
    items ||--o{ purchases : "purchased_as"
    items ||--o{ bookmarks : "bookmarked_as"
    items ||--o{ comments : "commented_on"
    items ||--o{ item_ratings : "rated_as"
    items ||--o{ items_tags : "tagged_with"
    items ||--o{ item_attributes : "has_attributes"
    items ||--o{ item_events : "has_events"
    items ||--o{ item_updates : "has_updates"
    items ||--|| item_summaries : "summarized_as"
    items ||--o{ attachments : "has_attachments"
    items ||--o{ item_faqs : "has_faqs"
    items ||--o{ item_short_descriptions : "has_descriptions"
    items ||--o{ item_license_prices : "has_prices"
    items ||--o{ item_url_names : "has_url_names"
    items ||--o{ item_legal_takedowns : "has_takedowns"
    items ||--o{ item_download_counters : "has_counters"
    items ||--o{ item_price_change_events : "has_price_changes"
    items ||--o{ item_concealments : "has_concealments"
    items ||--o{ item_related_identifiers : "has_identifiers"
    items ||--o{ user_featured_items : "featured_as"
    items ||--o{ popular_chart_lines : "ranked_in"
    items ||--o{ private_free_files : "has_free_files"
    items ||--o{ item_sources : "has_sources"
    items ||--o{ order_entries : "ordered_as"
    items ||--o{ cart_entries : "added_to_cart"
    items ||--o{ item_support_entitlements : "supports"
    items ||--o{ item_author_recommended_collections : "recommended_in"
    items ||--o{ item_license_pending_price_changes : "has_pending_price_changes"

    %% Item Moderation Relationships (consolidated for better rendering)
    users ||--o{ items : "moderates"

    %% Collection Relationships
    collections ||--o{ bookmarks : "contains"
    collections ||--o{ item_author_recommended_collections : "recommended_for"
    collections ||--o{ share_keys : "shared_via"

    %% Bookmark Relationships (removed duplicate - already defined above)

    %% Purchase Relationships (removed duplicate "buys" - already defined above)
    items ||--o{ purchases : "purchased_as"
    users ||--o{ purchases : "authored"
    order_entries ||--o{ purchases : "results_in"
    deposits ||--o{ purchases : "funded_by"
    purchases ||--o{ item_support_entitlements : "includes_support"
    purchases ||--o{ purchase_reversals : "reversed_by"
    purchases ||--o{ purchase_refund_envato_goodwill_events : "refunded_by_envato"
    purchases ||--o{ purchase_refund_author_envato_shared_events : "refunded_shared"
    purchases ||--o{ purchase_refund_cash_events : "refunded_cash"
    purchases ||--o{ purchase_fraudulent_reversals : "reversed_fraud"
    purchases ||--o{ refund_requests : "requested_refund"
    purchases ||--o{ short_download_urls : "downloaded_via"
    purchases ||--o{ purchase_unique_code_downloads : "downloaded_with_code"
    purchases ||--|| license_grants : "grants_license"

    %% Payment Relationships
    users ||--o{ pending_deposits : "initiates"
    items ||--o{ pending_deposits : "purchased_via"
    pending_deposits ||--o{ payment_messages : "processed_via"
    users ||--o{ payment_deposits : "makes"
    users ||--o{ deposits : "referred_for"
    deposits ||--o{ payment_messages : "confirmed_via"
    deposits ||--o{ purchases : "funds"

    %% Manual Adjustment Relationships
    users ||--o{ manual_adjustments : "receives"
    users ||--o{ manual_adjustments : "administered_by"

    %% Order/Cart Relationships
    users ||--o{ orders : "places"
    orders ||--o{ order_entries : "contains"
    items ||--o{ order_entries : "ordered_as"
    order_entries ||--o{ purchases : "results_in"
    orders ||--o{ buying_orders : "quoted_as"
    buying_orders ||--|| buying_order_fulfillments : "fulfilled_by"
    users ||--o{ buying_orders : "places"
    pending_deposits ||--o{ buying_orders : "paid_via"
    users ||--o{ carts : "owns"
    carts ||--o{ cart_entries : "contains"
    items ||--o{ cart_entries : "added_to"

    %% Comment Relationships
    users ||--o{ item_comments : "writes"
    items ||--o{ item_comments : "commented_on"
    users ||--o{ item_comments : "disables"
    item_comments ||--o{ item_comments : "replies_to"

    %% Rating Relationships
    users ||--o{ item_ratings : "rates"
    items ||--o{ item_ratings : "rated_as"
    users ||--o{ item_ratings : "disables"
    item_ratings ||--o{ item_ratings : "replaced_by"

    %% Support Relationships
    purchases ||--o{ item_support_entitlements : "entitled_to"
    items ||--o{ item_support_entitlements : "supports"
    users ||--o{ item_support_entitlements : "entitled_for"
    item_support_entitlements ||--o{ item_support_grants : "grants"

    %% Licensing Relationships
    licenses ||--o{ license_versions : "has_versions"
    license_versions ||--o{ license_grants : "granted_as"
    license_versions ||--o{ commercial_transaction_license_offers : "offered_as"
    license_grants ||--o{ license_revocations : "revoked_by"
    users ||--o{ license_revocations : "revokes"

    %% Tag Relationships
    tags ||--o{ items_tags : "applied_to"
    users ||--o{ tags : "approves"

    %% Category Relationships
    categories ||--o{ categories : "has_subcategories"

    %% Badge Relationships
    users ||--o{ user_badges : "earns"
    users ||--o{ user_badge_order_preferences : "prefers_order"
    users ||--o{ user_badges_seen_cache : "seen_badges"

    %% Commercial Transaction Relationships
    commercial_transaction_records ||--o{ commercial_transaction_fulfillment_records : "fulfilled_by"
    commercial_transaction_records ||--o{ commercial_transaction_support_offers : "offers_support"
    commercial_transaction_records ||--o{ commercial_transaction_license_offers : "offers_license"
    commercial_transaction_records ||--o{ commercial_transaction_taxes : "includes_taxes"
    commercial_transaction_records ||--o{ commercial_transaction_records : "voids"

    %% Refund Relationships
    purchases ||--o{ refund_requests : "requested_for"
    users ||--o{ refund_requests : "requests"
    users ||--o{ refund_requests : "assigned_to"
    users ||--o{ refund_requests : "resolved_by"
    refund_requests ||--o{ refund_request_events : "has_events"
    users ||--o{ refund_request_events : "creates"

    %% Purchase Reversal Relationships
    purchases ||--o{ purchase_reversals : "reversed_as"
    purchase_reversal_authorizations ||--o{ purchase_reversals : "authorizes"
    users ||--o{ purchase_reversal_authorizations : "authorizes"

    %% Additional Relationships
    attachments ||--o{ attachment_uuids : "has_uuids"
    attachments ||--o{ one_off_download_lookups : "downloaded_via"
    nav_ads ||--o{ nav_ad_sites : "targets"
    users ||--o{ tax_determination_failures : "failed_for"
    orders ||--o{ tax_determination_failures : "failed_for"
    users ||--o{ private_free_files : "has_access_to"
    items ||--o{ private_free_files : "has_free_files"
    users ||--o{ purchase_refund_envato_goodwill_events : "authorizes"
    users ||--o{ purchase_refund_envato_goodwill_events : "buyer"
    purchases ||--o{ purchase_refund_envato_goodwill_events : "refunded"
    users ||--o{ purchase_refund_author_envato_shared_events : "authorizes"
    users ||--o{ purchase_refund_author_envato_shared_events : "author"
    users ||--o{ purchase_refund_author_envato_shared_events : "buyer"
    purchases ||--o{ purchase_refund_author_envato_shared_events : "refunded"
    users ||--o{ purchase_refund_cash_events : "authorizes"
    users ||--o{ purchase_refund_cash_events : "buyer"
    purchases ||--o{ purchase_refund_cash_events : "refunded"
    purchases ||--o{ purchase_fraudulent_reversals : "reversed_for_fraud"
    users ||--o{ purchase_fraudulent_reversals : "authorizes"

    %% Item Event Relationships
    items ||--o{ item_events : "has_events"
    users ||--o{ item_events : "creates"
    item_updates ||--o{ item_events : "triggers"

    %% Item Update Relationships
    items ||--o{ item_updates : "updated_by"

    %% Attachment Relationships
    attachments ||--o{ attachment_uuids : "identified_by"
    attachments ||--o{ one_off_download_lookups : "downloaded_via"

    %% Share Key Relationships (polymorphic - removed duplicate)

    %% Download URL Relationships
    purchases ||--o{ short_download_urls : "downloaded_via"
    users ||--o{ purchase_unique_code_downloads : "downloads"

    %% Featured Item Relationships
    items ||--o{ featured_items : "featured_as"
    users ||--o{ featured_items : "featured_by"

    %% Navigation Ad Relationships
    nav_ads ||--o{ nav_ad_sites : "displayed_on"

    %% Site Statistics Relationships
    users ||--o{ site_stats : "tracked_for"
    users ||--o{ top_author_caches : "cached_for"
    users ||--o{ top_author_accumulation_caches : "accumulated_for"
    items ||--o{ popular_chart_lines : "ranked_as"

    %% Authentication Relationships
    users ||--o{ signin_attempts : "attempts"
    users ||--o{ user_history : "has_history"
    users ||--o{ user_two_factor : "secured_by"

    %% Exclusive Period Relationships
    users ||--o{ exclusive_periods : "has_period"
    users ||--o{ exclusive_periods : "created_by"

    %% Tax Determination Relationships
    users ||--o{ tax_determination_failures : "failed_for"

    %% User Clickthrough Relationships
    users ||--o{ user_clickthrough_totals : "tracked_for"
`;
