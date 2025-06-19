erDiagram
User {
int id PK
string name NOT NULL
string email
}
Order {
int id PK
int user_id FK
date order_date
decimal total
}
Product {
int id PK
string name
decimal price
string category
}
OrderItem {
int id PK
int order_id FK
int product_id FK
int quantity
decimal unit_price
}
User ||--o{ Order : places
Order ||--o{ OrderItem : contains
Product }o--o{ OrderItem : included_in
