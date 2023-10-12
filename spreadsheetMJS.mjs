import { GoogleSpreadsheet } from 'google-spreadsheet';
import creds from './client_secret.json' assert { type: 'json' };
//Please replace 'fill' with Google Spreadsheet's private ID.
const doc = new GoogleSpreadsheet('fill');

// print winners nicely
function printNice(winner){
    console.log("ID: " + winner.UserID + ", Wins: " + winner.AuctionsWon); 
}

export async function updateWin(id, character){
    const doc = new GoogleSpreadsheet('fill');
    await doc.useServiceAccountAuth({
        client_email: creds.client_email,
        private_key: creds.private_key, 
    });
    await doc.loadInfo();

    // Update History Sheet
    const sheetHistory = doc.sheetsByIndex[1];
    const newAuction = await sheetHistory.addRow({UserID: id, CharacterWon: character});
    await newAuction.save(); 

    // Update Number of Wins sheet
    const sheetWins = doc.sheetsByIndex[0];
    const rows = await sheetWins.getRows({ offset: 0 });

    const getUserID = user => user.UserID == id;
    const idx = rows.findIndex(getUserID);

    if (idx == -1){
        // ID not found. Create new row
        const newRow = await sheetWins.addRow({UserID: id, AuctionsWon: 1});
        await newRow.save(); 
        return;
    }

    // ID found! Increment #AuctionsWon
    rows[idx].AuctionsWon = Number(rows[idx].AuctionsWon) + 1;
    await rows[idx].save(); 

    // Swap to maintain order
    async function swapRows(rowIDX1, rowIDX2){
        let tempUserID = rows[rowIDX1].UserID;
        let tempAuctionsWon = rows[rowIDX1].AuctionsWon;
        rows[rowIDX1].UserID = rows[rowIDX2].UserID;
        rows[rowIDX1].AuctionsWon = rows[rowIDX2].AuctionsWon;
        rows[rowIDX2].UserID = tempUserID;
        rows[rowIDX2].AuctionsWon = tempAuctionsWon;
        await rows[rowIDX1].save();
        await rows[rowIDX2].save();
    }
    
    var newAuctionsWon = Number(rows[idx].AuctionsWon);
    if (idx == 0 || Number(rows[idx - 1].AuctionsWon) >= newAuctionsWon)
        return; // no swaps needed

    // look for next index to swap
    var i;
    for (i = idx - 1; i >= -1; i-=1) {
        if (i == -1 || Number(rows[i].AuctionsWon) >= newAuctionsWon )
            break;
    }
    swapRows(i+1, idx);
}

// Get first top entries in first sheet
export async function getTop(top) {
    const doc = new GoogleSpreadsheet('fill');
    await doc.useServiceAccountAuth({
        client_email: creds.client_email,
        private_key: creds.private_key, 
    });
    await doc.loadInfo();
    const sheetWins = doc.sheetsByIndex[0];
    const rows = await sheetWins.getRows({ offset: 0 });
    
    let lb = {
        ids: new Array(top).fill(""),
        wins: new Array(top).fill(0)
    };
    
    for (let i = 0; i < top; i++){
        lb.ids[i] = rows[i].UserID;
        lb.wins[i] = rows[i].AuctionsWon;
    }
    return lb;
}






 