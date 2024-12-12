import mongoose from "mongoose"

//defines journal schema as username:{fortunes with date added}
const JournalSchema = new mongoose.Schema({
    username:{type:String,required: true}, 
    fortunes:[{text:{ String,required: true},date:{type: Date, default:Date.now}}]
});

const JournalModel = mongoose.model('Journal',JournalSchema);
export default JournalModel;