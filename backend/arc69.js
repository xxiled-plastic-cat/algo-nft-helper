import axios from 'axios';

/** Fetches and parses ARC69 metadata for Algorand NFTs. */
export class Arc69 {
    async fetch(assetId) {
        // Fetch `acfg` transactions.449412782
        const url = `https://mainnet-idx.algonode.cloud/v2/assets/${assetId}/transactions?tx-type=acfg`;
        let transactions;
        try {
            //transactions = (await axios.get(url).then((res) => res.json())).transactions;
            const response = await axios.get(url);
            transactions = response.data.transactions;
        }
        catch (err) {
            console.error(err);
            return null;
        }

        // Sort the most recent `acfg` transactions first.
        transactions.sort((a, b) => b["round-time"] - a["round-time"]);

        // Attempt to parse each `acf` transaction's note for ARC69 metadata.
        for (const transaction of transactions) {
            try {
                const noteBase64 = transaction.note;
                const noteString = atob(noteBase64)
                    .trim()
                    .replace(/[^ -~]+/g, "");
                const noteObject = JSON.parse(noteString);
                if (noteObject.standard === "arc69") {
                    return noteObject;
                }
            }
            catch (err) {
                // Oh well...
            }
        }
        return null;
    }
}
