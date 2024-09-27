class logger {
  constructor(level='debug'){
    this.level=level
  }
    info(message, filename) {
        console.log('[' + this.getFullYmdStr() + '] [Log Level:'+ this.level +'] ['+ filename+ ']>>>> (' + message +')');
    }

    getFullYmdStr(){
        //년월일시분초 문자열 생성
        const d = new Date();
        return d.getFullYear() + "/" + (d.getMonth()+1) + "/" + d.getDate() + " - " + d.getHours() + "h " + d.getMinutes() + "m " + d.getSeconds() + "s";
    }


}

export default logger;