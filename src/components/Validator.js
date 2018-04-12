const emailFormatOK = (email) =>{
    return(email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)? true : false);
}

export default {
    emailFormatOK: emailFormatOK
}