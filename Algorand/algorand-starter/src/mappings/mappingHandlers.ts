import { AlgorandBlock, AlgorandTransaction } from "@subql/types-algorand";
import { Block, Transaction, Address } from "../types";
import assert from "assert";

export async function handleBlock(block: AlgorandBlock): Promise<void> {
  // The trigger handler for this function has been commented out in the project manifest (project.yaml)
  const blockEntity: Block = Block.create({
    id: block.round.toString(),
    height: block.round,
  });
  await blockEntity.save();
}

export async function handleTransaction(
  tx: AlgorandTransaction
): Promise<void> {
  // logger.info(JSON.stringify(tx));
  if (tx.assetTransferTransaction) {
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

    assert(tx.id, "tx.id missing");
    assert(tx.confirmedRound, "tx.confirmedRound missing");
    // Create the new transfer entity
    const transactionEntity = Transaction.create({
      id: tx.id,
      blockHeight: tx.confirmedRound,
      senderId: tx.sender.toLowerCase(),
      amount: BigInt(tx.assetTransferTransaction.amount),
    });
    await transactionEntity.save();
  }
}
