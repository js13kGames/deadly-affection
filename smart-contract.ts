import { NearContract, NearBindgen, near, call, view, assert, Vector } from 'near-sdk-js'

const STORAGE_COST: bigint = BigInt("1000000000000000000000");

class Transaction {
    constructor(
        public ownerId: string,
        public item: string,
        public amount: string,
        public purchasedAt: string,
    ) {}
}

@NearBindgen
class TransactionContract extends NearContract {
    beneficiary: string;

    transactions: Vector;

    constructor({ beneficiary }: { beneficiary:string }) {
        super();

        // makePrivate();

        this.beneficiary = beneficiary;
        this.transactions = new Vector('a');
    }

    default() {
        return new TransactionContract({ beneficiary: "dog-church.testnet"});
    }

    @call
    buy({ item }) {
        const buyer = near.signerAccountId();
        const amount: bigint = near.attachedDeposit() as bigint;
        const purchasedAt: bigint = near.blockTimestamp() as bigint;

        assert(amount > STORAGE_COST, `Attach at least ${STORAGE_COST} yoctoNEAR!`);

        const amountWithoutStoreageCost = amount - STORAGE_COST;

        const transaction = new Transaction(
            buyer,
            item,
            amount.toString(),
            purchasedAt.toString(),
        );

        this.transactions.push(transaction);

        const promise = near.promiseBatchCreate(this.beneficiary);
        near.promiseBatchActionTransfer(promise, amountWithoutStoreageCost);

        return `Bought "${item}" for ${amount} yoctoNEAR!`;
    }

    @view
    viewTransactions({ accountId }) {
        return this.transactions.toArray().filter((transaction: Transaction) => {
            return transaction.ownerId === accountId;
        });
    }
}

function makePrivate() {
    assert(near.predecessorAccountId() == near.currentAccountId(), `This is a private method!`)
}
