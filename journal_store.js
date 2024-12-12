import express from "express";

const store = express.Router();

const allJournals = {};

// create allJournals to include all user info
const initAllJournals = async () =>{
    const journals = await JournalModel.find({});
    journals.forEach(journal =>{
        allJournals[journal.username] = journal.fortunes;
    });
}

//add fortune to users journal
const addFortune = async (username, fortuneToAdd)=>{
    const journal = await JournalModel.findOneAndUpdate(
        {username},{$push:{fortunes:{text:fortuneToAdd}}},
        {new: true,upsert: true}
    );
    allJournals[username].push({text:fortuneToAdd,date: new Date()});
    return journal;
    };

// return all fortunes in a users journal
const getFortunes = async (username) => {
    try{
        if (allJournals[username]){
            return allJournals[username];
        }
        const journal = await JournalModel.findOne({username});
        const fortunes = journal ? journal.fortunes :[];
        allJournals[username] = fortunes;
        return fortunes;
    }catch (error){
        throw new Error('Bad request');
    }
};

// get recent fortune to return/share w/other users
const getMostRecent = async (username) => {
    try{
        const journal = await JournalModel.findOne(
            {username},
            {fortunes:{$slice:-1}}
        );
        if (journal && journal.fortunes.length > 0){
            return journal.fortunes[0];
        }else{
            // return null for emoty fortune dict
            return null;
        }
    } catch (error){
        throw new Error('No recent fortunes available');
    }
};

export{initAllJournals,addFortune,getFortunes,getMostRecent};
export default store;

