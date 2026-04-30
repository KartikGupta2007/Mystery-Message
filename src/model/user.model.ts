import mongoose,{Document, Schema} from 'mongoose';
import bcrypt from 'bcryptjs';


//user messages ke liye ek alag schema banate hain, jise hum user schema me embed karenge
export interface Message extends Document {
    content: string; // 's' in String should be lowercase.
    createdAt: Date;
}

const MessageSchema : Schema<Message> = new Schema({
    content: { type: String, required: true }, // String ka 's' should be capital
    createdAt: { type: Date, required : true, default: Date.now }
});

const MessageModel = mongoose.models.Message as mongoose.Model<Message> || mongoose.model<Message>('Message', MessageSchema);


export interface User extends Document{
    username: string;
    email: string;
    password: string;
    verifyCode : string; 
    verifycodeExpiry : Date;
    isVerified : boolean;
    isAcceptingMessages: boolean;
    messages: Message[];
}

const UserSchema : Schema<User> = new Schema({
    username: { type: String, required: [true, 'Username is required'], trim: true, unique: true },
    email: { type: String, required: [true, 'Email is required'], unique: true }, 
    password: { type: String, required: [true, 'Password is required'] }, 
    verifyCode : { type : String, default: "", required: false }, 
    verifycodeExpiry : { type : Date, default: null, required: false },
    isVerified : { type : Boolean, default : false },
    isAcceptingMessages: { type: Boolean, default: true }, 
    messages: [MessageSchema] // MessageSchema ko array me wrap kra hai.
});

UserSchema.pre("save", async function(){
    if(!this.password || !this.isModified("password")){
        return;
    }
    this.password = await bcrypt.hash(this.password, 10);
});

UserSchema.pre("findOneAndUpdate", async function () {
    const update = this.getUpdate() as any;
    if (!update) return;

    if (update.password && !update.password.startsWith("$2")) {
        update.password = await bcrypt.hash(update.password, 10);
    }

    if (update.$set?.password && !update.$set.password.startsWith("$2")) {
        update.$set.password = await bcrypt.hash(update.$set.password, 10);
    }

    this.setUpdate(update);
});

const UserModel =  mongoose.models.User as  mongoose.Model<User> || mongoose.model<User>('User', UserSchema);

export { UserModel, MessageModel };