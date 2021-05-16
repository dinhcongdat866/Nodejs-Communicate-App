const { MongoClient } = require('mongodb');
const upd=require('./updatedb')
/*async function main() {
    const uri = "mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false";

    const client = new MongoClient(uri);

    try {
        // Connect to the MongoDB cluster
        await client.connect();

        // Make the appropriate DB calls
        await listDatabases(client);
        await createlisting(client, {
            name: "Ofveberg",
            age:15,
            gender:"Male"
        })
        await createMultiplelisting(client,[
            {
            name:" Uveveve",
            age:20,
            gender:"Male"
            },
            {
            name:" Sol A Sin-chan",
            age:25,
            gender:"Female"
            },
        {
            name:" Oblibobo",
            age:30,
            gender:"Undefined"
        }]);
        await findOneListingByName(client, " Oblibobo");
        await upd.updateList(client," Oblibobo",{age: 69,gender:"Gayyyy as fuck"});
        await upd.updateMultiple(client," Oblibobo",{age:100,gender:"Who cares he already dead"})
        await findOneListingByName(client, " Oblibobo");
        await upd.deleteListingByName(client," Oblibobo");
        await upd.deleteallListingByName(client," Uveveve");
    } catch (e) {
        console.error(e);
    } finally {
        // Close the connection to the MongoDB cluster
        await client.close();
    }
}
*/
//main().catch(console.error);

/**
 * Print the names of all available databases
 * @param {MongoClient} client A MongoClient that is connected to a cluster
 */
async function listDatabases(client) {
    databasesList = await client.db().admin().listDatabases();

    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};
async function createlisting(client, newlist){
    const result=await client.db("admin").collection("usernamepassword").insertOne(newlist)
    console.log(`New listing created with the following id : ${result.insertedId}`)
}
async function createMultiplelisting(client, newlists){
    const result=await client.db("admin").collection("usernamepassword").insertMany(newlists)
    console.log(`${result.insertedCount} new listing(s) created with the following id(s): `)
    console.log(result.insertedIds)
}
async function findOneListingByName(client, nameOfListing) {
    const result = await client.db("admin").collection("usernamepassword").findOne({ username: nameOfListing });

    if (result) {
        console.log(`Found a listing in the collection with the name '${nameOfListing}':`);
        console.log(result);
    } else {
        console.log(`No listings found with the name '${nameOfListing}'`);
    }
}
async function findusernamepassword(client, usernamequery){
    const result= await client.db("admin").collection("usernamepassword").findOne({ username: usernamequery });
    if (result) {
        console.log(`Found a listing in the collection with the name '${nameOfListing}':`);
        console.log(result.password);
    } else {
        console.log(`No listings found with the name '${nameOfListing}'`);
    }
}
async function findall(client,query){
    const result= await client.db("admin").collection("usernamepassword").findOne({username:query});
    if(result){
        return result
    }
    else{
        console.log("Error")
    }
}
 async function findusername(client, query){
    const result= await client.db("admin").collection("usernamepassword").findOne({ username: query });
    if (result) {
        console.log('asfasf')
        console.log(result);
        return result
    } else {
        console.log(`No username found with the name '${query}'`);
        return null
    }
}

async function findusernameid(client, query){
    const result= await client.db("admin").collection("usernamepassword").findOne({ id: query });
    if (result) {
        console.log(result)
        return result
    } else {
        console.log(`No listings found with the name '${query}'`);
        return null
    }
}
async function findroomuser(client,query){//here
    result=[]
    const result= await client.db("admin").collection("usernamepassword").find({room:query})
    if (result) {
        console.log(result)
        return result
    } else {
        console.log(`No listings found with the name '${query}'`);
        return null
    }
}
async function deleteListingById(client,query){//here
    const result= await client.db("admin").collection("usernamepassword").deleteOne({id:query})
    console.log(`${result.deletedCount} document(s) was/were deleted.`);
}
module.exports={listDatabases:listDatabases,
createlisting:createlisting,
createMultiplelisting:createMultiplelisting,
findOneListingByName:findOneListingByName,
findusernamepassword:findusernamepassword,
findall:findall,
findusername:findusername,
findusernameid:findusernameid,
findroomuser:findroomuser,
deleteListingById:deleteListingById}