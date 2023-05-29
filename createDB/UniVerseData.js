var uuid = require("uuid");
//UniVerse DatabaseSetup
db = db.getSiblingDB('uniVerse');

//Drop Existing for reseed
db.dropDatabase("uniVerse");
//Account
db.createCollection('accounts')
accountCollection = db.getCollection("accounts");
accountCollection.remove({})
accountId1 = (0, uuid.v4)()
accountCollection.insert(
{
      id: "9fa4f6c0-27dd-4b30-90fc-ca34443bbbd4",
      username: "Uchenna123",
      fname: "Uche",
      lname: "Doe",
      email: "edoe@seattleu.com",
      department: "College of Nursing",

}
)
accountId2 = (0, uuid.v4)()
accountCollection.insert(
{
      id: "6ab34a04-8a84-4202-b2bb-cdde96feae19",
      username: "jsmith",
      fname: "Janet",
      lname: "Smith",
      email: "jsmith@seattleu.com",
      department: "College of Education",

}
)
accountId3 = (0, uuid.v4)()
accountCollection.insert(
{
      id: "3aadd54f-a60f-4d85-a20b-745e0d314312",
      username: "srodriguez",
      fname: "Santiago",
      lname: "Rodriguez",
      email: "srodriguez@seattleu.edu",
      department: "College of Arts",

}
)
accountId4 = (0, uuid.v4)()
accountCollection.insert(
{
      id: "33949ee3-31fa-4729-abde-f97fc88da22d",
      username: "kcruz24",
      fname: "Kayleigh",
      lname: "Cruz",
      email: "kayleighc@seattleu.edu",
      department: "College of Science and Engineering",

}
)
accountId5 = (0, uuid.v4)()
accountCollection.insert(
{
      id: "0c0d26f3-dc12-4b96-9734-7ddce8a2128d",
      username: "kennyj",
      fname: "Kenneth",
      lname: "Jones",
      email: "kjones@seattleu.edu",
      department: "Chemistry Department",

}
)
commentId1 = (0, uuid.v4)()
commentId2 = (0, uuid.v4)()
commentId3 = (0, uuid.v4)()
commentId4 = (0, uuid.v4)()
commentId5 = (0, uuid.v4)()

//Post
db.createCollection('posts')
postCollection = db.getCollection("posts")
postCollection.remove({})
postId1 = (0, uuid.v4)()
postCollection.insert(
{
    id: "2edb8e72-8f55-46ec-a937-57fdb4759f9d",
    accountId: accountId1,
    title: "Textbook inquiry",
    author: "edoe",
    isAnonymous: false,
    isEdited: false,
    description:"Are there any recommendations for which supplementary textbooks to read for clincals?",
    dateTime: 02-13-2023,
    likes: 3,
    dislikes: 0,
    comments: [commentId1]
}
)
postId2 = (0, uuid.v4)()
postCollection.insert(
{
    id: "5442e623-447b-461e-9cfa-f32114d773e7",
    accountId: "9fa4f6c0-27dd-4b30-90fc-ca34443bbbd4",
    title: "Experiential Learning Tips",
    author: "Uchenna",
    isAnonymous: true,
    isEdited: false,
    description: "I have found great success in always asking for feedback during my experiential learning experience as a K-12 school teacher. The feedback are quiet constructive and I must say please don't shy away from asking for help. I wish I knew this sooner",
    dateTime: 02-24-2023,
    likes: 4,
    dislikes: 0,
    comments: [commentId2],
}
)
postId3 = (0, uuid.v4)()
postCollection.insert(
{
    id: "068c98b6-cee4-4baf-bf6b-c97f4578bb9b",
    accountId: accountId3,
    title: "Hangout in the Game Lounge",
    author: "srodriguez",
    isAnonymous: false,
    isEdited: false,
    description:"If anyone wants to hangout for a game of FIFA or 2K, head up to the fifth floor of Residence Hall A",
    dateTime: 02-17-2023,
    likes: 3,
    dislikes: 1,
    comments: [commentId1],
}
)
postId4 = (0, uuid.v4)()
postCollection.insert(
{
    id: "c95068f5-2c20-4b6b-b811-aacf8265adea",
    accountId: accountId4,
    title: "Hackathon Open for All",
    author: "kcruz24",
    isAnonymous: false,
    isEdited: false,
    description:"Fellow students, the Computer Science Society will be hosting a Hackathon on campus this evening at 8pm. Join in to stand the chance of winning some cool prizes. Free pizza will be served too!",
    dateTime: 03-13-2023,
    likes: 5,
    dislikes: 2,
    comments: [commentId3],
}
)
postId5 = (0, uuid.v4)()
postCollection.insert(
{
    id: "c23f9a48-2dad-4560-a30a-c97a3752f4c7",
    accountId: accountId5,
    title: "Taken CH 2300?",
    author: "kennyj",
    isAnonymous: false,
    isEdited: false,
    description:"I'm planning on enrolling in CH 2300 next quarter. Has anyone taken that course with Dr. Ortega? I would want to know waht is like taking that course with her.",
    dateTime: 03-15-2023,
    likes: 1,
    dislikes: 0,
    comments: [commentId1],
}
)

