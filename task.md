## Task: Build mermaid diagram parser using mermaid js interfaces

## Context

<context>
The mermaid js provides the interfaces we can resuse to make the parsers much easier and accurate.

With the diagram as an example

```
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
`
```

We can get the mermaid diagram by

```
const diagram = await mermaid.mermaidAPI.getDiagramFromText(mermaidGraph);
```

Then we can get a parser object by

```
const parser = diagram.getParser()
```

We will have many interfaces to get such as tables and relations

```
const tables = parser.yy.getEntities()
```

The data structure of the tables list is

```
{
  User: { attributes: [ [Object], [Object], [Object], [Object] ] },
  Order: { attributes: [ [Object], [Object], [Object], [Object] ] },
  Product: { attributes: [ [Object], [Object], [Object], [Object] ] },
  OrderItem: { attributes: [ [Object], [Object], [Object], [Object], [Object] ] }
}
```

Example ONLY: The attributes of `User` object is

```
[
  {
    attributeType: 'int',
    attributeName: 'id',
    attributeKeyTypeList: [ 'PK' ]
  },
  {
    attributeType: 'int',
    attributeName: 'user_id',
    attributeKeyTypeList: [ 'FK' ]
  },
  { attributeType: 'date', attributeName: 'order_date' },
  { attributeType: 'decimal', attributeName: 'total' }
]
```

You can retries table and table columns, keys information from here

To get relationships:

```
const relationships = parser.yy.getRelationships()
```

The data structure of relationships list is

```
[
  {
    entityA: 'User',
    roleA: 'places',
    entityB: 'Order',
    relSpec: {
      cardA: 'ZERO_OR_MORE',
      relType: 'IDENTIFYING',
      cardB: 'ONLY_ONE'
    }
  },
  {
    entityA: 'Order',
    roleA: 'contains',
    entityB: 'OrderItem',
    relSpec: {
      cardA: 'ZERO_OR_MORE',
      relType: 'IDENTIFYING',
      cardB: 'ONLY_ONE'
    }
  },
  {
    entityA: 'Product',
    roleA: 'included_in',
    entityB: 'OrderItem',
    relSpec: {
      cardA: 'ZERO_OR_MORE',
      relType: 'IDENTIFYING',
      cardB: 'ZERO_OR_MORE'
    }
  }
]
```

Noticed from the relationships example above, use `Order ||--o{ OrderItem : contains` as an example:

```
entityA is Order (fromTable)
entityB is OrderItem (toTable)
rolA is contains (description)
relSpec.cardA is ZERO_OR_MORE (rightCardinality)
relSpec.relType is either IDENTIFYING or NON-IDENTIFYING
relSpec.cardB is ONLY_ONE (leftCardinality)
```

Also you can find the test case as another example from mermaid js github

```
it('should associate two entities correctly', function () {
    erDiagram.parser.parse('erDiagram\nCAR ||--o{ DRIVER : "insured for"');
    const entities = erDb.getEntities();
    const relationships = erDb.getRelationships();

    expect(entities.has('CAR')).toBe(true);
    expect(entities.has('DRIVER')).toBe(true);
    expect(relationships.length).toBe(1);
    expect(relationships[0].relSpec.cardA).toBe(erDb.Cardinality.ZERO_OR_MORE);
    expect(relationships[0].relSpec.cardB).toBe(erDb.Cardinality.ONLY_ONE);
    expect(relationships[0].relSpec.relType).toBe(erDb.Identification.IDENTIFYING);
  });
```

</context>

You work is

<steps>
1. Create a componet under app/lib/mermaidPaser which will use mermaid js per the example to get tables and relationships
2. Reuse the types defined in app/types/erd,ts, to exactly map the mermaid js returned object onto those types, so that we don't need to change the logic in `erdRenderer`
3. Use the new componet generated diagram data to render
</setps>

<important_note>
Undertand the context and steps and current data types, add the new feature carefully and ensure the relationship mapping correctly which is important
</important_note>
