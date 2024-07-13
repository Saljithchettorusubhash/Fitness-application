import Joi from "joi";

const userSchema = Joi.object({
  email: Joi.string().email().required(),
  name: Joi.string().required(),
  password: Joi.string().min(8).required(),
  dob: Joi.date().required(),
  role: Joi.string().valid('User', 'Trainer', 'Admin').required(),
});

const userUpdateSchema = Joi.object({
    email:Joi.string().email(),
    name:Joi.string(),
    password:Joi.string().min(8),
    dob:Joi.date(),
    rrole: Joi.string().valid('User', 'Trainer', 'Admin'),
}).min(1);

export const validateUser = (data) => {
  return userSchema.validate(data, { abortEarly: false });
};
export const validateUserUpdate =(data)=>{
    return userUpdateSchema.validate(data,{abortEarly:false})
};
