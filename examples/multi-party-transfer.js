const { Client, CryptoTransferTransaction, Hbar } = require("@hashgraph/sdk");

async function main() {

  const operatorAccount = process.env.OPERATOR_ID;
  const operatorPrivateKey = process.env.OPERATOR_KEY;

  if (operatorPrivateKey == null || operatorAccount == null) {
    throw new Error(
      "environment variables OPERATOR_KEY and OPERATOR_ID must be present"
    );
  }

  const client = new Client({
    network: { "0.testnet.hedera.com:50211": "0.0.3" },
    operator: {
      account: operatorAccount,
      privateKey: operatorPrivateKey
    }
  });

  const transactionId = await new CryptoTransferTransaction()
    .addSender(operatorAccount, Hbar.of(2)) // define total amount of hbar to send
    .addRecipient("0.0.3", Hbar.of(1)) // add recipient, and amount of hbar
    .addRecipient("0.0.17210", Hbar.of(1)) // add recipient, and amount of hbar
    .execute(client);

  const receipt = await transactionId.getRecord(client);
  console.log("receipt ", JSON.stringify(receipt) + "\n");
}

main();
