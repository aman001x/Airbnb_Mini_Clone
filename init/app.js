const mongoose = require("mongoose");
const initData = require("./data.js")
const Listing = require("../models/listing.js")
const mongourl ='mongodb://127.0.0.1:27017/wanderlust'
main().then(()=>{
    console.log("connect to DB")
})
.catch((err)=>{
    console.log(err)
})

    async function main(){
        await mongoose.connect(mongourl)
    }
    
    const initDB = async()=>{
        await Listing.deleteMany({});
        initData.data = initData.data.map((obj)=>({
            ...obj, owner:'66bc528532c8ac6dfb213400',
        }))
        await Listing.insertMany(initData.data);
        console.log("data was initlize");
    }
    initDB();