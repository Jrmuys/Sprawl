import Building from "../Building";

export default class House extends Building {
    /**
     * 
     * @param {Location} location 
     */
    constructor(location) {
        super(location, 29);

        this._capacity = 4;
        this.peopleCount = 0;

        this.people = []

    }


    getPeopleCount() {
        return this.peopleCount = this.people.length
    }

    getPerson(index) {
        if (index < this.people.length)
            return this.people[index];
    }

    addPerson(person) {
        if (this.people.length <= this._capacity)
            this.people.push(person);
    }

    getCapacity() {
        return this._capacity;
    }

}