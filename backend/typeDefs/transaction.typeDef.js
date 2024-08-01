const transactionTypeDef = `#graphql
type Transaction {
_id: ID!
userId: ID!
description: String!
paymentType: String!
category: String!
amount: Float!
location: String
date: String
user: User!
}

type CategoryStatistics{
    category: String!
    totalAmount: Float!
}

type Query{
    transactions: [Transaction!]
    transaction(transactionId: ID!): Transaction
    categoryStatistics:[CategoryStatistics!]
}

type Mutation {
createTransaction(input: createTransaction!): Transaction!
updateTransaction(input: updateTransaction!): Transaction!
deleteTransaction(transactionId: ID!):Transaction!
}


input createTransaction {
description: String!
paymentType: String!
category: String!
amount: Float!
date: String!
location: String
}

input updateTransaction{
transactionId: ID!
description: String
paymentType: String
category: String
amount: Float
location: String
date: String
}
`

export default transactionTypeDef;