import Transaction from "../models/transaction.model.js";


const transactionResolver = {
    Query:{
        transactions:async(_,__,context)=>{
            try {
                if(!context.getUser()){
                    throw new Error("Unauthorized user")
                }

                const userId = await context.getUser()._id;
                const transactions = await Transaction.find({userId})
                return transactions;
            } catch (err) {
                console.log("Error getting Transactions: ",err)
                throw new Error(err.message || "Error getting Transaction")
            }
        },
        transaction: async(_,{transactionId})=>{
         try {
            const transaction = await Transaction.findById(transactionId);
            return transaction;
         } catch (err) {
            console.log("Error getting Transaction: ",err)
            throw new Error(err.message || "Error getting Transaction")
         }
        }

        // TODO => Add categoryStatistics query
    },
    Mutation:{
        createTransaction: async(_,{input},context)=>{
            try {
                const newTransaction = new Transaction({
                    ...input,
                    userId:context.getUser().id
                })
                await newTransaction.save();
                return newTransaction;
            } catch (err) {
                console.error("Error creating transaction: " ,err)
                throw new Error("Error creating transaction")
                
            }
        },
        updateTransaction: async(_,{input})=>{
            try {
                const updatedTransaction = await Transaction.findByIdAndUpdate(input.transactionId , input , {new:true});
                return updatedTransaction;
            } catch (err) {
                console.error("Error updating transaction: ",err)
                throw new Error("Error updating transaction")
                
            }
        },
        deleteTransaction: async(_,{transactionId})=>{
           try {
            const deletedTransaction = await Transaction.findByIdAndDelete(transactionId);
            return deletedTransaction; 
           } catch (err) {
            console.error("Error deleting transaction: ",err)
            throw new Error("Error deleting transaction")
            
           }
        },
    }
}

export default transactionResolver;