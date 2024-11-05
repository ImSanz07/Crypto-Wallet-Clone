const mongoose = require("mongoose");

const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        require:[true,"Please Enter Your Name!"],
    },
    email:{
        type:String,
        require:[true,"Please Enter Your Email!"],
        unique:true,
        lowercase:true,
    },
    password:{
        type:String,
        require:[true,"Please Enter Your Password!"],
    },
    passwordConfirm:{
        type:String,
        require:[true,"Please Confirm your Password!"],
        validate:{
            validator:function(el){
                return el === this.password;
            },
            message:"Passwords are not the same!",
        },
    },
    address:String,
    private_key:String,
    mnemonic:String,
});


userSchema.pre("save",async function(next){
    //only run if password is modified
    if(!this.isModified("password")) return next();

    //hash the password with cost of 12
    this.password = await bcrypt.hash(this.password,12);

    //delete passwordConfirm field
    this.passwordConfirm = undefined;
    next();
});

userSchema.pre("save",function(next){
    if(!this.isModified("password") || this.isNew) return next();

    this.passwordChangedAt = Date.now() - 1000;
    next();
});

userSchema.pre("find",function(next){
    //this points to the current query
    this.find({active:{$ne:false}});
    next();
});


userSchema.methods.correctPassword = async function(candidatePassword,userPassword){
    return await bcrypt.compare(candidatePassword,userPassword);
};


userSchema.methods.changedPasswordAfter = function(JWTTimestamp){
    if(this.passwordChangedAt){
        const changedTimestamp = parseInt(
            this.passwordChangedAt.getTime() / 1000,
            10
        );
        return JWTTimestamp < changedTimestamp;
    }
    //False means not changed
    return false;
};

const User = mongoose.model("User",userSchema);

module.exports = User;
