const users=[]

function addUser(user){
    users.push(user)
}

function extractUser(username){
    const user=users.find((data)=>data.username==username)
    if(user) return user
    else return false 
}

module.exports={
    addUser,
    extractUser
}