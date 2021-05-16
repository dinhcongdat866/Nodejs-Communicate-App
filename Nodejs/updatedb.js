
    async function updateList(client,nameOfListing,updatedListing){
        console.log("Launched update one")
        const result= await client.db("admin").collection("listingsAndReviews").updateOne({name: nameOfListing},{$set:updatedListing});
        console.log(`${result.matchedCount} document(s) matched the query criteria.`);
        console.log(`${result.modifiedCount} document(s) was/were updated.`);
    }
    async function updateMultiple(client,nameOfListing,updatedListing){
        console.log("Launched multiple update")
        const result=await client.db("admin").collection("listingsAndReviews").updateMany({name: nameOfListing},{$set: updatedListing})
        console.log(`${result.matchedCount} document(s) matched the query criteria.`);
        console.log(`${result.modifiedCount} document(s) was/were updated.`);
    }
    async function deleteListingByName(client, nameOfListing) {
        console.log("Launched delete one")
        const result = await client.db("admin").collection("listingsAndReviews")
                .deleteOne({ name: nameOfListing });
        console.log(`${result.deletedCount} document(s) was/were deleted.`);
    }
    async function deleteallListingByName(client, nameOfListing) {
        console.log("Launched delete one")
        const result = await client.db("admin").collection("listingsAndReviews")
                .deleteMany({ name: nameOfListing });
        console.log(`${result.deletedCount} document(s) was/were deleted.`);
    }
module.exports={updateList :updateList,
    updateMultiple: updateMultiple,
    deleteListingByName: deleteListingByName,
deleteallListingByName:deleteallListingByName}