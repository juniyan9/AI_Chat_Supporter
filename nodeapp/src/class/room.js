class room {

    constructor(name, count, maxCount, password=''){
        this.name = name;
        this.count = count;
        this.maxCount = maxCount;
        this.password = password;
    }

    setName(name){
        this.name = name
    }

    setCount(count){
        this.count = count
    }

    setRoomName(maxCount){
        this.maxCount = maxCount
    }

    setPassword(password){
        this.password = password
    }

}

export default room;