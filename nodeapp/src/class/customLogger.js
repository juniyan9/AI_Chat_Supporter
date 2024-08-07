class logger {
  
    info(message, level='Info') {
        console.log('[' + this.getFullYmdStr() + '] [Log Level:'+ level +'] >>>> (' + message +')');
    }

    getFullYmdStr(){
        //년월일시분초 문자열 생성
        const d = new Date();
        return d.getFullYear() + "/" + (d.getMonth()+1) + "/" + d.getDate() + " - " + d.getHours() + "h " + d.getMinutes() + "m " + d.getSeconds() + "s";
    }


}

export default logger;