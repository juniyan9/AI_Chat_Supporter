class user {

    constructor(id, nickName, roomName){
        this.id = id;
        this.nickName = nickName;
        this.roomName = roomName;
    }

    setName(nickName){
        this.nickName = nickName
    }

    setRoomName(roomName){
        this.roomName = roomName
    }

}

export default user;