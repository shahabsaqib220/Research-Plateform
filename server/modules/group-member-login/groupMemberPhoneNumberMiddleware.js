const validatePhoneNumber = async(req,res,next)=>{

    // Getting the phone from from the front end
    const {phoneNumber} = req.body;

    if(!phoneNumber){
        return res.status(400).json({message:"Please Enter a phone Number"});
    }


// CHecking the phone number only accept the pakistan phone number so match +92 followed by 10 digits or 03 followed by 9 digits
    const phoneRegex = /^(?:\+92\d{10}|03\d{9})$/;

    // Checking the number if the number follow the regex if it does not follow the pattern of the number(pakistan) then requrn the message to the client side
    if(!phoneRegex.test(phoneNumber)){
        return res.status(400).json({message:"Please enter a valid phone number"})
    }

    // If the number is valid pattern then we need to pass the control to the controller function:
    next(); // Passing the control to the controller function to saving the mobile phone number into the database

    
}

//  Exporting the Midule
module.exports = validatePhoneNumber;