erDiagram
users {
string model_path "app/models/user.rb"
integer id PK
binary envato_uuid
string email
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
integer user_clickthrough_id "FK->user_clickthroughs"
integer failed_signins
datetime locked_out_until
boolean responded_to_author_agreement
text profile_html_cache
string country_code
text invoice_to
integer ratings_count
datetime flagged_underage_at
datetime approved_underage_at
boolean filter_from_top_authors_list
boolean can_do_photodune_special_imports
string forum_title
string serialized_roles
boolean exclude_from_mss_reports
boolean display_as_staff
string full_name
datetime accepted_terms_at
string first_name
string last_name
datetime confirmed_name_at
datetime confirmed_email_at
boolean banned_from_item_comments
string country_subdivision_code
}

    account_balances {
        string model_path "app/models/account_balance.rb"
        integer id PK
        string account
        string scope
        bigint balance
        datetime created_at
        datetime updated_at
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

    api_keys {
        string model_path "app/models/api_key.rb"
        integer id PK
        integer user_id "FK->users"
        string name
        string api_key
        boolean write_capable
        datetime revoked_at
        datetime created_at
        datetime updated_at
    }

    auth_role_change_log_entries {
        string model_path "app/models/auth/role_change_log_entry.rb"
        integer id PK
        integer user_id "FK->users"
        integer changed_by_user_id "FK->users"
        string serialized_roles_added
        string serialized_roles_removed
        datetime created_at
        datetime updated_at
    }

    auth_sign_in_as_log_entries {
        string model_path "app/models/auth/sign_in_as_log_entry.rb"
        integer id PK
        integer user_id "FK->users"
        integer target_user_id "FK->users"
        string user_agent
        string ip
        string event
        datetime created_at
        datetime updated_at
    }

    adwords_events {
        string model_path "app/models/adwords_event.rb"
        integer id PK
        integer user_id "FK->users"
        string event_type
        integer order_id "FK->orders"
        datetime created_at
        datetime updated_at
    }

    affiliate_referral_audits {
        string model_path "app/models/affiliate_referral_audit.rb"
        integer id PK
        integer user_id "FK->users"
        string signup_domain
        boolean signup_flip_on
        datetime created_at
        datetime updated_at
    }

    affiliate_referral_audits_domains {
        string model_path "app/models/affiliate_referral_audit_domain.rb"
        integer id PK
        integer affiliate_referral_audit_id "FK->affiliate_referral_audits"
        string domain
        string clickthrough_id
        string referring_user
        datetime created_at
        datetime updated_at
    }

    announcements {
        string model_path "app/models/announcement.rb"
        integer id PK
        integer user_id "FK->users"
        text text
        string kind
        string site
        datetime created_at
        datetime updated_at
    }

    announcements_users {
        string model_path "app/models/announcement_user.rb"
        integer id PK
        integer announcement_id "FK->announcements"
        integer user_id "FK->users"
        datetime created_at
        datetime updated_at
    }

    author_fee_invoice_lines {
        string model_path "app/models/author_fee_invoice_line.rb"
        integer id PK
        integer service_fee_invoice_id "FK->service_fee_invoices"
        integer event_id
        string event_type
        integer fee_amount
        decimal fee_rate
        integer total_sale_amount
        integer tax_amount
        decimal tax_rate
        datetime created_at
        datetime updated_at
    }

    billing_details_records {
        string model_path "app/models/billing_details/record.rb"
        integer id PK
        integer user_id "FK->users"
        string token
        string first_name
        string last_name
        string company_name
        string country_code
        string city
        string region
        string zipcode
        boolean vat_number_supplied
        boolean sales_tax_number_supplied
        boolean address_line1_supplied
        string source
        integer submitter_id "FK->users"
        string correlation_id
        integer identity_billing_details_id
        datetime created_at
        datetime updated_at
    }

    buyer_fee_invoices {
        string model_path "app/models/buyer_fee_invoice.rb"
        integer id PK
        integer order_id "FK->orders"
        integer to_user_id "FK->users"
        integer total
        string document_number
        boolean tax_charged
        string payment_method
        string tax_type
        integer from_billing_details_id "FK->billing_details_records"
        integer to_billing_details_id "FK->billing_details_records"
        datetime created_at
        datetime updated_at
    }

    buyer_fee_invoice_lines {
        string model_path "app/models/buyer_fee_invoice_line.rb"
        integer id PK
        integer buyer_fee_invoice_id "FK->buyer_fee_invoices"
        integer order_entry_id "FK->order_entries"
        integer fee_amount
        decimal fee_rate
        integer total_purchase_amount
        integer tax_amount
        decimal tax_rate
        datetime created_at
        datetime updated_at
    }

    fraud_alerts {
        string model_path "app/models/fraud/alert.rb"
        integer id PK
        integer user_id "FK->users"
        string reason
        string action_taken
        string alertable_type
        integer alertable_id "polymorphic_FK"
        datetime created_at
        datetime updated_at
    }

    fraud_order_events {
        string model_path "app/models/fraud/order_event.rb"
        integer id PK
        integer user_id "FK->users"
        integer order_id "FK->orders"
        string ip
        string user_agent
        datetime created_at
        datetime updated_at
    }

    hosted_subscriptions {
        string model_path "app/models/hosted/subscription.rb"
        integer id PK
        integer subscription_id
        integer subscriber_user_id "FK->users"
        integer hosted_item_id "FK->hosted_items"
        string unique_code
        datetime revoked_at
        datetime created_at
        datetime updated_at
    }

    pms {
        string model_path "app/models/pm.rb"
        integer id PK
        integer sender_id "FK->users"
        integer recipient_id "FK->users"
        text message
        string checksum
        string site
        boolean delivered
        datetime created_at
        datetime updated_at
    }

    portfolios {
        string model_path "app/models/portfolio.rb"
        integer id PK
        integer user_id "FK->users"
        string site
        text notes_to_reviewer
        string state
        integer locked_by_id "FK->users"
        datetime locked_at
        datetime submitted_at
        datetime created_at
        datetime updated_at
    }

    request_forensics {
        string model_path "app/models/request_forensic.rb"
        integer id PK
        string log_entry_type
        integer log_entry_id "polymorphic_FK"
        integer user_id "FK->users"
        string ip
        string session_id
        string post_code
        integer city_geoname_id
        integer subdivision_geoname_id
        integer country_geoname_id
        integer continent_geoname_id
        decimal lat
        decimal lng
        integer user_agent_id "FK->request_forensics_user_agents"
        datetime created_at
    }

    notes {
        string model_path "app/models/note.rb"
        integer id PK
        string notable_type
        integer notable_id "polymorphic_FK"
        string title
        text content
        integer author_id "FK->users"
        datetime created_at
        datetime updated_at
    }

    proofing_queue {
        string model_path "app/models/proofing/queue.rb"
        integer id PK
        boolean locked
        integer proofable_id
        string proofable_type
        integer item_id "FK->items"
        integer locked_by_user_id "FK->users"
        integer held_by_user_id "FK->users"
        integer submitting_user_id "FK->users"
        datetime locked_at
        datetime held_at
        string item_type
        string site
        string category
        integer priority
        string held_reason
        boolean ready_for_proofing
        datetime penalised_until
        integer review_id "FK->reviews"
        datetime created_at
    }

    proofing_skill_sets {
        string model_path "app/models/proofing/skill_set.rb"
        integer id PK
        integer user_id "FK->users"
        string site
        string root_category
    }

    service_fee_invoices {
        string model_path "app/models/service_fee_invoice.rb"
        integer id PK
        integer to_user_id "FK->users"
        integer yearmonth
        string document_number
        string tax_type
        integer from_billing_details_id "FK->billing_details_records"
        integer to_billing_details_id "FK->billing_details_records"
        datetime created_at
        datetime updated_at
    }

    user_abilities {
        string model_path "app/models/user/ability.rb"
        integer id PK
        integer user_id "FK->users"
        string name
        string action
        integer authorizing_user_id "FK->users"
        datetime created_at
    }

    user_preferences {
        string model_path "app/models/user/preference.rb"
        integer id PK
        integer user_id "FK->users"
        string default_item_filter
        string facebook
        string linkedin
        string twitter
        string flickr
        string digg
        string myspace
        string deviantart
        string youtube
        string tumblr
        string vimeo
        string dribbble
        string behance
        string lastfm
        string reddit
        string github
        string googleplus
        string tuts
        string soundcloud
        string instagram
        boolean has_social_networks
        boolean registered_with_payoneer
        boolean send_proofing_emails
        boolean send_daily_proofing_digest
        boolean signed_model_release_waiver
        boolean send_item_comment_notifications
        boolean opt_in_to_100_percent_gpl
        boolean available_for_freelance
        boolean agreed_to_google_analytics_terms
        boolean send_buyer_review_notifications
        boolean send_team_comment_notifications
        boolean show_country_badge
        boolean show_background_for_header_avatar
        string google_analytics_tracking_code
        datetime created_at
        datetime updated_at
    }

    user_sessions {
        string model_path "app/models/user/session.rb"
        integer id PK
        binary envato_uuid
        string sso_session_id
        boolean two_factor_used
        datetime expires_on
        datetime refresh_on
        datetime latest_password_reset_by_user_at
        datetime latest_verified_sign_in_by_user_at
        datetime latest_email_update_by_user_at
        datetime latest_password_update_by_user_at
        datetime created_at
        datetime updated_at
    }

    hosted_items {
        string model_path "app/models/hosted/item.rb"
        integer id PK
        integer item_id "FK->items"
        integer vendor_bundle_id
        string description
        string feature_image_url
        boolean visible
        datetime revoked_at
        datetime created_at
        datetime updated_at
    }

    hosted_author_payments {
        string model_path "app/models/hosted/author_payment.rb"
        integer id PK
        integer hosted_subscription_id "FK->hosted_subscriptions"
        integer hosted_item_id "FK->hosted_items"
        string payment_type
        integer user_earnings
        datetime created_at
    }

    hosted_license_grants {
        string model_path "app/models/hosted/license_grant.rb"
        integer id PK
        integer hosted_subscription_id "FK->hosted_subscriptions"
        integer licensee_id "FK->users"
        integer item_id "FK->items"
        string unique_code
        datetime issued_at
        datetime conditional_period_ended_at
        datetime created_at
    }

    hosted_license_revocations {
        string model_path "app/models/hosted/license_revocation.rb"
        integer id PK
        integer license_grant_id "FK->hosted_license_grants"
        datetime revoked_at
        datetime created_at
    }

    hosted_service_proceeds_invoices {
        string model_path "app/models/hosted/service_proceeds_invoice.rb"
        integer id PK
        integer from_user_id "FK->users"
        integer yearmonth
        string document_number
        integer from_billing_details_id "FK->billing_details_records"
        integer to_billing_details_id "FK->billing_details_records"
        datetime created_at
        datetime updated_at
    }

    hosted_service_proceeds_invoice_lines {
        string model_path "app/models/hosted/service_proceeds_invoice_line.rb"
        integer id PK
        integer hosted_service_proceeds_invoice_id "FK->hosted_service_proceeds_invoices"
        integer hosted_item_id "FK->hosted_items"
        string description
        integer number_of_subscriptions
        integer amount_per_subscription
        integer amount
        datetime from_date
        datetime to_date
    }

    hosted_distributor_license_author_fee_invoice_lines {
        string model_path "app/models/hosted/distributor_license_author_fee_invoice_line.rb"
        integer id PK
        integer service_fee_invoice_id "FK->service_fee_invoices"
        integer event_id
        string event_type
        integer fee_amount
        decimal fee_rate
        integer total_sale_amount
        integer tax_amount
        decimal tax_rate
        datetime created_at
        datetime updated_at
    }

    hosted_theme_service_proceeds_summaries {
        string model_path "app/models/hosted/theme_service_proceeds_summary.rb"
        integer id PK
        integer hosted_author_payment_id "FK->hosted_author_payments"
        integer theme_id "FK->items"
        date from_date
        date to_date
        integer amount_per_subscription
        integer number_of_subscriptions
        datetime created_at
    }

    hosted_item_update_notifications_subscriptions {
        string model_path "app/models/hosted/item_update_notifications_subscription.rb"
        integer id PK
        integer item_id "FK->items"
        integer subscriber_id "FK->users"
    }

    earning_summaries {
        string model_path "app/models/earning_summary.rb"
        bigint id PK
        binary external_id
        integer user_id "FK->users"
        integer after_tax_amount_cents
        string revenue_month
        datetime created_at
        datetime updated_at
    }

    eu_vat_rates {
        string model_path "app/models/eu_vat_rate.rb"
        integer id PK
        string country_code
        decimal rate
        datetime active_from
        datetime created_at
        datetime updated_at
    }

    us_state_tax_rates {
        string model_path "app/models/us_state_tax_rate.rb"
        integer id PK
        integer user_id "FK->users"
        string state_code
        decimal rate
        datetime active_from
        datetime active_to
        datetime created_at
        datetime updated_at
    }

    tax_determinations {
        string model_path "app/models/tax_determination.rb"
        bigint id PK
        bigint quote_id "FK->orders"
        bigint user_id "FK->users"
        string provider
        string external_id
        datetime created_at
        datetime updated_at
    }

    performing_rights_organizations {
        string model_path "app/models/performing_rights_organization.rb"
        integer id PK
        string name
        datetime created_at
        datetime updated_at
    }

    lines {
        string model_path "app/models/line.rb"
        integer id PK
        string account
        string scope
        string code
        integer amount
        bigint balance
        integer partner_id
        string partner_account
        string partner_scope
        integer detail_id
        string detail_type
        datetime created_at
        datetime updated_at
    }

    line_checks {
        string model_path "app/models/line_check.rb"
        integer id PK
        integer last_line_id "FK->lines"
        boolean errors_found
        text log
        datetime created_at
        datetime updated_at
    }

    line_metadata {
        string model_path "app/models/line_metadata.rb"
        integer id PK
        integer line_id "FK->lines"
        string key
        string value
        datetime created_at
        datetime updated_at
    }

    statement_lines {
        string model_path "app/models/statement_line.rb"
        integer id PK
        integer user_id "FK->users"
        integer amount
        string line_type
        string detail
        string trigger_event_type
        integer trigger_event_id
        integer item_price
        integer item_id "FK->items"
        datetime created_at
        datetime updated_at
    }

    statement_line_taxes {
        string model_path "app/models/statement_line_tax.rb"
        integer id PK
        integer statement_line_id "FK->statement_lines"
        string name
        integer amount
        datetime created_at
        datetime updated_at
    }

    buyer_fee_credit_notes {
        string model_path "app/models/buyer_fee_credit_note.rb"
        integer id PK
        integer buyer_fee_invoice_id "FK->buyer_fee_invoices"
        string invoice_document_number
        integer order_id "FK->orders"
        integer to_user_id "FK->users"
        integer total
        string document_number
        boolean tax_charged
        string tax_type
        integer from_billing_details_id "FK->billing_details_records"
        integer to_billing_details_id "FK->billing_details_records"
        datetime created_at
        datetime updated_at
    }

    buyer_fee_credit_note_lines {
        string model_path "app/models/buyer_fee_credit_note_line.rb"
        integer id PK
        integer buyer_fee_credit_note_id "FK->buyer_fee_credit_notes"
        integer quantity
        string description
        integer amount
        datetime created_at
        datetime updated_at
    }

    goodwill_refund_credit_notes {
        string model_path "app/models/goodwill_refund_credit_note.rb"
        integer id PK
        integer item_purchase_invoice_id "FK->item_purchase_invoices"
        string invoice_document_number
        integer to_user_id "FK->users"
        integer order_id "FK->orders"
        integer total
        string document_number
        boolean tax_charged
        string tax_type
        integer from_billing_details_id "FK->billing_details_records"
        integer to_billing_details_id "FK->billing_details_records"
        datetime created_at
        datetime updated_at
    }

    goodwill_refund_credit_note_lines {
        string model_path "app/models/goodwill_refund_credit_note_line.rb"
        integer id PK
        integer goodwill_refund_credit_note_id "FK->goodwill_refund_credit_notes"
        integer quantity
        integer item_id "FK->items"
        string description
        integer amount
        datetime created_at
        datetime updated_at
    }

    handling_fee_invoices {
        string model_path "app/models/handling_fee_invoice.rb"
        integer id PK
        integer order_id "FK->orders"
        integer to_user_id "FK->users"
        string document_number
        boolean tax_charged
        string payment_method
        string tax_type
        integer total
        integer from_billing_details_id "FK->billing_details_records"
        integer to_billing_details_id "FK->billing_details_records"
        datetime created_at
        datetime updated_at
    }

    handling_fee_invoice_lines {
        string model_path "app/models/handling_fee_invoice_line.rb"
        integer id PK
        integer handling_fee_invoice_id "FK->handling_fee_invoices"
        integer quantity
        string description
        integer amount
    }

    item_purchase_invoices {
        string model_path "app/models/item_purchase_invoice.rb"
        integer id PK
        integer to_user_id "FK->users"
        integer from_user_id "FK->users"
        string from_username
        integer order_id "FK->orders"
        string document_number
        boolean tax_charged
        integer total
        integer from_billing_details_id "FK->billing_details_records"
        integer to_billing_details_id "FK->billing_details_records"
        datetime created_at
        datetime updated_at
    }

    item_purchase_invoice_lines {
        string model_path "app/models/item_purchase_invoice_line.rb"
        integer id PK
        integer item_purchase_invoice_id "FK->item_purchase_invoices"
        integer item_id "FK->items"
        string entity
        integer quantity
        integer amount
        string description
        datetime created_at
        datetime updated_at
    }

    item_purchase_credit_notes {
        string model_path "app/models/item_purchase_credit_note.rb"
        integer id PK
        integer invoice_id "FK->item_purchase_invoices"
        string invoice_document_number
        integer to_user_id "FK->users"
        integer from_user_id "FK->users"
        string from_username
        integer order_id "FK->orders"
        string document_number
        boolean tax_charged
        integer total
        integer from_billing_details_id "FK->billing_details_records"
        integer to_billing_details_id "FK->billing_details_records"
        integer from_fin_doc_settings_id
        integer supplier_of_vat_billing_details_id "FK->billing_details_records"
        integer supplier_of_gst_billing_details_id "FK->billing_details_records"
        datetime created_at
        datetime updated_at
    }

    item_purchase_credit_note_lines {
        string model_path "app/models/item_purchase_credit_note_line.rb"
        integer id PK
        integer item_purchase_credit_note_id "FK->item_purchase_credit_notes"
        integer item_id "FK->items"
        string entity
        integer quantity
        integer amount
        string description
        datetime created_at
        datetime updated_at
    }

    user_flags {
        string model_path "app/models/user/flag.rb"
        integer id PK
        integer user_id "FK->users"
        string name
        boolean value
        integer authorizing_user_id "FK->users"
        datetime created_at
    }

    user_leaves {
        string model_path "app/models/user/leave.rb"
        integer id PK
        integer user_id "FK->users"
        datetime starts_at
        datetime ends_at
        boolean active
        datetime created_at
        datetime updated_at
    }

    user_following_summaries {
        string model_path "app/models/user/following_summary.rb"
        integer id PK
        integer user_id "FK->users"
        integer followers_count
        integer followed_authors_count
        datetime created_at
        datetime updated_at
    }

    user_email_settings {
        string model_path "app/models/user/email_setting.rb"
        integer id PK
        integer user_id "FK->users"
        string email_type
        boolean enabled
    }

    item_bundles {
        string model_path "app/models/item/bundle.rb"
        integer id PK
        integer item_id "FK->items"
        integer item_count
        datetime created_at
        datetime updated_at
    }

    author_follows {
        string model_path "app/models/author_follow.rb"
        integer id PK
        integer user_id "FK->users"
        integer author_id "FK->users"
        datetime created_at
        datetime updated_at
    }

    braintree_customer_records {
        string model_path "app/models/braintree_customer_record.rb"
        integer id PK
        integer user_id "FK->users"
        string customer_id
        datetime created_at
        datetime updated_at
    }

    paypal_billing_details {
        string model_path "app/models/paypal_billing_detail.rb"
        integer id PK
        integer user_id "FK->users"
        string invoice_number
        string first_name
        string last_name
        string country
        datetime created_at
        datetime updated_at
    }

    item_key_features {
        string model_path "app/models/item/key_feature.rb"
        integer id PK
        integer item_id "FK->items"
        string body
        datetime created_at
        datetime updated_at
    }

    weekly_features {
        string model_path "app/models/weekly_feature.rb"
        integer id PK
        integer author_id "FK->users"
        string title
        text description
        datetime created_at
        datetime updated_at
    }

    soi__indexing__version_sequences {
        string model_path "app/models/soi/indexing/version_sequence.rb"
        integer id PK
    }

    soi__indexing__versions {
        string model_path "app/models/soi/indexing/version.rb"
        integer id PK
        string reference_name
        integer reference_id
        integer version
    }

    soi__quality_score__grading_buckets {
        string model_path "app/models/soi/quality_score/grading_bucket.rb"
        integer id PK
        string score_name
        string segment_name
        integer bucket_0_max
        integer bucket_1_max
        integer bucket_2_max
        integer bucket_3_max
        integer bucket_4_max
        integer bucket_5_max
        integer bucket_6_max
        integer bucket_7_max
        integer bucket_8_max
        integer bucket_9_max
        integer total_size
        datetime last_quartile_cutoff_date
        datetime created_at
        datetime updated_at
    }

    soi__quality_score__summaries {
        string model_path "app/models/soi/quality_score/summary.rb"
        integer id PK
        integer item_id "FK->items"
        decimal favourites_score
        decimal private_collections_score
        datetime reduced_at
        integer manual_adjustment
        integer featured
    }

    soi__trending__daily_trends {
        string model_path "app/models/soi/trending/daily_trend.rb"
        integer id PK
        integer item_id "FK->items"
        string site
        datetime day
        float strength
    }

    soi__trending__events {
        string model_path "app/models/soi/trending/event.rb"
        integer id PK
        integer item_id "FK->items"
        integer user_id "FK->users"
        string site
        string event
        float weight
        datetime created_at
    }

    soi__trending__score_summaries {
        string model_path "app/models/soi/trending/score_summary.rb"
        integer id PK
        integer item_id "FK->items"
        float current_score
        float previous_score
    }

    sales_distribution_data {
        string model_path "app/models/sales_distribution_datum.rb"
        integer id PK
        integer user_id "FK->users"
        integer event_id
        string event_type
        datetime event_date
        string earning_type
        string buyer_country_code
        integer amount
        datetime created_at
    }

    sales_segmentation_data {
        string model_path "app/models/sales_segmentation_datum.rb"
        integer id PK
        integer author_id "FK->users"
        integer order_entry_id "FK->order_entries"
        integer purchase_id "FK->purchases"
        integer item_purchase_earnings_amount
        integer support_bundle_earnings_amount
        integer support_upgrade_earnings_amount
        string buyer_country_code
        boolean negated
        datetime sale_date
        datetime created_at
        datetime updated_at
    }

    message_tracking {
        string model_path "app/models/message_tracking.rb"
        integer id PK
        integer trackable_id
        string trackable_type
        integer user_id "FK->users"
        text diff
        datetime created_at
        datetime updated_at
    }

    credit_expiry_events {
        string model_path "app/models/credit_expiry/event.rb"
        integer id PK
        integer user_id "FK->users"
        integer amount
        datetime created_at
    }

    credit_extinguish_events {
        string model_path "app/models/credit_extinguish_event.rb"
        integer id PK
        integer user_id "FK->users"
        integer amount
        integer expiry_event_id "FK->credit_expiry_events"
        datetime created_at
    }

    delegations {
        string model_path "app/models/delegation.rb"
        integer id PK
        integer delegator_id "FK->users"
        integer delegatee_id "FK->users"
        string action
        datetime created_at
        datetime updated_at
    }

    complaints {
        string model_path "app/models/complaint.rb"
        integer id PK
        integer reported_by_id "FK->users"
        integer processed_by_id "FK->users"
        string complainable_type
        integer complainable_id
        string state
        text reason
        integer num_times_skipped
        datetime processed_at
        datetime created_at
        datetime updated_at
    }

    submission_limit_exemptions {
        string model_path "app/models/submission_limit_exemption.rb"
        integer id PK
        integer author_id "FK->users"
        string root_category_path
        string site_key
    }

    delegations_log_entries {
        string model_path "app/models/delegation_log_entry.rb"
        integer id PK
        integer delegator_id "FK->users"
        integer delegatee_id "FK->users"
        integer by_id "FK->users"
        string action
        boolean active
        datetime created_at
        datetime updated_at
    }

    completed_author_trials {
        string model_path "app/models/completed_author_trial.rb"
        integer id PK
        integer user_id "FK->users"
        string site
        string type
        datetime created_at
        datetime updated_at
    }

    author_driven_pricing_conversion_states {
        string model_path "app/models/author_driven_pricing_conversion_state.rb"
        integer id PK
        string site
        string root_category
        string state
        datetime created_at
        datetime updated_at
    }

    item_review_stats {
        string model_path "app/models/item_review_stat.rb"
        integer id PK
        integer item_id "FK->items"
        integer item_event_id "FK->item_events"
        integer author_id "FK->users"
        integer reviewer_id "FK->users"
        datetime submission_time
        datetime review_start_time
        datetime review_finish_time
        integer queue_duration
        integer review_duration
        string site
        string item_type
        string root_category
        string category
        string old_state
        string new_state
        string event_type
        boolean bulk_proofed
        text note
        integer priority
        datetime penalised_until
        string event_source
    }

    item_rating_author_replies {
        string model_path "app/models/item_rating_author_reply.rb"
        integer id PK
        integer item_rating_id "FK->item_ratings"
        integer user_id "FK->users"
        text content
        datetime created_at
    }

    pricing_default_photo_prices {
        string model_path "app/models/pricing_default_photo_price.rb"
        integer id PK
        integer user_id "FK->users"
        integer license_id "FK->licenses"
        integer price
        datetime created_at
        datetime updated_at
    }

    paypal_express_checkouts {
        string model_path "app/models/paypal_express_checkout.rb"
        integer id PK
        integer pending_deposit_id "FK->pending_deposits"
        string status
        string checkout_status
        string email
        string payer_id
        string payer_status
        string country_code
        string error_message
        string error_explanation
        string error_code
        string severity_code
        string acknowledgement_status
        string dec_payment_status
        string dec_error_short_message
        string dec_error_long_message
        string dec_error_code
        string dec_severity_code
        string dec_ack
        datetime created_at
        datetime updated_at
    }

    paypal_ipn_messages {
        string model_path "app/models/paypal_ipn_message.rb"
        integer id PK
        string txn_id
        string transaction_subject
        string parent_txn_id
        string txn_type
        string payment_status
        string reason_code
        string receipt_id
        string payer_id
        string payer_email
        string receiver_id
        integer mc_gross
        integer mc_fee
        datetime payment_date
        integer duplicate_of_paypal_ipn_message_id "FK->paypal_ipn_messages"
        datetime created_at
        datetime updated_at
    }

    user_country_residence_updates {
        string model_path "app/models/user/country_residence_update.rb"
        integer id PK
        integer user_id "FK->users"
        string old_country_code
        string new_country_code
        datetime created_at
    }

    user_deposit_limit_override_events {
        string model_path "app/models/user/deposit_limit_override_event.rb"
        integer id PK
        integer user_id "FK->users"
        integer authorizing_user_id "FK->users"
        string action
        string reason
        string help_ticket_reference
        integer amount
        datetime created_at
    }

    user_item_support_preferences {
        string model_path "app/models/user/item_support_preference.rb"
        integer id PK
        integer user_id "FK->users"
        string type_of_support_offered
        string support_email
        string support_url
        text support_policy
        text support_policy_html_cache
        string response_time
        datetime created_at
        datetime updated_at
    }

    user_item_support_preference_log_entries {
        string model_path "app/models/user/item_support_preference_log_entry.rb"
        integer id PK
        integer user_id "FK->users"
        string action
        text changes
        datetime created_at
    }

    item_uuids {
        string model_path "app/models/item/uuid.rb"
        integer id PK
        binary uuid
        integer item_id "FK->items"
        datetime created_at
        datetime updated_at
    }

    item_version_uuids {
        string model_path "app/models/item/version_uuid.rb"
        integer id PK
        binary uuid
        integer item_update_id "FK->item_updates"
        datetime created_at
        datetime updated_at
    }

    item_warehouse_job_statuses {
        string model_path "app/models/item_warehouse_job_status.rb"
        integer id PK
        string use_case
        string status
        string error_messages
        binary subject_uuid
        string subject_type
        string item_warehouse_host
        datetime created_at
        datetime updated_at
    }

    studio_promotion_services {
        string model_path "app/models/studio_promotion/service.rb"
        integer id PK
        integer service_id
        string site
        string name
        integer price
        string url
    }

    studio_promotion_generations {
        string model_path "app/models/studio_promotion/generation.rb"
        integer id PK
        integer generation
        string species
        datetime created_at
        datetime updated_at
    }

    studio_promotion_chromosomes {
        string model_path "app/models/studio_promotion/chromosome.rb"
        integer id PK
        string site
        integer generation
        string chromosome
    }

    fraud_sign_ins {
        string model_path "app/models/fraud/sign_in.rb"
        integer id PK
        integer user_id "FK->users"
        string ip_address
        string user_agent
        string detection_method
        datetime created_at
    }

    preemptive_fraud_refund_events {
        string model_path "app/models/preemptive_fraud_refund_event.rb"
        integer id PK
        integer purchase_id "FK->purchases"
        integer authorizing_user_id "FK->users"
        string reason
        integer refunded_amount
        datetime created_at
    }

    preemptive_fraud_refund_purchase_reversals {
        string model_path "app/models/preemptive_fraud_refund_purchase_reversal.rb"
        integer id PK
        integer preemptive_fraud_refund_event_id "FK->preemptive_fraud_refund_events"
        integer purchase_reversal_id "FK->purchase_reversals"
        datetime created_at
    }

    referral_commission_fraud_reversals {
        string model_path "app/models/referral_commission_fraud_reversal.rb"
        integer id PK
        integer user_id "FK->users"
        integer authorizing_user_id "FK->users"
        integer reversed_commission_amount
        string reason
        datetime created_at
    }

    bi_purchases {
        string model_path "app/models/bi_purchase.rb"
        integer id PK
        integer item_id "FK->items"
        integer user_id "FK->users"
        integer author_id "FK->users"
        integer cost
        integer base_amount
        integer amount_excluding_consumption_tax_collected
        integer amount_including_consumption_tax_collected
        integer buyer_fee_amount
        integer item_price_amount
        integer author_fee_amount
        decimal author_fee_rate
        integer downloads
        integer commission
        float rate
        integer earnings_used
        integer profit
        string licence
        datetime refunded_at
        integer spending_refund_id
        string type
        integer buy_now_pending_deposit_id "FK->pending_deposits"
        date last_downloaded_at
        integer downloads_in_last_day
        integer earnings_refund_id
        string unique_code
        string attachment_accessor
        integer order_entry_id "FK->order_entries"
        integer included_surcharge_amount
        boolean reversed
        integer support_bundle_purchase_amount
        integer support_bundle_purchase_amount_including_tax
        integer support_bundle_author_fee_amount
        integer support_bundle_earnings_amount
        integer support_upgrade_purchase_amount
        integer support_upgrade_purchase_amount_including_tax
        integer support_upgrade_author_fee_amount
        float support_upgrade_author_fee_rate
        integer support_upgrade_earnings_amount
        integer support_extension_purchase_amount
        integer support_extension_purchase_amount_including_tax
        integer support_extension_author_fee_amount
        float support_extension_author_fee_rate
        integer support_extension_earnings_amount
        datetime created_at
        datetime updated_at
    }

    schema_migrations {
        string model_path "Active Record schema migrations"
        string version PK
    }

    ar_internal_metadata {
        string model_path "Active Record internal metadata"
        string key PK
        string value
        datetime created_at
        datetime updated_at
    }

    events {
        string model_path "app/models/event.rb"
        bigint id PK
        binary aggregate_id
        string type
        text body
        datetime created_at
    }

    country_conflict_status_change_events {
        string model_path "app/models/country_conflict_status_change_event.rb"
        integer id PK
        integer user_id "FK->users"
        integer country_conflict_current_status_id
        string old_status
        string new_status
        integer actioner_id "FK->users"
        text comment
        datetime created_at
    }

    credit_expiry_date_change_events {
        string model_path "app/models/credit_expiry_date_change_event.rb"
        integer id PK
        integer user_id "FK->users"
        datetime expiry_date
        datetime created_at
    }

    credit_unexpiry_events {
        string model_path "app/models/credit_unexpiry_event.rb"
        integer id PK
        integer user_id "FK->users"
        integer amount
        integer expiry_event_id "FK->credit_expiry_events"
        datetime created_at
    }

    free_item_events {
        string model_path "app/models/free_item_event.rb"
        integer id PK
        integer item_id "FK->items"
        integer authorizing_user_id "FK->users"
        datetime start_date
        datetime end_date
        string event_type
        datetime created_at
    }

    async_job_entries {
        string model_path "app/models/async_job_entry.rb"
        integer id PK
        integer user_id "FK->users"
        string uuid
        text serialized_object
        boolean successful
        datetime completed_at
        text error
        datetime created_at
        datetime updated_at
    }

    zencoder_jobs {
        string model_path "app/models/zencoder_job.rb"
        integer id PK
        boolean done
        datetime created_at
        datetime updated_at
        integer zencoder_job_id
        integer attachable_model_id
        string attachable_model_type
        string destination_url
        string uuid
        string job_type
    }

    deposit_audit_logs {
        string model_path "app/models/deposit_audit_log.rb"
        integer id PK
        string action
        integer pending_deposit_id "FK->pending_deposits"
        integer deposit_id "FK->deposits"
        integer performing_user_id "FK->users"
        datetime created_at
    }

    manually_verified_business_events {
        string model_path "app/models/manually_verified_business_event.rb"
        integer id PK
        integer user_id "FK->users"
        integer verifying_user_id "FK->users"
        string event_type
        string help_ticket_reference
        string reason
        datetime created_at
        datetime updated_at
    }

    payment_authorization_events {
        string model_path "app/models/payment_authorization_event.rb"
        integer id PK
        integer pending_deposit_id "FK->pending_deposits"
        string payment_service
        string transaction_id
        integer amount
        string currency_code
        integer user_id "FK->users"
        text checkout_details
        datetime created_at
        datetime updated_at
    }

    payment_request_events {
        string model_path "app/models/payment_request_event.rb"
        integer id PK
        string request_identifier
        datetime created_at
        datetime updated_at
    }

    portfolio_events {
        string model_path "app/models/portfolio_event.rb"
        integer id PK
        integer author_id "FK->users"
        string site
        string action
        string state
        integer admin_id "FK->users"
        text options
        datetime created_at
    }

    user_enablement_events {
        string model_path "app/models/user_enablement_event.rb"
        integer id PK
        integer user_id "FK->users"
        integer authorised_user_id "FK->users"
        string from_state
        string to_state
        string reason
        datetime created_at
    }

    purchase_update_notification_preferences {
        string model_path "app/models/purchase_update_notification_preference.rb"
        integer id PK
        integer purchase_id "FK->purchases"
        boolean notify
    }

    financial_document_settings {
        string model_path "app/models/financial_document_setting.rb"
        integer id PK
        integer user_id "FK->users"
        boolean hide_identity_from_buyers
        string custom_tax_message
        datetime effective_at
        datetime created_at
        datetime updated_at
    }

    billing_details_tax_forms {
        string model_path "app/models/billing_details_tax_form.rb"
        integer id PK
        integer billing_details_record_id "FK->billing_details_records"
        string form_type
        string form_data
        datetime submitted_at
        datetime created_at
        datetime updated_at
    }

    category_cache {
        string model_path "app/models/category_cache.rb"
        integer id PK
        string site
        string category
        integer item_count
        datetime last_updated_at
    }

    purchase_refund_event_metadata {
        string model_path "app/models/purchase_refund_event_metadata.rb"
        integer id PK
        integer refund_event_id
        string refund_event_type
        text metadata
        datetime created_at
    }

    refund_request_last_visited_cache {
        string model_path "app/models/refund_request_last_visited_cache.rb"
        integer id PK
        integer user_id "FK->users"
        datetime last_visited_at
    }

    refund_requests_author_closed_cache {
        string model_path "app/models/refund_requests_author_closed_cache.rb"
        integer id PK
        integer author_id "FK->users"
        integer closed_count
        datetime last_updated_at
    }

    refund_requests_author_open_cache {
        string model_path "app/models/refund_requests_author_open_cache.rb"
        integer id PK
        integer author_id "FK->users"
        integer open_count
        datetime last_updated_at
    }

    top_author_cache_settings {
        string model_path "app/models/top_author_cache_setting.rb"
        integer id PK
        string site
        string category
        boolean enabled
        integer min_sales_threshold
        datetime created_at
        datetime updated_at
    }

    commercial_transaction_discounts {
        string model_path "app/models/commercial_transaction/discount.rb"
        bigint id PK
        bigint commercial_transaction_id "FK->commercial_transaction_records"
        integer original_amount
        integer discounted_amount
        integer discount_rate
        string source
        datetime discount_period_started_at
        datetime created_at
        datetime updated_at
    }

    commercial_transaction_license_fulfillments {
        string model_path "app/models/commercial_transaction/license_fulfillment.rb"
        integer id PK
        integer commercial_transaction_fulfillment_id "FK->commercial_transaction_fulfillment_records"
        integer grant_id "FK->license_grants"
    }

    commercial_transaction_license_reversals {
        string model_path "app/models/commercial_transaction/license_reversal.rb"
        integer id PK
        integer commercial_transaction_fulfillment_id "FK->commercial_transaction_fulfillment_records"
        integer revocation_id "FK->license_revocations"
    }

    commercial_transaction_support_fulfillments {
        string model_path "app/models/commercial_transaction/support_fulfillment.rb"
        integer id PK
        integer commercial_transaction_fulfillment_id "FK->commercial_transaction_fulfillment_records"
        integer grant_id "FK->item_support_grants"
    }

    commercial_transaction_support_reversals {
        string model_path "app/models/commercial_transaction/support_reversal.rb"
        integer id PK
        integer commercial_transaction_fulfillment_id "FK->commercial_transaction_fulfillment_records"
        integer revocation_id "FK->item_support_revocations"
    }

    commercial_transaction_tax_facts {
        string model_path "app/models/commercial_transaction/tax_fact.rb"
        integer id PK
        integer commercial_transaction_id "FK->commercial_transaction_records"
        text facts
        datetime created_at
        datetime updated_at
    }

    category_licenses {
        string model_path "app/models/category_license.rb"
        integer id PK
        string site
        string root_category
        integer license_id "FK->licenses"
        integer position
        string pricing_strategy
        text pricing_parameters
        datetime deprecated_at
        datetime created_at
        datetime updated_at
    }

    category_license_buyer_fees {
        string model_path "app/models/category_license_buyer_fee.rb"
        integer id PK
        string site
        string category
        integer license_id "FK->licenses"
        integer buyer_fee
        datetime created_at
        datetime updated_at
    }

    item_license_discounts {
        string model_path "app/models/item_license_discount.rb"
        bigint id PK
        bigint created_by_user_id "FK->users"
        bigint item_id "FK->items"
        bigint license_id "FK->licenses"
        integer discount_type
        integer original_list_price_cents
        integer original_price_cents
        integer discounted_list_price_cents
        integer discounted_price_cents
        datetime starts_at
        datetime ends_at
        integer discount_percentage
        integer status
        bigint updated_by_user_id "FK->users"
        datetime started_at
        datetime ended_at
        datetime created_at
        datetime updated_at
    }

    item_support_offerings {
        string model_path "app/models/item_support/offering.rb"
        integer id PK
        string key
        string name
        string scenario
        datetime created_at
        datetime updated_at
    }

    item_support_inquiries {
        string model_path "app/models/item_support/inquiry.rb"
        integer id PK
        integer sender_id "FK->users"
        integer author_id "FK->users"
        integer item_id "FK->items"
        string site
        text message
        datetime created_at
        datetime updated_at
    }

    item_support_exclusions {
        string model_path "app/models/item_support/exclusion.rb"
        integer id PK
        integer item_id "FK->items"
        datetime start_at
        datetime end_at
    }

    item_support_revocations {
        string model_path "app/models/item_support/revocation.rb"
        integer id PK
        integer grant_id "FK->item_support_grants"
        datetime revoked_at
        datetime created_at
    }

    referral_commissions {
        string model_path "app/models/referral_commission.rb"
        integer id PK
        integer commercial_transaction_id "FK->commercial_transaction_records"
        integer deposit_id "FK->deposits"
        integer referring_user_id "FK->users"
        integer referred_user_id "FK->users"
        integer amount
        decimal rate
    }

    pro_affiliation_events {
        string model_path "app/models/pro_affiliation_event.rb"
        integer id PK
        binary author_uuid
        binary authorizing_user_uuid
        integer pro_id "FK->performing_rights_organizations"
        string pro_name
        datetime created_at
    }

    current_billing_details {
        string model_path "app/models/current_billing_detail.rb"
        integer id PK
        integer user_id "FK->users"
        integer billing_details_id "FK->billing_details_records"
        string billing_details_token
        datetime created_at
        datetime updated_at
    }

    current_free_items {
        string model_path "app/models/current_free_item.rb"
        integer id PK
        integer item_id "FK->items"
        datetime start_date
        datetime end_date
        datetime created_at
        datetime updated_at
    }

    envato_elite_emails {
        string model_path "app/models/envato_elite_email.rb"
        integer id PK
        integer user_id "FK->users"
        string threshold_name
        datetime created_at
        datetime updated_at
    }

    external_provider_ids {
        string model_path "app/models/external_provider_id.rb"
        bigint id PK
        string identifiable_type
        bigint identifiable_id "polymorphic_FK"
        string external_id
        string provider
        datetime created_at
        datetime updated_at
    }

    buying_pending_order_requests {
        string model_path "app/models/buying/pending_order_request.rb"
        integer id PK
        integer user_id "FK->users"
        integer authorization_event_id
        integer quote_id "FK->orders"
        string email
        string token
        datetime completed_at
        datetime voided_at
        datetime failed_at
        datetime created_at
        datetime updated_at
    }

    temporary_license_grants {
        string model_path "app/models/temporary_license_grant.rb"
        integer id PK
        integer licensee_id "FK->users"
        integer item_id "FK->items"
        string unique_code
        datetime issued_at
        datetime created_at
    }

    dam_author_migrations {
        string model_path "app/models/dam_author_migration.rb"
        bigint id PK
        bigint user_id "FK->users"
        string site
        datetime created_at
        datetime updated_at
    }

    order_entry_commercial_transactions {
        string model_path "app/models/order_entry_commercial_transaction.rb"
        integer id PK
        integer order_entry_id "FK->order_entries"
        integer commercial_transaction_id "FK->commercial_transaction_records"
        datetime created_at
        datetime updated_at
    }

    purchase_commercial_transactions {
        string model_path "app/models/purchase_commercial_transaction.rb"
        integer id PK
        integer purchase_id "FK->purchases"
        integer commercial_transaction_id "FK->commercial_transaction_records"
        datetime created_at
    }

    quote_commercial_transactions {
        string model_path "app/models/quote_commercial_transaction.rb"
        integer id PK
        integer quote_id "FK->orders"
        integer commercial_transaction_id "FK->commercial_transaction_records"
        datetime created_at
        datetime updated_at
    }

    proofing_trusted_author_bulk_approvals {
        string model_path "app/models/proofing/trusted_author_bulk_approval.rb"
        integer id PK
        integer user_id "FK->users"
        float min_ratio
        integer min_reviews
        string time_period
        datetime started_at
        integer authors_to_process
        integer processed_authors
        integer processed_items
        text log
        datetime finished_at
        datetime created_at
        datetime updated_at
    }

    credit_expiry_extension_request_events {
        string model_path "app/models/credit_expiry_extension_request_event.rb"
        integer id PK
        integer user_id "FK->users"
        integer requested_by_user_id "FK->users"
        datetime requested_at
        datetime created_at
    }

    credit_expiry_notification_events {
        string model_path "app/models/credit_expiry_notification_event.rb"
        integer id PK
        integer user_id "FK->users"
        integer days_until_expiry
        datetime created_at
    }

    credit_expiry_pending_expiry_dates {
        string model_path "app/models/credit_expiry_pending_expiry_date.rb"
        integer id PK
        integer user_id "FK->users"
        datetime expiry_date
        datetime created_at
        datetime updated_at
    }

    deposit_receipts {
        string model_path "app/models/deposit_receipt.rb"
        integer id PK
        integer deposit_id "FK->deposits"
        string receipt_number
        text receipt_data
        datetime created_at
        datetime updated_at
    }

    handling_fee_credit_notes {
        string model_path "app/models/handling_fee_credit_note.rb"
        integer id PK
        integer handling_fee_invoice_id "FK->handling_fee_invoices"
        string document_number
        integer total
        datetime created_at
        datetime updated_at
    }

    handling_fee_credit_note_lines {
        string model_path "app/models/handling_fee_credit_note_line.rb"
        integer id PK
        integer handling_fee_credit_note_id "FK->handling_fee_credit_notes"
        integer quantity
        string description
        integer amount
    }

    area51_secrets {
        string model_path "app/models/area51_secret.rb"
        string id PK
        json value
    }

    attachment_related_data {
        string model_path "app/models/attachment_related_datum.rb"
        integer id PK
        integer attachment_id "FK->attachments"
        string attachment_key
        text data
        datetime created_at
        datetime updated_at
    }

    collection_ratings {
        string model_path "app/models/collection_rating.rb"
        integer id PK
        integer user_id "FK->users"
        integer collection_id "FK->collections"
        integer rating
        datetime created_at
        datetime updated_at
    }

    ftp_signin_attempts {
        string model_path "app/models/ftp_signin_attempt.rb"
        integer id PK
        integer user_id "FK->users"
        boolean successful
        boolean used_api_key
        datetime created_at
        datetime updated_at
    }

    blocklisted_user_agents {
        string model_path "app/models/blocklisted_user_agent.rb"
        bigint id PK
        bigint blocklister_id "FK->users"
        string user_agent
        string reason
        boolean disable_automatically
        datetime deactivated_at
        datetime created_at
        datetime updated_at
    }

    billing_details_locks {
        string model_path "app/models/billing_details_lock.rb"
        integer id PK
        integer user_id "FK->users"
        datetime created_at
        datetime updated_at
    }

    deposit_invoice_additional_details {
        string model_path "app/models/deposit_invoice_additional_detail.rb"
        integer id PK
        integer deposit_id "FK->deposits"
        string additional_description
        datetime created_at
        datetime updated_at
    }

    authorship_rights {
        string model_path "app/models/authorship_right.rb"
        integer id PK
        integer user_id "FK->users"
        string site
        boolean revoked
        boolean automatic
        datetime created_at
        datetime updated_at
    }

    country_conflict_current_statuses {
        string model_path "app/models/country_conflict_current_status.rb"
        integer id PK
        integer user_id "FK->users"
        string w8_country_code
        string conflicting_country_code
        string status
        datetime identified_at
        datetime created_at
        datetime updated_at
    }

    payment_account_verifications {
        string model_path "app/models/payment_account_verification.rb"
        integer id PK
        string payer_email
        integer user_id "FK->users"
        boolean verified
        string site
        string verification_key
        string payment_service
        datetime created_at
        datetime updated_at
    }

    payment_message_terms {
        string model_path "app/models/payment_message_term.rb"
        bigint id PK
        bigint payment_message_id "FK->payment_messages"
        string username
        text params
    }

    payment_service_transaction_reversals {
        string model_path "app/models/payment_service_transaction_reversal.rb"
        integer id PK
        integer deposit_id "FK->deposits"
        string transaction_id
        string payment_service
        datetime created_at
        datetime updated_at
    }

    payment_void_events {
        string model_path "app/models/payment_void_event.rb"
        integer id PK
        integer pending_deposit_id "FK->pending_deposits"
        string payment_service
        string transaction_id
        integer amount
        string currency_code
        integer user_id "FK->users"
        text void_details
        datetime created_at
        datetime updated_at
    }

    item_support_offering_versions {
        string model_path "app/models/item_support/offering_version.rb"
        integer id PK
        integer offering_id "FK->item_support_offerings"
        text commercial_transactions
        datetime effective_at
        datetime deprecated_at
        boolean launch_grant_holders_only
        datetime created_at
        datetime updated_at
    }

    deposit_reversals {
        string model_path "app/models/deposit_reversal.rb"
        integer id PK
        integer deposit_id "FK->deposits"
        integer amount
        integer authorizing_user_id "FK->users"
        datetime created_at
        datetime updated_at
    }

    statement_line_reversal_details {
        string model_path "app/models/statement_line_reversal_detail.rb"
        integer id PK
        string purchase_unique_code
        integer statement_line_id "FK->statement_lines"
    }

    manually_verified_us_sales_tax_exemption_events {
        string model_path "app/models/manually_verified_us_sales_tax_exemption_event.rb"
        integer id PK
        integer user_id "FK->users"
        integer verifying_user_id "FK->users"
        string event_type
        string help_ticket_reference
        string reason
        datetime created_at
        datetime updated_at
    }

    transaction_details_for_buy_now_purchases {
        string model_path "app/models/transaction_details_for_buy_now_purchase.rb"
        integer id PK
        integer buy_now_purchase_id "FK->purchases"
        string transaction_id
        string invoice_id
        datetime created_at
        datetime updated_at
    }

    buy_now_deposit_invoice_details {
        string model_path "app/models/buy_now_deposit_invoice_detail.rb"
        integer id PK
        integer deposit_id "FK->deposits"
        integer handling_fee_amount
        integer buyer_fee_amount
        integer license_fee_amount
        datetime created_at
        datetime updated_at
    }

    request_forensics_locations {
        string model_path "app/models/request_forensics_location.rb"
        integer id PK
        integer geoname_id
        string name
        string code
    }

    request_forensics_user_agents {
        string model_path "app/models/request_forensics_user_agent.rb"
        integer id PK
        string header_value
    }

    secure_record_undispatched_messages {
        string model_path "app/models/secure_record_undispatched_message.rb"
        integer id PK
        string token
        text message
        datetime created_at
        datetime updated_at
    }

    skrill_fee_invoice_lines {
        string model_path "app/models/skrill_fee_invoice_line.rb"
        integer id PK
        integer service_fee_invoice_id "FK->service_fee_invoices"
        integer withdrawal_id
        integer fee_amount
        datetime created_at
        datetime updated_at
    }

    spam_ips {
        string model_path "app/models/spam_ip.rb"
        integer id PK
        string ip
        integer blocked_by_user_id "FK->users"
        string reason
        datetime expires_at
        datetime created_at
        datetime updated_at
    }

    commercial_transaction_migrated_legacy_commercial_transactions {
        string model_path "app/models/commercial_transaction/migrated_legacy_commercial_transaction.rb"
        integer id PK
        string legacy_ct_type
        integer legacy_ct_id
        integer generic_ct_id "FK->commercial_transaction_records"
    }

    purchase_legacy_commercial_transactions {
        string model_path "app/models/purchase_legacy_commercial_transaction.rb"
        integer id PK
        integer purchase_id "FK->purchases"
        integer commercial_transaction_id "FK->commercial_transaction_records"
        string commercial_transaction_type
    }

    purchase_reversal_commercial_transactions {
        string model_path "app/models/purchase_reversal_commercial_transaction.rb"
        integer id PK
        integer purchase_reversal_id "FK->purchase_reversals"
        integer commercial_transaction_id "FK->commercial_transaction_records"
        datetime created_at
    }

    reversal_commercial_transactions {
        string model_path "app/models/reversal_commercial_transaction.rb"
        integer id PK
        integer reversal_id
        string reversal_type
        integer commercial_transaction_id "FK->commercial_transaction_records"
        datetime created_at
        datetime updated_at
    }

    financial_document_tax_suppliers {
        string model_path "app/models/financial_document_tax_supplier.rb"
        bigint id PK
        integer document_id
        string document_type
        integer billing_details_record_id "FK->billing_details_records"
    }

    support_author_fee_invoice_lines {
        string model_path "app/models/support_author_fee_invoice_line.rb"
        integer id PK
        integer service_fee_invoice_id "FK->service_fee_invoices"
        integer event_id
        string event_type
        integer fee_amount
        decimal fee_rate
        integer total_sale_amount
        integer tax_amount
        decimal tax_rate
        datetime created_at
        datetime updated_at
    }

    trusted_update_rights_events {
        string model_path "app/models/trusted_update_rights_event.rb"
        bigint id PK
        integer author_id "FK->users"
        integer admin_id "FK->users"
        string site
        string event_type
        datetime created_at
        datetime updated_at
    }

    user_acknowledgements {
        string model_path "app/models/user/acknowledgement.rb"
        integer id PK
        integer user_id "FK->users"
        string key
        datetime created_at
        datetime updated_at
    }

    user_disable_operations {
        string model_path "app/models/user/disable_operation.rb"
        integer id PK
        integer user_id "FK->users"
        integer actioned_by_user_id "FK->users"
        string message
        string action
        boolean include_forum_messages
        datetime created_at
        datetime updated_at
        string reason
        boolean include_item_comments
    }

    user_licence_exclusions {
        string model_path "app/models/user/licence_exclusion.rb"
        integer id PK
        integer user_id "FK->users"
        string licence
        datetime created_at
        datetime updated_at
    }

    payment__credit_card__buy_now_complete_log_entries {
        string model_path "app/models/payment/credit_card/buy_now_complete_log_entry.rb"
        integer id PK
        string request_id
        integer user_id "FK->users"
        boolean in_flip_group
        boolean trusted_user
        string payment_service
        integer amount
        integer pending_deposit_id "FK->pending_deposits"
        string session_id
        string sso_session_id
        datetime created_at
        datetime updated_at
    }

    payment__credit_card__buy_now_start_log_entries {
        string model_path "app/models/payment/credit_card/buy_now_start_log_entry.rb"
        integer id PK
        string request_id
        integer user_id "FK->users"
        boolean in_flip_group
        boolean trusted_user
        string session_id
        string sso_session_id
        datetime created_at
        datetime updated_at
    }

    payment__credit_card__deposit_complete_log_entries {
        string model_path "app/models/payment/credit_card/deposit_complete_log_entry.rb"
        integer id PK
        string request_id
        integer user_id "FK->users"
        boolean in_flip_group
        boolean trusted_user
        string payment_service
        integer amount
        integer pending_deposit_id "FK->pending_deposits"
        datetime created_at
        datetime updated_at
        string session_id
        string sso_session_id
    }

    payment__credit_card__deposit_start_log_entries {
        string model_path "app/models/payment/credit_card/deposit_start_log_entry.rb"
        integer id PK
        string request_id
        integer user_id "FK->users"
        boolean in_flip_group
        boolean trusted_user
        datetime created_at
        datetime updated_at
        string session_id
        string sso_session_id
    }

    proofing_skill_set_log_entries {
        string model_path "app/models/proofing/skill_set_log_entry.rb"
        integer id PK
        integer user_id "FK->users"
        integer changed_by_user_id "FK->users"
        string site
        string root_category
        boolean granted
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
        integer tagable_id "polymorphic_FK->items,item_updates"
        integer tag_id "FK->tags"
        string group
    }

    category_states {
        string model_path "app/models/category_state.rb"
        integer id PK
        string site
        string category
        string state
        datetime created_at
        datetime updated_at
        integer user_id "FK->users"
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

    buying_sagas {
        string model_path "app/models/buying/saga.rb"
        integer id PK
        integer quote_id "FK->orders"
        integer user_id "FK->users"
        boolean created_account
        integer entry_point_id
        string entry_point_type
        datetime created_at
        datetime updated_at
    }

    buying_orders {
        string model_path "app/models/buying/order.rb"
        integer id PK
        integer quote_id "FK->orders"
        integer user_id "FK->users"
        integer saga_id "FK->buying_sagas"
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

    user_clickthroughs {
        string model_path "app/models/user_clickthrough.rb"
        integer id PK
        integer user_id "FK->users"
        string ip
        datetime created_at
        string referrer
        string user_agent
        integer month
        string site
        string url
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

    delayed_jobs {
        string model_path "app/models/delayed_job.rb"
        integer id PK
        integer priority
        integer attempts
        text handler
        text last_error
        datetime run_at
        datetime locked_at
        datetime failed_at
        string locked_by
        datetime created_at
        datetime updated_at
        string queue
    }



    reviews {
        string model_path "app/models/review.rb"
        integer id PK
        integer user_id "FK->users"
        integer item_id "FK->items"
        text content
        integer rating
        datetime created_at
        datetime updated_at
        boolean published
    }

    billing_details_current_for_envato {
        string model_path "app/models/billing_details_current_for_envato.rb"
        integer id PK
        integer billing_details_id "FK->billing_details_records"
        string payment_entity
        datetime created_at
        datetime updated_at
    }

    billing_details_fetcher_status {
        string model_path "app/models/billing_details_fetcher_status.rb"
        integer id PK
        string status
        text error_details
        datetime created_at
        datetime updated_at
    }

    innodb_lock_monitor {
        string model_path "database infrastructure table"
        integer id PK
    }

    innodb_monitor {
        string model_path "database infrastructure table"
        integer id PK
    }

    item_support_expiring_support_notification_events {
        string model_path "app/models/item_support/expiring_support_notification_event.rb"
        integer id PK
        integer item_support_entitlement_id "FK->item_support_entitlements"
        integer user_id "FK->users"
        datetime created_at
        datetime updated_at
    }

    market_identity_billing_details_mapping {
        string model_path "app/models/market_identity_billing_details_mapping.rb"
        integer id PK
        integer market_billing_details_id "FK->billing_details_records"
        string identity_billing_details_token
        datetime created_at
        datetime updated_at
    }

    popular_charts {
        string model_path "app/models/popular_chart.rb"
        integer id PK
        string site
        string category
        date chart_date
        string period
        datetime created_at
        datetime updated_at
    }

    swift_fee_invoice_lines {
        string model_path "app/models/swift_fee_invoice_line.rb"
        integer id PK
        integer service_fee_invoice_id "FK->service_fee_invoices"
        integer withdrawal_id
        integer fee_amount
        datetime created_at
        datetime updated_at
    }

    %% Core User Relationships
    users ||--o{ account_sign_ups : "has_account -> account_sign_ups.user_id"
    users ||--o{ items : "authors -> items.user_id"
    users ||--o{ purchases : "buys -> purchases.user_id"
    users ||--o{ collections : "creates -> collections.user_id"
    users ||--o{ item_comments : "writes -> item_comments.user_id"
    users ||--o{ item_ratings : "rates -> item_ratings.user_id"
    users ||--o{ signin_attempts : "attempts -> signin_attempts.user_id"
    users ||--o{ user_history : "has_history -> user_history.user_id"
    users ||--o{ manual_adjustments : "receives -> manual_adjustments.user_id"
    users ||--o{ deposits : "makes -> deposits.user_id"
    users ||--o{ pending_deposits : "initiates -> pending_deposits.user_id"
    users ||--o{ user_exclusive_periods : "has -> user_exclusive_periods.user_id"
    users ||--o{ top_author_caches : "ranked_in -> top_author_caches.user_id"
    users ||--o{ user_badges : "earns -> user_badges.user_id"
    users ||--|| user_clickthroughs : "current_clickthrough -> users.user_clickthrough_id"
    users ||--o{ user_clickthroughs : "has_clickthroughs -> user_clickthroughs.user_id"
    users ||--o{ user_clickthrough_totals : "tracked_for -> user_clickthrough_totals.user_id"
    users ||--o{ top_author_accumulation_caches : "accumulated_in -> top_author_accumulation_caches.user_id"
    users ||--o{ api_keys : "has_keys -> api_keys.user_id"
    users ||--o{ auth_role_change_log_entries : "role_changed -> auth_role_change_log_entries.user_id"
    users ||--o{ auth_role_change_log_entries : "changed_by -> auth_role_change_log_entries.changed_by_user_id"
    users ||--o{ auth_sign_in_as_log_entries : "signs_in_as -> auth_sign_in_as_log_entries.user_id"
    users ||--o{ auth_sign_in_as_log_entries : "target_user -> auth_sign_in_as_log_entries.target_user_id"
    users ||--o{ adwords_events : "tracked_for -> adwords_events.user_id"
    users ||--o{ affiliate_referral_audits : "audited_for -> affiliate_referral_audits.user_id"
    users ||--o{ announcements : "creates -> announcements.user_id"
    users ||--o{ announcements_users : "sees -> announcements_users.user_id"
    users ||--o{ billing_details_records : "has_billing -> billing_details_records.user_id"
    users ||--o{ billing_details_records : "submitted_by -> billing_details_records.submitter_id"
    users ||--o{ buyer_fee_invoices : "invoiced_to -> buyer_fee_invoices.to_user_id"

    users ||--o{ hosted_subscriptions : "subscribes -> hosted_subscriptions.subscriber_user_id"
    users ||--o{ hosted_license_grants : "licensed_to -> hosted_license_grants.licensee_id"

    users ||--o{ hosted_service_proceeds_invoices : "invoiced_from -> hosted_service_proceeds_invoices.from_user_id"
    users ||--o{ earning_summaries : "earns -> earning_summaries.user_id"
    users ||--o{ us_state_tax_rates : "has_tax_rates -> us_state_tax_rates.user_id"
    users ||--o{ tax_determinations : "determined_for -> tax_determinations.user_id"
    users ||--o{ statement_lines : "has_statements -> statement_lines.user_id"
    users ||--o{ item_purchase_invoices : "buys_from -> item_purchase_invoices.to_user_id"
    users ||--o{ item_purchase_invoices : "sells_to -> item_purchase_invoices.from_user_id"
    users ||--o{ item_purchase_credit_notes : "credited_to -> item_purchase_credit_notes.to_user_id"
    users ||--o{ item_purchase_credit_notes : "credited_from -> item_purchase_credit_notes.from_user_id"
    users ||--o{ user_flags : "flagged -> user_flags.user_id"
    users ||--o{ user_flags : "flagged_by -> user_flags.authorizing_user_id"
    users ||--o{ user_leaves : "takes_leave -> user_leaves.user_id"
    users ||--o{ user_following_summaries : "has_followers -> user_following_summaries.user_id"
    users ||--o{ user_email_settings : "configures_email -> user_email_settings.user_id"
    users ||--o{ author_follows : "follows -> author_follows.user_id"
    users ||--o{ author_follows : "followed_by -> author_follows.author_id"
    users ||--o{ braintree_customer_records : "has_braintree -> braintree_customer_records.user_id"
    users ||--o{ paypal_billing_details : "has_paypal -> paypal_billing_details.user_id"
    users ||--o{ weekly_features : "featured_weekly -> weekly_features.author_id"
    users ||--o{ soi__trending__events : "triggers_trending -> soi__trending__events.user_id"
    users ||--o{ sales_distribution_data : "earns_from -> sales_distribution_data.user_id"
    users ||--o{ sales_segmentation_data : "authored_sales -> sales_segmentation_data.author_id"
    users ||--o{ message_tracking : "tracked_for -> message_tracking.user_id"
    users ||--o{ credit_expiry_events : "credit_expires -> credit_expiry_events.user_id"
    users ||--o{ credit_extinguish_events : "credit_extinguished -> credit_extinguish_events.user_id"
    users ||--o{ delegations : "delegates_to -> delegations.delegator_id"
    users ||--o{ delegations : "delegated_from -> delegations.delegatee_id"
    users ||--o{ delegations_log_entries : "logs_delegation -> delegations_log_entries.delegator_id"
    users ||--o{ delegations_log_entries : "delegation_logged_by -> delegations_log_entries.by_id"
    users ||--o{ complaints : "reported_by -> complaints.reported_by_id"
    users ||--o{ complaints : "processed_by -> complaints.processed_by_id"
    users ||--o{ submission_limit_exemptions : "exempted -> submission_limit_exemptions.author_id"
    users ||--o{ completed_author_trials : "completed_trial -> completed_author_trials.user_id"
    users ||--o{ item_review_stats : "authored_review -> item_review_stats.author_id"
    users ||--o{ item_review_stats : "reviewed_by -> item_review_stats.reviewer_id"
    users ||--o{ item_rating_author_replies : "replied_to_rating -> item_rating_author_replies.user_id"
    users ||--o{ pricing_default_photo_prices : "sets_photo_prices -> pricing_default_photo_prices.user_id"

    %% User Self-Referential Relationships
    users ||--o{ users : "refers -> users.referred_by_user_id"
    users ||--o{ users : "disables -> users.disabled_by_user_id"

    %% Item Relationships
    items ||--o{ purchases : "purchased_as -> purchases.item_id"
    items ||--o{ bookmarks : "bookmarked_as -> bookmarks.item_id"
    items ||--o{ item_comments : "commented_on -> item_comments.item_id"
    items ||--o{ item_ratings : "rated_as -> item_ratings.item_id"
    items ||--o{ items_tags : "tagged_with -> items_tags.tagable_id"
    items ||--o{ attributes : "has_attributes -> attributes.item_id"
    items ||--o{ item_events : "has_events -> item_events.item_id"
    items ||--o{ item_updates : "has_updates -> item_updates.item_id"
    items ||--|| item_summaries : "summarized_as -> item_summaries.item_id"
    items ||--o{ attachments : "has_attachments -> attachments.scope_value"
    items ||--o{ item_faqs : "has_faqs -> item_faqs.item_id"
    items ||--o{ item_short_descriptions : "has_descriptions -> item_short_descriptions.item_id"
    items ||--o{ item_license_prices : "has_prices -> item_license_prices.item_id"
    items ||--o{ item_url_names : "has_url_names -> item_url_names.item_id"
    items ||--o{ item_legal_takedowns : "has_takedowns -> item_legal_takedowns.item_id"
    items ||--o{ item_download_counters : "has_counters -> item_download_counters.item_id"
    items ||--o{ item_price_change_events : "has_price_changes -> item_price_change_events.item_id"
    items ||--o{ item_concealments : "has_concealments -> item_concealments.item_id"
    items ||--o{ item_related_identifiers : "has_identifiers -> item_related_identifiers.item_id"
    items ||--o{ user_featured_items : "featured_as -> user_featured_items.item_id"
    items ||--o{ popular_chart_lines : "ranked_in -> popular_chart_lines.item_id"
    items ||--o{ private_free_files : "has_free_files -> private_free_files.item_id"
    items ||--o{ item_sources : "has_sources -> item_sources.item_id"
    items ||--o{ order_entries : "ordered_as -> order_entries.item_id"
    items ||--o{ cart_entries : "added_to_cart -> cart_entries.item_id"
    items ||--o{ item_support_entitlements : "supports -> item_support_entitlements.item_id"
    items ||--o{ item_author_recommended_collections : "recommended_in -> item_author_recommended_collections.item_id"
    items ||--o{ item_license_pending_price_changes : "has_pending_price_changes -> item_license_pending_price_changes.item_id"
    items ||--o{ hosted_items : "hosted_as -> hosted_items.item_id"
    items ||--o{ hosted_license_grants : "licensed -> hosted_license_grants.item_id"
    items ||--o{ item_bundles : "bundled_as -> item_bundles.item_id"
    items ||--o{ item_key_features : "has_features -> item_key_features.item_id"
    items ||--o{ statement_lines : "referenced_in -> statement_lines.item_id"
    items ||--o{ item_purchase_invoice_lines : "invoiced_for -> item_purchase_invoice_lines.item_id"
    items ||--o{ item_purchase_credit_note_lines : "credited_for -> item_purchase_credit_note_lines.item_id"
    items ||--o{ goodwill_refund_credit_note_lines : "refunded_for -> goodwill_refund_credit_note_lines.item_id"
    items ||--o{ soi__quality_score__summaries : "scored_for -> soi__quality_score__summaries.item_id"
    items ||--o{ soi__trending__daily_trends : "trending_for -> soi__trending__daily_trends.item_id"
    items ||--o{ soi__trending__events : "events_for -> soi__trending__events.item_id"
    items ||--o{ soi__trending__score_summaries : "trend_scored_for -> soi__trending__score_summaries.item_id"
    items ||--o{ item_review_stats : "reviewed_as -> item_review_stats.item_id"

    %% Item Self-Referential Relationships (for concealment)
    users ||--o{ items : "conceals -> items.concealed_by_user_id"
    users ||--o{ items : "features -> items.featured_by_user_id"
    users ||--o{ items : "weekly_features -> items.weekly_featured_by_user_id"
    users ||--o{ items : "daily_features -> items.daily_featured_by_user_id"
    users ||--o{ items : "makes_free -> items.free_file_by_user_id"

    %% Collection Relationships
    collections ||--o{ bookmarks : "contains -> bookmarks.collection_id"
    collections ||--o{ item_author_recommended_collections : "recommended_for -> item_author_recommended_collections.collection_id"


    %% Bookmark Relationships
    items ||--o{ bookmarks : "bookmarked_as -> bookmarks.item_id"
    collections ||--o{ bookmarks : "contains -> bookmarks.collection_id"

    %% Purchase Relationships
    users ||--o{ purchases : "buys -> purchases.user_id"
    items ||--o{ purchases : "purchased_as -> purchases.item_id"
    users ||--o{ purchases : "authored -> purchases.author_id"
    order_entries ||--o{ purchases : "results_in -> purchases.order_entry_id"
    deposits ||--o{ purchases : "funded_by -> purchases.deposit_id"
    purchases ||--o{ item_support_entitlements : "includes_support -> item_support_entitlements.purchase_id"
    purchases ||--o{ purchase_reversals : "reversed_by -> purchase_reversals.purchase_id"
    purchases ||--o{ purchase_refund_envato_goodwill_events : "refunded_by_envato -> purchase_refund_envato_goodwill_events.purchase_id"
    purchases ||--o{ purchase_refund_author_envato_shared_events : "refunded_shared -> purchase_refund_author_envato_shared_events.purchase_id"
    purchases ||--o{ purchase_refund_cash_events : "refunded_cash -> purchase_refund_cash_events.purchase_id"
    purchases ||--o{ purchase_fraudulent_reversals : "reversed_fraud -> purchase_fraudulent_reversals.purchase_id"
    purchases ||--o{ refund_requests : "requested_refund -> refund_requests.purchase_id"
    purchases ||--o{ short_download_urls : "downloaded_via -> short_download_urls.purchase_id"



    %% Payment Relationships
    users ||--o{ pending_deposits : "initiates -> pending_deposits.user_id"
    items ||--o{ pending_deposits : "purchased_via -> pending_deposits.item_id"
    pending_deposits ||--o{ payment_messages : "processed_via -> payment_messages.pending_deposit_id"
    users ||--o{ deposits : "makes -> deposits.user_id"
    users ||--o{ deposits : "referred_for -> deposits.referral_awarded_to_user_id"
    deposits ||--o{ payment_messages : "confirmed_via -> payment_messages.deposit_id"
    deposits ||--o{ purchases : "funds -> purchases.deposit_id"

    %% Manual Adjustment Relationships
    users ||--o{ manual_adjustments : "receives -> manual_adjustments.user_id"
    users ||--o{ manual_adjustments : "administered_by -> manual_adjustments.admin_user_id"

    %% Order/Cart Relationships
    users ||--o{ orders : "places -> orders.user_id"
    orders ||--o{ order_entries : "contains -> order_entries.order_id"
    items ||--o{ order_entries : "ordered_as -> order_entries.item_id"
    order_entries ||--o{ purchases : "results_in -> purchases.order_entry_id"
    orders ||--o{ buying_orders : "quoted_as -> buying_orders.quote_id"
    buying_orders ||--|| buying_order_fulfillments : "fulfilled_by -> buying_order_fulfillments.order_id"
    users ||--o{ buying_orders : "places -> buying_orders.user_id"
    buying_sagas ||--o{ buying_orders : "processes -> buying_orders.saga_id"
    users ||--o{ buying_sagas : "initiates -> buying_sagas.user_id"
    orders ||--o{ buying_sagas : "quoted_for -> buying_sagas.quote_id"
    pending_deposits ||--o{ buying_orders : "paid_via -> buying_orders.pending_deposit_id"
    users ||--o{ carts : "owns -> carts.user_id"
    carts ||--o{ cart_entries : "contains -> cart_entries.cart_id"
    items ||--o{ cart_entries : "added_to -> cart_entries.item_id"

    %% Comment Relationships
    users ||--o{ item_comments : "writes -> item_comments.user_id"
    items ||--o{ item_comments : "commented_on -> item_comments.item_id"
    users ||--o{ item_comments : "disables -> item_comments.disabled_by_user_id"
    item_comments ||--o{ item_comments : "replies_to -> item_comments.parent_id"

    %% Rating Relationships
    users ||--o{ item_ratings : "rates -> item_ratings.user_id"
    items ||--o{ item_ratings : "rated_as -> item_ratings.item_id"
    users ||--o{ item_ratings : "disables -> item_ratings.disabled_by_user_id"
    item_ratings ||--o{ item_ratings : "replaced_by -> item_ratings.replaced_by_id"

    %% Support Relationships
    purchases ||--o{ item_support_entitlements : "entitled_to -> item_support_entitlements.purchase_id"
    items ||--o{ item_support_entitlements : "supports -> item_support_entitlements.item_id"
    users ||--o{ item_support_entitlements : "entitled_for -> item_support_entitlements.user_id"
    item_support_entitlements ||--o{ item_support_grants : "grants -> item_support_grants.entitlement_id"

    %% Licensing Relationships
    licenses ||--o{ license_versions : "has_versions -> license_versions.license_id"
    license_versions ||--o{ license_grants : "granted_as -> license_grants.license_version_id"
    license_versions ||--o{ commercial_transaction_license_offers : "offered_as -> commercial_transaction_license_offers.license_version_id"
    license_grants ||--o{ license_revocations : "revoked_by -> license_revocations.license_grant_id"
    users ||--o{ license_revocations : "revokes -> license_revocations.revoking_user_id"

    %% Tag Relationships
    tags ||--o{ items_tags : "applied_to -> items_tags.tag_id"
    items ||--o{ items_tags : "tagged_with -> items_tags.tagable_id"
    item_updates ||--o{ items_tags : "tagged_with -> items_tags.tagable_id"
    users ||--o{ tags : "approves -> tags.approved_by_user_id"

    %% Category Relationships
    users ||--o{ category_states : "manages -> category_states.user_id"

    %% Badge Relationships
    users ||--o{ user_badges : "earns -> user_badges.user_id"
    users ||--o{ user_badge_order_preferences : "prefers_order -> user_badge_order_preferences.user_id"
    users ||--o{ user_badges_seen_cache : "seen_badges -> user_badges_seen_cache.user_id"

    %% Commercial Transaction Relationships
    commercial_transaction_records ||--o{ commercial_transaction_fulfillment_records : "fulfilled_by -> commercial_transaction_fulfillment_records.commercial_transaction_id"
    commercial_transaction_records ||--o{ commercial_transaction_support_offers : "offers_support -> commercial_transaction_support_offers.commercial_transaction_id"
    commercial_transaction_records ||--o{ commercial_transaction_license_offers : "offers_license -> commercial_transaction_license_offers.commercial_transaction_id"
    commercial_transaction_records ||--o{ commercial_transaction_taxes : "includes_taxes -> commercial_transaction_taxes.commercial_transaction_id"
    commercial_transaction_records ||--o{ commercial_transaction_records : "voids -> commercial_transaction_records.voided_commercial_transaction_id"

    %% Refund Relationships
    purchases ||--o{ refund_requests : "requested_for -> refund_requests.purchase_id"
    users ||--o{ refund_requests : "requests -> refund_requests.requesting_user_id"
    users ||--o{ refund_requests : "assigned_to -> refund_requests.assigned_to_user_id"
    users ||--o{ refund_requests : "resolved_by -> refund_requests.resolved_by_user_id"
    refund_requests ||--o{ refund_request_events : "has_events -> refund_request_events.refund_request_id"
    users ||--o{ refund_request_events : "creates -> refund_request_events.user_id"

    %% Purchase Reversal Relationships
    purchases ||--o{ purchase_reversals : "reversed_as -> purchase_reversals.purchase_id"
    purchase_reversal_authorizations ||--o{ purchase_reversals : "authorizes -> purchase_reversals.purchase_reversal_authorization_id"
    users ||--o{ purchase_reversal_authorizations : "authorizes -> purchase_reversal_authorizations.authorizing_user_id"

    %% Additional Relationships
    attachments ||--o{ attachment_uuids : "has_uuids -> attachment_uuids.attachment_id"
    attachments ||--o{ one_off_download_lookups : "downloaded_via -> one_off_download_lookups.attachment_id"
    nav_ads ||--o{ nav_ad_sites : "targets -> nav_ad_sites.nav_ad_id"
    users ||--o{ tax_determination_failures : "failed_for -> tax_determination_failures.user_id"
    orders ||--o{ tax_determination_failures : "failed_for -> tax_determination_failures.quote_id"
    users ||--o{ private_free_files : "has_access_to -> private_free_files.user_id"
    items ||--o{ private_free_files : "has_free_files -> private_free_files.item_id"
    users ||--o{ purchase_refund_envato_goodwill_events : "authorizes -> purchase_refund_envato_goodwill_events.authorizing_user_id"
    users ||--o{ purchase_refund_envato_goodwill_events : "buyer -> purchase_refund_envato_goodwill_events.buyer_id"
    purchases ||--o{ purchase_refund_envato_goodwill_events : "refunded -> purchase_refund_envato_goodwill_events.purchase_id"
    users ||--o{ purchase_refund_author_envato_shared_events : "authorizes -> purchase_refund_author_envato_shared_events.authorizing_user_id"
    users ||--o{ purchase_refund_author_envato_shared_events : "author -> purchase_refund_author_envato_shared_events.author_id"
    users ||--o{ purchase_refund_author_envato_shared_events : "buyer -> purchase_refund_author_envato_shared_events.buyer_id"
    purchases ||--o{ purchase_refund_author_envato_shared_events : "refunded -> purchase_refund_author_envato_shared_events.purchase_id"
    users ||--o{ purchase_refund_cash_events : "authorizes -> purchase_refund_cash_events.authorizing_user_id"
    users ||--o{ purchase_refund_cash_events : "buyer -> purchase_refund_cash_events.buyer_id"
    purchases ||--o{ purchase_refund_cash_events : "refunded -> purchase_refund_cash_events.purchase_id"
    purchases ||--o{ purchase_fraudulent_reversals : "reversed_for_fraud -> purchase_fraudulent_reversals.purchase_id"
    users ||--o{ purchase_fraudulent_reversals : "authorizes -> purchase_fraudulent_reversals.authorizing_user_id"

    %% Item Event Relationships
    items ||--o{ item_events : "has_events -> item_events.item_id"
    users ||--o{ item_events : "creates -> item_events.user_id"
    item_updates ||--o{ item_events : "triggers -> item_events.item_update_id"

    %% Item Update Relationships
    items ||--o{ item_updates : "updated_by -> item_updates.item_id"

    %% Attachment Relationships
    attachments ||--o{ attachment_uuids : "identified_by -> attachment_uuids.attachment_id"
    attachments ||--o{ one_off_download_lookups : "downloaded_via -> one_off_download_lookups.attachment_id"

    %% Share Key Relationships
    collections ||--o{ share_keys : "shared_via -> share_keys.shareable_id"

    %% Download URL Relationships
    purchases ||--o{ short_download_urls : "downloaded_via -> short_download_urls.purchase_id"
    users ||--o{ purchase_unique_code_downloads : "downloads -> purchase_unique_code_downloads.user_id"

    %% Featured Item Relationships
    items ||--o{ user_featured_items : "featured_as -> user_featured_items.item_id"
    users ||--o{ user_featured_items : "featured_by -> user_featured_items.featured_by_user_id"

    %% Navigation Ad Relationships
    nav_ads ||--o{ nav_ad_sites : "displayed_on -> nav_ad_sites.nav_ad_id"

    %% Site Statistics Relationships
    users ||--o{ site_stats : "tracked_for -> site_stats.user_id"
    users ||--o{ top_author_caches : "cached_for -> top_author_caches.user_id"
    users ||--o{ top_author_accumulation_caches : "accumulated_for -> top_author_accumulation_caches.user_id"
    items ||--o{ popular_chart_lines : "ranked_as -> popular_chart_lines.item_id"

    %% Authentication Relationships
    users ||--o{ signin_attempts : "attempts -> signin_attempts.user_id"
    users ||--o{ user_history : "has_history -> user_history.user_id"

    %% Exclusive Period Relationships
    users ||--o{ user_exclusive_periods : "has_period -> user_exclusive_periods.user_id"
    users ||--o{ user_exclusive_periods : "created_by -> user_exclusive_periods.created_by_user_id"

    %% Tax Determination Relationships
    users ||--o{ tax_determination_failures : "failed_for -> tax_determination_failures.user_id"

    %% User Clickthrough Relationships
    users ||--o{ user_clickthroughs : "has_clickthroughs -> user_clickthroughs.user_id"
    users ||--o{ user_clickthrough_totals : "tracked_for -> user_clickthrough_totals.user_id"

    %% Review Relationships
    users ||--o{ reviews : "writes -> reviews.user_id"
    items ||--o{ reviews : "reviewed_in -> reviews.item_id"

    %% Hosted Services Relationships
    hosted_items ||--o{ hosted_author_payments : "generates_payments -> hosted_author_payments.hosted_item_id"
    hosted_items ||--o{ hosted_service_proceeds_invoice_lines : "invoiced_for -> hosted_service_proceeds_invoice_lines.hosted_item_id"
    hosted_subscriptions ||--o{ hosted_author_payments : "pays_for -> hosted_author_payments.hosted_subscription_id"
    hosted_subscriptions ||--o{ hosted_license_grants : "grants_license -> hosted_license_grants.hosted_subscription_id"
    hosted_license_grants ||--o{ hosted_license_revocations : "revoked_by -> hosted_license_revocations.license_grant_id"
    hosted_author_payments ||--o{ hosted_theme_service_proceeds_summaries : "summarized_by -> hosted_theme_service_proceeds_summaries.hosted_author_payment_id"
    hosted_service_proceeds_invoices ||--o{ hosted_service_proceeds_invoice_lines : "contains -> hosted_service_proceeds_invoice_lines.hosted_service_proceeds_invoice_id"
    billing_details_records ||--o{ hosted_service_proceeds_invoices : "billed_from -> hosted_service_proceeds_invoices.from_billing_details_id"
    billing_details_records ||--o{ hosted_service_proceeds_invoices : "billed_to -> hosted_service_proceeds_invoices.to_billing_details_id"
    service_fee_invoices ||--o{ hosted_distributor_license_author_fee_invoice_lines : "contains -> hosted_distributor_license_author_fee_invoice_lines.service_fee_invoice_id"

    %% Financial & Tax Relationships
    orders ||--o{ tax_determinations : "tax_calculated_for -> tax_determinations.quote_id"
    lines ||--o{ line_metadata : "has_metadata -> line_metadata.line_id"
    lines ||--|| line_checks : "checked_up_to -> line_checks.last_line_id"
    statement_lines ||--o{ statement_line_taxes : "includes_taxes -> statement_line_taxes.statement_line_id"

    %% Credit Note Relationships
    buyer_fee_invoices ||--o{ buyer_fee_credit_notes : "credited_by -> buyer_fee_credit_notes.buyer_fee_invoice_id"
    buyer_fee_credit_notes ||--o{ buyer_fee_credit_note_lines : "contains -> buyer_fee_credit_note_lines.buyer_fee_credit_note_id"
    orders ||--o{ buyer_fee_credit_notes : "credited_for -> buyer_fee_credit_notes.order_id"
    orders ||--o{ goodwill_refund_credit_notes : "refunded_for -> goodwill_refund_credit_notes.order_id"
    item_purchase_invoices ||--o{ goodwill_refund_credit_notes : "credited_against -> goodwill_refund_credit_notes.item_purchase_invoice_id"
    goodwill_refund_credit_notes ||--o{ goodwill_refund_credit_note_lines : "contains -> goodwill_refund_credit_note_lines.goodwill_refund_credit_note_id"

    %% Purchase Invoice Relationships
    orders ||--o{ item_purchase_invoices : "invoiced_as -> item_purchase_invoices.order_id"
    orders ||--o{ handling_fee_invoices : "handling_fees_for -> handling_fee_invoices.order_id"
    item_purchase_invoices ||--o{ item_purchase_invoice_lines : "contains -> item_purchase_invoice_lines.item_purchase_invoice_id"
    item_purchase_invoices ||--o{ item_purchase_credit_notes : "credited_by -> item_purchase_credit_notes.invoice_id"
    item_purchase_credit_notes ||--o{ item_purchase_credit_note_lines : "contains -> item_purchase_credit_note_lines.item_purchase_credit_note_id"
    handling_fee_invoices ||--o{ handling_fee_invoice_lines : "contains -> handling_fee_invoice_lines.handling_fee_invoice_id"
    billing_details_records ||--o{ item_purchase_invoices : "billed_from -> item_purchase_invoices.from_billing_details_id"
    billing_details_records ||--o{ item_purchase_invoices : "billed_to -> item_purchase_invoices.to_billing_details_id"
    billing_details_records ||--o{ item_purchase_credit_notes : "credited_from -> item_purchase_credit_notes.from_billing_details_id"
    billing_details_records ||--o{ item_purchase_credit_notes : "credited_to -> item_purchase_credit_notes.to_billing_details_id"
    billing_details_records ||--o{ handling_fee_invoices : "billed_from -> handling_fee_invoices.from_billing_details_id"
    billing_details_records ||--o{ handling_fee_invoices : "billed_to -> handling_fee_invoices.to_billing_details_id"

    %% Phase 2: Infrastructure & Analytics Relationships

    %% SOI System Relationships
    items ||--o{ soi__quality_score__summaries : "quality_scored -> soi__quality_score__summaries.item_id"
    items ||--o{ soi__trending__daily_trends : "daily_trends -> soi__trending__daily_trends.item_id"
    items ||--o{ soi__trending__events : "trending_events -> soi__trending__events.item_id"
    items ||--o{ soi__trending__score_summaries : "trend_summaries -> soi__trending__score_summaries.item_id"

    %% Analytics Relationships
    users ||--o{ sales_distribution_data : "distribution_tracked -> sales_distribution_data.user_id"
    users ||--o{ sales_segmentation_data : "segmentation_tracked -> sales_segmentation_data.author_id"
    order_entries ||--o{ sales_segmentation_data : "segmented_as -> sales_segmentation_data.order_entry_id"
    purchases ||--o{ sales_segmentation_data : "purchase_segmented -> sales_segmentation_data.purchase_id"

    %% Credit Management Relationships
    credit_expiry_events ||--o{ credit_extinguish_events : "extinguished_by -> credit_extinguish_events.expiry_event_id"

    %% Admin & Operations Relationships


    %% Item Rating Relationships
    item_ratings ||--o{ item_rating_author_replies : "replied_to -> item_rating_author_replies.item_rating_id"

    %% Review Stats Relationships
    item_events ||--o{ item_review_stats : "tracked_by -> item_review_stats.item_event_id"

    %% Pricing Relationships
    licenses ||--o{ pricing_default_photo_prices : "priced_for -> pricing_default_photo_prices.license_id"

    %% PayPal Integration Relationships
    pending_deposits ||--o{ paypal_express_checkouts : "processed_via -> paypal_express_checkouts.pending_deposit_id"
    paypal_ipn_messages ||--o{ paypal_ipn_messages : "duplicates -> paypal_ipn_messages.duplicate_of_paypal_ipn_message_id"

    %% Enhanced User Features Relationships
    users ||--o{ user_country_residence_updates : "updates_country -> user_country_residence_updates.user_id"
    users ||--o{ user_deposit_limit_override_events : "overrides_limit -> user_deposit_limit_override_events.user_id"
    users ||--o{ user_deposit_limit_override_events : "authorizes_override -> user_deposit_limit_override_events.authorizing_user_id"
    users ||--o{ user_item_support_preferences : "configures_support -> user_item_support_preferences.user_id"
    users ||--o{ user_item_support_preference_log_entries : "logs_support_changes -> user_item_support_preference_log_entries.user_id"

    %% Item Infrastructure Relationships
    items ||--|| item_uuids : "identified_by -> item_uuids.item_id"
    item_updates ||--o{ item_version_uuids : "versioned_as -> item_version_uuids.item_update_id"

    %% Studio Promotion Relationships
    studio_promotion_generations ||--o{ studio_promotion_chromosomes : "contains -> studio_promotion_chromosomes.generation"

    %% Fraud & Security Relationships
    users ||--o{ fraud_sign_ins : "flagged_for -> fraud_sign_ins.user_id"
    purchases ||--o{ preemptive_fraud_refund_events : "refunded_preemptively -> preemptive_fraud_refund_events.purchase_id"
    users ||--o{ preemptive_fraud_refund_events : "authorizes_refund -> preemptive_fraud_refund_events.authorizing_user_id"
    preemptive_fraud_refund_events ||--o{ preemptive_fraud_refund_purchase_reversals : "reverses_via -> preemptive_fraud_refund_purchase_reversals.preemptive_fraud_refund_event_id"
    purchase_reversals ||--o{ preemptive_fraud_refund_purchase_reversals : "reversed_for -> preemptive_fraud_refund_purchase_reversals.purchase_reversal_id"
    users ||--o{ referral_commission_fraud_reversals : "commission_reversed -> referral_commission_fraud_reversals.user_id"
    users ||--o{ referral_commission_fraud_reversals : "authorizes_reversal -> referral_commission_fraud_reversals.authorizing_user_id"

    %% Legacy & Analytics Relationships
    items ||--o{ bi_purchases : "legacy_purchased -> bi_purchases.item_id"
    users ||--o{ bi_purchases : "legacy_buys -> bi_purchases.user_id"
    users ||--o{ bi_purchases : "legacy_authored -> bi_purchases.author_id"
    pending_deposits ||--o{ bi_purchases : "buy_now_deposit -> bi_purchases.buy_now_pending_deposit_id"
    order_entries ||--o{ bi_purchases : "legacy_ordered -> bi_purchases.order_entry_id"

    %% Event System Relationships
    items ||--o{ free_item_events : "made_free -> free_item_events.item_id"
    users ||--o{ free_item_events : "authorizes_free -> free_item_events.authorizing_user_id"
    users ||--o{ async_job_entries : "has_jobs -> async_job_entries.user_id"
    users ||--o{ country_conflict_status_change_events : "conflict_changed -> country_conflict_status_change_events.user_id"
    users ||--o{ country_conflict_status_change_events : "conflict_actioner -> country_conflict_status_change_events.actioner_id"
    users ||--o{ credit_expiry_date_change_events : "credit_date_changed -> credit_expiry_date_change_events.user_id"
    users ||--o{ credit_unexpiry_events : "credit_unexpired -> credit_unexpiry_events.user_id"
    credit_expiry_events ||--o{ credit_unexpiry_events : "unexpired_by -> credit_unexpiry_events.expiry_event_id"

    %% Audit & Tracking Relationships
    pending_deposits ||--o{ deposit_audit_logs : "audited_pending -> deposit_audit_logs.pending_deposit_id"
    deposits ||--o{ deposit_audit_logs : "audited_deposit -> deposit_audit_logs.deposit_id"
    users ||--o{ deposit_audit_logs : "performed_audit -> deposit_audit_logs.performing_user_id"
    users ||--o{ manually_verified_business_events : "business_verified -> manually_verified_business_events.user_id"
    users ||--o{ manually_verified_business_events : "verifies_business -> manually_verified_business_events.verifying_user_id"
    pending_deposits ||--o{ payment_authorization_events : "authorized_for -> payment_authorization_events.pending_deposit_id"
    users ||--o{ payment_authorization_events : "authorized_user -> payment_authorization_events.user_id"
    users ||--o{ portfolio_events : "portfolio_author -> portfolio_events.author_id"
    users ||--o{ portfolio_events : "portfolio_admin -> portfolio_events.admin_id"
    users ||--o{ user_enablement_events : "enablement_changed -> user_enablement_events.user_id"
    users ||--o{ user_enablement_events : "authorizes_enablement -> user_enablement_events.authorised_user_id"

    %% Notification & Settings Relationships
    purchases ||--|| purchase_update_notification_preferences : "notification_pref -> purchase_update_notification_preferences.purchase_id"
    users ||--|| financial_document_settings : "financial_settings -> financial_document_settings.user_id"
    billing_details_records ||--o{ billing_details_tax_forms : "has_tax_forms -> billing_details_tax_forms.billing_details_record_id"

    %% Cache Relationships
    users ||--|| refund_request_last_visited_cache : "refund_visited -> refund_request_last_visited_cache.user_id"
    users ||--|| refund_requests_author_closed_cache : "closed_refunds -> refund_requests_author_closed_cache.author_id"
    users ||--|| refund_requests_author_open_cache : "open_refunds -> refund_requests_author_open_cache.author_id"

    %% Phase 3: Specialized Features Relationships

    %% Commercial Transaction Mapping Relationships
    order_entries ||--|| order_entry_commercial_transactions : "mapped_to_transaction -> order_entry_commercial_transactions.order_entry_id"
    commercial_transaction_records ||--o{ order_entry_commercial_transactions : "mapped_from_order -> order_entry_commercial_transactions.commercial_transaction_id"
    purchases ||--|| purchase_commercial_transactions : "mapped_to_transaction -> purchase_commercial_transactions.purchase_id"
    commercial_transaction_records ||--o{ purchase_commercial_transactions : "mapped_from_purchase -> purchase_commercial_transactions.commercial_transaction_id"
    orders ||--|| quote_commercial_transactions : "quoted_as_transaction -> quote_commercial_transactions.quote_id"
    commercial_transaction_records ||--o{ quote_commercial_transactions : "quoted_from_order -> quote_commercial_transactions.commercial_transaction_id"

    %% Temporary License Relationships
    users ||--o{ temporary_license_grants : "granted_temporary_license -> temporary_license_grants.licensee_id"
    items ||--o{ temporary_license_grants : "temporarily_licensed -> temporary_license_grants.item_id"

    %% DAM Migration Relationships
    users ||--o{ dam_author_migrations : "migrated_to_dam -> dam_author_migrations.user_id"

    %% Proofing Enhancement Relationships
    users ||--o{ proofing_trusted_author_bulk_approvals : "bulk_approved -> proofing_trusted_author_bulk_approvals.user_id"

    %% Credit Management Enhancement Relationships
    users ||--o{ credit_expiry_extension_request_events : "requests_extension -> credit_expiry_extension_request_events.user_id"
    users ||--o{ credit_expiry_extension_request_events : "extension_requested_by -> credit_expiry_extension_request_events.requested_by_user_id"
    users ||--o{ credit_expiry_notification_events : "notified_of_expiry -> credit_expiry_notification_events.user_id"
    users ||--o{ credit_expiry_pending_expiry_dates : "pending_expiry -> credit_expiry_pending_expiry_dates.user_id"

    %% Deposit Enhancement Relationships
    deposits ||--|| deposit_receipts : "receipt_for -> deposit_receipts.deposit_id"
    deposits ||--o{ deposit_reversals : "reversed_by -> deposit_reversals.deposit_id"
    users ||--o{ deposit_reversals : "authorizes_deposit_reversal -> deposit_reversals.authorizing_user_id"
    deposits ||--|| deposit_invoice_additional_details : "additional_details -> deposit_invoice_additional_details.deposit_id"
    deposits ||--|| buy_now_deposit_invoice_details : "buy_now_details -> buy_now_deposit_invoice_details.deposit_id"

    %% Credit Note Enhancement Relationships
    handling_fee_invoices ||--o{ handling_fee_credit_notes : "credited_by -> handling_fee_credit_notes.handling_fee_invoice_id"
    handling_fee_credit_notes ||--o{ handling_fee_credit_note_lines : "contains -> handling_fee_credit_note_lines.handling_fee_credit_note_id"

    %% Infrastructure & Security Relationships
    attachments ||--o{ attachment_related_data : "has_related_data -> attachment_related_data.attachment_id"
    collections ||--o{ collection_ratings : "rated_by -> collection_ratings.collection_id"
    users ||--o{ collection_ratings : "rates_collection -> collection_ratings.user_id"
    users ||--o{ ftp_signin_attempts : "ftp_attempts -> ftp_signin_attempts.user_id"
    users ||--o{ blocklisted_user_agents : "blocklisted_by -> blocklisted_user_agents.blocklister_id"
    users ||--|| billing_details_locks : "billing_locked -> billing_details_locks.user_id"

    %% Authorship & Country Conflict Relationships
    users ||--o{ authorship_rights : "has_authorship_rights -> authorship_rights.user_id"
    users ||--o{ country_conflict_current_statuses : "has_country_conflicts -> country_conflict_current_statuses.user_id"

    %% Payment Enhancement Relationships
    users ||--o{ payment_account_verifications : "payment_verified -> payment_account_verifications.user_id"
    payment_messages ||--|| payment_message_terms : "has_terms -> payment_message_terms.payment_message_id"
    deposits ||--o{ payment_service_transaction_reversals : "payment_reversed -> payment_service_transaction_reversals.deposit_id"
    pending_deposits ||--o{ payment_void_events : "payment_voided -> payment_void_events.pending_deposit_id"
    users ||--o{ payment_void_events : "void_authorized_for -> payment_void_events.user_id"

    %% Item Support Enhancement Relationships
    item_support_offerings ||--o{ item_support_offering_versions : "versioned_as -> item_support_offering_versions.offering_id"

    %% Statement Enhancement Relationships
    statement_lines ||--|| statement_line_reversal_details : "reversal_details -> statement_line_reversal_details.statement_line_id"

    %% Tax Verification Relationships
    users ||--o{ manually_verified_us_sales_tax_exemption_events : "tax_exemption_verified -> manually_verified_us_sales_tax_exemption_events.user_id"
    users ||--o{ manually_verified_us_sales_tax_exemption_events : "verifies_tax_exemption -> manually_verified_us_sales_tax_exemption_events.verifying_user_id"

    %% Buy Now Transaction Relationships
    purchases ||--o{ transaction_details_for_buy_now_purchases : "buy_now_transaction_details -> transaction_details_for_buy_now_purchases.buy_now_purchase_id"

    %% Infrastructure Support Relationships

    service_fee_invoices ||--o{ skrill_fee_invoice_lines : "skrill_fees -> skrill_fee_invoice_lines.service_fee_invoice_id"
    users ||--o{ spam_ips : "blocked_spam_ip -> spam_ips.blocked_by_user_id"

    %% Final Phase 3 Relationships

    %% Legacy Commercial Transaction Migration Relationships
    commercial_transaction_records ||--o{ commercial_transaction_migrated_legacy_commercial_transactions : "migrated_from_legacy -> commercial_transaction_migrated_legacy_commercial_transactions.generic_ct_id"
    purchases ||--o{ purchase_legacy_commercial_transactions : "legacy_mapped_to -> purchase_legacy_commercial_transactions.purchase_id"
    commercial_transaction_records ||--o{ purchase_legacy_commercial_transactions : "legacy_mapped_from -> purchase_legacy_commercial_transactions.commercial_transaction_id"
    purchase_reversals ||--o{ purchase_reversal_commercial_transactions : "reversal_mapped_to -> purchase_reversal_commercial_transactions.purchase_reversal_id"
    commercial_transaction_records ||--o{ purchase_reversal_commercial_transactions : "reversal_mapped_from -> purchase_reversal_commercial_transactions.commercial_transaction_id"
    commercial_transaction_records ||--o{ reversal_commercial_transactions : "reversed_as -> reversal_commercial_transactions.commercial_transaction_id"

    %% Financial Document Tax Supplier Relationships
    billing_details_records ||--o{ financial_document_tax_suppliers : "tax_supplier_for -> financial_document_tax_suppliers.billing_details_record_id"

    %% Support Fee Relationships
    service_fee_invoices ||--o{ support_author_fee_invoice_lines : "support_fees -> support_author_fee_invoice_lines.service_fee_invoice_id"

    %% User Management Enhancement Relationships
    users ||--o{ trusted_update_rights_events : "trusted_rights_author -> trusted_update_rights_events.author_id"
    users ||--o{ trusted_update_rights_events : "trusted_rights_admin -> trusted_update_rights_events.admin_id"
    users ||--o{ user_acknowledgements : "acknowledges -> user_acknowledgements.user_id"
    users ||--o{ user_disable_operations : "disabled_user -> user_disable_operations.user_id"
    users ||--o{ user_disable_operations : "disable_actioner -> user_disable_operations.actioned_by_user_id"
    users ||--o{ user_licence_exclusions : "licence_excluded -> user_licence_exclusions.user_id"

    %% Payment Credit Card Log Relationships
    users ||--o{ payment__credit_card__buy_now_complete_log_entries : "buy_now_completed -> payment__credit_card__buy_now_complete_log_entries.user_id"
    pending_deposits ||--o{ payment__credit_card__buy_now_complete_log_entries : "buy_now_logged -> payment__credit_card__buy_now_complete_log_entries.pending_deposit_id"
    users ||--o{ payment__credit_card__buy_now_start_log_entries : "buy_now_started -> payment__credit_card__buy_now_start_log_entries.user_id"
    users ||--o{ payment__credit_card__deposit_complete_log_entries : "deposit_completed -> payment__credit_card__deposit_complete_log_entries.user_id"
    pending_deposits ||--o{ payment__credit_card__deposit_complete_log_entries : "deposit_logged -> payment__credit_card__deposit_complete_log_entries.pending_deposit_id"
    users ||--o{ payment__credit_card__deposit_start_log_entries : "deposit_started -> payment__credit_card__deposit_start_log_entries.user_id"

    %% Proofing Enhancement Relationships
    users ||--o{ proofing_skill_set_log_entries : "skill_set_changed -> proofing_skill_set_log_entries.user_id"
    users ||--o{ proofing_skill_set_log_entries : "skill_set_changer -> proofing_skill_set_log_entries.changed_by_user_id"

    %% Missing Tables Relationships
    billing_details_records ||--o{ billing_details_current_for_envato : "current_for_envato -> billing_details_current_for_envato.billing_details_id"
    item_support_entitlements ||--o{ item_support_expiring_support_notification_events : "notified_expiring -> item_support_expiring_support_notification_events.item_support_entitlement_id"
    users ||--o{ item_support_expiring_support_notification_events : "notified_user -> item_support_expiring_support_notification_events.user_id"
    billing_details_records ||--o{ market_identity_billing_details_mapping : "mapped_to_identity -> market_identity_billing_details_mapping.market_billing_details_id"
    service_fee_invoices ||--o{ swift_fee_invoice_lines : "swift_fees -> swift_fee_invoice_lines.service_fee_invoice_id"
