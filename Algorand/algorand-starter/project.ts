import {
  AlgorandDataSourceKind,
  AlgorandHandlerKind,
  AlgorandProject,
} from "@subql/types-algorand";

// Can expand the Datasource processor types via the genreic param
const project: AlgorandProject = {
  specVersion: "1.0.0",
  name: "algorand-subql-starter",
  version: "1.0.0",
  runner: {
    node: {
      name: "@subql/node-algorand",
      version: ">=1.0.0",
    },
    query: {
      name: "@subql/query",
      version: "*",
    },
  },
  description:
    "This project can be used as a starting point for developing your Algorand SubQuery project",
  repository: "https://github.com/subquery/algorand-subql-starter",
  schema: {
    file: "./schema.graphql",
  },
  network: {
    // For the testnet use the following
    // chainId: "SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI="
    chainId: "wGHE2Pwdvd7S12BL5FaOP20EGYesN73ktiC1qzkkit8=",
    /**
     * These endpoint(s) should be public non-pruned archive node
     * We recommend providing more than one endpoint for improved reliability, performance, and uptime
     * Public nodes may be rate limited, which can affect indexing speed
     * When developing your project we suggest getting a private API key
     * If you use a rate limited endpoint, adjust the --batch-size and --workers parameters
     * These settings can be found in your docker-compose.yaml, they will slow indexing but prevent your project being rate limited
     */
    endpoint: ["https://mainnet-idx.algonode.cloud"],
  },
  dataSources: [
    {
      kind: AlgorandDataSourceKind.Runtime,
      startBlock: 8712119,
      mapping: {
        file: "./dist/index.js",
        handlers: [
          // {
          //   block handlers are slow and we are best to avoid them if possible
          //   handler: handleBlock,
          //   kind: AlgorandHandlerKind.Block
          // }
          {
            handler: "handleTransaction",
            kind: AlgorandHandlerKind.Transaction,
            filter: {
              txType: "axfer", // From the application TransactionType enum https://github.com/algorand/js-algorand-sdk/blob/5eb7b4ffe5fcb46812785fdc79e8a7edb78b084f/src/types/transactions/base.ts#L6
              assetId: 27165954, // Planet watch asset
              sender:
                "ZW3ISEHZUHPO7OZGMKLKIIMKVICOUDRCERI454I3DB2BH52HGLSO67W754",
              // applicationId: 1
              // receiver: "XXXXX"
            },
          },
        ],
      },
    },
  ],
};

export default project;
