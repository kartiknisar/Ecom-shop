module.exports={
    getError(errors,prop){
        console.log(prop)
        try{
            console.log(JSON.stringify(errors.mapped()));
           return errors.mapped()[prop].msg;
        }catch(err){
            return '';

        }
    }
}