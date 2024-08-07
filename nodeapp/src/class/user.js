class user {

    constructor(id, name, room){
        this.id = id;
        this.name = name;
        this.room = room;
    }

    setName(name){
        this.name = name
    }

    setRoom(room){
        this.room = room
    }

}

export default user;