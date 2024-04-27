const asyncHandler = require("express-async-handler");
const Contact= require("../models/contactModel");

//@desc get all the contacts
//@route GET /api/contacts
//@access Private

const getContacts= asyncHandler (async(req,res)=> {
    console.log("The request:");
    const contact =await Contact.find({user_id:req.params.user.id});
    res.status(200).json({contact });
});


const createContacts = asyncHandler(async (req, res) => {
    console.log("The request:", req.body);
    const { name, email, phone, ...otherData } = req.body;

    if (!name || !email || !phone) {
        res.status(400);
        throw new Error("Name, email, and phone are mandatory fields");
    }

    const contact = await Contact.create({
        name,
        email,
        phone,
        ...otherData, // Include all other data provided by the user
    });

    res.status(201).json({ contact });
});



//@desc cretae contact 
//@route get /api/contacts:id
//@access Private

const getContact=asyncHandler (async(req,res)=> {
    const contact= await Contact.findById(req.params.id);
    if (!contact){
        res.statusCode(404);
        throw new Error("Contact not found");
    }
   res.status(200).json({contact});
});
 
 
//@desc update all the contacts
//@route PUT /api/contacts
//@access Private

const updateContact= asyncHandler (async(req,res)=> {
    const contact= await Contact.findById(req.params.id);
    if (!contact){
        res.statusCode(404);
        throw new Error("Contact not found");
    }
    const updatatedContact =await Contact.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new:true}
    )
    res.status(200).json({updatatedContact});
}); 


//@desc Delete all the contacts
//@route DELETE /api/contacts
//@access Private

const deleteContact = asyncHandler(async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);
        if (!contact) {
            res.status(404);
            throw new Error("Contact not found");
        }
        await contact.remove();
        res.status(204).json(); // No content response for successful deletion
    } catch (error) {
        res.status(500);
        throw new Error("Error deleting contact: " + error.message);
    }
}
);



module.exports=  {
    getContacts,
    createContacts,
    getContact,
    updateContact,
    deleteContact,
}