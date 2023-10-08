import { AlgorandTransaction } from "@subql/types-algorand";
import { Transaction, Address } from "../types";

export async function handleTransaction(
  tx: AlgorandTransaction
): Promise<void> {
  // logger.info(JSON.stringify(tx));
  if (tx.assetTransferTransaction && tx.id && tx.confirmedRound) {
    // ensure that our address entities exist
    const senderAddress = await Address.get(tx.sender.toLowerCase());
    if (!senderAddress) {
      await new Address(tx.sender.toLowerCase()).save();
    }

    const receiverAddress = await Address.get(
      tx.assetTransferTransaction.receiver.toLowerCase()
    );
    if (!receiverAddress) {
      await new Address(
        tx.assetTransferTransaction.receiver.toLowerCase()
      ).save();
    }

    // Create the new transfer entity
    const transactionEntity: Transaction = Transaction.create({
      id: tx.id,
      blockHeight: tx.confirmedRound,
      senderId: tx.sender.toLowerCase(),
      receiverId: tx.assetTransferTransaction.receiver.toLowerCase(),
      amount: BigInt(tx.assetTransferTransaction.amount),
    });
    await transactionEntity.save();
  }
}
