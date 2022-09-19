import { AlgorandBlock, AlgorandTransaction } from "@subql/types-algorand";
import { Block, Transaction } from "../types";

export async function handleBlock(block: AlgorandBlock): Promise<void> {
  const blockEntity: Block = Block.create({
    id: block.round.toString(),
    height: block.round,
  });
  await blockEntity.save();
}

export async function handleTransaction(
  tx: AlgorandTransaction
): Promise<void> {
  const transactionEntity: Transaction = Transaction.create({
    id: tx.id,
    blockHeight: tx.confirmedRound,
    sender: tx.sender,
    assetId:
      tx.txType === "afrz"
        ? BigInt(tx.assetFreezeTransaction.assetId)
        : tx.txType === "acfg"
        ? BigInt(tx.assetConfigTransaction.assetId)
        : undefined,
    amount:
      tx.txType === "axfer"
        ? BigInt(tx.assetTransferTransaction.amount)
        : tx.txType === "pay"
        ? BigInt(tx.paymentTransaction.amount)
        : undefined,
  });
  await transactionEntity.save();
}