//Comment
db.createCollection('comments')
commentCollection = db.getCollection("comments")
commentCollection.remove({})
commentCollection.insert(
{
    id: "05591f37-b4db-49f8-985c-d6948e93d10c",
    postId : "2edb8e72-8f55-46ec-a937-57fdb4759f9d",
    author: "kennyj",
    description: "Human Anotomy by A.H Henson is a good supplementar textbook. It should support you through clinicals",
    dateTime: 02-14-2023,
    likes: 3,
    dislikes: 0,
}
)

commentCollection.insert(
{
    id: "de954cb0-df31-446e-8748-6f9d190d1d59",
    postId : "2edb8e72-8f55-46ec-a937-57fdb4759f9d",
    author: "srodriguez",
    description: "I concur, I always remember asking for feedback during my internship at the pharmaceutical company. I interned at last summer.",
    dateTime: 02-24-2023,
    likes: 3,
    dislikes: 0,
}
)
commentCollection.insert(
{
    id: "3d8a0355-b333-46b7-997f-bf1da7570374",
    postId : postId4,
    author: "kcruz24",
    description: "How about we meet around 8:00pm. I should be finished with homework by then. Plus my roommates wanna join in too",
    dateTime: 02-18-2023,
    likes: 3,
    dislikes: 0,
}
)
commentCollection.insert(
{
    id: "f726d0d1-5c03-41fb-bd5f-28187fb0b768",
    postId : postId4,
    author: "kennyj",
    description: "Yay! Hackathons are back. How I missed in-person hackathon since the pandemic caused us to experience them virtually",
    dateTime: 03-14-2023,
    likes: 2,
    dislikes: 0,
}
)
commentCollection.insert(
{
    id: "d36a72a5-5c53-4290-9200-bcc8752abbae",
    postId : postId5,
    author: "srodriguez",
    description: "I haven't had any courses with Dr. Ortega. However, from what I've heard from my bestfriend, who is a Chemistry major, she's a fun professor. Expect to learn a ton in her courses!",
    dateTime: 03-15-2023,
    likes: 1,
    dislikes: 0,
}
)

//Notification
db.createCollection('notifications')
notificationCollection = db.getCollection("notifications")
notificationCollection.remove({})
notificationId1 = (0, uuid.v4)()
notificationCollection.insert(
{
    id: "7ccc7879-c773-4b46-a880-602dcacbf9d1",
    accountId: accountId1,
    postId: postId1,
    title:"Like and comment received.",
    description: "Jane Smith liked and commented on your post.",
    dateTime: 02-14-2023,
}
)
notificationId2 = (0, uuid.v4)()
notificationCollection.insert(
{
    id: "6c426228-8ae4-4b4a-989b-0a6d1f66e883",
    accountId: accountId2,
    postId: postId2,
    title:"Like and comment received.",
    description: "Kenneth Jones liked and commented on your post.",
    dateTime: 02-24-2023,
}
)
notificationId3 = (0, uuid.v4)()
notificationCollection.insert(
{
    id: "fbe66774-366c-414d-a127-bcce8f986344",
    accountId: accountId3,
    postId: postId3,
    title:"Like and comment received",
    description: "Kayleigh Cruz liked and commented on your post.",
    dateTime: 02-18-2023,
}
)
notificationId4 = (0, uuid.v4)()
notificationCollection.insert(
{
    id: "8554ab68-907d-4749-844e-9195f03a635d",
    accountId: accountId4,
    postId: postId4,
    title:"Like and comment received",
    description: "Kenneth Jones liked and commented on your post.",
    dateTime: 03-14-2023,
}
)
notificationId5 = (0, uuid.v4)()
notificationCollection.insert(
{
    id: "d1499422-c67f-4d9d-a135-77b2cda42ebc",
    accountId: accountId5,
    postId: postId4,
    title:"Like and comment received",
    description: "Santiago Rodriguez liked and commented on your post =.",
    dateTime: 03-15-2023,
}
)


